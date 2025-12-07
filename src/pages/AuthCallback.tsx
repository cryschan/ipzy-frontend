import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * OAuth 콜백 페이지
 * - 카카오 로그인 성공 후 리다이렉트되는 페이지
 * - /api/auth/me 호출해서 사용자 정보를 가져옴
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const errorCode = searchParams.get("code");

      // OAuth 실패 시
      if (errorCode && errorCode.startsWith("AUTH_")) {
        console.error("OAuth 로그인 실패:", errorCode);
        navigate("/login?error=" + errorCode, { replace: true });
        return;
      }

      // 사용자 정보 가져오기
      try {
        const success = await fetchUser();
        if (success) {
          navigate("/", { replace: true });
        } else {
          navigate("/login?error=fetch_failed", { replace: true });
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        navigate("/login?error=fetch_failed", { replace: true });
      }
    };

    handleCallback();
  }, [fetchUser, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
