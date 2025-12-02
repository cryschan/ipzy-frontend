import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

// 인증이 필요한 페이지 보호
export function ProtectedRoute({ children, redirectTo = "/login" }: RouteGuardProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // 로그인 후 원래 페이지로 돌아갈 수 있도록 현재 위치 저장
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

// 로그인 상태에서 접근 불가 (로그인/회원가입 페이지)
export function GuestRoute({ children, redirectTo = "/" }: RouteGuardProps) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

// 퀴즈 답변이 필요한 페이지 보호 (Loading, Result)
export function QuizRequiredRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  // state에 answers가 없으면 퀴즈로 리다이렉트
  if (!location.state?.answers) {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
}

// 관리자 페이지 보호
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
