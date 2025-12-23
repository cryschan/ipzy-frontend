import { api } from "./api";

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface MeResponse {
  userId: number;
  email: string;
  name: string;
}

/**
 * 브라우저를 백엔드 카카오 OAuth2 로그인 엔드포인트로 리다이렉트합니다.
 * 클릭 핸들러에서 호출해야 하며, 호출 시 앱에서 벗어나 로그인 페이지로 이동합니다.
 */
export async function redirectToKakaoLogin(): Promise<void> {
  // OAuth 시작은 XHR이 아닌 "탑레벨 네비게이션"으로 처리해야 CORS 문제를 피할 수 있음
  // Vercel rewrite 프록시를 사용하면 상대 경로로 호출 가능
  const base = import.meta.env?.VITE_API_BASE_URL ?? "";
  const url = `${base.replace(/\/$/, "")}/api/auth/login/kakao`;
  window.location.assign(url);
}

/**
 * 현재 인증된 사용자의 기본 프로필을 조회합니다.
 * 요청에 쿠키(세션) 자격 증명을 함께 전송합니다.
 */
export async function fetchMe(): Promise<ApiResponse<MeResponse>> {
  try {
    const { data } = await api.get("/api/auth/me");
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<MeResponse>;
    }
    return { success: true, data: data as MeResponse };
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { error?: ApiError } };
      message?: string;
    };
    const statusCode = err?.response?.status ?? 0;
    const data = err?.response?.data ?? {};
    return {
      success: false,
      error: {
        code: data?.error?.code ?? "HTTP_" + statusCode,
        message: data?.error?.message ?? err?.message ?? "Failed to fetch current user",
      },
    };
  }
}

/**
 * 서버에서 현재 세션을 로그아웃합니다.
 * 요청에 쿠키(세션) 자격 증명을 함께 전송합니다.
 */
export async function logout(): Promise<ApiResponse<null>> {
  try {
    const { data } = await api.post("/api/auth/logout");
    if (data && typeof data === "object" && "success" in data) {
      return data as ApiResponse<null>;
    }
    return { success: true, data: null };
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { error?: ApiError } };
      message?: string;
    };
    const statusCode = err?.response?.status ?? 0;
    const data = err?.response?.data ?? {};
    return {
      success: false,
      error: {
        code: data?.error?.code ?? "HTTP_" + statusCode,
        message: data?.error?.message ?? err?.message ?? "Logout failed",
      },
    };
  }
}
