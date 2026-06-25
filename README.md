# 우리 반 모둠 편성기

교사가 학생 이름을 입력해 랜덤으로 모둠을 편성하고, 학생별 역할을 함께 배정하는 React + Vite 웹앱입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 터미널에 표시되는 주소로 접속하면 됩니다.

## GitHub Pages

배포 후 아래 주소에서 앱을 열 수 있습니다.

```text
https://lihyosong-a11y.github.io/replace/
```

처음 사용할 때는 GitHub 저장소의 `Settings` → `Pages`에서 `Source`를 `GitHub Actions`로 선택해야 합니다.

## Vercel 배포

Vercel에서는 GitHub 저장소를 Import하면 됩니다.

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Vercel 배포에서는 앱이 사이트 루트(`/`)에서 열리도록 설정되어 있습니다.

## 확인 명령

```bash
npm test
npm run build
```

## 사용 방법

1. 학생 이름을 한 줄에 한 명씩 입력합니다.
2. 모둠 수와 역할 목록을 조정합니다.
3. `랜덤 모둠 편성하기`를 누릅니다.
4. 필요하면 `다시 섞기`, `결과 복사하기`, `인쇄하기`를 사용합니다.
