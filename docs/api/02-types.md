# 타입 정의

이 문서는 API에서 사용되는 TypeScript 타입 정의를 설명합니다.

## 공통 타입

```typescript
type UUID = string;
type ISODateString = string; // "2025-01-15T09:30:00Z"
type DateString = string; // "2025-01-15"
```

## 사용자 관련

### UserRole

```typescript
type UserRole = "user" | "admin";
```

### User

```typescript
interface User {
  id: UUID;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  phoneNumber?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
```

### UserProfile

```typescript
interface UserProfile extends User {
  subscription: SubscriptionInfo | null;
  preferences?: UserPreferences;
}
```

### UserPreferences

```typescript
interface UserPreferences {
  favoriteStyles: string[];
  preferredColors: string[];
  bodyType?: string;
  budget?: {
    min: number;
    max: number;
  };
}
```

## 구독 관련

### SubscriptionPlan

```typescript
type SubscriptionPlan = "free" | "basic" | "pro";
```

### SubscriptionStatus

```typescript
type SubscriptionStatus = "active" | "cancelled" | "expired" | "pending";
```

### SubscriptionInfo

```typescript
interface SubscriptionInfo {
  id: UUID;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: ISODateString;
  endDate: ISODateString;
  autoRenew: boolean;
  features: SubscriptionFeatures;
}
```

### SubscriptionFeatures

```typescript
interface SubscriptionFeatures {
  dailyRecommendations: number; // -1 = 무제한
  savedOutfitsLimit: number; // -1 = 무제한
  prioritySupport: boolean;
  exclusiveStyles: boolean;
  adFree: boolean;
}
```

## 코디 관련

### ClothingCategory

```typescript
type ClothingCategory = "top" | "bottom" | "shoes" | "accessory" | "outer";
```

### ClothingItem

```typescript
interface ClothingItem {
  id: UUID;
  name: string;
  brand: string;
  category: ClothingCategory;
  price: number;
  imageUrl: string;
  color: string;
  size?: string[];
  purchaseUrl?: string;
}
```

### Outfit

```typescript
interface Outfit {
  id: UUID;
  name?: string;
  top: ClothingItem;
  bottom: ClothingItem;
  shoes: ClothingItem;
  accessories?: ClothingItem[];
  outer?: ClothingItem;
  totalPrice: number;
  reason: string;
  occasion: string;
  season: string;
  style: string;
  createdAt: ISODateString;
}
```

### SavedOutfit

```typescript
interface SavedOutfit extends Outfit {
  userId: UUID;
  savedAt: ISODateString;
  note?: string;
  isFavorite: boolean;
}
```

## 퀴즈 관련

### QuizType

```typescript
type QuizType = "single" | "multiple" | "scale";
```

### Quiz

```typescript
interface Quiz {
  id: UUID;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  isActive: boolean;
  order: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
```

### QuizQuestion

```typescript
interface QuizQuestion {
  id: UUID;
  quizId: UUID;
  text: string;
  type: QuizType;
  options: QuizOption[];
  order: number;
  required: boolean;
}
```

### QuizOption

```typescript
interface QuizOption {
  id: UUID;
  text: string;
  value: string;
  imageUrl?: string;
}
```

### QuizResponse

```typescript
interface QuizResponse {
  questionId: UUID;
  selectedOptions: string[]; // option values
}
```

## 결제 관련

### PaymentMethod

```typescript
type PaymentMethod =
  | "credit_card"
  | "kakao_pay"
  | "naver_pay"
  | "bank_transfer";
```

### PaymentStatus

```typescript
type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "cancelled";
```

### Payment

```typescript
interface Payment {
  id: UUID;
  userId: UUID;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  subscriptionPlan: SubscriptionPlan;
  description: string;
  transactionId?: string;
  receiptUrl?: string;
  failureReason?: string;
  createdAt: ISODateString;
  completedAt?: ISODateString;
}
```

### PaymentCard

```typescript
interface PaymentCard {
  id: UUID;
  userId: UUID;
  cardNumber: string; // 마스킹: "****-****-****-1234"
  cardBrand: string; // "visa", "mastercard", "hyundai" 등
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  createdAt: ISODateString;
}
```

## 상품 관련

### Product

```typescript
interface Product {
  id: UUID;
  name: string;
  brand: string;
  category: ClothingCategory;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl: string;
  images: string[];
  description?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isActive: boolean;
  tags: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
```

## 관리자 대시보드

### DashboardStats

```typescript
interface DashboardStats {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    activeSubscribers: number;
  };
  subscriptions: {
    free: number;
    basic: number;
    pro: number;
    churnRate: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  recommendations: {
    totalToday: number;
    averagePerUser: number;
  };
}
```

## 인증 관련

### AuthTokens

```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 초 단위
}
```

### LoginResponse

```typescript
interface LoginResponse {
  user: UserProfile;
  tokens: AuthTokens;
}
```

### RegisterRequest

```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  agreeToTerms: boolean;
  agreeToMarketing?: boolean;
}
```

### LoginRequest

```typescript
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

## 코디 추천 요청

### RecommendRequest

```typescript
interface RecommendRequest {
  quizResponses: QuizResponse[];
  additionalContext?: {
    weather?: string;
    occasion?: string;
    budget?: {
      min: number;
      max: number;
    };
  };
}
```

### RecommendResponse

```typescript
interface RecommendResponse {
  recommendations: Outfit[];
  usageInfo: {
    usedToday: number;
    remainingToday: number;
    dailyLimit: number;
  };
}
```
