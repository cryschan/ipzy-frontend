# 관리자 API

Base Path: `/admin`

**공통 사항**: 모든 관리자 API는 인증 필수이며, `role`이 `"admin"`인 사용자만 접근 가능합니다.

---

## GET /admin/dashboard

대시보드 통계

### 요청

**인증**: 필요 (관리자)

**쿼리 파라미터**
```
period: today | week | month | year (기본값: today)
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 15420,
      "newToday": 45,
      "newThisWeek": 312,
      "newThisMonth": 1205,
      "activeSubscribers": 3250,
      "growth": {
        "percentage": 12.5,
        "trend": "up"
      }
    },
    "subscriptions": {
      "free": 12170,
      "basic": 2450,
      "pro": 800,
      "churnRate": 2.3,
      "conversionRate": 8.5
    },
    "revenue": {
      "today": 1250000,
      "thisWeek": 8750000,
      "thisMonth": 35200000,
      "thisYear": 420000000,
      "growth": {
        "percentage": 15.2,
        "trend": "up"
      }
    },
    "recommendations": {
      "totalToday": 12500,
      "averagePerUser": 3.2,
      "popularStyles": [
        { "style": "casual", "count": 5200 },
        { "style": "minimal", "count": 3100 },
        { "style": "street", "count": 2800 }
      ]
    },
    "topProducts": [
      {
        "id": "prod-101",
        "name": "오버핏 코튼 티셔츠",
        "brand": "무신사 스탠다드",
        "recommendCount": 1250,
        "category": "top"
      },
      {
        "id": "prod-201",
        "name": "와이드 데님 팬츠",
        "brand": "무신사 스탠다드",
        "recommendCount": 980,
        "category": "bottom"
      }
    ]
  }
}
```

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

## GET /admin/users

회원 목록

### 요청

**인증**: 필요 (관리자)

**쿼리 파라미터**
```
page: 페이지 번호 (기본값: 1)
limit: 페이지당 항목 수 (기본값: 20, 최대: 100)
search: 이메일, 이름 검색
role: user | admin
subscriptionPlan: free | basic | pro
status: active | inactive | suspended
sortBy: createdAt | name | email | lastActiveAt
sortOrder: asc | desc
startDate: 가입일 시작 (YYYY-MM-DD)
endDate: 가입일 종료 (YYYY-MM-DD)
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-001",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "user",
      "profileImage": null,
      "phoneNumber": "010-1234-5678",
      "status": "active",
      "subscription": {
        "plan": "basic",
        "status": "active",
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-02-01T00:00:00Z"
      },
      "stats": {
        "totalRecommendations": 156,
        "savedOutfits": 23,
        "totalPayments": 99000,
        "lastActiveAt": "2024-01-15T08:30:00Z"
      },
      "createdAt": "2023-06-15T00:00:00Z",
      "updatedAt": "2024-01-15T08:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "currentPage": 1,
      "totalPages": 771,
      "totalItems": 15420,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalUsers": 15420,
      "activeUsers": 12450,
      "suspendedUsers": 15
    }
  }
}
```

---

## GET /admin/users/:id

