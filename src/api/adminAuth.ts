import { api } from "./api";
import type { ApiResponse } from "./auth";

// 관리자 로그인 요청
export interface AdminLoginRequest {
  email: string;
  password: string;
}

// 관리자 정보 응답
export interface AdminMeResponse {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
}

// Axios 에러 타입
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

/**
 * API 에러를 ApiResponse 형태로 변환하는 헬퍼 함수
 */
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

/**
 * 관리자 로그인
 * POST /api/admin/auth/login
 */
export async function adminLogin(
  request: AdminLoginRequest
): Promise<ApiResponse<AdminMeResponse>> {
  try {
    const { data } = await api.post("/api/admin/auth/login", request);
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<AdminMeResponse>;
    }
    return { success: true, data: data as AdminMeResponse };
  } catch (error: unknown) {
    return extractApiError(error, "관리자 로그인에 실패했습니다");
  }
}

/**
 * 관리자 로그아웃
 * POST /api/admin/auth/logout
 */
export async function adminLogout(): Promise<ApiResponse<null>> {
  try {
    const { data } = await api.post("/api/admin/auth/logout");
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<null>;
    }
    return { success: true, data: null };
  } catch (error: unknown) {
    return extractApiError(error, "로그아웃에 실패했습니다");
  }
}

/**
 * 현재 관리자 정보 조회
 * GET /api/admin/auth/me
 */
export async function fetchAdminMe(): Promise<ApiResponse<AdminMeResponse>> {
  try {
    const { data } = await api.get("/api/admin/auth/me");
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<AdminMeResponse>;
    }
    return { success: true, data: data as AdminMeResponse };
  } catch (error: unknown) {
    return extractApiError(error, "관리자 정보 조회에 실패했습니다");
  }
}
