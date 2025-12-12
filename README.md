# 뭐입지 (ipzy-frontend)

AI 기반 코디 추천 서비스 "뭐입지"의 프론트엔드 저장소입니다. 사용자가 4가지 간단한 질문에 답하면 AI가 무신사 상품을 기반으로 상의/하의/신발을 조합해 코디를 추천합니다.

- **프로젝트 문서:** `docs/화면정의서.md` (화면 목록/플로우/컴포넌트)
- **스크린샷:** `screenshots/` 폴더

## 기술 스택

- **Language:** TypeScript 5.9.x
- **Framework:** React 19
- **스타일:** Tailwind CSS 4
- **라우팅:** React Router DOM 7
- **아이콘:** Lucide React
- **번들러:** Vite 7

## 빠른 시작

사전 요구 사항:

- Node.js: 22.19.0 (`.nvmrc` 제공)
- npm (또는 호환되는 패키지 매니저)

```bash
# 1) Node 버전 지정 (선택)
nvm use

# 2) 의존성 설치
npm install

# 3) 개발 서버 실행
npm run dev

# 4) 프로덕션 빌드
npm run build

# 5) 빌드 미리보기
npm run preview
```

개발 서버 기본 주소: `http://localhost:5173`

## 핵심 기능

- 4가지 질문 기반 스타일 분석
- AI 코디 추천 (상의/하의/신발) 및 총액 표시
- 무신사 연동 구매 흐름
- 코디 저장/관리, 구독 플랜(Basic/Pro)
- 관리자 대시보드/회원/구독/결제/상품/퀴즈/설정

## 로컬에서 스크린샷 캡처 자동화

로컬 개발 서버가 실행 중일 때 아래 스크립트로 주요 화면 스크린샷을 생성할 수 있습니다.

```bash
# dev 서버 실행 중이어야 함 (기본: http://localhost:5173)
npm run dev

# 새 터미널에서 캡처 실행
node scripts/capture-screens.cjs
```

## Prettier 연동 방식

본 프로젝트는 "ESLint에서 Prettier를 강제"합니다.

## 라이선스

내부 프로젝트용 문서/소스입니다. 별도 안내가 없으면 외부 배포를 지양해 주세요.
