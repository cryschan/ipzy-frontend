# 뭐입지 API 설계서

## 개요

이 문서는 "뭐입지(코디 추천 서비스)" 프로젝트의 RESTful API 설계를 상세히 설명합니다.

## 목차

1. [공통 규약](./01-common.md) - Base URL, 요청/응답 형식, 에러 처리
2. [타입 정의](./02-types.md) - TypeScript 인터페이스 및 타입
3. [인증 API](./03-auth.md) - 회원가입, 로그인, 토큰 관리
4. [사용자 API](./04-users.md) - 프로필 관리, 설정
5. [코디 추천 API](./05-outfits.md) - 추천, 저장된 코디 관리
6. [퀴즈 API](./06-quizzes.md) - 퀴즈 조회 및 응답
7. [구독 API](./07-subscriptions.md) - 구독 플랜, 결제 관리
8. [결제 API](./08-payments.md) - 결제 처리, 내역 조회
9. [상품 API](./09-products.md) - 상품 목록, 상세 조회
10. [관리자 API](./10-admin.md) - 대시보드, 관리 기능
11. [보안](./11-security.md) - 인증, CORS, Rate Limiting

## 빠른 시작

### Base URL

```
Production: https://api.mweoipji.com/api/v1
Development: http://localhost:3001/api/v1
```

### 인증

대부분의 API는 JWT 기반 인증이 필요합니다.

```http
Authorization: Bearer <access_token>
```

### 공통 응답 형식

**성공**
```json
{
  "success": true,
  "data": { /* 응답 데이터 */ }
}
```

**에러**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "유효하지 않은 이메일 또는 비밀번호입니다"
  }
}
```

## API 요약

### 인증
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신
- `POST /auth/logout` - 로그아웃

### 사용자
- `GET /users/me` - 내 프로필 조회
- `PATCH /users/me` - 프로필 수정
- `PUT /users/me/password` - 비밀번호 변경

### 코디 추천
- `POST /outfits/recommend` - 코디 추천 받기
- `GET /outfits/saved` - 저장된 코디 목록
- `POST /outfits/saved` - 코디 저장

### 구독
- `GET /subscriptions/plans` - 구독 플랜 목록
- `GET /subscriptions/me` - 내 구독 정보
- `POST /subscriptions` - 구독 시작/변경

### 결제
- `POST /payments` - 결제 처리
- `GET /payments` - 결제 내역
- `POST /payments/:id/refund` - 환불 요청

### 관리자
- `GET /admin/dashboard` - 대시보드 통계
- `GET /admin/users` - 회원 관리
- `GET /admin/products` - 상품 관리

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0.0 | 2024-01-15 | 초기 설계 |

## 기여

API 설계에 대한 피드백이나 제안은 GitHub Issues를 통해 제출해주세요.

## 라이선스

이 문서는 프로젝트의 일부로 관리됩니다.
