import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { redirectToKakaoLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { socialLogin } = useAuth();

  // 로그인 후 원래 페이지로 이동
  const from = location.state?.from || "/";

  const handleSocial = async (provider: "google" | "kakao") => {
    const ok = await socialLogin(provider);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
            aria-label="홈으로 돌아가기"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <span className="text-xl font-black tracking-tighter">뭐입지</span>
          <div className="w-5" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Error Banner (from OAuth callback) */}
          {location.state?.errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm"
            >
              {location.state.errorMessage}
            </div>
          )}
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-2">로그인</h1>
            <p className="text-gray-500">소셜 계정으로 간편하게 시작하세요</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocial("google")}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3 font-medium hover:bg-gray-50 transition-colors rounded-full"
              aria-label="Google 계정으로 로그인"
            >
              <span className="text-xl" aria-hidden="true">
                G
              </span>
              <span>Google로 계속하기</span>
            </button>
            <button
              type="button"
              onClick={() => {
                // OAuth 리다이렉트 후 돌아올 경로 저장
                // 퀴즈 완료 후 로그인하는 경우 기존 postLoginRedirect 유지
                const existingRedirect = sessionStorage.getItem("postLoginRedirect");
                const pendingQuiz = sessionStorage.getItem("pendingQuizAnswers");
                if (!existingRedirect || !pendingQuiz) {
                  sessionStorage.setItem("postLoginRedirect", from);
                }
                redirectToKakaoLogin();
              }}
              className="w-full flex items-center justify-center gap-3 bg-[#FEE500] py-3 font-medium hover:bg-[#FDD800] transition-colors rounded-full"
              aria-label="카카오 계정으로 로그인"
            >
              <span className="text-xl" aria-hidden="true">
                K
              </span>
              <span>카카오로 계속하기</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
