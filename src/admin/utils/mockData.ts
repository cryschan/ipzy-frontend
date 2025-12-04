// 모의 사용자 데이터
export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  plan: "free" | "basic" | "pro";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLoginAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "hong@email.com",
    name: "홍길동",
    role: "user",
    plan: "pro",
    status: "active",
    createdAt: "2025-01-15",
    lastLoginAt: "2025-01-20",
  },
  {
    id: "2",
    email: "kim@email.com",
    name: "김철수",
    role: "user",
    plan: "basic",
    status: "active",
    createdAt: "2025-01-14",
    lastLoginAt: "2025-01-19",
  },
  {
    id: "3",
    email: "lee@email.com",
    name: "이영희",
    role: "user",
    plan: "free",
    status: "suspended",
    createdAt: "2025-01-13",
    lastLoginAt: "2025-01-15",
  },
  {
    id: "4",
    email: "park@email.com",
    name: "박민수",
    role: "user",
    plan: "pro",
    status: "active",
    createdAt: "2025-01-12",
    lastLoginAt: "2025-01-20",
  },
  {
    id: "5",
    email: "choi@email.com",
    name: "최지현",
    role: "user",
    plan: "basic",
    status: "active",
    createdAt: "2025-01-11",
    lastLoginAt: "2025-01-18",
  },
  {
    id: "6",
    email: "jung@email.com",
    name: "정우성",
    role: "user",
    plan: "free",
    status: "active",
    createdAt: "2025-01-10",
    lastLoginAt: "2025-01-17",
  },
  {
    id: "7",
    email: "kang@email.com",
    name: "강동원",
    role: "user",
    plan: "pro",
    status: "active",
    createdAt: "2025-01-09",
    lastLoginAt: "2025-01-20",
  },
  {
    id: "8",
    email: "yoon@email.com",
    name: "윤아름",
    role: "user",
    plan: "basic",
    status: "inactive",
    createdAt: "2025-01-08",
    lastLoginAt: "2025-01-10",
  },
  {
    id: "9",
    email: "shin@email.com",
    name: "신민아",
    role: "user",
    plan: "free",
    status: "active",
    createdAt: "2025-01-07",
    lastLoginAt: "2025-01-19",
  },
  {
    id: "10",
    email: "han@email.com",
    name: "한지민",
    role: "user",
    plan: "pro",
    status: "active",
    createdAt: "2025-01-06",
    lastLoginAt: "2025-01-20",
  },
];

// 모의 구독 데이터
export interface MockSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: "basic" | "pro";
  status: "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  amount: number;
}

export const mockSubscriptions: MockSubscription[] = [
  {
    id: "s1",
    userId: "1",
    userName: "홍길동",
    userEmail: "hong@email.com",
    plan: "pro",
    status: "active",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    amount: 19900,
  },
  {
    id: "s2",
    userId: "2",
    userName: "김철수",
    userEmail: "kim@email.com",
    plan: "basic",
    status: "active",
    startDate: "2025-01-14",
    endDate: "2025-02-14",
    amount: 9900,
  },
  {
    id: "s3",
    userId: "4",
    userName: "박민수",
    userEmail: "park@email.com",
    plan: "pro",
    status: "active",
    startDate: "2025-01-12",
    endDate: "2025-02-12",
    amount: 19900,
  },
  {
    id: "s4",
    userId: "5",
    userName: "최지현",
    userEmail: "choi@email.com",
    plan: "basic",
    status: "active",
    startDate: "2025-01-11",
    endDate: "2025-02-11",
    amount: 9900,
  },
  {
    id: "s5",
    userId: "7",
    userName: "강동원",
    userEmail: "kang@email.com",
    plan: "pro",
    status: "active",
    startDate: "2025-01-09",
    endDate: "2025-02-09",
    amount: 19900,
  },
  {
    id: "s6",
    userId: "10",
    userName: "한지민",
    userEmail: "han@email.com",
    plan: "pro",
    status: "active",
    startDate: "2025-01-06",
    endDate: "2025-02-06",
    amount: 19900,
  },
];

// 모의 결제 데이터
export interface MockPayment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: "card" | "kakao" | "naver";
  status: "completed" | "failed" | "refunded";
  plan: "basic" | "pro";
  createdAt: string;
  cardLast4?: string;
}

export const mockPayments: MockPayment[] = [
  {
    id: "p1",
    userId: "1",
    userName: "홍길동",
    amount: 19900,
    method: "card",
    status: "completed",
    plan: "pro",
    createdAt: "2025-01-15 14:30",
    cardLast4: "1234",
  },
  {
    id: "p2",
    userId: "2",
    userName: "김철수",
    amount: 9900,
    method: "kakao",
    status: "completed",
    plan: "basic",
    createdAt: "2025-01-14 10:20",
  },
  {
    id: "p3",
    userId: "4",
    userName: "박민수",
    amount: 19900,
    method: "card",
    status: "completed",
    plan: "pro",
    createdAt: "2025-01-12 16:45",
    cardLast4: "5678",
  },
  {
    id: "p4",
    userId: "5",
    userName: "최지현",
    amount: 9900,
    method: "naver",
    status: "completed",
    plan: "basic",
    createdAt: "2025-01-11 09:15",
  },
  {
    id: "p5",
    userId: "7",
    userName: "강동원",
    amount: 19900,
    method: "card",
    status: "completed",
    plan: "pro",
    createdAt: "2025-01-09 11:30",
    cardLast4: "9012",
  },
  {
    id: "p6",
    userId: "8",
    userName: "윤아름",
    amount: 9900,
    method: "kakao",
    status: "refunded",
    plan: "basic",
    createdAt: "2025-01-08 13:00",
  },
  {
    id: "p7",
    userId: "10",
    userName: "한지민",
    amount: 19900,
    method: "card",
    status: "completed",
    plan: "pro",
    createdAt: "2025-01-06 15:20",
    cardLast4: "3456",
  },
];

