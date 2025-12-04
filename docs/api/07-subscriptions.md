# 구독 API

Base Path: `/subscriptions`

---

## GET /subscriptions/plans

구독 플랜 목록

### 요청

**인증**: 불필요

### 응답

**성공 (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": "plan-free",
      "name": "Free",
      "displayName": "무료",
      "price": 0,
      "currency": "KRW",
      "billingPeriod": null,
      "features": {
        "dailyRecommendations": 3,
        "savedOutfitsLimit": 10,
        "prioritySupport": false,
        "exclusiveStyles": false,
        "adFree": false
      },
      "description": "기본 기능을 무료로 사용해보세요",
      "highlights": ["하루 3회 코디 추천", "최대 10개 코디 저장"]
    },
    {
      "id": "plan-basic",
      "name": "Basic",
      "displayName": "베이직",
      "price": 9900,
      "currency": "KRW",
      "billingPeriod": "monthly",
      "features": {
        "dailyRecommendations": 10,
        "savedOutfitsLimit": 50,
        "prioritySupport": false,
        "exclusiveStyles": false,
        "adFree": true
      },
      "description": "더 많은 추천을 받아보세요",
      "highlights": ["하루 10회 코디 추천", "최대 50개 코디 저장", "광고 제거"],
      "badge": "인기"
    },
    {
      "id": "plan-pro",
      "name": "Pro",
      "displayName": "프로",
      "price": 19900,
      "currency": "KRW",
      "billingPeriod": "monthly",
      "features": {
        "dailyRecommendations": -1,
        "savedOutfitsLimit": -1,
        "prioritySupport": true,
        "exclusiveStyles": true,
        "adFree": true
      },
      "description": "모든 기능을 무제한으로",
      "highlights": [
        "무제한 코디 추천",
        "무제한 코디 저장",
        "독점 스타일 컬렉션",
        "우선 고객 지원"
      ],
      "badge": "추천"
    }
  ]
}
```

---

## GET /subscriptions/me

내 구독 정보

### 요청

**인증**: 필요

### 응답

**성공 (200)**

```json
{
  "success": true,
  "data": {
    "id": "sub-123",
    "plan": "basic",
    "status": "active",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-02-01T00:00:00Z",
    "autoRenew": true,
    "features": {
      "dailyRecommendations": 10,
      "savedOutfitsLimit": 50,
      "prioritySupport": false,
      "exclusiveStyles": false,
      "adFree": true
    },
    "usage": {
      "recommendationsToday": 3,
      "recommendationsRemaining": 7,
      "savedOutfits": 12,
      "savedOutfitsRemaining": 38
    },
    "billing": {
      "nextBillingDate": "2025-02-01T00:00:00Z",
      "amount": 9900,
      "paymentMethod": {
        "type": "credit_card",
        "last4": "1234",
        "brand": "visa"
      }
    }
  }
}
```

---

## POST /subscriptions

구독 시작/변경

### 요청

**인증**: 필요

**Body**

```json
{
  "planId": "plan-basic",
  "paymentMethodId": "pm-123",
  "couponCode": "WELCOME2025"
}
```

### 응답

**성공 (201)**

```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub-124",
      "plan": "basic",
      "status": "active",
      "startDate": "2025-01-15T09:30:00Z",
      "endDate": "2025-02-15T09:30:00Z",
      "autoRenew": true
    },
    "payment": {
      "id": "pay-456",
      "amount": 9900,
      "discount": 0,
      "finalAmount": 9900,
      "status": "completed"
    }
  }
}
```

**에러 (409) - 이미 활성 구독 존재**

```json
{
  "success": false,
  "error": {
    "code": "SUB_002",
    "message": "이미 활성화된 구독이 있습니다",
    "details": {
      "currentPlan": "basic",
      "endDate": "2025-02-01T00:00:00Z"
    }
  }
}
```

---

## DELETE /subscriptions/me

구독 취소

### 요청

**인증**: 필요

**Body**

```json
{
  "reason": "서비스 불만족",
  "feedback": "추천 정확도 개선 필요"
}
```

### 응답

**성공 (200)**

```json
{
  "success": true,
  "data": {
    "message": "구독이 취소되었습니다",
    "effectiveDate": "2025-02-01T00:00:00Z",
    "subscription": {
      "id": "sub-123",
      "plan": "basic",
      "status": "cancelled",
      "endDate": "2025-02-01T00:00:00Z",
      "autoRenew": false
    }
  }
}
```

---

## 구독 상태

| 상태      | 설명                        |
| --------- | --------------------------- |
| active    | 활성 구독                   |
| cancelled | 취소됨 (기간 종료까지 유효) |
| expired   | 만료됨                      |
| pending   | 결제 대기 중                |

---

## 플랜 비교

| 기능           | Free | Basic   | Pro      |
| -------------- | ---- | ------- | -------- |
| 일일 코디 추천 | 3회  | 10회    | 무제한   |
| 코디 저장      | 10개 | 50개    | 무제한   |
| 광고 제거      | ✗    | ✓       | ✓        |
| 독점 스타일    | ✗    | ✗       | ✓        |
| 우선 고객 지원 | ✗    | ✗       | ✓        |
| 월 가격        | 무료 | 9,900원 | 19,900원 |
