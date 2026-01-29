# 🚀 Vercel 웹 배포 완벽 가이드 (프론트엔드)

이 가이드는 **명령어 없이** Vercel 웹사이트에서 클릭만으로 안전하게 배포하는 방법입니다.
이전에 발생했던 **404 오류를 방지하는 설정**이 포함되어 있습니다.

---

## 1단계: GitHub에 코드 올리기

(이미 올리셨다면 패스하세요)

1. 터미널에 아래 명령어 입력:
   ```bash
   git add .
   git commit -m "배포 준비 완료"
   git push origin master
   ```

---

## 2단계: Vercel 프로젝트 생성 (가장 중요! ⭐)

1. [Vercel 대시보드](https://vercel.com/dashboard) 로그인.
2. 우측 상단 **Add New...** → **Project** 클릭.
3. `aws_pro1` (또는 레포지토리 이름) 옆의 **Import** 버튼 클릭.

### ⚠️ 여기서 잠깐! Root Directory 설정 (필수)

**Import**를 누른 직후 나오는 화면에서 설정을 변경해야 합니다.

1. **Framework Preset**: `Next.js` 확인.
2. **Root Directory**: 여기가 핵심입니다!
   - `Edit` 버튼 클릭.
   - 폴더 목록에서 **`energy-trading-app`** 선택.
   - **Continue** 클릭.

> **이걸 안 하면 404 에러가 뜹니다!** 반드시 `energy-trading-app` 폴더를 지정해주세요.

---

## 3단계: 환경 변수(API 키) 설정

같은 화면의 **Environment Variables** 섹션을 클릭해서 펼칩니다.

1. `.env.local` 파일 내용을 참고하여 입력:
   - **Key**: `NEXT_PUBLIC_KAKAO_MAP_KEY`
   - **Value**: (발급받은 카카오 자바스크립트 키)
2. **Add** 버튼 클릭.

---

## 4단계: 배포 시작

1. **Deploy** 버튼 클릭.
2. 폭죽이 터질 때까지 기다립니다 (약 1분).
3. **Continue to Dashboard** 클릭.
4. **Visit** 버튼을 눌러 사이트가 뜨는지 확인합니다.

---

## 5단계: 지도가 안 보인다면? (마지막 필수 과정)

배포된 사이트 주소(예: `https://energy-truck.vercel.app`)를 카카오에 등록해야 지도가 나옵니다.

1. [Kakao Developers](https://developers.kakao.com/) 접속.
2. **내 애플리케이션** → **플랫폼** → **Web** 수정.
3. 배포된 **Vercel 도메인 주소**를 추가하고 저장.

---

## 🚨 이미 배포했는데 404가 뜬다면?

프로젝트를 지우고 다시 할 필요 없습니다. 설정만 바꾸면 됩니다.

1. Vercel 프로젝트 **Settings** → **General**.
2. **Root Directory** 섹션에서 `edit` 클릭.
3. `energy-trading-app` 선택하고 저장.
4. **Deployments** 탭으로 이동.
5. 가장 최근 배포의 점 3개(`...`) 클릭 → **Redeploy**.

이제 완벽하게 배포될 것입니다! 🚀
