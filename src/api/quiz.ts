import { AxiosError } from "axios";
import { api } from "./api";

// Axios 에러 타입 가드
const isAxiosError = (
  error: unknown
): error is AxiosError & { response: NonNullable<AxiosError["response"]> } => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError;
    return axiosError.response !== undefined;
  }
  return false;
};

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

// 퀴즈 목록 관련 타입
export interface QuizMetadata {
  quizId: number;
  title: string;
  description: string;
  displayOrder: number;
}

// 퀴즈 질문 관련 서버 DTO
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

// 내부 응답 래퍼
interface ApiQuizListResponse {
  success: boolean;
  data?: QuizMetadata[];
  error?: {
    code: string;
    message: string;
  };
}

interface ApiQuestionResponse {
  success: boolean;
  data?: ApiQuestion[];
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 활성화된 퀴즈 목록을 조회합니다.
 * @returns 퀴즈 목록 (displayOrder 오름차순 정렬)
 */
export const fetchQuizList = async (): Promise<QuizMetadata[]> => {
  try {
    const { data } = await api.get<ApiQuizListResponse>("/api/quizzes");
    if (data.error || !data.success) {
      const error = data.error;
      if (error) throw new Error(`${error.code}: ${error.message}`);
      throw new Error("퀴즈 목록을 불러오는데 실패했습니다");
    }
    if (!data.data) {
      throw new Error("퀴즈 목록 데이터 형식이 올바르지 않습니다");
    }
    return data.data.sort((a: QuizMetadata, b: QuizMetadata) => a.displayOrder - b.displayOrder);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 퀴즈 목록을 불러오는데 실패했습니다`);
    }
    throw error;
  }
};

/**
 * 퀴즈 질문을 서버 DTO 형식으로 조회합니다.
 * UI 변환은 utils에서 처리합니다.
 */
export const fetchQuestionsRaw = async (quizId: number): Promise<ApiQuestion[]> => {
  try {
    const { data } = await api.get<ApiQuestionResponse>(`/api/quizzes/${quizId}/questions`);
    if (data.error || !data.success) {
      const error = data.error;
      if (error) throw new Error(`${error.code}: ${error.message}`);
      throw new Error("퀴즈를 불러오는데 실패했습니다");
    }
    if (!data.data) {
      throw new Error("퀴즈 데이터 형식이 올바르지 않습니다");
    }
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
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

// 답변 저장 요청/응답 타입
export interface SaveAnswerRequest {
  questionId: number;
  selectedOptions: string[];
}
export interface SaveAnswerResponse {
  questionId: number;
  selectedOptions: string[];
}

// 완료 응답 타입
export interface CompleteSessionResponse {
  sessionId: number;
  completed: boolean;
  completedAt: string;
}

export const startQuizSession = async (quizId: number): Promise<QuizSession> => {
  try {
    const { data } = await api.post<ApiResponse<QuizSession>>(`/api/quizzes/${quizId}/sessions`);
    if (data.error || !data.success) {
      const error = data.error;
      if (error) throw new Error(`${error.code}: ${error.message}`);
      throw new Error("세션을 시작하는데 실패했습니다");
    }
    if (!data.data) {
      throw new Error("세션 데이터 형식이 올바르지 않습니다");
    }
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 세션을 시작하는데 실패했습니다`);
    }
    throw error;
  }
};

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
    if (data.error || !data.success) {
      const error = data.error;
      if (error) throw new Error(`${error.code}: ${error.message}`);
      throw new Error("답변을 저장하는데 실패했습니다");
    }
    if (!data.data) {
      throw new Error("답변 저장 응답 데이터가 없습니다");
    }
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 답변을 저장하는데 실패했습니다`);
    }
    throw error;
  }
};

export const completeQuizSession = async (sessionId: number): Promise<CompleteSessionResponse> => {
  try {
    const { data } = await api.post<ApiResponse<CompleteSessionResponse>>(
      `/api/quiz-sessions/${sessionId}/complete`
    );
    if (data.error || !data.success) {
      const error = data.error;
      if (error) throw new Error(`${error.code}: ${error.message}`);
      throw new Error("퀴즈 세션을 완료하는데 실패했습니다");
    }
    if (!data.data) {
      throw new Error("완료 응답 데이터가 없습니다");
    }
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 퀴즈 세션을 완료하는데 실패했습니다`);
    }
    throw error;
  }
};

// 추천 생성 관련 타입
export interface RecommendationItemPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RecommendationItem {
  productId: number;
  category: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  linkUrl: string;
  position: RecommendationItemPosition;
}

export interface RecommendationResult {
  success: boolean;
  message: string;
  compositeImageUrl: string;
  imageWidth: number;
  imageHeight: number;
  totalPrice: number;
  items: RecommendationItem[];
}

export interface RecommendationGeneration {
  displayOrder: number;
  occasion: string;
  season: string;
  style: string;
  reason: string;
  status: string;
  jobId: string;
  createdAt: string;
  completedAt: string | null;
  result: RecommendationResult | null;
  error: string | null;
}

export const generateRecommendations = async (
  sessionId: number
): Promise<RecommendationGeneration[]> => {
  try {
    const { data } = await api.post<ApiResponse<RecommendationGeneration[]>>(
      `/api/recommendations/sessions/${sessionId}/generate`
    );
    if (data.error || !data.success) {
      const error = data.error;
      if (error) throw new Error(`${error.code}: ${error.message}`);
      throw new Error("추천 생성을 요청하는데 실패했습니다");
    }
    if (!data.data) {
      throw new Error("추천 생성 응답 데이터가 없습니다");
    }
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 추천 생성 요청에 실패했습니다`);
    }
    throw error;
  }
};

/**
 * 세션별 추천 결과를 조회합니다.
 * @param sessionId 세션 ID
 * @returns 추천 결과 목록
 */
export const getRecommendationsBySession = async (
  sessionId: number
): Promise<RecommendationGeneration[]> => {
  try {
    const { data } = await api.get<ApiResponse<RecommendationGeneration[]>>(
      `/api/recommendations/sessions/${sessionId}`
    );
    if (data.error || !data.success) {
      const error = data.error;
      if (error) throw new Error(`${error.code}: ${error.message}`);
      throw new Error("추천 결과를 조회하는데 실패했습니다");
    }
    if (!data.data) {
      throw new Error("추천 결과 데이터가 없습니다");
    }
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 추천 결과 조회에 실패했습니다`);
    }
    throw error;
  }
};

/**
 * 생성된 추천을 다시 생성합니다.
 * @param sessionId 세션 ID
 * @returns 재생성된 추천 작업 목록
 */
export const regenerateRecommendations = async (
  sessionId: number
): Promise<RecommendationGeneration[]> => {
  try {
    const { data } = await api.post<ApiResponse<RecommendationGeneration[]>>(
      `/api/recommendations/sessions/${sessionId}/regenerate`
    );
    if (data.error || !data.success) {
      const error = data.error;
      if (error) throw new Error(`${error.code}: ${error.message}`);
      throw new Error("추천 재생성을 요청하는데 실패했습니다");
    }
    if (!data.data) {
      throw new Error("추천 재생성 응답 데이터가 없습니다");
    }
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response.status;
      throw new Error(`HTTP ${status}: 추천 재생성 요청에 실패했습니다`);
    }
    throw error;
  }
};
