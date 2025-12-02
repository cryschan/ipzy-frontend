import { useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { validateEmail, sanitizeInput } from "../utils/validation";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  // 로그인 후 원래 페이지로 이동
  const from = location.state?.from || "/";

  const handleEmailChange = (value: string) => {
    const sanitized = sanitizeInput(value, 100);
    setEmail(sanitized);

    if (sanitized && !validateEmail(sanitized)) {
      setEmailError("올바른 이메일 형식을 입력해주세요");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 중복 요청 방지
    if (isSubmitting.current || loading) return;

    // 이메일 검증
    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요");
      return;
    }

    setError("");
    setLoading(true);
    isSubmitting.current = true;

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const isFormValid = email && password && !emailError;

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
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-2">로그인</h1>
            <p className="text-gray-500">다시 만나서 반가워요!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="example@email.com"
                maxLength={100}
                className={`w-full px-4 py-3 border-2 ${
                  emailError ? "border-red-500" : "border-gray-200"
                } focus:border-[#FB5010] focus:outline-none transition-colors rounded-lg`}
                aria-describedby={emailError ? "email-error" : undefined}
                aria-invalid={!!emailError}
                autoComplete="email"
              />
              {emailError && (
                <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(sanitizeInput(e.target.value, 100))}
                  placeholder="비밀번호를 입력하세요"
                  maxLength={100}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#FB5010] focus:outline-none transition-colors pr-12 rounded-lg"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-[#FB5010] text-white py-4 font-bold hover:bg-[#E04600] transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">또는</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3 font-medium hover:bg-gray-50 transition-colors rounded-full"
              aria-label="Google 계정으로 로그인"
            >
              <span className="text-xl" aria-hidden="true">G</span>
              <span>Google로 계속하기</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-[#FEE500] py-3 font-medium hover:bg-[#FDD800] transition-colors rounded-full"
              aria-label="카카오 계정으로 로그인"
            >
              <span className="text-xl" aria-hidden="true">K</span>
              <span>카카오로 계속하기</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-gray-500">
            아직 계정이 없으신가요?{" "}
            <Link to="/signup" className="text-[#FB5010] font-bold hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
