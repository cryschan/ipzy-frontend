# 사용자 API

Base Path: `/users`

모든 엔드포인트는 인증이 필요합니다.

---

## GET /users/me

내 프로필 조회

### 요청

**인증**: 필요

**Headers**
```
Authorization: Bearer <access_token>
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user",
    "profileImage": "https://cdn.mweoipji.com/profiles/user-123.jpg",
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
    },
    "preferences": {
      "favoriteStyles": ["casual", "minimal"],
      "preferredColors": ["black", "white", "navy"],
      "bodyType": "average",
      "budget": {
        "min": 30000,
        "max": 150000
      }
    },
    "stats": {
      "savedOutfitsCount": 12,
      "recommendationsToday": 3,
      "recommendationsRemaining": 7
    }
  }
}
```

---

## PATCH /users/me

프로필 수정

### 요청

**인증**: 필요

**Body** - 변경할 필드만 전송
```json
{
  "name": "홍길동",
  "phoneNumber": "010-9876-5432",
  "profileImage": "https://cdn.mweoipji.com/profiles/new-image.jpg",
  "preferences": {
    "favoriteStyles": ["casual", "street"],
    "preferredColors": ["black", "white"],
    "budget": {
      "min": 50000,
      "max": 200000
    }
  }
}
```

**필드 설명**
- `name` (optional): 이름 (2-50자)
- `phoneNumber` (optional): 휴대폰 번호
- `profileImage` (optional): 프로필 이미지 URL
- `preferences` (optional): 사용자 선호도

### 응답

**성공 (200)** - 업데이트된 전체 프로필 반환 (GET /users/me와 동일)

**에러 (400)**
```json
{
  "success": false,
  "error": {
    "code": "VAL_002",
    "message": "유효하지 않은 형식입니다",
    "details": {
      "field": "phoneNumber",
      "reason": "올바른 휴대폰 번호 형식이 아닙니다"
    }
  }
}
```

---

## PUT /users/me/password

비밀번호 변경

### 요청

**인증**: 필요

**Body**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**필드 설명**
- `currentPassword` (required): 현재 비밀번호
- `newPassword` (required): 새 비밀번호 (8자 이상, 영문+숫자+특수문자)

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

**에러 (400) - 현재 비밀번호 불일치**
```json
{
  "success": false,
  "error": {
    "code": "USER_003",
    "message": "비밀번호가 일치하지 않습니다"
  }
}
```

**에러 (400) - 새 비밀번호 검증 실패**
```json
{
  "success": false,
  "error": {
    "code": "VAL_002",
    "message": "유효하지 않은 형식입니다",
    "details": {
      "field": "newPassword",
      "reason": "비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다"
    }
  }
}
```

---

## DELETE /users/me

회원 탈퇴

### 요청

**인증**: 필요

**Body**
```json
{
  "password": "CurrentPass123!",
  "reason": "서비스 이용 안함",
  "feedback": "추천 정확도가 낮았습니다"
}
```

**필드 설명**
- `password` (required): 현재 비밀번호 (본인 확인용)
- `reason` (optional): 탈퇴 사유
- `feedback` (optional): 서비스 개선을 위한 피드백

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "message": "계정이 삭제되었습니다",
    "deletedAt": "2024-01-15T09:30:00Z"
  }
}
```

**에러 (400) - 비밀번호 불일치**
```json
{
  "success": false,
  "error": {
    "code": "USER_003",
    "message": "비밀번호가 일치하지 않습니다"
  }
}
```

---

## 참고 사항

### 소프트 삭제 (Soft Delete)

회원 탈퇴 시 실제로 데이터를 삭제하지 않고 `deletedAt` 필드를 설정하여 소프트 삭제 처리합니다. 이는:
- 데이터 복구 가능성 제공
- 통계 및 분석 데이터 유지
- 법적 요구사항 준수 (개인정보 보관 의무)

일정 기간(예: 30일) 후 실제 삭제 또는 개인정보 비식별화 처리됩니다.

### 프로필 이미지 업로드

프로필 이미지는 별도의 파일 업로드 API를 통해 업로드 후, 반환된 URL을 `PATCH /users/me`의 `profileImage` 필드에 전달합니다.

파일 업로드 API는 향후 추가될 예정입니다:
```
POST /upload/profile-image
Content-Type: multipart/form-data
```
