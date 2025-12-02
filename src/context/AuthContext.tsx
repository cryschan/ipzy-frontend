import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

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
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  checkEmailDuplicate: (email: string) => Promise<boolean>;
  logout: () => void;
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
    date: "2024-01-15",
    top: { name: "오버핏 옥스포드 셔츠", brand: "무신사 스탠다드", price: 59000 },
    bottom: { name: "와이드 슬랙스 팬츠", brand: "커버낫", price: 79000 },
    shoes: { name: "레더 코트 스니커즈", brand: "컨버스", price: 51000 },
    total: 189000,
    reason: "데이트에 어울리는 깔끔한 스타일",
  },
  {
    id: "2",
    date: "2024-01-10",
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
          isActive: false,
        },
        createdAt: new Date().toISOString().split("T")[0],
      });
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // 모의 관리자 로그인 (실제로는 API 호출)
    // 테스트용: admin@admin.com / admin123
    if (email === "admin@admin.com" && password === "admin123") {
      setUser({
        id: "admin-1",
        email,
        name: "관리자",
        role: "admin",
        subscription: {
          plan: "pro",
          startDate: null,
          endDate: null,
          isActive: true,
        },
        createdAt: "2024-01-01",
      });
      return true;
    }
    return false;
  };

  const isAdmin = (): boolean => {
    return user?.role === "admin" || user?.role === "super_admin";
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

  const logout = () => {
    setUser(null);
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
      value={{ user, savedOutfits, login, adminLogin, signup, checkEmailDuplicate, logout, saveOutfit, removeOutfit, subscribe, cancelSubscription, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
