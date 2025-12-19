import {
  type ApiQuestion,
  completeQuizSession as completeQuizSessionApi,
  type CompleteSessionResponse,
  fetchQuestionsRaw,
  fetchQuizList as fetchQuizListApi,
  generateRecommendations as generateRecommendationsApi,
  type QuizMetadata,
  type QuizSession,
  type RecommendationGeneration,
  regenerateRecommendations as regenerateRecommendationsApi,
  type SaveAnswerResponse,
  saveQuizAnswer as saveQuizAnswerApi,
  startQuizSession as startQuizSessionApi,
} from "@/api/quiz";

// 컴포넌트에서 사용하는 질문 타입
export interface Question {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
}

// API 응답을 컴포넌트 형식으로 변환
const transformQuestions = (apiQuestions: ApiQuestion[]): Question[] => {
  return apiQuestions
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((apiQuestion) => ({
      id: apiQuestion.questionId,
      question: apiQuestion.text,
      options: apiQuestion.options
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((option) => ({
          value: option.value,
          label: option.text,
        })),
    }));
};

/**
 * 활성화된 퀴즈 목록을 조회합니다.
 * @returns 퀴즈 목록 (displayOrder 오름차순 정렬)
 */
export const fetchQuizList = async (): Promise<QuizMetadata[]> => {
  return await fetchQuizListApi();
};

/**
 * displayOrder가 1인 퀴즈의 ID를 가져옵니다.
 * @returns 퀴즈 ID
 * @throws displayOrder가 1인 퀴즈가 없을 경우 에러
 */
export const getDefaultQuizId = async (): Promise<number> => {
  const quizList = await fetchQuizList();
  const defaultQuiz = quizList.find((quiz) => quiz.displayOrder === 1);

  if (!defaultQuiz) {
    throw new Error("displayOrder가 1인 퀴즈를 찾을 수 없습니다");
  }

  return defaultQuiz.quizId;
};

/**
 * 퀴즈 질문을 가져옵니다.
 * @param quizId 퀴즈 ID
 * @returns 질문 목록
 */
export const fetchQuestions = async (quizId: number): Promise<Question[]> => {
  const apiQuestions = await fetchQuestionsRaw(quizId);
  return transformQuestions(apiQuestions);
};

// 세션 시작 응답 타입
export type { QuizSession };

const SESSION_STORAGE_KEY = "quiz_session";

/**
 * 퀴즈 세션을 시작합니다.
 * @param quizId 퀴즈 ID
 * @returns 세션 정보
 */
export const startQuizSession = async (quizId: number): Promise<QuizSession> => {
  const session = await startQuizSessionApi(quizId);
  // 세션 정보를 sessionStorage에 저장
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
};

/**
 * 저장된 세션 정보를 가져옵니다.
 * @returns 세션 정보 또는 null
 */
export const getStoredSession = (): QuizSession | null => {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as QuizSession;
    }
  } catch {
    // 파싱 실패 시 무시
  }
  return null;
};

/**
 * 저장된 세션 정보를 삭제합니다.
 */
export const clearStoredSession = (): void => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
};

// 답변 저장 요청 타입
// 답변 저장 응답 타입
export type { SaveAnswerResponse };

/**
 * 퀴즈 세션의 답변을 저장하거나 수정합니다.
 * @param sessionId 세션 ID
 * @param questionId 질문 ID
 * @param selectedOptions 선택한 옵션의 value 배열
 * @returns 저장된 답변 정보
 */
export const saveQuizAnswer = async (
  sessionId: number,
  questionId: number,
  selectedOptions: string[]
): Promise<SaveAnswerResponse> => {
  return await saveQuizAnswerApi(sessionId, questionId, selectedOptions);
};

// 퀴즈 세션 완료 응답 타입
export type { CompleteSessionResponse };

/**
 * 퀴즈 세션을 완료 처리합니다.
 * @param sessionId 세션 ID
 * @returns 완료된 세션 정보
 */
export const completeQuizSession = async (sessionId: number): Promise<CompleteSessionResponse> => {
  const res = await completeQuizSessionApi(sessionId);
  // 세션 정보 업데이트 (completed 상태 반영)
  const session = getStoredSession();
  if (session) {
    const updatedSession: QuizSession = {
      ...session,
      completed: true,
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
  }
  return res;
};

// 추천 생성 관련 타입
export type { RecommendationGeneration };

/**
 * 퀴즈 완료 후 추천 생성 요청을 트리거합니다.
 * @param sessionId 세션 ID
 * @returns 생성된 추천 작업 목록
 */
export const generateRecommendations = async (
  sessionId: number
): Promise<RecommendationGeneration[]> => {
  return await generateRecommendationsApi(sessionId);
};

/**
 * 추천을 재생성합니다.
 * @param sessionId 세션 ID
 * @returns 재생성된 추천 작업 목록
 */
export const regenerateRecommendations = async (
  sessionId: number
): Promise<RecommendationGeneration[]> => {
  return await regenerateRecommendationsApi(sessionId);
};
