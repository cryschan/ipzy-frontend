import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUserFromServer } = useAuth();

  useEffect(() => {
    const go = async () => {
      // OAuth 실패 시 백엔드가 code 쿼리로 리다이렉트함: ?code=AUTH_002 등
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const to = sessionStorage.getItem("postLoginRedirect") || "/";
        sessionStorage.removeItem("postLoginRedirect");
        const messageMap: Record<string, string> = {
          AUTH_002: "OAuth 인증에 실패했어요. 다시 시도해 주세요.",
          AUTH_006: "로그인을 취소하셨어요. 다시 시도해 주세요.",
          AUTH_007: "OAuth 토큰이 유효하지 않아요. 다시 시도해 주세요.",
          AUTH_008:
            "OAuth 응답을 처리할 수 없어요. 잠시 후 다시 시도해 주세요.",
        };
        const errorMessage =
          messageMap[code] ||
          "로그인 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.";
        navigate("/login", {
          replace: true,
          state: { from: to, errorMessage },
        });
        return;
      }
      const ok = await refreshUserFromServer();
      const to = sessionStorage.getItem("postLoginRedirect") || "/";
      sessionStorage.removeItem("postLoginRedirect");
      if (ok) {
        navigate(to, { replace: true });
      } else {
        navigate("/login", { replace: true, state: { from: to } });
      }
    };
    void go();
  }, [navigate, refreshUserFromServer]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">로그인 처리 중...</p>
    </main>
  );
}
