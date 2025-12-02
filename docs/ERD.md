# 뭐입지 ERD (Entity Relationship Diagram)

## 개요
현재 프론트엔드 상태 기반으로 설계한 데이터베이스 스키마입니다.

---

## ERD 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  ┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐               │
│  │    users    │       │  subscriptions  │       │ subscription_   │               │
│  ├─────────────┤       ├─────────────────┤       │     plans       │               │
│  │ PK id       │──┐    │ PK id           │    ┌──├─────────────────┤               │
│  │ email       │  │    │ FK user_id      │────┘  │ PK id           │               │
│  │ password    │  └───▶│ FK plan_id      │───────│ name            │               │
│  │ name        │       │ start_date      │       │ price           │               │
│  │ created_at  │       │ end_date        │       │ features        │               │
│  │ updated_at  │       │ is_active       │       │ limits          │               │
│  └─────────────┘       │ created_at      │       └─────────────────┘               │
│         │              └─────────────────┘                                          │
│         │                                                                           │
│         │              ┌─────────────────┐       ┌─────────────────┐               │
│         │              │  saved_outfits  │       │    products     │               │
│         │              ├─────────────────┤       ├─────────────────┤               │
│         └─────────────▶│ PK id           │       │ PK id           │               │
│                        │ FK user_id      │    ┌──│ name            │               │
│                        │ FK top_id       │────┤  │ brand           │               │
│                        │ FK bottom_id    │────┤  │ price           │               │
│                        │ FK shoes_id     │────┘  │ image_url       │               │
│                        │ total_price     │       │ category        │               │
│                        │ reason          │       │ external_url    │               │
│                        │ created_at      │       │ created_at      │               │
│                        └─────────────────┘       └─────────────────┘               │
│                                                           │                         │
│         ┌─────────────┐       ┌─────────────────┐        │                         │
│         │quiz_sessions│       │  quiz_answers   │        │                         │
│         ├─────────────┤       ├─────────────────┤        │                         │
│         │ PK id       │──────▶│ PK id           │        │                         │
│         │ FK user_id  │       │ FK session_id   │        │                         │
│         │ status      │       │ question_id     │        │                         │
│         │ created_at  │       │ answer_value    │        │       ┌─────────────┐   │
│         │ completed_at│       └─────────────────┘        │       │   brands    │   │
│         └─────────────┘                                  └──────▶├─────────────┤   │
│                │                                                 │ PK id       │   │
│                │              ┌─────────────────┐                │ name        │   │
│                │              │ recommendations │                │ logo_url    │   │
│                └─────────────▶├─────────────────┤                │ website_url │   │
│                               │ PK id           │                └─────────────┘   │
│                               │ FK session_id   │                                   │
│                               │ FK outfit_id    │                                   │
│                               │ created_at      │                                   │
│                               └─────────────────┘                                   │
│                                                                                     │
│  ┌─────────────────┐                                                               │
│  │    payments     │                                                               │
│  ├─────────────────┤                                                               │
│  │ PK id           │                                                               │
│  │ FK user_id      │                                                               │
│  │ FK subscription │                                                               │
│  │ amount          │                                                               │
│  │ payment_method  │                                                               │
│  │ status          │                                                               │
│  │ pg_transaction  │                                                               │
│  │ created_at      │                                                               │
│  └─────────────────┘                                                               │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 테이블 상세 정의

### 1. users (사용자)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 사용자 고유 식별자 |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 이메일 (로그인 ID) |
| password_hash | VARCHAR(255) | NOT NULL | 비밀번호 해시 |
| name | VARCHAR(50) | NOT NULL | 사용자 이름 |
| created_at | TIMESTAMP | DEFAULT NOW() | 가입일시 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일시 |

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

---

### 2. subscription_plans (구독 플랜)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | VARCHAR(20) | PK | 플랜 ID (free, basic, pro) |
| name | VARCHAR(50) | NOT NULL | 플랜 이름 |
| price | INTEGER | NOT NULL | 월 가격 (원) |
| description | TEXT | | 플랜 설명 |
| features | JSONB | | 포함 기능 목록 |
| limits | JSONB | | 제한 사항 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성화 여부 |

