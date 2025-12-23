import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { completeQuizSession, generateRecommendations, getStoredSession } from "../utils/quizApi";

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // 중복 실행 방지
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    const processRecommendation = async () => {
      // sessionStorage에서 로그인 전 저장된 답변 복원
      const pendingAnswers = sessionStorage.getItem("pendingQuizAnswers");
      let answersToPass = location.state?.answers;

      // location.state에 답변이 없으면 sessionStorage에서 복원
      if (!answersToPass && pendingAnswers) {
        try {
          answersToPass = JSON.parse(pendingAnswers);
          sessionStorage.removeItem("pendingQuizAnswers");
        } catch (error) {
          console.error("답변 복원 실패:", error);
        }
      }

      const session = getStoredSession();
      if (!session) {
        console.error("세션 정보가 없습니다");
        navigate("/quiz");
        return;
      }

      try {
        // Step 1: 세션 완료
        setCurrentStep(1);
        await completeQuizSession(session.sessionId);

        // Step 2: 추천 생성
        setCurrentStep(2);
        await generateRecommendations(session.sessionId);

        // Step 3: 완료 - 결과 페이지로 이동
        setCurrentStep(3);
        navigate("/result", {
          state: {
            ...location.state,
            answers: answersToPass,
          },
        });
      } catch (error) {
        console.error("추천 생성 실패:", error);
        // 에러가 발생해도 결과 페이지로 이동 (Result에서 에러 표시)
        navigate("/result", {
          state: {
            ...location.state,
            answers: answersToPass,
          },
        });
      }
    };

    processRecommendation();
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
      <div className="mt-16 space-y-3 text-sm">
        <div
          className={`flex items-center gap-3 ${currentStep >= 1 ? "text-white" : "text-gray-500"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${currentStep >= 1 ? "bg-[#FB5010]" : "bg-white/30"} ${currentStep === 1 ? "animate-pulse" : ""}`}
          />
          <span>{currentStep > 1 ? "취향 분석 완료 ✓" : "취향 분석 중..."}</span>
        </div>
        <div
          className={`flex items-center gap-3 ${currentStep >= 2 ? "text-white" : "text-gray-500"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${currentStep >= 2 ? "bg-[#FB5010]" : "bg-white/30"} ${currentStep === 2 ? "animate-pulse" : ""}`}
          />
          <span>{currentStep > 2 ? "코디 조합 완료 ✓" : "최적의 코디 조합 생성 중..."}</span>
        </div>
        <div
          className={`flex items-center gap-3 ${currentStep >= 3 ? "text-white" : "text-gray-500"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${currentStep >= 3 ? "bg-[#FB5010]" : "bg-white/30"} ${currentStep === 3 ? "animate-pulse" : ""}`}
          />
          <span>{currentStep >= 3 ? "결과 페이지로 이동 중..." : "결과 준비 대기 중..."}</span>
        </div>
      </div>
    </main>
  );
}
