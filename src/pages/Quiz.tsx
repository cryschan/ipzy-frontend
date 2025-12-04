import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const STORAGE_KEY = "quiz_progress";

const questions = [
  {
    id: 1,
    question: "어디 가요?",
    options: [
      { value: "school", label: "학교" },
      { value: "work", label: "회사" },
      { value: "date", label: "데이트" },
      { value: "casual", label: "외출" },
    ],
  },
  {
    id: 2,
    question: "어떻게 보이고 싶어요?",
    options: [
      { value: "clean", label: "깔끔하게" },
      { value: "comfortable", label: "편하게" },
      { value: "cool", label: "멋있게" },
      { value: "unique", label: "독특하게" },
    ],
  },
  {
    id: 3,
    question: "체형 고민?",
    options: [
      { value: "none", label: "없음" },
      { value: "belly", label: "배" },
      { value: "thin", label: "마른편" },
      { value: "height", label: "키" },
    ],
  },
  {
    id: 4,
    question: "예산은?",
    options: [
      { value: "100k", label: "10만원" },
      { value: "200k", label: "20만원" },
      { value: "300k", label: "30만원" },
      { value: "unlimited", label: "무관" },
    ],
  },
];

interface QuizProgress {
  currentStep: number;
  answers: Record<number, string>;
}

export default function Quiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isRestored, setIsRestored] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advancingRef = useRef(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentStepRef = useRef(0);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // sessionStorage에서 진행 상태 복구
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress: QuizProgress = JSON.parse(saved);
        if (
          progress.currentStep >= 0 &&
          progress.currentStep < questions.length
        ) {
          setCurrentStep(progress.currentStep);
          setAnswers(progress.answers || {});
        }
      }
    } catch {
      // 파싱 실패 시 무시
    }
    setIsRestored(true);
  }, []);

  // 상태 변경 시 sessionStorage에 저장
  useEffect(() => {
    if (!isRestored) return;

    const progress: QuizProgress = { currentStep, answers };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [currentStep, answers, isRestored]);

  // 퀴즈 완료 시 sessionStorage 정리
  const clearProgress = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    // 이미 진행 중이면 추가 클릭 무시 (동시 클릭 방지)
    if (advancingRef.current) return;
    advancingRef.current = true;
    setIsAdvancing(true);

    // 선택 저장
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    // 짧은 딜레이 후 자동 진행 (선택 피드백 표시용)
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }
    advanceTimeoutRef.current = setTimeout(() => {
      const step = currentStepRef.current;
      if (step < questions.length - 1) {
        setCurrentStep(step + 1);
        advancingRef.current = false;
        setIsAdvancing(false);
      } else {
        // 마지막 질문이면 로딩 페이지로 이동
        clearProgress();
        navigatingCleanup();
        navigate("/loading", { state: { answers: nextAnswers } });
      }
    }, 150);
  };

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
      advancingRef.current = false;
    };
  }, []);

  const navigatingCleanup = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    advancingRef.current = false;
    setIsAdvancing(false);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 모든 질문 완료 - 진행 상태 삭제 후 로딩 페이지로 이동
      clearProgress();
      navigate("/loading", { state: { answers } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      // 첫 질문에서 뒤로가기 시 진행 상태 삭제
      clearProgress();
      navigate("/");
    }
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 진행 중에는 추가 입력을 막고, 선택 후 자동 진행되므로 Enter 진행은 비활성화
    if (e.key === "Enter" && isSelected && !isAdvancing) {
      handleNext();
    }
  };

  const isSelected = answers[currentQuestion.id];

  // 복구 전 로딩 상태 표시 방지
  if (!isRestored) {
    return null;
  }

  return (
    <main
      className="min-h-screen bg-white text-[#1a1a1a] flex flex-col"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
            aria-label={currentStep > 0 ? "이전 질문으로" : "홈으로 돌아가기"}
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm">뒤로</span>
          </button>
          <span className="text-xl font-black tracking-tighter">뭐입지</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Progress Bar */}
      <div
        className="w-full h-1 bg-gray-100"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-label={`질문 ${currentStep + 1}/${questions.length}`}
      >
        <div
          className="h-full bg-[#FB5010] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto w-full">
          {/* Step Indicator */}
          <div className="mb-8">
            <span className="text-[#FB5010] text-sm font-bold tracking-widest">
              Q{currentStep + 1} / {questions.length}
            </span>
          </div>

          {/* Question */}
          <h1
            className="text-4xl md:text-5xl font-black mb-12"
            id="question-title"
          >
            {currentQuestion.question}
          </h1>

          {/* Options */}
          <div
            className="grid grid-cols-2 gap-4"
            role="radiogroup"
            aria-labelledby="question-title"
          >
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                disabled={isAdvancing}
                className={`p-6 border-2 text-left transition-all rounded-lg ${
                  answers[currentQuestion.id] === option.value
                    ? "border-[#FB5010] bg-[#FB5010]/5"
                    : `border-gray-200 ${
                        isAdvancing
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:border-gray-400"
                      }`
                }`}
                role="radio"
                aria-checked={answers[currentQuestion.id] === option.value}
                aria-label={option.label}
                tabIndex={index === 0 ? 0 : -1}
              >
                <span className="text-lg font-bold">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
