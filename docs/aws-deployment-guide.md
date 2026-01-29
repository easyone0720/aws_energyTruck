# ☁️ AWS 배포 가이드 (ECS Fargate)

이 문서는 `README.md`와 `PRD`에 명시된 아키텍처를 바탕으로, AWS ECS Fargate 환경에 Energy Truck 서비스를 배포하는 절차를 안내합니다.

---

## 🏗️ 아키텍처 개요

*   **컴퓨팅**: AWS ECS Fargate (Serverless Container)
*   **이미지 저장소**: AWS ECR (Elastic Container Registry)
*   **네트워크**: AWS ALB (Application Load Balancer)
*   **데이터베이스**: Supabase (외부 호스팅)
*   **CI/CD**: Jenkins + GitHub Webhooks

---

## 1️⃣ 사전 준비 사항 (Prerequisites)

1.  **AWS 계정 생성**: [AWS Console](https://aws.amazon.com/ko/console/)
2.  **AWS CLI 설치 및 설정**:
    ```bash
    aws configure
    # Access Key ID, Secret Access Key, Region (ap-northeast-2) 입력
    ```
3.  **Docker 설치**: 로컬에서 이미지를 빌드하기 위해 필요

---

## 2️⃣ ECR 리포지토리 생성

Docker 이미지를 저장할 공간을 만듭니다.

1.  **AWS Console > ECR** 접속
2.  **리포지토리 생성** 클릭
    *   이름: `energy-truck-frontend`
    *   설정: `Private` 유지
    *   **생성** 클릭
3.  백엔드용 리포지토리도 동일하게 생성 (`energy-truck-backend`)

---

## 3️⃣ Docker 이미지 빌드 및 푸시

로컬에서 이미지를 빌드하여 ECR에 올립니다.

### 3-1. ECR 로그인
```bash
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com
```

### 3-2. 프론트엔드 빌드 & 푸시
```bash
cd energy-trading-app

# 이미지 빌드 (플랫폼 linux/amd64 지정 필수 - Fargate 호환성)
docker build --platform linux/amd64 -t energy-truck-frontend .

# 태그 지정
docker tag energy-truck-frontend:latest [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-frontend:latest

# 푸시
docker push [AWS_ACCOUNT_ID].dkr.ecr.ap-northeast-2.amazonaws.com/energy-truck-frontend:latest
```

*(백엔드도 동일한 방식으로 진행)*

---

## 4️⃣ ECS 클러스터 및 태스크 정의

### 4-1. ECS 클러스터 생성
1.  **AWS Console > ECS > 클러스터**
2.  **클러스터 생성** 클릭
    *   이름: `energy-truck-cluster`
    *   인프라: `AWS Fargate (serverless)` 선택
    *   **생성** 클릭

### 4-2. 태스크 정의 (Task Definition) 생성
1.  **ECS > 태스크 정의 > 새 태스크 정의 생성**
2.  설정:
    *   태스크 패밀리 이름: `energy-truck-frontend-task`
    *   시작 유형: `AWS Fargate`
    *   OS/아키텍처: `Linux/X86_64`
    *   CPU: `.5 vCPU`, 메모리: `1 GB` (테스트용)
3.  **컨테이너 상세 정보**:
    *   이미지 URI: (ECR에서 복사한 URI) + `:latest`
    *   컨테이너 포트: `3000`
    *   환경 변수: `.env.local`의 내용을 Key-Value로 입력
        *   `NEXT_PUBLIC_KAKAO_MAP_KEY`: `...`
        *   `NEXT_PUBLIC_SUPABASE_URL`: `...`
        *   등등...
4.  **생성** 클릭

---

## 5️⃣ 서비스 생성 및 로드 밸런서 연결

실제 컨테이너를 실행하고 인터넷에 연결합니다.

1.  **클러스터 > energy-truck-cluster > 서비스** 탭
2.  **생성** 클릭
3.  설정:
    *   컴퓨팅 옵션: `시작 유형` -> `FARGATE`
    *   패밀리: `energy-truck-frontend-task`
    *   서비스 이름: `energy-truck-frontend-service`
    *   원하는 태스크 수: `1`
4.  **네트워킹**:
    *   VPC: 기본 VPC 선택
    *   서브넷: 모든 서브넷 선택
    *   보안 그룹: **새 보안 그룹 생성** -> 인바운드 규칙: `TCP 80` (HTTP), `TCP 3000` (Custom)
5.  **로드 밸런싱 (선택 사항이지만 권장)**:
    *   로드 밸런서 유형: `Application Load Balancer`
    *   로드 밸런서 이름: `energy-truck-alb`
    *   리스너 포트: `80`
    *   대상 그룹 이름: `energy-truck-tg`
6.  **생성** 클릭

---

## 6️⃣ 접속 확인

1.  서비스 상태가 `Active`가 될 때까지 대기 (약 2~3분)
2.  **EC2 > 로드 밸런서** 메뉴로 이동
3.  생성된 ALB의 **DNS 이름** 복사 (예: `energy-truck-alb-12345...ap-northeast-2.elb.amazonaws.com`)
4.  브라우저에서 접속 확인!

---

## 🚀 CI/CD 구성 가이드 (Jenkins 연동)

자동 배포를 위해 Jenkins 파이프라인을 구성합니다.

`Jenkinsfile` 예시:

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/username/aws_pro1.git'
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('energy-trading-app') {
                    sh 'docker build -t energy-truck-frontend .'
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                sh 'aws ecr get-login-password | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr...'
                sh 'docker tag energy-truck-frontend:latest ...'
                sh 'docker push ...'
            }
        }
        
        stage('Deploy to ECS') {
            steps {
                sh 'aws ecs update-service --cluster energy-truck-cluster --service energy-truck-frontend-service --force-new-deployment'
            }
        }
    }
}
```

---

## ✅ 요약

1.  **ECR**에 Docker 이미지 저장
2.  **ECS Fargate**로 서버리스 컨테이너 실행
3.  **ALB**로 외부 트래픽 연결 및 부하 분산
4.  **Jenkins**로 자동 배포 파이프라인 구축

이제 AWS의 강력한 인프라 위에서 Energy Truck 서비스를 운영할 수 있습니다! 🚛⚡
