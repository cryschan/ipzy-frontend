// Gender enum
export type Gender = "MALE" | "FEMALE" | "OTHER";

// 스타일 선호도
export interface StylePreference {
  colors: string[] | null;
  age: number | null;
  gender: Gender | null;
  styles: string[] | null;
}

// 사용자 프로필 응답
export interface UserProfile {
  userId: number;
  email: string;
  name: string;
  phone: string | null;
  profileImageUrl: string | null;
  preferences: Record<string, unknown>;
  stylePreference: StylePreference | null;
}

// 프로필 수정 요청
export interface UpdateProfileRequest {
  name: string;
  phone?: string;
  profileImageUrl?: string;
}

// 환경설정 수정 요청
export interface UpdatePreferencesRequest {
  preferences: Record<string, unknown>;
}

// 스타일 선호도 수정 요청
export interface UpdateStylePreferenceRequest {
  colors?: string[];
  age?: number;
  gender?: Gender;
  styles?: string[];
}
