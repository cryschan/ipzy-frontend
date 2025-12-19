import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoginRequiredModal from "../components/LoginRequiredModal";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import {
  clearStoredSession,
  completeQuizSession,
  fetchQuestions,
  generateRecommendations,
  getDefaultQuizId,
  getStoredSession,
  type Question,
  saveQuizAnswer,
  startQuizSession,
} from "../utils/quizApi";

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isRestored, setIsRestored] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const advancingRef = useRef(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentStepRef = useRef(0);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // 퀴즈 세션 시작, 질문 로드, 진행 상태 복구
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // displayOrder가 1인 퀴즈 ID 가져오기
        const quizId = await getDefaultQuizId();

        // 질문 로드 (세션 생성 전에 먼저 로드)
        const loadedQuestions = await fetchQuestions(quizId);
        setQuestions(loadedQuestions);

        // 기존 세션이 없거나 다른 퀴즈의 세션이거나 완료된 세션이면 새로 시작
        const existingSession = getStoredSession();
        if (!existingSession || existingSession.quizId !== quizId || existingSession.completed) {
          await startQuizSession(quizId);
        }

        // 중간에 빠져나가면 복구하지 않고 처음부터 시작
        // 진행 상태 복구 로직 제거
      } catch (err) {
        setError(err instanceof Error ? err.message : "퀴즈를 불러오는데 실패했습니다");
      } finally {
        setIsLoading(false);
        setIsRestored(true);
      }
    };

    loadQuiz();
  }, []);

  // Edge Case: 페이지 새로고침 또는 로그인 후 돌아왔을 때 처리
  useEffect(() => {
    // 초기 로딩이 완료된 후에만 체크
    if (!isRestored) return;

    const pendingAnswers = sessionStorage.getItem("pendingQuizAnswers");
    if (!pendingAnswers) return;

    if (user) {
      // 케이스 3: 로그인 완료 + 저장된 답변 있음 → 바로 Loading으로
      try {
        const parsedAnswers = JSON.parse(pendingAnswers);
        // state와 함께 전달해야 QuizRequiredRoute 통과
        navigate("/loading", { state: { answers: parsedAnswers } });
      } catch (error) {
        console.error("답변 복원 실패:", error);
        // 복원 실패 시 저장된 답변 삭제하고 처음부터 시작
        sessionStorage.removeItem("pendingQuizAnswers");
      }
    } else {
      // 케이스 1: 비로그인 + 저장된 답변 있음 → 모달 표시
      setShowLoginModal(true);
    }
  }, [isRestored, user, navigate]);

  // 중간에 빠져나가면 복구하지 않으므로 sessionStorage 저장 제거

  // 퀴즈 세션 및 진행 상태 완전 초기화
  const resetQuizSession = useCallback(() => {
    clearStoredSession();
  }, []);

  // 로그인 모달 확인 시 로그인 페이지로 이동
  const handleLoginModalConfirm = () => {
    setShowLoginModal(false);
    // 로그인 후 /loading으로 돌아가도록 state 전달
    navigate("/login", { state: { from: "/loading" } });
  };

  // 클릭 기반 진행(답변 저장 + 자동 진행)
  const handleSelect = async (value: string) => {
    // 이미 진행 중이면 추가 클릭 무시 (동시 클릭 방지)
    if (advancingRef.current) return;
    advancingRef.current = true;
    setIsAdvancing(true);

    // 현재 질문 가져오기
    const currentQuestion = questions[currentStep];

    // 선택 저장 (로컬 상태)
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    // 백엔드에 답변 저장
    try {
      const session = getStoredSession();
      if (session) {
        await saveQuizAnswer(session.sessionId, currentQuestion.id, [value]);
      }
    } catch (error) {
      console.error("답변 저장 실패:", error);
      // 답변 저장 실패해도 UI는 계속 진행 (사용자 경험 유지)
      // 필요시 에러 메시지 표시 가능
    }

    // 짧은 딜레이 후 자동 진행 (선택 피드백 표시용)
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }
    advanceTimeoutRef.current = setTimeout(async () => {
      const step = currentStepRef.current;
      if (step < questions.length - 1) {
        setCurrentStep(step + 1);
        advancingRef.current = false;
        setIsAdvancing(false);
      } else {
        // 마지막 질문이면 로그인 체크 후 처리
        if (!user) {
          // 비로그인 사용자: 답변 저장 후 로그인 유도
          sessionStorage.setItem("pendingQuizAnswers", JSON.stringify(nextAnswers));
          sessionStorage.setItem("postLoginRedirect", "/loading");
          advancingRef.current = false;
          setIsAdvancing(false);
          setShowLoginModal(true);
          return;
        }

        // 로그인 사용자: 세션 완료 처리 후 로딩 페이지로 이동
        try {
          const session = getStoredSession();
          if (session) {
            await completeQuizSession(session.sessionId);
            // 완료 성공 시 추천 생성 트리거
            try {
              await generateRecommendations(session.sessionId);
            } catch (genError) {
              // 추천 생성 실패는 사용자 흐름을 막지 않음
              console.error("추천 생성 요청 실패:", genError);
            }
          }
        } catch (error) {
          console.error("세션 완료 실패:", error);
          // 세션 완료 실패해도 로딩 페이지로 이동 (사용자 경험 유지)
        }
        navigatingCleanup();
        navigate("/loading", { state: { answers: nextAnswers } });
      }
    }, 150);
  };

  // 언마운트 시 타이머 정리 및 세션 초기화
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
      advancingRef.current = false;

      // 페이지를 떠날 때 (완료되지 않은 경우) 세션 초기화
      // 완료된 세션은 유지하고, 진행 중인 세션만 초기화
      const session = getStoredSession();
      if (session && !session.completed) {
        resetQuizSession();
      }
    };
  }, [resetQuizSession]);

  const navigatingCleanup = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    advancingRef.current = false;
    setIsAdvancing(false);
  };

  // 키보드/수동 진행
  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 모든 질문 완료 - 로그인 체크 후 처리
      if (!user) {
        // 비로그인 사용자: 답변 저장 후 로그인 유도
        sessionStorage.setItem("pendingQuizAnswers", JSON.stringify(answers));
        sessionStorage.setItem("postLoginRedirect", "/loading");
        setShowLoginModal(true);
        return;
      }

      // 로그인 사용자: 세션 완료 처리 후 로딩 페이지로 이동
      try {
        const session = getStoredSession();
        if (session) {
          await completeQuizSession(session.sessionId);
          // 완료 성공 시 추천 생성 트리거
          try {
            await generateRecommendations(session.sessionId);
          } catch (genError) {
            // 추천 생성 실패는 사용자 흐름을 막지 않음
            console.error("추천 생성 요청 실패:", genError);
          }
        }
      } catch (error) {
        console.error("세션 완료 실패:", error);
        // 세션 완료 실패해도 로딩 페이지로 이동 (사용자 경험 유지)
      }
      navigate("/loading", { state: { answers } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      // 첫 질문에서 뒤로가기 시 세션 및 진행 상태 완전 초기화
      resetQuizSession();
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

  // 에러 발생 시 (질문 0개인 실패 케이스 포함)
  if (error) {
    return (
      <main className="min-h-screen bg-white text-[#1a1a1a] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FB5010] text-white rounded-lg hover:bg-[#FB5010]/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  // 로딩 중일 때만 로딩 UI
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white text-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">퀴즈를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  // 로딩은 끝났는데 질문이 없다면(비정상/빈 데이터) 별도 처리
  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-white text-[#1a1a1a] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-lg text-gray-600 mb-4">표시할 퀴즈가 없습니다.</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FB5010] text-white rounded-lg hover:bg-[#FB5010]/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentStep];
  // 현재 질문 위치 기준으로 진행률 계산 (뒤로 가면 progress 바도 줄어듦)
  // 현재 질문까지 답변한 질문 수만 카운트
  const answeredCount = questions.slice(0, currentStep).filter((q) => answers[q.id]).length;
  const progress = (answeredCount / questions.length) * 100;
  const isSelected = answers[currentQuestion.id];

  // 복구 전 로딩 상태 표시 방지
  if (!isRestored) {
    return null;
  }

  return (
    <>
      <SEO
        title="AI 코디 퀴즈 - 뭐입지"
        description="4가지 질문에 답하고 AI가 추천하는 무신사 코디를 받아보세요. 무료로 시작하세요!"
        keywords="코디 추천, 퀴즈, AI, 무신사, 스타일 테스트"
        url="https://ipzy.vercel.app/quiz"
      />
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
          aria-valuenow={answeredCount}
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-label={`답변 완료 ${answeredCount}/${questions.length}`}
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
            <h1 className="text-4xl md:text-5xl font-black mb-12" id="question-title">
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
                          isAdvancing ? "opacity-60 cursor-not-allowed" : "hover:border-gray-400"
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

        {/* Login Required Modal */}
        <LoginRequiredModal isOpen={showLoginModal} onConfirm={handleLoginModalConfirm} />
      </main>
    </>
  );
}
