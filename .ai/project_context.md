# Project Context

## 제품/도메인

- 서비스명: 뭐입지 (AI Styling Service)
- 핵심 가치: 4가지 질문으로 개인화된 코디 추천 제공
- 타깃: 빠르게 코디 영감을 얻고 싶은 일반 사용자, 관리자(운영)

## 기술 스택

- 프론트엔드: React + TypeScript
- 라우팅: react-router-dom
- 데이터: TanStack Query
- 상태/인증: 커스텀 `AuthContext`
- 빌드: Vite

## 주요 플로우

- 공개 페이지: `/`, `/quiz`, `/pricing`, 문서/개발 페이지
- 인증: 소셜 로그인(카카오) 시작 → 백엔드 OAuth → 세션 기반 `/api/auth/me`로 사용자 동기화
- 보호 라우팅:
  - `ProtectedRoute`: 로그인 필요
  - `GuestRoute`: 로그인 상태 접근 제한
  - `QuizRequiredRoute`: 특정 state 필요(answers)
  - `AdminRoute`: 관리자 권한 필요

## API 요약(프론트 기준)

- `GET /api/auth/me`: 현재 사용자 조회(세션 기반)
- `POST /api/auth/logout`: 로그아웃
- `GET /api/auth/login/kakao`: OAuth 시작(브라우저 네비게이션)

## 제약/가이드

- 초기 렌더에서 불필요한 인증 호출/리다이렉트 방지
- 보호 라우트에서만 `/api/auth/me` 지연 호출
- 타입 안정성 유지, 명확한 네이밍/컴포넌트 분리

## 향후 과제(예시)

- 실제 결제 연동
- 서버 스키마와 타입 공유
- 에러/로깅 일원화 및 사용자 피드백 향상
