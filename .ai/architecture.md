# Architecture Guide

## 개요

- React + TypeScript + Vite
- 라우팅: `react-router-dom` with nested routes
- 상태: `AuthContext`(인증/유저), 기타는 컴포넌트 로컬 상태
- 서버 상태: TanStack Query (사용 시 서버 데이터에 한함)

## 라우팅/가드

- 공개 라우트: `/`, `/quiz`, `/pricing`, 문서/개발 페이지
- 보호 라우트:
  - `ProtectedRoute`: 로그인 필요. 초기에 `loading = !user`로 세션 확인 전 리다이렉트 방지. 필요 시 `refreshUserFromServer()` 1회 호출.
  - `AdminRoute`: 관리자 권한 필요. 위와 동일한 지연 확인 패턴 적용 후 `isAdmin()` 검사.
  - `GuestRoute`: 로그인 상태 접근 제한.
  - `QuizRequiredRoute`: `location.state.answers` 필요.

## 인증/세션

- 백엔드 세션 기반
- `/api/auth/me`로 현재 사용자 조회
- 전역 초기 진입에서 자동 호출하지 않고, 보호 라우트 접근 시 지연 호출

## API 레이어

- `src/api/api.ts`의 axios 인스턴스 사용 가정
- `ApiResponse<T>` 래퍼 유지, 오류 시 코드/메시지 포함
- OAuth 시작은 브라우저 네비게이션으로 처리(`redirectToKakaoLogin`)

## 관리자 영역

- 베이스 경로: `/admin`
- 로그인: `/admin/login`
- 내부: `AdminLayout` 하위 nested routes

## 확장 포인트

- 공통 에러 경계/알림 시스템
- 서버 DTO 타입 공유
- Feature 단위로 lazy route/code splitting