```sql
CREATE TABLE subscription_plans (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    features JSONB DEFAULT '[]',
    limits JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE
);

-- 초기 데이터
INSERT INTO subscription_plans (id, name, price, description, features, limits) VALUES
('free', 'Free', 0, '무료 플랜',
 '["월 5회 코디 추천", "기본 스타일 분석"]',
 '{"monthly_recommendations": 5, "saved_outfits": 10}'),
('basic', 'Basic', 9900, '스타일링을 시작하는 분들께',
 '["월 30회 코디 추천", "기본 스타일 분석", "코디 저장 (최대 50개)", "이메일 지원"]',
 '{"monthly_recommendations": 30, "saved_outfits": 50}'),
('pro', 'Pro', 19900, '완벽한 스타일을 원하는 분들께',
 '["무제한 코디 추천", "AI 심층 스타일 분석", "코디 저장 무제한", "프리미엄 브랜드 추천", "체형 맞춤 분석", "1:1 스타일 상담 (월 2회)"]',
 '{"monthly_recommendations": -1, "saved_outfits": -1}');
```

---

### 3. subscriptions (사용자 구독)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 구독 고유 식별자 |
| user_id | UUID | FK, NOT NULL | 사용자 ID |
| plan_id | VARCHAR(20) | FK, NOT NULL | 플랜 ID |
| start_date | DATE | NOT NULL | 구독 시작일 |
| end_date | DATE | | 구독 종료일 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성화 여부 |
| auto_renew | BOOLEAN | DEFAULT TRUE | 자동 갱신 여부 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| cancelled_at | TIMESTAMP | | 취소일시 |

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(20) NOT NULL REFERENCES subscription_plans(id),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(user_id, is_active);
```

---

### 4. brands (브랜드)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 브랜드 고유 식별자 |
| name | VARCHAR(100) | UNIQUE, NOT NULL | 브랜드명 |
| logo_url | TEXT | | 로고 이미지 URL |
| website_url | TEXT | | 공식 웹사이트 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5. products (상품)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 상품 고유 식별자 |
| name | VARCHAR(200) | NOT NULL | 상품명 |
| brand_id | UUID | FK | 브랜드 ID |
| price | INTEGER | NOT NULL | 가격 (원) |
| image_url | TEXT | | 상품 이미지 URL |
| category | VARCHAR(20) | NOT NULL | 카테고리 (top, bottom, shoes, accessory) |
| external_url | TEXT | | 외부 구매 링크 (무신사 등) |
| external_id | VARCHAR(100) | | 외부 상품 ID |
| is_available | BOOLEAN | DEFAULT TRUE | 판매 가능 여부 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일시 |

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    brand_id UUID REFERENCES brands(id),
    price INTEGER NOT NULL,
    image_url TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN ('top', 'bottom', 'shoes', 'accessory')),
    external_url TEXT,
    external_id VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_price ON products(price);
```

---

### 6. quiz_sessions (퀴즈 세션)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 세션 고유 식별자 |
| user_id | UUID | FK | 사용자 ID (비회원은 NULL) |
| status | VARCHAR(20) | NOT NULL | 상태 (in_progress, completed, abandoned) |
| created_at | TIMESTAMP | DEFAULT NOW() | 시작일시 |
| completed_at | TIMESTAMP | | 완료일시 |

```sql
CREATE TABLE quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id);
```

---

### 7. quiz_answers (퀴즈 답변)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 답변 고유 식별자 |
| session_id | UUID | FK, NOT NULL | 세션 ID |
| question_id | INTEGER | NOT NULL | 질문 번호 (1-4) |
| answer_value | VARCHAR(50) | NOT NULL | 답변 값 |
| created_at | TIMESTAMP | DEFAULT NOW() | 답변일시 |

```sql
CREATE TABLE quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL CHECK (question_id BETWEEN 1 AND 4),
    answer_value VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, question_id)
);

-- 질문 정의 참조
-- 1: 어디 가요? (school, work, date, casual)
-- 2: 어떻게 보이고 싶어요? (clean, comfortable, cool, unique)
-- 3: 체형 고민? (none, belly, thin, height)
-- 4: 예산은? (100k, 200k, 300k, unlimited)
```

---

### 8. saved_outfits (저장된 코디)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 코디 고유 식별자 |
| user_id | UUID | FK, NOT NULL | 사용자 ID |
| top_id | UUID | FK, NOT NULL | 상의 상품 ID |
| bottom_id | UUID | FK, NOT NULL | 하의 상품 ID |
| shoes_id | UUID | FK, NOT NULL | 신발 상품 ID |
| total_price | INTEGER | NOT NULL | 총 가격 |
| reason | TEXT | | AI 추천 이유 |
| created_at | TIMESTAMP | DEFAULT NOW() | 저장일시 |

