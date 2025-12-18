import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

import {
  adminLogin as apiAdminLogin,
  adminLogout as apiAdminLogout,
  fetchAdminMe,
} from "@/api/adminAuth";
import { fetchMe, logout as apiLogout } from "@/api/auth";

type SubscriptionPlan = "free" | "basic" | "pro";
type UserRole = "user" | "admin" | "super_admin";

interface Subscription {
  plan: SubscriptionPlan;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscription: Subscription;
  createdAt: string;
}

interface SavedOutfit {
  id: string;
  date: string;
  top: { name: string; brand: string; price: number; image?: string };
  bottom: { name: string; brand: string; price: number; image?: string };
  shoes: { name: string; brand: string; price: number; image?: string };
  total: number;
  reason: string;
}

interface AuthContextType {
  user: User | null;
  savedOutfits: SavedOutfit[];
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: "google" | "kakao") => Promise<boolean>;
  refreshUserFromServer: () => Promise<boolean>;
  refreshAdminFromServer: () => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  checkEmailDuplicate: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  saveOutfit: (outfit: Omit<SavedOutfit, "id" | "date">) => void;
  removeOutfit: (id: string) => void;
  subscribe: (plan: SubscriptionPlan) => Promise<boolean>;
  cancelSubscription: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 모의 저장된 코디 데이터
const mockSavedOutfits: SavedOutfit[] = [
  {
    id: "1",
    date: "2025-01-15",
    top: {
      name: "오버핏 옥스포드 셔츠",
      brand: "무신사 스탠다드",
      price: 59000,
    },
    bottom: { name: "와이드 슬랙스 팬츠", brand: "커버낫", price: 79000 },
    shoes: { name: "레더 코트 스니커즈", brand: "컨버스", price: 51000 },
    total: 189000,
    reason: "데이트에 어울리는 깔끔한 스타일",
  },
  {
    id: "2",
    date: "2025-01-10",
    top: { name: "베이직 크루넥 니트", brand: "유니클로", price: 39000 },
    bottom: { name: "스트레이트 데님 팬츠", brand: "리바이스", price: 89000 },
    shoes: { name: "클래식 레더 로퍼", brand: "닥터마틴", price: 159000 },
    total: 287000,
    reason: "회사에서 깔끔하게 보이는 캐주얼 룩",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(mockSavedOutfits);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 모의 로그인 (실제로는 API 호출)
    if (email && password) {
      setUser({
        id: "1",
        email,
        name: email.split("@")[0],
        role: "user",
        subscription: {
          plan: "free",
          startDate: null,
          endDate: null,
          isActive: true,
        },
        createdAt: new Date().toISOString().split("T")[0], // TODO: 서버에서 createdAt 추가 예정
      });
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiAdminLogin({ email, password });
      if (res.success && res.data) {
        const admin = res.data;
        setUser({
          id: String(admin.id),
          email: admin.email,
          name: admin.name,
          role: "admin",
          subscription: {
            plan: "pro",
            startDate: null,
            endDate: null,
            isActive: true,
          },
          createdAt: new Date().toISOString().split("T")[0],
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === "admin" || user?.role === "super_admin";
  };

  // 서버 세션 기반으로 현재 사용자 정보를 갱신
  const refreshUserFromServer = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetchMe();
      if (res.success && res.data) {
        const me = res.data;
        setUser({
          id: String(me.userId),
          email: me.email,
          name: me.name,
          role: "user",
          subscription: {
            plan: "free",
            startDate: null,
            endDate: null,
            isActive: true,
          },
          createdAt: new Date().toISOString().split("T")[0],
        });
        return true;
      }
      setUser(null);
      return false;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  // 관리자 세션 기반으로 현재 관리자 정보를 갱신
  const refreshAdminFromServer = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetchAdminMe();
      if (res.success && res.data) {
        const admin = res.data;
        setUser({
          id: String(admin.id),
          email: admin.email,
          name: admin.name,
          role: "admin",
          subscription: {
            plan: "pro",
            startDate: null,
            endDate: null,
            isActive: true,
          },
          createdAt: new Date().toISOString().split("T")[0],
        });
        return true;
      }
      setUser(null);
      return false;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  const socialLogin = async (provider: "google" | "kakao"): Promise<boolean> => {
    // 모의 소셜 로그인
    const email = provider === "google" ? "google_user@example.com" : "kakao_user@example.com";
    const name = provider === "google" ? "Google 사용자" : "Kakao 사용자";
    setUser({
      id: provider + "-1",
      email,
      name,
      role: "user",
      subscription: {
        plan: "free",
        startDate: null,
        endDate: null,
        isActive: false,
      },
      createdAt: new Date().toISOString().split("T")[0],
    });
    return true;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // 모의 회원가입 (실제로는 API 호출)
    if (email && password && name) {
      setUser({
        id: "1",
        email,
        name,
        role: "user",
        subscription: {
          plan: "free",
          startDate: null,
          endDate: null,
          isActive: false,
        },
        createdAt: new Date().toISOString().split("T")[0],
      });
      return true;
    }
    return false;
  };

  const checkEmailDuplicate = async (email: string): Promise<boolean> => {
    // 모의 이메일 중복 체크 (실제로는 API 호출)
    // true: 사용 가능, false: 이미 사용 중
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 테스트용: test@test.com은 이미 사용 중인 것으로 처리
    const existingEmails = ["test@test.com", "admin@admin.com", "user@example.com"];
    return !existingEmails.includes(email.toLowerCase());
  };

  const logout = async (): Promise<void> => {
    const wasAdmin = user?.role === "admin" || user?.role === "super_admin";
    try {
      // 관리자면 관리자 로그아웃 API, 아니면 일반 로그아웃 API 호출
      if (wasAdmin) {
        await apiAdminLogout();
      } else {
        await apiLogout();
      }
    } catch {
      // ignore API error; proceed with local cleanup
    } finally {
      try {
        // 인증 관련 키만 제거
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        sessionStorage.removeItem("session_id");
        // 접두사 기반 일괄 제거 (예: auth_*)
        const removePrefixed = (storage: Storage, prefix: string) => {
          Object.keys(storage).forEach((key) => {
            if (key.startsWith(prefix)) storage.removeItem(key);
          });
        };
        removePrefixed(localStorage, "auth_");
        removePrefixed(sessionStorage, "auth_");
      } catch {
        // ignore storage errors
      }
      setUser(null);
    }
  };

  const saveOutfit = (outfit: Omit<SavedOutfit, "id" | "date">) => {
    const newOutfit: SavedOutfit = {
      ...outfit,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    };
    setSavedOutfits((prev) => [newOutfit, ...prev]);
  };

  const removeOutfit = (id: string) => {
    setSavedOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
  };

  const subscribe = async (plan: SubscriptionPlan): Promise<boolean> => {
    // 모의 구독 (실제로는 결제 API 호출)
    if (user && plan !== "free") {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      setUser({
        ...user,
        subscription: {
          plan,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          isActive: true,
        },
      });
      return true;
    }
    return false;
  };

  const cancelSubscription = () => {
    if (user) {
      setUser({
        ...user,
        subscription: {
          plan: "free",
          startDate: null,
          endDate: null,
          isActive: false,
        },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        savedOutfits,
        login,
        adminLogin,
        socialLogin,
        refreshUserFromServer,
        refreshAdminFromServer,
        signup,
        checkEmailDuplicate,
        logout,
        saveOutfit,
        removeOutfit,
        subscribe,
        cancelSubscription,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
