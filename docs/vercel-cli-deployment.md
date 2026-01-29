# ⚡ Vercel CLI로 확실하게 배포하기

이전 방법(GUI 설정)이 잘 안 될 때, **명령어 한 줄**로 배포하는 가장 확실한 방법입니다.

---

## 1️⃣ 터미널 열기

VS Code에서 터미널(`Ctrl + ` `)을 열고, 프로젝트 폴더로 이동합니다.

```bash
cd energy-trading-app
```

> **중요**: 반드시 `energy-trading-app` 폴더 안으로 이동해야 합니다!

---

## 2️⃣ 배포 명령어 실행

아래 명령어를 복사해서 붙여넣으세요:

```bash
npx vercel
```

---

## 3️⃣ 질문 답변하기 (엔터만 누르면 됩니다)

명령어를 치면 몇 가지 질문이 나옵니다. 아래처럼 답변하세요:

1.  **Set up and deploy "~~\energy-trading-app"?**
    - `y` (엔터)

2.  **Which scope do you want to deploy to?**
    - (본인 계정 선택 후 엔터)

3.  **Link to existing project?**
    - `n` (엔터) - *기존 실패한 프로젝트와 연결하지 않고 새로 만드는 게 깔끔할 수 있습니다.*

4.  **What’s your project’s name?**
    - `energy-truck` (또는 원하는 이름 입력 후 엔터)

5.  **In which directory is your code located?**
    - `./` (그냥 엔터! 이미 폴더 안에 들어왔으니까요)

---

## 4️⃣ 환경 변수 설정 (마지막 단계!)

배포가 시작되면 Vercel 대시보드 링크가 뜹니다. (Production: `https://...`)
하지만 **아직은 지도가 안 보일 거예요.** 환경 변수를 넣어줘야 합니다.

1. 터미널에 뜬 `Production` 링크(또는 `Inspect` 링크)를 클릭해 Vercel 대시보드로 갑니다.
2. **Settings** -> **Environment Variables** 메뉴로 이동합니다.
3. 아래 키를 추가합니다:
    *   Key: `NEXT_PUBLIC_KAKAO_MAP_KEY`
    *   Value: `발급받은_키_복사_붙여넣기`
4. **저장(Save)** 후, **Deployments** 탭으로 가서 **Redeploy**를 누릅니다.

---

## ✅ 요약

1. `cd energy-trading-app`
2. `npx vercel`
3. 질문엔 대부분 엔터 (`Link to existing?` 만 `No` 추천)
4. 대시보드 가서 API 키 넣고 재배포

이 방법은 폴더 위치를 자동으로 인식하므로 오류가 날 확률이 거의 없습니다! 🚀