```sql
CREATE TABLE saved_outfits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    top_id UUID NOT NULL REFERENCES products(id),
    bottom_id UUID NOT NULL REFERENCES products(id),
    shoes_id UUID NOT NULL REFERENCES products(id),
    total_price INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_outfits_user ON saved_outfits(user_id);
CREATE INDEX idx_saved_outfits_created ON saved_outfits(user_id, created_at DESC);
```

---

### 9. recommendations (AI 추천 기록)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 추천 고유 식별자 |
| session_id | UUID | FK, NOT NULL | 퀴즈 세션 ID |
| top_id | UUID | FK, NOT NULL | 추천 상의 ID |
| bottom_id | UUID | FK, NOT NULL | 추천 하의 ID |
| shoes_id | UUID | FK, NOT NULL | 추천 신발 ID |
| total_price | INTEGER | NOT NULL | 총 가격 |
| reason | TEXT | | AI 추천 이유 |
| created_at | TIMESTAMP | DEFAULT NOW() | 추천일시 |

```sql
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    top_id UUID NOT NULL REFERENCES products(id),
    bottom_id UUID NOT NULL REFERENCES products(id),
    shoes_id UUID NOT NULL REFERENCES products(id),
    total_price INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_session ON recommendations(session_id);
```

---

### 10. payments (결제)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK | 결제 고유 식별자 |
| user_id | UUID | FK, NOT NULL | 사용자 ID |
| subscription_id | UUID | FK | 구독 ID |
| amount | INTEGER | NOT NULL | 결제 금액 |
| payment_method | VARCHAR(50) | NOT NULL | 결제 수단 |
| status | VARCHAR(20) | NOT NULL | 결제 상태 |
| pg_provider | VARCHAR(50) | | PG사 |
| pg_transaction_id | VARCHAR(100) | | PG 거래 ID |
| card_last_four | VARCHAR(4) | | 카드 마지막 4자리 |
| created_at | TIMESTAMP | DEFAULT NOW() | 결제일시 |
| completed_at | TIMESTAMP | | 완료일시 |

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    amount INTEGER NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    pg_provider VARCHAR(50),
    pg_transaction_id VARCHAR(100),
    card_last_four VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
```

---

## 관계 요약

| 관계 | 설명 | 카디널리티 |
|------|------|-----------|
| users → subscriptions | 사용자의 구독 내역 | 1:N |
| users → saved_outfits | 사용자가 저장한 코디 | 1:N |
| users → quiz_sessions | 사용자의 퀴즈 세션 | 1:N |
| users → payments | 사용자의 결제 내역 | 1:N |
| subscription_plans → subscriptions | 플랜별 구독 | 1:N |
| quiz_sessions → quiz_answers | 세션별 답변 | 1:N |
| quiz_sessions → recommendations | 세션별 추천 결과 | 1:N |
| brands → products | 브랜드별 상품 | 1:N |
| products → saved_outfits | 상품이 포함된 코디 | 1:N (각 카테고리별) |
| products → recommendations | 추천에 포함된 상품 | 1:N (각 카테고리별) |

---

## 인덱스 전략

### 자주 사용되는 쿼리 패턴

1. **사용자 조회**: `email`로 로그인
2. **구독 확인**: `user_id` + `is_active`로 현재 구독 상태
3. **저장된 코디**: `user_id` + `created_at` 최신순 정렬
4. **상품 검색**: `category`, `brand_id`, `price` 범위 검색

### 권장 인덱스

```sql
-- 복합 인덱스
CREATE INDEX idx_subscriptions_user_active ON subscriptions(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_saved_outfits_user_date ON saved_outfits(user_id, created_at DESC);
CREATE INDEX idx_products_category_price ON products(category, price);
CREATE INDEX idx_products_available ON products(is_available) WHERE is_available = TRUE;
```

---

## 확장 고려사항

### 향후 추가 가능한 테이블

1. **user_preferences**: 사용자 스타일 선호도 저장
2. **product_reviews**: 상품 리뷰
3. **wishlist**: 찜 목록
4. **notifications**: 알림
5. **analytics_events**: 사용자 행동 로그

### 성능 최적화

- 읽기가 많은 테이블(products, brands)은 Redis 캐싱 고려
- 대용량 데이터 예상 시 파티셔닝 (created_at 기준)
- 전문 검색 필요 시 Elasticsearch 연동