회원 상세

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 사용자 ID

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user",
    "profileImage": null,
    "phoneNumber": "010-1234-5678",
    "status": "active",
    "subscription": {
      "id": "sub-123",
      "plan": "basic",
      "status": "active",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-02-01T00:00:00Z",
      "autoRenew": true
    },
    "preferences": {
      "favoriteStyles": ["casual", "minimal"],
      "preferredColors": ["black", "white"],
      "budget": { "min": 30000, "max": 150000 }
    },
    "stats": {
      "totalRecommendations": 156,
      "savedOutfits": 23,
      "totalPayments": 99000,
      "lastActiveAt": "2024-01-15T08:30:00Z",
      "loginCount": 89
    },
    "recentActivity": [
      {
        "type": "recommendation",
        "details": "캐주얼 코디 추천"
      },
      {
        "type": "payment",
        "details": "Basic 플랜 구독"
      }
    ],
    "createdAt": "2023-06-15T00:00:00Z",
    "updatedAt": "2024-01-15T08:30:00Z"
  }
}
```

---

## PATCH /admin/users/:id

회원 정보 수정

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 사용자 ID

**Body**
```json
{
  "status": "suspended",
  "role": "admin",
  "note": "관리자 요청에 의한 권한 변경"
}
```

**필드 설명**
- `status` (optional): active | inactive | suspended
- `role` (optional): user | admin
- `note` (optional): 변경 사유 (로그용)

### 응답

**성공 (200)** - 업데이트된 사용자 정보 반환

---

## DELETE /admin/users/:id

회원 삭제

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 사용자 ID

**Body**
```json
{
  "reason": "이용약관 위반",
  "note": "스팸 활동 확인"
}
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "message": "회원이 삭제되었습니다",
    "deletedAt": "2024-01-15T09:30:00Z"
  }
}
```

---

## GET /admin/subscriptions

구독 관리

### 요청

**인증**: 필요 (관리자)

**쿼리 파라미터**
```
page, limit
plan: free | basic | pro
status: active | cancelled | expired
search: 사용자 이름 또는 이메일
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub-123",
      "userId": "user-001",
      "userName": "홍길동",
      "userEmail": "user@example.com",
      "plan": "basic",
      "status": "active",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-02-01T00:00:00Z",
      "autoRenew": true,
      "amount": 9900,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "pagination": {},
    "summary": {
      "totalSubscriptions": 3250,
      "activeCount": 3100,
      "cancelledCount": 150
    }
  }
}
```

---

## PATCH /admin/subscriptions/:id

구독 수정

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 구독 ID

**Body**
```json
{
  "plan": "pro",
  "endDate": "2024-06-01T00:00:00Z",
  "reason": "프로모션 당첨"
}
```

### 응답

**성공 (200)** - 업데이트된 구독 정보 반환

---

## GET /admin/payments

결제 관리

### 요청

**인증**: 필요 (관리자)

**쿼리 파라미터**
```
page, limit
status: pending | completed | failed | refunded | cancelled
method: credit_card | kakao_pay | naver_pay
startDate, endDate: 결제일 범위
minAmount, maxAmount: 금액 범위
userId: 특정 사용자 필터
search: 사용자 이름 또는 이메일
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": "pay-001",
      "userId": "user-001",
      "userName": "홍길동",
      "userEmail": "user@example.com",
      "amount": 9900,
      "method": "credit_card",
      "status": "completed",
      "subscriptionPlan": "basic",
      "transactionId": "txn_abc123",
      "createdAt": "2024-01-01T09:00:00Z",
      "completedAt": "2024-01-01T09:00:05Z"
    }
  ],
  "meta": {
    "pagination": {},
    "summary": {
      "totalAmount": 32175000,
      "completedAmount": 31200000,
      "refundedAmount": 475000,
      "completedCount": 3200,
      "failedCount": 45,
      "refundedCount": 12
    }
  }
}
```

---

## POST /admin/payments/:id/refund

관리자 환불 처리

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 결제 ID

**Body**
```json
{
  "amount": 9900,
  "reason": "고객 요청에 의한 환불",
  "note": "1회 사용 후 환불 요청"
}
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "refundId": "refund-001",
    "paymentId": "pay-001",
    "amount": 9900,
    "status": "completed",
    "processedAt": "2024-01-15T09:30:00Z"
  }
}
```

---

## GET /admin/products

상품 관리 목록

### 요청

**인증**: 필요 (관리자)

**쿼리 파라미터**
```
page, limit
category, brand, search
isActive: true | false (비활성 상품 포함)
sort: name | price | createdAt | stock
```

### 응답

**성공 (200)** - GET /products와 유사하나 비활성 상품 포함

---

## POST /admin/products

상품 등록

### 요청

**인증**: 필요 (관리자)

**Body**
```json
{
  "name": "슬림핏 데님 팬츠",
  "brand": "무신사 스탠다드",
  "category": "bottom",
  "subCategory": "jeans",
  "price": 59000,
  "originalPrice": 79000,
  "imageUrl": "https://cdn.mweoipji.com/products/new-prod.jpg",
  "images": [
    "https://cdn.mweoipji.com/products/new-prod-1.jpg",
    "https://cdn.mweoipji.com/products/new-prod-2.jpg"
  ],
  "description": "슬림핏 데님 팬츠입니다.",
  "sizes": ["28", "30", "32", "34"],
  "colors": ["blue", "black"],
  "stock": 200,
  "tags": ["slim", "denim", "basic"],
  "purchaseUrl": "https://store.musinsa.com/...",
  "isActive": true
}
```

### 응답

**성공 (201)**
```json
{
  "success": true,
  "data": {
    "id": "prod-new-001",
    "name": "슬림핏 데님 팬츠",
    "brand": "무신사 스탠다드",
    "category": "bottom",
    "price": 59000,
    "createdAt": "2024-01-15T09:30:00Z"
  }
}
```

---

## PUT /admin/products/:id

상품 전체 수정

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 상품 ID

**Body**: POST와 동일 (전체 필드 필요)

### 응답

**성공 (200)** - 업데이트된 상품 정보 반환

---

## PATCH /admin/products/:id

상품 부분 수정

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 상품 ID

**Body** - 변경할 필드만
```json
{
  "price": 49000,
  "stock": 150,
  "isActive": false
}
```

### 응답

**성공 (200)** - 업데이트된 상품 정보 반환

---

## DELETE /admin/products/:id

상품 삭제

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 상품 ID

### 응답

**성공 (204)** - No Content

---

## GET /admin/quizzes

퀴즈 관리

### 요청

**인증**: 필요 (관리자)

**쿼리 파라미터**
```
page, limit
isActive: true | false
```

### 응답

**성공 (200)** - GET /quizzes와 유사하나 비활성 퀴즈 포함

---

## POST /admin/quizzes

퀴즈 생성

### 요청

**인증**: 필요 (관리자)

**Body**
```json
{
  "title": "여름 스타일 퀴즈",
  "description": "여름에 어울리는 스타일을 찾아보세요",
  "questions": [
    {
      "text": "여름에 선호하는 상의 스타일은?",
      "type": "single",
      "options": [
        { "text": "민소매", "value": "sleeveless" },
        { "text": "반팔", "value": "short_sleeve" },
        { "text": "린넨 셔츠", "value": "linen_shirt" }
      ],
      "order": 1,
      "required": true
    }
  ],
  "isActive": false,
  "order": 2
}
```

### 응답

**성공 (201)** - 생성된 퀴즈 정보 반환

---

## PUT /admin/quizzes/:id

퀴즈 수정

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 퀴즈 ID

**Body**: POST와 동일

### 응답

**성공 (200)** - 업데이트된 퀴즈 정보 반환

---

## DELETE /admin/quizzes/:id

퀴즈 삭제

### 요청

**인증**: 필요 (관리자)

**경로 파라미터**
- `id`: 퀴즈 ID

### 응답

**성공 (204)** - No Content

---

## GET /admin/analytics/users

사용자 분석

### 요청

**인증**: 필요 (관리자)

**쿼리 파라미터**
```
period: day | week | month | year
startDate, endDate
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "userGrowth": [
      { "date": "2024-01-01", "count": 120 },
      { "date": "2024-01-02", "count": 135 }
    ],
    "subscriptionDistribution": {
      "free": 12170,
      "basic": 2450,
      "pro": 800
    },
    "retentionRate": {
      "day1": 85.5,
      "day7": 62.3,
      "day30": 45.8
    }
  }
}
```

---

## GET /admin/analytics/revenue

매출 분석

### 요청

**인증**: 필요 (관리자)

**쿼리 파라미터**
```
period: day | week | month | year
startDate, endDate
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "revenueByDate": [
      { "date": "2024-01-01", "amount": 1250000 },
      { "date": "2024-01-02", "amount": 1380000 }
    ],
    "revenueByPlan": {
      "basic": 24255000,
      "pro": 15920000
    },
    "averageRevenuePerUser": 12450
  }
}
```

---

## 관리자 권한 레벨

향후 구현 예정:
- `super_admin`: 모든 권한
- `admin`: 일반 관리 권한
- `support`: 고객 지원 (읽기 전용)

현재는 `admin` 역할만 모든 관리자 API 접근 가능
