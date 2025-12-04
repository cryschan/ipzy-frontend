# 상품 API

Base Path: `/products`

---

## GET /products

상품 목록

### 요청

**인증**: 선택 (비회원도 조회 가능)

**쿼리 파라미터**

```
page: 페이지 번호 (기본값: 1)
limit: 페이지당 항목 수 (기본값: 20, 최대: 50)
category: top | bottom | shoes | accessory | outer
brand: 브랜드 이름
minPrice: 최소 가격
maxPrice: 최대 가격
color: 색상
size: 사이즈
tags: 태그 (쉼표 구분, 예: "basic,cotton")
search: 검색어 (상품명, 브랜드)
sort: price | -price | createdAt | -createdAt | name
```

**요청 예시**

```
GET /api/v1/products?category=top&minPrice=20000&maxPrice=50000&sort=-createdAt&page=1&limit=20
```

### 응답

**성공 (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": "prod-101",
      "name": "오버핏 코튼 티셔츠",
      "brand": "무신사 스탠다드",
      "category": "top",
      "subCategory": "t-shirt",
      "price": 29000,
      "originalPrice": 39000,
      "discountPercent": 26,
      "imageUrl": "https://cdn.mweoipji.com/products/prod-101.jpg",
      "images": [
        "https://cdn.mweoipji.com/products/prod-101-1.jpg",
        "https://cdn.mweoipji.com/products/prod-101-2.jpg"
      ],
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["white", "black", "gray"],
      "stock": 150,
      "isActive": true,
      "tags": ["basic", "oversized", "cotton"],
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T00:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 195,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "appliedFilters": {
        "category": "top",
        "minPrice": 20000,
        "maxPrice": 50000
      },
      "availableFilters": {
        "brands": ["무신사 스탠다드", "유니클로", "자라", "COS"],
        "colors": ["white", "black", "gray", "navy", "beige"],
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "priceRange": {
          "min": 15000,
          "max": 89000
        },
        "categories": [
          { "value": "top", "count": 78 },
          { "value": "bottom", "count": 65 },
          { "value": "shoes", "count": 42 },
          { "value": "outer", "count": 10 }
        ]
      }
    }
  }
}
```

---

## GET /products/:id

상품 상세

### 요청

**인증**: 선택

**경로 파라미터**

- `id`: 상품 ID

### 응답

**성공 (200)**

```json
{
  "success": true,
  "data": {
    "id": "prod-101",
    "name": "오버핏 코튼 티셔츠",
    "brand": "무신사 스탠다드",
    "category": "top",
    "subCategory": "t-shirt",
    "price": 29000,
    "originalPrice": 39000,
    "discountPercent": 26,
    "imageUrl": "https://cdn.mweoipji.com/products/prod-101.jpg",
    "images": [
      "https://cdn.mweoipji.com/products/prod-101-1.jpg",
      "https://cdn.mweoipji.com/products/prod-101-2.jpg",
      "https://cdn.mweoipji.com/products/prod-101-3.jpg"
    ],
    "description": "편안한 착용감의 오버핏 코튼 티셔츠입니다. 20수 면 소재로 부드럽고 내구성이 좋습니다.",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["white", "black", "gray"],
    "sizeGuide": {
      "S": { "chest": 55, "length": 70, "shoulder": 50 },
      "M": { "chest": 58, "length": 72, "shoulder": 52 },
      "L": { "chest": 61, "length": 74, "shoulder": 54 },
      "XL": { "chest": 64, "length": 76, "shoulder": 56 }
    },
    "material": "면 100%",
    "careInstructions": [
      "찬물 세탁",
      "드라이클리닝 가능",
      "표백제 사용 금지",
      "다림질 낮은 온도"
    ],
    "stock": 150,
    "stockBySize": {
      "S": 30,
      "M": 50,
      "L": 45,
      "XL": 25
    },
    "isActive": true,
    "tags": ["basic", "oversized", "cotton"],
    "relatedProducts": [
      {
        "id": "prod-102",
        "name": "슬림핏 코튼 티셔츠",
        "imageUrl": "https://cdn.mweoipji.com/products/prod-102.jpg",
        "price": 25000
      },
      {
        "id": "prod-103",
        "name": "라운드넥 기본 티셔츠",
        "imageUrl": "https://cdn.mweoipji.com/products/prod-103.jpg",
        "price": 19000
      }
    ],
    "purchaseUrl": "https://store.musinsa.com/app/product/detail/...",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-15T00:00:00Z"
  }
}
```

**에러 (404)**

```json
{
  "success": false,
  "error": {
    "code": "PROD_001",
    "message": "상품을 찾을 수 없습니다"
  }
}
```

---

## GET /products/search

상품 검색 (고급)

### 요청

**인증**: 선택

**쿼리 파라미터**

```
q: 검색어 (필수)
category: 카테고리 필터
brands: 브랜드 필터 (쉼표 구분)
colors: 색상 필터 (쉼표 구분)
minPrice, maxPrice: 가격 범위
sort: relevance | price | -price
page, limit: 페이지네이션
```

**요청 예시**

```
GET /api/v1/products/search?q=티셔츠&brands=무신사,유니클로&minPrice=10000&maxPrice=50000
```

### 응답

**성공 (200)** - GET /products와 동일한 형식

---

## 카테고리

| 값        | 설명     | 서브카테고리 예시            |
| --------- | -------- | ---------------------------- |
| top       | 상의     | t-shirt, shirt, knit, hoodie |
| bottom    | 하의     | jeans, pants, shorts, skirt  |
| shoes     | 신발     | sneakers, loafers, boots     |
| accessory | 악세서리 | bag, hat, watch, jewelry     |
| outer     | 아우터   | jacket, coat, cardigan       |

---

## 브랜드

주요 연동 브랜드:

- 무신사 스탠다드
- 유니클로
- 자라 (ZARA)
- COS
- H&M
- 앤아더스토리즈
- 에잇세컨즈
- 스파오

---

## 사이즈 가이드

### 상의 (cm)

| 사이즈 | 가슴둘레 | 총장 | 어깨너비 |
| ------ | -------- | ---- | -------- |
| XS     | 52       | 68   | 48       |
| S      | 55       | 70   | 50       |
| M      | 58       | 72   | 52       |
| L      | 61       | 74   | 54       |
| XL     | 64       | 76   | 56       |
| XXL    | 67       | 78   | 58       |

### 하의 (인치)

| 사이즈 | 허리   | 예시    |
| ------ | ------ | ------- |
| 28     | 28인치 | 약 71cm |
| 30     | 30인치 | 약 76cm |
| 32     | 32인치 | 약 81cm |
| 34     | 34인치 | 약 86cm |
| 36     | 36인치 | 약 91cm |

### 신발 (mm)

한국 표준 사이즈 사용

- 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290

---

## 색상 코드

| 값    | 한글명 | Hex     |
| ----- | ------ | ------- |
| white | 화이트 | #FFFFFF |
| black | 블랙   | #000000 |
| gray  | 그레이 | #808080 |
| navy  | 네이비 | #000080 |
| beige | 베이지 | #F5F5DC |
| brown | 브라운 | #8B4513 |
| red   | 레드   | #FF0000 |
| blue  | 블루   | #0000FF |
| green | 그린   | #008000 |

---

## 정렬 옵션

| 값         | 설명                      |
| ---------- | ------------------------- |
| relevance  | 연관도순 (검색 시 기본값) |
| price      | 낮은 가격순               |
| -price     | 높은 가격순               |
| createdAt  | 오래된 순                 |
| -createdAt | 최신순 (기본값)           |
| name       | 이름 오름차순             |
| -name      | 이름 내림차순             |

---

## 재고 관리

- `stock > 0`: 구매 가능
- `stock == 0`: 품절
- `isActive == false`: 판매 중단

품절 상품도 검색 결과에 포함되며, UI에서 "품절" 표시 필요

---

## 외부 링크

모든 상품은 `purchaseUrl` 필드를 통해 실제 구매 페이지로 연결됩니다.

- 무신사: `https://store.musinsa.com/...`
- 기타 브랜드: 해당 브랜드 공식 사이트

---

## 이미지

### 이미지 크기

CDN을 통해 다양한 크기 제공:

- 썸네일: 200x200px
- 중간: 600x600px
- 원본: 1200x1200px

URL 파라미터로 크기 지정:

```
https://cdn.mweoipji.com/products/prod-101.jpg?size=200
https://cdn.mweoipji.com/products/prod-101.jpg?size=600
```

### 이미지 순서

`images` 배열의 첫 번째 이미지가 메인 이미지이며, `imageUrl`과 동일합니다.

---

## 참고 사항

### 가격 정보

- `price`: 현재 판매가
- `originalPrice`: 정가 (할인 전)
- `discountPercent`: 할인율 (계산값)

할인이 없는 경우 `originalPrice`는 null이며, `discountPercent`는 0입니다.

### 관련 상품

`relatedProducts`는 스타일, 카테고리, 가격대를 고려한 추천 상품 목록입니다 (최대 5개).
