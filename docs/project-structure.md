# 프로젝트 구조

## 개요

React + TypeScript + Vite 기반 프론트엔드 프로젝트입니다.

---

## 디렉토리 구조

```
src/
├── admin/                    # 관리자 페이지
│   ├── components/           # 관리자 전용 컴포넌트
│   │   ├── AdminHeader.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── DataTable.tsx
│   │   └── StatsCard.tsx
│   ├── pages/               # 관리자 페이지
│   │   ├── AdminLogin.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Payments.tsx
│   │   ├── Products.tsx
│   │   ├── QuizManagement.tsx
│   │   ├── Settings.tsx
│   │   ├── Subscriptions.tsx
│   │   ├── UserDetail.tsx
│   │   └── UserList.tsx
│   └── utils/
│       └── mockData.ts
│
├── components/              # 공용 컴포넌트
│   ├── CTASection.tsx
│   ├── FeatureCard.tsx
│   ├── FeaturesSection.tsx
│   ├── HeroSection.tsx
│   ├── Logo.tsx
│   ├── ManifestoCard.tsx
│   ├── PhoneMockup.tsx
│   ├── RouteGuard.tsx       # 라우트 보호 (인증/권한)
│   ├── TestimonialsSection.tsx
│   └── ui/
│       └── card.tsx
│
├── context/                 # React Context
│   └── AuthContext.tsx      # 인증 상태 관리
│
├── lib/
│   └── utils.ts             # 유틸리티 함수
│
├── pages/                   # 사용자 페이지
│   ├── Home.tsx             # 메인 (랜딩)
│   ├── Loading.tsx          # 로딩 화면
│   ├── Login.tsx            # 로그인
│   ├── MyPage.tsx           # 마이페이지
│   ├── NetworkError.tsx     # 네트워크 에러
│   ├── NotFound.tsx         # 404
│   ├── Payment.tsx          # 결제
│   ├── Pricing.tsx          # 요금제
│   ├── Quiz.tsx             # 퀴즈
│   ├── Result.tsx           # 결과
│   ├── ServerError.tsx      # 500 에러
│   └── ValidationExamples.tsx # 개발용
│
├── utils/
│   └── validation.ts        # 유효성 검사
│
├── App.tsx                  # 라우트 정의
└── main.tsx                 # 엔트리포인트
```

---

## 라우팅 구조

### 공개 페이지

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | `Home` | 메인 (랜딩) |
| `/quiz` | `Quiz` | 퀴즈 |
| `/pricing` | `Pricing` | 요금제 |

### 인증 관련

| 경로 | 컴포넌트 | 가드 |
|------|----------|------|
| `/login` | `Login` | `GuestRoute` (비로그인만) |
| `/auth/callback` | `AuthCallback` | - |

### 보호된 페이지

| 경로 | 컴포넌트 | 가드 |
|------|----------|------|
| `/mypage` | `MyPage` | `ProtectedRoute` |
| `/payment` | `Payment` | `ProtectedRoute` |
| `/loading` | `Loading` | `QuizRequiredRoute` |
| `/result` | `Result` | `QuizRequiredRoute` |

### 관리자 페이지

| 경로 | 컴포넌트 | 가드 |
|------|----------|------|
| `/admin/login` | `AdminLogin` | - |
| `/admin/*` | `AdminLayout` | `AdminRoute` |

---

## 라우트 가드

### GuestRoute
비로그인 사용자만 접근 가능. 로그인 상태면 메인으로 리다이렉트.

### ProtectedRoute
로그인 사용자만 접근 가능. 비로그인이면 로그인 페이지로 리다이렉트.

### QuizRequiredRoute
퀴즈 응답이 필요한 페이지. 응답 없으면 퀴즈 페이지로 리다이렉트.

### AdminRoute
관리자 권한 필요. 권한 없으면 관리자 로그인으로 리다이렉트.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18 |
| 언어 | TypeScript |
| 빌드 | Vite |
| 스타일 | Tailwind CSS |
| 라우팅 | React Router v6 |
| 상태 관리 | React Context |
| 아이콘 | Lucide React |

---

## 환경 변수

```bash
# API 서버 주소
VITE_API_BASE_URL=http://localhost:8080
```

---

## 스크립트

```bash
npm run dev      # 개발 서버 (5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
npm run lint     # ESLint
```
