import { api } from "../api/api";
import { AxiosError } from "axios";

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

// 퀴즈 질문 관련 타입
export interface ApiOption {
  optionId: number;
  text: string;
  value: string;
  imageUrl: string | null;
  displayOrder: number;
}

export interface ApiQuestion {
  questionId: number;
  text: string;
  type: string;
  required: boolean;
  displayOrder: number;
  options: ApiOption[];
}

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

// 퀴즈 질문 조회 API 응답 타입
interface ApiQuestionResponse {
  success: boolean;
  data?: ApiQuestion[];
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 퀴즈 질문을 가져옵니다.
 * @param quizId 퀴즈 ID
 * @returns 질문 목록
 */
export const fetchQuestions = async (quizId: number): Promise<Question[]> => {
  try {
    const { data } = await api.get<ApiQuestionResponse>(
      `/api/quizzes/${quizId}/questions`
    );

    // 에러 필드가 있거나 success가 false이면 에러 처리
    if (data.error || !data.success) {
      const error = data.error;
      if (error) {
        throw new Error(`${error.code}: ${error.message}`);
      }
      throw new Error("퀴즈를 불러오는데 실패했습니다");
    }

    if (!data.data) {
      throw new Error("퀴즈 데이터 형식이 올바르지 않습니다");
    }

    return transformQuestions(data.data);
  } catch (error) {
    // axios 에러 처리
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 퀴즈를 불러오는데 실패했습니다`);
    }
    throw error;
  }
};

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
  try {
    const { data } = await api.post<ApiResponse<QuizSession>>(
      `/api/quizzes/${quizId}/sessions`
    );

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
  } catch (error) {
    // axios 에러 처리
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 세션을 시작하는데 실패했습니다`);
    }
    throw error;
  }
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

  try {
    const { data } = await api.post<ApiResponse<SaveAnswerResponse>>(
      `/api/quiz-sessions/${sessionId}/answers`,
      requestBody
    );

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
  } catch (error) {
    // axios 에러 처리
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 답변을 저장하는데 실패했습니다`);
    }
    throw error;
  }
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
  try {
    const { data } = await api.post<ApiResponse<CompleteSessionResponse>>(
      `/api/quiz-sessions/${sessionId}/complete`
    );

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
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(updatedSession)
      );
    }

    return data.data;
  } catch (error) {
    // axios 에러 처리
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 퀴즈 세션을 완료하는데 실패했습니다`);
    }
    throw error;
  }
};
