import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface RouteGuardProps {
  children?: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

// 인증이 필요한 페이지 보호
export function ProtectedRoute({ children, redirectTo = "/login" }: RouteGuardProps) {
  const { user, refreshUserFromServer } = useAuth();
  const location = useLocation();
  const attemptedRef = useRef(false);
  const [loading, setLoading] = useState(() => !user);

  useEffect(() => {
    if (!user && !attemptedRef.current) {
      attemptedRef.current = true;
      void refreshUserFromServer().finally(() => setLoading(false));
    }
  }, [user, refreshUserFromServer]);

  if (loading) {
    return null;
  }

  if (!user) {
    // 로그인 후 원래 페이지로 돌아갈 수 있도록 현재 위치 저장
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // 하위 라우팅(Outlet) 패턴 지원: children이 없으면 Outlet 렌더
  return children ? <>{children}</> : <Outlet />;
}

// 로그인 상태에서 접근 불가 (로그인/회원가입 페이지)
export function GuestRoute({ children, redirectTo = "/" }: RouteGuardProps) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  // 하위 라우팅(Outlet) 패턴 지원: children이 없으면 Outlet 렌더
  return children ? <>{children}</> : <Outlet />;
}

// 퀴즈 답변이 필요한 페이지 보호 (Loading, Result)
export function QuizRequiredRoute({ children }: RouteGuardProps) {
  const location = useLocation();

  // state에 answers가 있거나, sessionStorage에 pendingQuizAnswers가 있으면 허용
  const hasAnswersInState = !!location.state?.answers;
  const hasPendingAnswers = !!sessionStorage.getItem("pendingQuizAnswers");

  if (!hasAnswersInState && !hasPendingAnswers) {
    return <Navigate to="/quiz" replace />;
  }

  // 하위 라우팅(Outlet) 패턴 지원: children이 없으면 Outlet 렌더
  return children ? <>{children}</> : <Outlet />;
}

// 관리자 로그인 상태에서 접근 불가 (관리자 로그인 페이지)
export function AdminGuestRoute({ children, redirectTo = "/admin/dashboard" }: RouteGuardProps) {
  const { user, isAdmin, refreshAdminFromServer } = useAuth();
  const attemptedRef = useRef(false);
  const [loading, setLoading] = useState(() => !user);

  useEffect(() => {
    if (!user && !attemptedRef.current) {
      attemptedRef.current = true;
      void refreshAdminFromServer().finally(() => setLoading(false));
    }
  }, [user, refreshAdminFromServer]);

  if (loading) {
    return null;
  }

  // 이미 관리자로 로그인된 상태면 대시보드로 리다이렉트
  if (user && isAdmin()) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

// 관리자 페이지 보호
export function AdminRoute({ children }: RouteGuardProps) {
  const { user, isAdmin, refreshAdminFromServer } = useAuth();
  const attemptedRef = useRef(false);
  const [loading, setLoading] = useState(() => !user);

  useEffect(() => {
    if (!user && !attemptedRef.current) {
      attemptedRef.current = true;
      void refreshAdminFromServer().finally(() => setLoading(false));
    }
  }, [user, refreshAdminFromServer]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // 하위 라우팅(Outlet) 패턴 지원: children이 없으면 Outlet 렌더
  return children ? <>{children}</> : <Outlet />;
}
