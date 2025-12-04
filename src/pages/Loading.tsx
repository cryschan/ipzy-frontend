import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 2.5초 후 결과 페이지로 이동
    const timer = setTimeout(() => {
      navigate("/result", { state: location.state });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-12">
        <span className="text-2xl font-black tracking-tighter">뭐입지</span>
      </div>

      {/* Loading Animation */}
      <div className="relative mb-12">
        {/* Outer Ring */}
        <div className="w-32 h-32 rounded-full border-4 border-white/10" />

        {/* Spinning Ring */}
        <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-[#FB5010] animate-spin" />

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-black text-[#FB5010]">AI</span>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">코디 조합 중...</h1>
        <p className="text-gray-400 text-sm md:text-base">
          AI가 당신에게 딱 맞는 스타일을 찾고 있어요
        </p>
      </div>

      {/* Loading Dots */}
      <div className="flex gap-2 mt-8">
        <div
          className="w-2 h-2 bg-[#FB5010] rounded-full animate-big-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-[#FB5010] rounded-full animate-big-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-[#FB5010] rounded-full animate-big-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>

      {/* Progress Steps */}
      <div className="mt-16 space-y-3 text-sm text-gray-500">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-2 h-2 bg-[#FB5010] rounded-full" />
          <span>취향 분석 중...</span>
        </div>
        <div
          className="flex items-center gap-3 animate-pulse"
          style={{ animationDelay: "500ms" }}
        >
          <div className="w-2 h-2 bg-white/30 rounded-full" />
          <span>무신사 상품 검색 중...</span>
        </div>
        <div
          className="flex items-center gap-3 animate-pulse"
          style={{ animationDelay: "1000ms" }}
        >
          <div className="w-2 h-2 bg-white/30 rounded-full" />
          <span>최적의 코디 조합 생성 중...</span>
        </div>
      </div>
    </main>
  );
}
