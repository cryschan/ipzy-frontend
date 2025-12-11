const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 공통 에러 응답 타입
export interface ApiError {
  code: string;
  message: string;
}

// 공통 API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// 세션 시작 응답 타입
export interface QuizSession {
  sessionId: number;
  userId: number | null;
  quizId: number;
  completed: boolean;
  createdAt: string;
}

const SESSION_STORAGE_KEY = "quiz_session";

/**
 * 퀴즈 세션을 시작합니다.
 * @param quizId 퀴즈 ID (기본값: 1)
 * @returns 세션 정보
 */
export const startQuizSession = async (
  quizId: number = 1
): Promise<QuizSession> => {
  const response = await fetch(
    `${API_BASE_URL}/api/quizzes/${quizId}/sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키 포함 (필요한 경우)
    }
  );

  const data: ApiResponse<QuizSession> = await response.json();

  // 에러 필드가 있거나 success가 false이면 에러 처리
  if (data.error || !data.success) {
    const error = data.error;
    if (error) {
      throw new Error(`${error.code}: ${error.message}`);
    }
    throw new Error("세션을 시작하는데 실패했습니다");
  }

  if (!data.data) {
    throw new Error("세션 데이터 형식이 올바르지 않습니다");
  }

  // 세션 정보를 sessionStorage에 저장
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.data));

  return data.data;
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

// 진행 상태 응답 타입
export interface QuizProgress {
  sessionId: number;
  totalQuestions: number;
  answeredCount: number;
  completed: boolean;
  answers: Array<{
    questionId: number;
    optionValue: string;
  }>;
}

/**
 * 퀴즈 세션의 진행 상태를 조회합니다.
 * @param sessionId 세션 ID
 * @returns 진행 상태 정보
 */
export const getQuizProgress = async (
  sessionId: number
): Promise<QuizProgress> => {
  const response = await fetch(
    `${API_BASE_URL}/api/quiz-sessions/${sessionId}/progress`,
    {
      credentials: "include",
    }
  );

  const data: ApiResponse<QuizProgress> = await response.json();

  // 에러 필드가 있거나 success가 false이면 에러 처리
  if (data.error || !data.success) {
    const error = data.error;
    if (error) {
      throw new Error(`${error.code}: ${error.message}`);
    }
    throw new Error("진행 상태를 조회하는데 실패했습니다");
  }

  if (!data.data) {
    throw new Error("진행 상태 데이터 형식이 올바르지 않습니다");
  }

  return data.data;
};

// 답변 저장 요청 타입
export interface SaveAnswerRequest {
  questionId: number;
  selectedOptions: string[];
}

// 답변 저장 응답 타입
export interface SaveAnswerResponse {
  questionId: number;
  selectedOptions: string[];
}

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
  const requestBody: SaveAnswerRequest = {
    questionId,
    selectedOptions,
  };

  const response = await fetch(
    `${API_BASE_URL}/api/quiz-sessions/${sessionId}/answers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    }
  );

  const data: ApiResponse<SaveAnswerResponse> = await response.json();

  // 에러 필드가 있거나 success가 false이면 에러 처리
  if (data.error || !data.success) {
    const error = data.error;
    if (error) {
      throw new Error(`${error.code}: ${error.message}`);
    }
    throw new Error("답변을 저장하는데 실패했습니다");
  }

  if (!data.data) {
    throw new Error("답변 저장 응답 데이터가 없습니다");
  }

  return data.data;
};

// 퀴즈 세션 완료 응답 타입
export interface CompleteSessionResponse {
  sessionId: number;
  completed: boolean;
  completedAt: string;
}

/**
 * 퀴즈 세션을 완료 처리합니다.
 * @param sessionId 세션 ID
 * @returns 완료된 세션 정보
 */
export const completeQuizSession = async (
  sessionId: number
): Promise<CompleteSessionResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/quiz-sessions/${sessionId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const data: ApiResponse<CompleteSessionResponse> = await response.json();

  // 에러 필드가 있거나 success가 false이면 에러 처리
  if (data.error || !data.success) {
    const error = data.error;
    if (error) {
      throw new Error(`${error.code}: ${error.message}`);
    }
    throw new Error("퀴즈 세션을 완료하는데 실패했습니다");
  }

  if (!data.data) {
    throw new Error("완료 응답 데이터가 없습니다");
  }

  // 세션 정보 업데이트 (completed 상태 반영)
  const session = getStoredSession();
  if (session) {
    const updatedSession: QuizSession = {
      ...session,
      completed: true,
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
  }

  return data.data;
};

/**
 * 퀴즈 페이지로 이동합니다.
 * 세션 생성은 Quiz 컴포넌트에서 처리합니다.
 * @param navigate 네비게이션 함수
 */
export const navigateToQuiz = (navigate: (path: string) => void): void => {
  navigate("/quiz");
};
