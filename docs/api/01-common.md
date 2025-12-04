# 공통 규약

## Base URL

```
Production:  https://api.mweoipji.com/api/v1
Development: http://localhost:3001/api/v1
```

## 공통 요청 헤더

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>  # 인증 필요 API
X-Request-ID: <uuid>                  # 요청 추적용 (선택)
```

## 공통 응답 형식

### 성공 응답

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}
```

**예시**

```json
{
  "success": true
  "data": {
    "id": "user-123"
    "name": "홍길동"
  }
}
```

### 페이지네이션 메타데이터

```typescript
interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

**예시**

```json
{
  "success": true
  "data": [ /* items */ ]
  "meta": {
    "pagination": {
      "currentPage": 1
      "totalPages": 10
      "totalItems": 95
      "itemsPerPage": 10
      "hasNext": true
      "hasPrev": false
    }
  }
}
```

### 에러 응답

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string; // 예: "AUTH_001"
    message: string; // 사용자 친화적 메시지
    details?: any; // 검증 에러 상세 등
  };
}
```

**단일 에러 예시**

```json
{
  "success": false
  "error": {
    "code": "AUTH_001"
    "message": "유효하지 않은 이메일 또는 비밀번호입니다"
  }
}
```

**검증 에러 예시**

```json
{
  "success": false
  "error": {
    "code": "VAL_001"
    "message": "필수 필드가 누락되었습니다"
    "details": {
      "fields": [
        { "field": "email", "message": "이메일은 필수입니다" }
        { "field": "password", "message": "비밀번호는 8자 이상이어야 합니다" }
      ]
    }
  }
}
```

## HTTP 상태 코드

| 상태 코드 | 용도                           | 예시                              |
| --------- | ------------------------------ | --------------------------------- |
| 200       | 조회/수정 성공                 | GET, PATCH 성공                   |
| 201       | 생성 성공                      | POST로 리소스 생성                |
| 204       | 삭제 성공 (응답 본문 없음)     | DELETE 성공                       |
| 400       | 잘못된 요청 (검증 실패)        | 필수 필드 누락, 형식 오류         |
| 401       | 인증 필요/실패                 | 토큰 없음, 만료, 잘못된 인증 정보 |
| 403       | 권한 없음                      | 관리자 API를 일반 사용자가 접근   |
| 404       | 리소스 없음                    | 존재하지 않는 ID                  |
| 409       | 충돌                           | 이메일 중복 등                    |
| 422       | 처리 불가 (비즈니스 로직 오류) | 구독 한도 초과 등                 |
| 429       | 요청 제한 초과                 | Rate limit 초과                   |
| 500       | 서버 오류                      | 내부 서버 에러                    |

## 에러 코드 체계

### 인증 관련: AUTH_XXX

| 코드     | 메시지                                   |
| -------- | ---------------------------------------- |
| AUTH_001 | 유효하지 않은 이메일 또는 비밀번호입니다 |
| AUTH_002 | 토큰이 만료되었습니다                    |
| AUTH_003 | 토큰이 유효하지 않습니다                 |
| AUTH_004 | 리프레시 토큰이 유효하지 않습니다        |
| AUTH_005 | 이미 등록된 이메일입니다                 |
| AUTH_006 | 관리자 권한이 필요합니다                 |

### 사용자 관련: USER_XXX

| 코드     | 메시지                         |
| -------- | ------------------------------ |
| USER_001 | 사용자를 찾을 수 없습니다      |
| USER_002 | 프로필 업데이트에 실패했습니다 |
| USER_003 | 비밀번호가 일치하지 않습니다   |

### 구독 관련: SUB_XXX

| 코드    | 메시지                                     |
| ------- | ------------------------------------------ |
| SUB_001 | 유효하지 않은 구독 플랜입니다              |
| SUB_002 | 이미 활성화된 구독이 있습니다              |
| SUB_003 | 구독이 만료되었습니다                      |
| SUB_004 | 해당 기능은 Pro 플랜에서만 사용 가능합니다 |

### 결제 관련: PAY_XXX

| 코드    | 메시지                        |
| ------- | ----------------------------- |
| PAY_001 | 결제 처리에 실패했습니다      |
| PAY_002 | 유효하지 않은 카드 정보입니다 |
| PAY_003 | 결제를 찾을 수 없습니다       |
| PAY_004 | 환불 처리에 실패했습니다      |

### 코디 관련: OUTFIT_XXX

| 코드       | 메시지                        |
| ---------- | ----------------------------- |
| OUTFIT_001 | 코디를 찾을 수 없습니다       |
| OUTFIT_002 | 일일 추천 횟수를 초과했습니다 |
| OUTFIT_003 | 코디 저장에 실패했습니다      |

### 퀴즈 관련: QUIZ_XXX

| 코드     | 메시지                        |
| -------- | ----------------------------- |
| QUIZ_001 | 퀴즈를 찾을 수 없습니다       |
| QUIZ_002 | 유효하지 않은 퀴즈 응답입니다 |

### 상품 관련: PROD_XXX

| 코드     | 메시지                  |
| -------- | ----------------------- |
| PROD_001 | 상품을 찾을 수 없습니다 |
| PROD_002 | 품절된 상품입니다       |

### 일반 검증: VAL_XXX

| 코드    | 메시지                        |
| ------- | ----------------------------- |
| VAL_001 | 필수 필드가 누락되었습니다    |
| VAL_002 | 유효하지 않은 형식입니다      |
| VAL_003 | 값이 허용 범위를 벗어났습니다 |

## 페이지네이션

목록 조회 API는 다음 쿼리 파라미터를 지원합니다:

```
page: 페이지 번호 (기본값: 1)
limit: 페이지당 항목 수 (기본값: 10, 최대: 50)
```

**요청 예시**

```
GET /api/v1/users?page=2&limit=20
```

## 정렬

정렬이 지원되는 API는 `sort` 파라미터를 사용합니다:

```
sort: 필드명 (오름차순) 또는 -필드명 (내림차순)
```

**예시**

```
GET /api/v1/outfits/saved?sort=-savedAt  # 저장일 내림차순
GET /api/v1/products?sort=price          # 가격 오름차순
```

## 필터링

API마다 지원하는 필터가 다르며, 쿼리 파라미터로 전달합니다:

```
GET /api/v1/products?category=top&minPrice=20000&maxPrice=50000
```

## 날짜/시간 형식

모든 날짜는 ISO 8601 형식을 사용합니다:

```
2025-01-15T09:30:00Z  # UTC 기준
```

## 다국어 지원

현재는 한국어만 지원하며, 향후 다국어 지원 시 `Accept-Language` 헤더를 사용할 예정입니다.

```http
Accept-Language: ko-KR
```
