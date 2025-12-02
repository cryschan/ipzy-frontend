# 코디 추천 API

Base Path: `/outfits`

---

## POST /outfits/recommend

코디 추천 받기

### 요청

**인증**: 필요 (Free 플랜도 가능, 일일 제한 적용)
**Rate Limit**: 플랜별 일일 한도

**Body**
```json
{
  "quizResponses": [
    {
      "questionId": "q1-style",
      "selectedOptions": ["casual"]
    },
    {
      "questionId": "q2-color",
      "selectedOptions": ["black", "white"]
    },
    {
      "questionId": "q3-occasion",
      "selectedOptions": ["daily"]
    },
    {
      "questionId": "q4-budget",
      "selectedOptions": ["medium"]
    }
  ],
  "additionalContext": {
    "weather": "sunny",
    "occasion": "casual_outing"
  }
}
```

**필드 설명**
- `quizResponses` (required): 퀴즈 응답 배열
- `additionalContext` (optional): 날씨, 상황 등 추가 정보

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "outfit-001",
        "name": "캐주얼 데일리 룩",
        "top": {
          "id": "prod-101",
          "name": "오버핏 코튼 티셔츠",
          "brand": "무신사 스탠다드",
          "category": "top",
          "price": 29000,
          "imageUrl": "https://cdn.mweoipji.com/products/prod-101.jpg",
          "color": "white"
        },
        "bottom": {
          "id": "prod-201",
          "name": "와이드 데님 팬츠",
          "brand": "무신사 스탠다드",
          "category": "bottom",
          "price": 49000,
          "imageUrl": "https://cdn.mweoipji.com/products/prod-201.jpg",
          "color": "blue"
        },
        "shoes": {
          "id": "prod-301",
          "name": "뉴발란스 530",
          "brand": "New Balance",
          "category": "shoes",
          "price": 139000,
          "imageUrl": "https://cdn.mweoipji.com/products/prod-301.jpg",
          "color": "white"
        },
        "totalPrice": 217000,
        "reason": "편안하면서도 깔끔한 캐주얼 룩입니다.",
        "occasion": "daily",
        "season": "spring",
        "style": "casual",
        "createdAt": "2024-01-15T09:30:00Z"
      }
    ],
    "usageInfo": {
      "usedToday": 4,
      "remainingToday": 6,
      "dailyLimit": 10
    }
  }
}
```

**에러 (422) - 일일 한도 초과**
```json
{
  "success": false,
  "error": {
    "code": "OUTFIT_002",
    "message": "일일 추천 횟수를 초과했습니다",
    "details": {
      "dailyLimit": 3,
      "usedToday": 3,
      "resetAt": "2024-01-16T00:00:00Z"
    }
  }
}
```

---

## GET /outfits/saved

저장된 코디 목록

### 요청

**인증**: 필요

**쿼리 파라미터**
```
page: 페이지 번호 (기본값: 1)
limit: 페이지당 항목 수 (기본값: 10, 최대: 50)
sort: savedAt | -savedAt | totalPrice | -totalPrice
isFavorite: true | false
```

### 응답

**성공 (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": "saved-001",
      "userId": "user-123",
      "name": "캐주얼 데일리 룩",
      "top": {
        "id": "prod-101",
        "name": "오버핏 코튼 티셔츠",
        "price": 29000
      },
      "bottom": {
        "id": "prod-201",
        "name": "와이드 데님 팬츠",
        "price": 49000
      },
      "shoes": {
        "id": "prod-301",
        "name": "뉴발란스 530",
        "price": 139000
      },
      "totalPrice": 217000,
      "savedAt": "2024-01-15T09:30:00Z",
      "note": "출근용으로 좋을 듯",
      "isFavorite": true
    }
  ],
  "meta": {
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## POST /outfits/saved

코디 저장

### 요청

**인증**: 필요

**Body**
```json
{
  "outfitId": "outfit-001",
  "note": "주말 데이트용",
  "isFavorite": false
}
```

### 응답

**성공 (201)**
```json
{
  "success": true,
  "data": {
    "id": "saved-002",
    "outfitId": "outfit-001",
    "savedAt": "2024-01-15T09:30:00Z",
    "note": "주말 데이트용",
    "isFavorite": false
  }
}
```

**에러 (422) - 저장 한도 초과**
```json
{
  "success": false,
  "error": {
    "code": "SUB_004",
    "message": "저장 가능한 코디 수를 초과했습니다",
    "details": {
      "currentCount": 10,
      "limit": 10,
      "plan": "free"
    }
  }
}
```

---

## DELETE /outfits/saved/:id

저장된 코디 삭제

### 요청

**인증**: 필요

**경로 파라미터**
- `id`: 저장된 코디 ID

### 응답

**성공 (204)** - No Content

---

## 플랜별 제한사항

| 플랜 | 일일 추천 | 저장 코디 | 독점 스타일 |
|------|-----------|-----------|-------------|
| Free | 3회 | 10개 | ✗ |
| Basic | 10회 | 50개 | ✗ |
| Pro | 무제한 | 무제한 | ✓ |
