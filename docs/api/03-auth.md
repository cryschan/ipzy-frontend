# 인증 API

Base Path: `/auth`

## POST /auth/register

회원가입

### 요청

**인증**: 불필요

**Body**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "홍길동",
  "phoneNumber": "010-1234-5678",
  "agreeToTerms": true,
  "agreeToMarketing": false
}
```

**필드 설명**
- `email` (required): 이메일 형식
- `password` (required): 최소 8자, 영문+숫자+특수문자
- `name` (required): 2-50자
- `phoneNumber` (optional): 휴대폰 번호
- `agreeToTerms` (required): 이용약관 동의 (true여야 함)
- `agreeToMarketing` (optional): 마케팅 수신 동의

### 응답

**성공 (201)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "user",
      "createdAt": "2024-01-15T09:30:00Z",
      "updatedAt": "2024-01-15T09:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

**에러 (409) - 이메일 중복**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_005",
    "message": "이미 등록된 이메일입니다"
  }
}
```

**에러 (400) - 검증 실패**
```json
{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "필수 필드가 누락되었습니다",
    "details": {
      "fields": [
        { "field": "email", "message": "이메일은 필수입니다" },
        { "field": "password", "message": "비밀번호는 8자 이상이어야 합니다" }
      ]
    }
  }
}
```

---

## POST /auth/login

로그인

### 요청

**인증**: 불필요

**Body**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**필드 설명**
- `email` (required): 이메일
- `password` (required): 비밀번호
- `rememberMe` (optional): true시 refresh token 유효기간 연장 (30일)

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "user",
      "profileImage": null,
      "phoneNumber": "010-1234-5678",
      "createdAt": "2024-01-15T09:30:00Z",
      "updatedAt": "2024-01-15T09:30:00Z",
      "subscription": {
        "id": "sub-123",
        "plan": "basic",
        "status": "active",
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-02-01T00:00:00Z",
        "autoRenew": true,
        "features": {
          "dailyRecommendations": 10,
          "savedOutfitsLimit": 50,
          "prioritySupport": false,
          "exclusiveStyles": false,
          "adFree": true
        }
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

**에러 (401)**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "유효하지 않은 이메일 또는 비밀번호입니다"
  }
}
```

---

## POST /auth/admin/login

관리자 로그인

### 요청

**인증**: 불필요

**Body**
```json
{
  "email": "admin@mweoipji.com",
  "password": "AdminPass123!",
  "otpCode": "123456"
}
```

**필드 설명**
- `email` (required): 관리자 이메일
- `password` (required): 비밀번호
- `otpCode` (optional): 2FA 코드 (선택적 구현)

### 응답

**성공 (200)**: 일반 로그인과 동일하나 `role`이 `"admin"`

**에러 (403)**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_006",
    "message": "관리자 권한이 필요합니다"
  }
}
```

---

## POST /auth/refresh

토큰 갱신

### 요청

**인증**: 불필요 (Refresh Token 사용)

**Body**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

**에러 (401)**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_004",
    "message": "리프레시 토큰이 유효하지 않습니다"
  }
}
```

---

## POST /auth/logout

로그아웃

### 요청

**인증**: 필요

**Headers**
```
Authorization: Bearer <access_token>
```

**Body** (선택)
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "allDevices": false
}
```

**필드 설명**
- `refreshToken` (optional): 무효화할 refresh token
- `allDevices` (optional): true시 모든 기기에서 로그아웃

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "message": "로그아웃되었습니다"
  }
}
```

---

## POST /auth/password/forgot

비밀번호 찾기

### 요청

**인증**: 불필요
**Rate Limit**: 분당 3회

**Body**
```json
{
  "email": "user@example.com"
}
```

### 응답

**성공 (200)** - 보안상 항상 성공 응답
```json
{
  "success": true,
  "data": {
    "message": "비밀번호 재설정 이메일을 발송했습니다"
  }
}
```

---

## POST /auth/password/reset

비밀번호 재설정

### 요청

**인증**: 불필요

**Body**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "message": "비밀번호가 변경되었습니다"
  }
}
```

**에러 (400)**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_002",
    "message": "토큰이 만료되었습니다"
  }
}
```

---

## JWT 토큰 구조

### Access Token Payload

```typescript
{
  sub: string;        // user id
  email: string;
  role: "user" | "admin";
  iat: number;        // issued at
  exp: number;        // expiration (1시간)
}
```

### Refresh Token Payload

```typescript
{
  sub: string;        // user id
  tokenId: string;    // 토큰 고유 ID (revoke용)
  iat: number;
  exp: number;        // expiration (7일, rememberMe시 30일)
}
```
