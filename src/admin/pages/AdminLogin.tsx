import { Lock, Eye, EyeOff } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSubmitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting.current || loading) return;

    setError("");
    setLoading(true);
    isSubmitting.current = true;

    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(result.errorMessage ?? "로그인에 실패했습니다.");
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#FB5010] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">관리자 로그인</h1>
          <p className="text-gray-500 text-sm mt-2">뭐입지 Admin</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@admin.com"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg focus:border-[#FB5010] focus:outline-none transition-colors"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-white rounded-lg focus:border-[#FB5010] focus:outline-none transition-colors pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[#FB5010] text-white py-4 rounded-lg font-bold hover:bg-[#E04600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Test Account Info */}
        <div className="mt-8 p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
          <p className="text-gray-500 text-xs mb-2">테스트 계정</p>
          <p className="text-gray-400 text-sm">이메일: admin@admin.com</p>
          <p className="text-gray-400 text-sm">비밀번호: admin123</p>
        </div>

        {/* Back to Main */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
          >
            메인 사이트로 돌아가기
          </button>
        </div>
      </div>
    </main>
  );
}
