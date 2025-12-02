import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, Mail, Calendar, Crown, CreditCard, Ban, CheckCircle } from "lucide-react";
import { mockUsers, mockPayments } from "../utils/mockData";

export default function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const user = mockUsers.find((u) => u.id === id);
  const userPayments = mockPayments.filter((p) => p.userId === id);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">사용자를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 text-[#FB5010] hover:underline"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-800">회원 상세</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-[#FB5010] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">가입일: {user.createdAt}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">최근 접속: {user.lastLoginAt}</span>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">상태</span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  user.status === "active"
                    ? "bg-green-100 text-green-600"
                    : user.status === "suspended"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.status === "active" ? "활성" : user.status === "suspended" ? "정지" : "비활성"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {user.status === "active" ? (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <Ban className="w-4 h-4" />
                  <span>계정 정지</span>
                </button>
              ) : (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  <span>계정 활성화</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Subscription & Payments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-[#FB5010]" />
              <h3 className="font-bold text-gray-800">구독 정보</h3>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  user.plan === "pro"
                    ? "bg-[#FB5010]/10"
                    : user.plan === "basic"
                    ? "bg-blue-100"
                    : "bg-gray-100"
                }`}
              >
                <Crown
                  className={`w-6 h-6 ${
                    user.plan === "pro"
                      ? "text-[#FB5010]"
                      : user.plan === "basic"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">
                  {user.plan === "pro" ? "Pro" : user.plan === "basic" ? "Basic" : "Free"} 플랜
                </p>
                <p className="text-sm text-gray-500">
                  {user.plan === "pro"
                    ? "₩19,900/월"
                    : user.plan === "basic"
                    ? "₩9,900/월"
                    : "무료"}
                </p>
              </div>
              {user.plan !== "free" && (
                <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  플랜 변경
                </button>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-[#FB5010]" />
              <h3 className="font-bold text-gray-800">결제 내역</h3>
            </div>

            {userPayments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">결제 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">
                        {payment.plan.toUpperCase()} 플랜 결제
                      </p>
                      <p className="text-sm text-gray-500">{payment.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₩{payment.amount.toLocaleString()}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : payment.status === "refunded"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {payment.status === "completed"
                          ? "완료"
                          : payment.status === "refunded"
                          ? "환불"
                          : "실패"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