// 모의 상품 데이터
export interface MockProduct {
  id: string;
  name: string;
  brand: string;
  category: "top" | "bottom" | "shoes";
  price: number;
  imageUrl: string | null;
  externalUrl: string;
  isAvailable: boolean;
  createdAt: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: "prod1",
    name: "오버핏 옥스포드 셔츠",
    brand: "무신사 스탠다드",
    category: "top",
    price: 59000,
    imageUrl: null,
    externalUrl: "https://musinsa.com",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    id: "prod2",
    name: "와이드 슬랙스 팬츠",
    brand: "커버낫",
    category: "bottom",
    price: 79000,
    imageUrl: null,
    externalUrl: "https://musinsa.com",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    id: "prod3",
    name: "레더 코트 스니커즈",
    brand: "컨버스",
    category: "shoes",
    price: 51000,
    imageUrl: null,
    externalUrl: "https://musinsa.com",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    id: "prod4",
    name: "베이직 크루넥 니트",
    brand: "유니클로",
    category: "top",
    price: 39000,
    imageUrl: null,
    externalUrl: "https://musinsa.com",
    isAvailable: true,
    createdAt: "2025-01-02",
  },
  {
    id: "prod5",
    name: "스트레이트 데님 팬츠",
    brand: "리바이스",
    category: "bottom",
    price: 89000,
    imageUrl: null,
    externalUrl: "https://musinsa.com",
    isAvailable: true,
    createdAt: "2025-01-02",
  },
  {
    id: "prod6",
    name: "클래식 레더 로퍼",
    brand: "닥터마틴",
    category: "shoes",
    price: 159000,
    imageUrl: null,
    externalUrl: "https://musinsa.com",
    isAvailable: true,
    createdAt: "2025-01-02",
  },
  {
    id: "prod7",
    name: "오버사이즈 후드 집업",
    brand: "스투시",
    category: "top",
    price: 129000,
    imageUrl: null,
    externalUrl: "https://musinsa.com",
    isAvailable: false,
    createdAt: "2025-01-03",
  },
  {
    id: "prod8",
    name: "카고 조거 팬츠",
    brand: "디스이즈네버댓",
    category: "bottom",
    price: 98000,
    imageUrl: null,
    externalUrl: "https://musinsa.com",
    isAvailable: true,
    createdAt: "2025-01-03",
  },
];

// 대시보드 통계
export const mockStats = {
  totalUsers: 1234,
  totalUsersChange: 12,
  activeSubscriptions: 389,
  activeSubscriptionsChange: 5,
  monthlyRevenue: 5847600,
  monthlyRevenueChange: 8,
  todayRecommendations: 234,
  todayRecommendationsChange: -3,
};

// 플랜별 사용자 분포
export const mockPlanDistribution = {
  free: { count: 845, percentage: 68 },
  basic: { count: 245, percentage: 20 },
  pro: { count: 144, percentage: 12 },
};

// 최근 활동
export interface MockActivity {
  id: string;
  type: "signup" | "subscription" | "recommendation" | "payment";
  message: string;
  timestamp: string;
}

export const mockActivities: MockActivity[] = [
  {
    id: "a1",
    type: "subscription",
    message: "홍길동님이 Pro 플랜 구독",
    timestamp: "5분 전",
  },
  {
    id: "a2",
    type: "recommendation",
    message: "김철수님이 코디 저장",
    timestamp: "12분 전",
  },
  {
    id: "a3",
    type: "signup",
    message: "이영희님이 회원가입",
    timestamp: "30분 전",
  },
  {
    id: "a4",
    type: "payment",
    message: "박민수님이 ₩19,900 결제 완료",
    timestamp: "1시간 전",
  },
  {
    id: "a5",
    type: "subscription",
    message: "최지현님이 Basic 플랜 구독",
    timestamp: "2시간 전",
  },
];

// 퀴즈 통계
export const mockQuizStats = {
  totalResponses: 12456,
  questions: [
    {
      id: 1,
      question: "어디 가요?",
      options: [
        { value: "school", label: "학교", count: 1121, percentage: 9 },
        { value: "work", label: "회사", count: 2242, percentage: 18 },
        { value: "date", label: "데이트", count: 5605, percentage: 45 },
        { value: "casual", label: "외출", count: 3488, percentage: 28 },
      ],
    },
    {
      id: 2,
      question: "어떻게 보이고 싶어요?",
      options: [
        { value: "clean", label: "깔끔하게", count: 4982, percentage: 40 },
        { value: "comfortable", label: "편하게", count: 3737, percentage: 30 },
        { value: "cool", label: "멋있게", count: 2491, percentage: 20 },
        { value: "unique", label: "독특하게", count: 1246, percentage: 10 },
      ],
    },
    {
      id: 3,
      question: "체형 고민?",
      options: [
        { value: "none", label: "없음", count: 4982, percentage: 40 },
        { value: "belly", label: "배", count: 3114, percentage: 25 },
        { value: "thin", label: "마른편", count: 2491, percentage: 20 },
        { value: "height", label: "키", count: 1869, percentage: 15 },
      ],
    },
    {
      id: 4,
      question: "예산은?",
      options: [
        { value: "100k", label: "10만원", count: 3737, percentage: 30 },
        { value: "200k", label: "20만원", count: 4360, percentage: 35 },
        { value: "300k", label: "30만원", count: 2491, percentage: 20 },
        { value: "unlimited", label: "무관", count: 1868, percentage: 15 },
      ],
    },
  ],
};
