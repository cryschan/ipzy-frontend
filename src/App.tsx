import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Admin
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import Payments from "./admin/pages/Payments";
import Products from "./admin/pages/Products";
import QuizManagement from "./admin/pages/QuizManagement";
import Settings from "./admin/pages/Settings";
import Subscriptions from "./admin/pages/Subscriptions";
import UserDetail from "./admin/pages/UserDetail";
import UserList from "./admin/pages/UserList";
import { AdminRoute, GuestRoute, ProtectedRoute, QuizRequiredRoute } from "./components/RouteGuard";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import AccountManagement from "./pages/AccountManagement";
import AuthCallback from "./pages/AuthCallback";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import NetworkError from "./pages/NetworkError";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import Pricing from "./pages/Pricing";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import ServerError from "./pages/ServerError";
import ValidationExamples from "./pages/ValidationExamples";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* 공개 페이지 */}
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* 퀴즈 답변 필요 */}
              <Route element={<QuizRequiredRoute />}>
                <Route path="/loading" element={<Loading />} />
                <Route path="/result" element={<Result />} />
              </Route>

              {/* 비로그인 사용자만 접근 가능 */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Route>

              {/* 로그인 필요 */}
              <Route element={<ProtectedRoute />}>
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/mypage/account" element={<AccountManagement />} />
                <Route path="/payment" element={<Payment />} />
              </Route>

              {/* 관리자 페이지 */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
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
              </Route>

              {/* 개발/문서용 페이지 */}
              <Route path="/dev/validation" element={<ValidationExamples />} />

              {/* 에러 페이지 */}
              <Route path="/error/500" element={<ServerError />} />
              <Route path="/error/network" element={<NetworkError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
