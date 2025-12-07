import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import {
  ProtectedRoute,
  GuestRoute,
  QuizRequiredRoute,
  AdminRoute,
} from "./components/RouteGuard";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Loading from "./pages/Loading";
import Result from "./pages/Result";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";
import NetworkError from "./pages/NetworkError";
import ValidationExamples from "./pages/ValidationExamples";
import AuthCallback from "./pages/AuthCallback";

// Admin
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import UserList from "./admin/pages/UserList";
import UserDetail from "./admin/pages/UserDetail";
import Subscriptions from "./admin/pages/Subscriptions";
import Payments from "./admin/pages/Payments";
import Products from "./admin/pages/Products";
import QuizManagement from "./admin/pages/QuizManagement";
import Settings from "./admin/pages/Settings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 공개 페이지 */}
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* 퀴즈 답변 필요 */}
          <Route
            path="/loading"
            element={
              <QuizRequiredRoute>
                <Loading />
              </QuizRequiredRoute>
            }
          />
          <Route
            path="/result"
            element={
              <QuizRequiredRoute>
                <Result />
              </QuizRequiredRoute>
            }
          />

          {/* 비로그인 사용자만 접근 가능 */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          {/* 기존 /signup 접근 시 로그인으로 리다이렉트 */}
          <Route path="/signup" element={<Navigate to="/login" replace />} />

          {/* 로그인 필요 */}
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* 개발/문서용 페이지 */}
          <Route path="/dev/validation" element={<ValidationExamples />} />

          {/* 관리자 페이지 */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="payments" element={<Payments />} />
            <Route path="products" element={<Products />} />
            <Route path="quiz" element={<QuizManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 에러 페이지 */}
          <Route path="/error/500" element={<ServerError />} />
          <Route path="/error/network" element={<NetworkError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
