# 결제 API

Base Path: `/payments`

---

## GET /payments

결제 내역

### 요청

**인증**: 필요

**쿼리 파라미터**
```
page, limit
status: pending | completed | failed | refunded | cancelled
startDate, endDate
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": "pay-001",
      "userId": "user-123",
      "amount": 9900,
      "currency": "KRW",
      "method": "credit_card",
      "status": "completed",
      "subscriptionPlan": "basic",
      "description": "베이직 플랜 월간 구독",
      "transactionId": "txn_abc123",
      "receiptUrl": "https://receipt.mweoipji.com/pay-001",
      "createdAt": "2024-01-01T09:00:00Z",
      "completedAt": "2024-01-01T09:00:05Z"
    }
  ],
  "meta": {
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalAmount": 475200,
      "completedCount": 48
    }
  }
}
```

---

## POST /payments

결제 처리

### 요청

**인증**: 필요

**Body - 신규 카드로 결제**
```json
{
  "amount": 9900,
  "subscriptionPlanId": "plan-basic",
  "card": {
    "number": "4242424242424242",
    "expiryMonth": "12",
    "expiryYear": "25",
    "cvc": "123",
    "holderName": "HONG GILDONG"
  },
  "saveCard": true
}
```

**필드 설명**
- `amount` (required): 결제 금액
- `subscriptionPlanId` (optional): 구독 결제 시 플랜 ID
- `card` (optional): 신규 카드 정보
- `saveCard` (optional): 카드 저장 여부 (기본값: false)

### 응답

**성공 (201)**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay-002",
    "status": "completed",
    "amount": 9900,
    "transactionId": "txn_def456",
    "receiptUrl": "https://receipt.mweoipji.com/pay-002",
    "message": "결제가 완료되었습니다"
  }
}
```

**에러 (422) - 카드 정보 오류**
```json
{
  "success": false,
  "error": {
    "code": "PAY_002",
    "message": "유효하지 않은 카드 정보입니다",
    "details": {
      "field": "card.number",
      "reason": "카드 번호가 올바르지 않습니다"
    }
  }
}
```

---

## POST /payments/:id/refund

환불 요청

### 요청

**인증**: 필요

**Body**
```json
{
  "reason": "서비스 불만족",
  "amount": 9900
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
    "status": "pending",
    "estimatedDate": "2024-01-18T00:00:00Z",
    "message": "환불 요청이 접수되었습니다. 영업일 기준 3-5일 내 처리됩니다."
  }
}
```

---

## GET /payments/methods

저장된 결제 수단

### 요청

**인증**: 필요

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": "pm-001",
      "type": "credit_card",
      "cardNumber": "****-****-****-4242",
      "cardBrand": "visa",
      "expiryMonth": "12",
      "expiryYear": "25",
      "isDefault": true,
      "createdAt": "2024-01-01T09:00:00Z"
    }
  ]
}
```

---

## 결제 방법

### 신용카드 (credit_card)

- Visa, Mastercard, JCB, American Express 지원
- 국내 카드사 전체 지원
- Luhn 알고리즘으로 카드 번호 검증

### 카카오페이 (kakao_pay)

향후 지원 예정

### 네이버페이 (naver_pay)

향후 지원 예정

---

## 결제 상태

| 상태 | 설명 |
|------|------|
| pending | 결제 대기 중 |
| completed | 결제 완료 |
| failed | 결제 실패 |
| refunded | 환불 완료 |
| cancelled | 결제 취소 |

---

## 환불 정책

- **전액 환불**: 구매 후 7일 이내, 서비스 미사용
- **부분 환불**: 일할 계산 (남은 기간에 대한 환불)
- **환불 불가**: 7일 경과, 서비스 사용 시작
- **처리 기간**: 영업일 기준 3-5일
