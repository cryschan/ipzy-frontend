import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Crown, Mail, Shield } from "lucide-react";
import { type AdminUserDetailResponse, fetchUserDetail } from "../../api/adminApi";
import { formatDateKorean } from "../../utils/date";

export default function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<AdminUserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: 정지 기능 구현 후 활성화
  // const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (!id) return;

      setLoading(true);
      setError(null);

      const result = await fetchUserDetail(Number(id));

      if (result.success && result.data) {
        setUser(result.data);
      } else {
        setError(result.error?.message ?? "회원 정보 조회 실패");
      }

      setLoading(false);
    }

    loadUser();
  }, [id]);

  /* TODO: 정지 기능 구현 후 활성화
  const handleStatusChange = async (newStatus: "ACTIVE" | "SUSPENDED") => {
    if (!user || !id) return;

    const reason = newStatus === "SUSPENDED" ? window.prompt("정지 사유를 입력하세요:") : undefined;

    if (newStatus === "SUSPENDED" && reason === null) return; // 취소

    setUpdating(true);

    const result = await changeUserStatus(Number(id), {
      status: newStatus,
      reason: reason ?? undefined,
    });

    if (result.success && result.data) {
      setUser(result.data);
    } else {
      alert(result.error?.message ?? "상태 변경 실패");
    }

    setUpdating(false);
  };
  */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error ?? "사용자를 찾을 수 없습니다."}</p>
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
              {user.name?.charAt(0) ?? "?"}
            </div>
            <h2 className="text-xl font-bold">{user.name ?? "-"}</h2>
            <p className="text-gray-500">{user.email}</p>
            {user.role === "ADMIN" && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                <Shield className="w-3 h-3" />
                관리자
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">가입일: {formatDateKorean(user.createdAt)}</span>
            </div>
            {/* TODO: 최근 접속 표시 방식 확정 후 활성화
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">최근 접속: {formatDateKorean(user.lastLoginAt)}</span>
            </div>
*/}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 text-xs">Provider:</span>
              <span className="text-gray-600">{user.provider ?? "-"}</span>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">상태</span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  user.status === "ACTIVE"
                    ? "bg-green-100 text-green-600"
                    : user.status === "SUSPENDED"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.status === "ACTIVE" ? "활성" : user.status === "SUSPENDED" ? "정지" : "삭제"}
              </span>
            </div>

            {/* TODO: 정지 기능 구현 후 활성화
            <div className="space-y-2">
              {user.status === "ACTIVE" ? (
                <button
                  onClick={() => handleStatusChange("SUSPENDED")}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" />
                  <span>{updating ? "처리 중..." : "계정 정지"}</span>
                </button>
              ) : user.status === "SUSPENDED" ? (
                <button
                  onClick={() => handleStatusChange("ACTIVE")}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{updating ? "처리 중..." : "계정 활성화"}</span>
                </button>
              ) : null}
            </div>
            */}
          </div>
        </div>

        {/* Subscription */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-[#FB5010]" />
              <h3 className="font-bold text-gray-800">구독 정보</h3>
            </div>

            {user.subscription ? (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    user.subscription.planName === "PRO"
                      ? "bg-[#FB5010]/10"
                      : user.subscription.planName === "BASIC"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                  }`}
                >
                  <Crown
                    className={`w-6 h-6 ${
                      user.subscription.planName === "PRO"
                        ? "text-[#FB5010]"
                        : user.subscription.planName === "BASIC"
                          ? "text-blue-600"
                          : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{user.subscription.displayName} 플랜</p>
                  <p className="text-sm text-gray-500">
                    {user.subscription.price > 0
                      ? `₩${user.subscription.price.toLocaleString()}/월`
                      : "무료"}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.subscription.status === "ACTIVE"
                        ? "bg-green-100 text-green-600"
                        : user.subscription.status === "CANCELLED"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.subscription.status === "ACTIVE"
                      ? "활성"
                      : user.subscription.status === "CANCELLED"
                        ? "취소됨"
                        : "만료됨"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100">
                  <Crown className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">Free 플랜</p>
                  <p className="text-sm text-gray-500">무료</p>
                </div>
              </div>
            )}

            {/* Subscription Details */}
            {user.subscription && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">시작일</p>
                  <p className="font-medium">{formatDateKorean(user.subscription.startDate)}</p>
                </div>
                {/* TODO: 종료일 표시 방식 확정 후 활성화
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">종료일</p>
                  <p className="font-medium">
                    {formatDateKorean(user.subscription.endDate)}
                  </p>
                </div>
*/}
                {/* TODO: 자동 갱신 표시 방식 확정 후 활성화
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">자동 갱신</p>
                  <p className="font-medium">{user.subscription.autoRenew ? "예" : "아니오"}</p>
                </div>
*/}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">추가 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">회원 ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">역할</p>
                <p className="font-medium">{user.role === "ADMIN" ? "관리자" : "일반 사용자"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <p className="text-xs text-gray-500">Provider ID</p>
                <p className="font-medium text-sm break-all">{user.providerId ?? "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
