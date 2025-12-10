import axios from "axios";

// 공용 axios 인스턴스
// - baseURL: VITE_API_BASE_URL (기본값: http://localhost:8080)
// - withCredentials: 세션/쿠키 기반 인증을 위해 쿠키를 자동 포함
const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL ?? "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// 전역 응답 인터셉터: 인증 만료(401/419) 시 즉시 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status ?? 0;
    if (status === 401 || status === 419) {
      // 1) 로컬 저장소 정리
      try {
        // 인증 관련 키만 제거
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        sessionStorage.removeItem("session_id");
        // 접두사 기반 일괄 제거 (예: auth_*)
        const removePrefixed = (storage: Storage, prefix: string) => {
          Object.keys(storage).forEach((key) => {
            if (key.startsWith(prefix)) storage.removeItem(key);
          });
        };
        removePrefixed(localStorage, "auth_");
        removePrefixed(sessionStorage, "auth_");
      } catch {
        // ignore storage errors
      }
      // 2) 경로에 따라 로그인 페이지로 이동
      try {
        const currentPath = window.location?.pathname || "/";
        const isAdmin = currentPath.startsWith("/admin");
        const loginPath = isAdmin ? "/admin/login" : "/login";
        // 콜백 루프 방지 및 불필요한 재이동 방지
        if (currentPath !== "/auth/callback" && currentPath !== loginPath) {
          if (!isAdmin) {
            // 돌아갈 경로 저장(관리자 영역은 별도 처리)
            sessionStorage.setItem("postLoginRedirect", currentPath);
          }
          window.location.replace(loginPath);
        }
      } catch {
        // ignore navigation errors
      }
    }
    return Promise.reject(error);
  }
);
