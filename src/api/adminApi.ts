import { api } from "./api";
import type { ApiResponse } from "./auth";

// ============================================
// 대시보드 통계 타입
// ============================================
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface QuizStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
}

export interface RecommendationStats {
  totalRecommendations: number;
  recommendationsThisMonth: number;
}

export interface AdminDashboardResponse {
  userStats: UserStats;
  quizStats: QuizStats;
  recommendationStats: RecommendationStats;
}

// ============================================
// 회원 관리 타입
// ============================================
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type UserRole = "USER" | "ADMIN";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface AdminUserResponse {
  id: number;
  email: string;
  name: string;
  status: UserStatus;
  role: UserRole;
  provider: string;
  planName: string | null;
  createdAt: string;
}

export interface SubscriptionSummary {
  id: number;
  planName: string;
  displayName: string;
  price: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface AdminUserDetailResponse {
  id: number;
  email: string;
  name: string;
  status: UserStatus;
  role: UserRole;
  provider: string;
  providerId: string;
  createdAt: string;
  lastLoginAt: string | null;
  subscription: SubscriptionSummary | null;
}

export interface AdminUserSearchParams {
  keyword?: string;
  status?: UserStatus;
  role?: UserRole;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminUserStatusChangeRequest {
  status: UserStatus;
  reason?: string;
}

// 페이지네이션 응답 타입
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ============================================
// 에러 헬퍼
// ============================================
interface AxiosErrorLike {
  response?: {
    status?: number;
    data?: {
      error?: {
        code?: string;
        message?: string;
      };
    };
  };
  message?: string;
}

function extractApiError<T>(error: unknown, defaultMessage: string): ApiResponse<T> {
  const axiosError = error as AxiosErrorLike;
  const statusCode = axiosError?.response?.status ?? 0;
  const errorData = axiosError?.response?.data ?? {};
  return {
    success: false,
    error: {
      code: errorData?.error?.code ?? "HTTP_" + statusCode,
      message: errorData?.error?.message ?? axiosError?.message ?? defaultMessage,
    },
  };
}

// ============================================
// API 함수
// ============================================

/**
 * 대시보드 통계 조회
 * GET /api/admin/dashboard
 */
export async function fetchDashboardStats(): Promise<ApiResponse<AdminDashboardResponse>> {
  try {
    const { data } = await api.get("/api/admin/dashboard");
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<AdminDashboardResponse>;
    }
    return { success: true, data: data as AdminDashboardResponse };
  } catch (error: unknown) {
    return extractApiError(error, "대시보드 통계 조회에 실패했습니다");
  }
}

/**
 * 회원 목록 조회
 * GET /api/admin/users
 */
export async function fetchUsers(
  params: AdminUserSearchParams = {}
): Promise<ApiResponse<PageResponse<AdminUserResponse>>> {
  try {
    const { data } = await api.get("/api/admin/users", { params });
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<PageResponse<AdminUserResponse>>;
    }
    return { success: true, data: data as PageResponse<AdminUserResponse> };
  } catch (error: unknown) {
    return extractApiError(error, "회원 목록 조회에 실패했습니다");
  }
}

/**
 * 회원 상세 조회
 * GET /api/admin/users/{userId}
 */
export async function fetchUserDetail(
  userId: number
): Promise<ApiResponse<AdminUserDetailResponse>> {
  try {
    const { data } = await api.get(`/api/admin/users/${userId}`);
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<AdminUserDetailResponse>;
    }
    return { success: true, data: data as AdminUserDetailResponse };
  } catch (error: unknown) {
    return extractApiError(error, "회원 상세 조회에 실패했습니다");
  }
}

/**
 * 회원 상태 변경
 * PATCH /api/admin/users/{userId}/status
 */
export async function changeUserStatus(
  userId: number,
  request: AdminUserStatusChangeRequest
): Promise<ApiResponse<AdminUserDetailResponse>> {
  try {
    const { data } = await api.patch(`/api/admin/users/${userId}/status`, request);
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<AdminUserDetailResponse>;
    }
    return { success: true, data: data as AdminUserDetailResponse };
  } catch (error: unknown) {
    return extractApiError(error, "회원 상태 변경에 실패했습니다");
  }
}
