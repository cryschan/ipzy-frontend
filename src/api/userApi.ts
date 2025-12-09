import { apiClient, type ApiResponse } from "./client";
import type {
  UserProfile,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  UpdateStylePreferenceRequest,
} from "./types";

const USER_API = "/api/users";

export const userApi = {
  // 내 프로필 조회
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      `${USER_API}/me`
    );
    return response.data.data;
  },

  // 프로필 수정
  updateProfile: async (request: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      `${USER_API}/me`,
      request
    );
    return response.data.data;
  },

  // 환경설정 수정
  updatePreferences: async (
    request: UpdatePreferencesRequest
  ): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      `${USER_API}/me/preferences`,
      request
    );
    return response.data.data;
  },

  // 스타일 선호도 수정
  updateStylePreference: async (
    request: UpdateStylePreferenceRequest
  ): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      `${USER_API}/me/style-preference`,
      request
    );
    return response.data.data;
  },

  // 계정 탈퇴
  withdraw: async (): Promise<void> => {
    await apiClient.delete(`${USER_API}/me`);
  },
};
