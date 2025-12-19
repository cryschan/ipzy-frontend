import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, UserCheck, UserPlus, Users, Zap } from "lucide-react";
import {
  type AdminDashboardResponse,
  type AdminUserResponse,
  fetchDashboardStats,
  fetchUsers,
} from "../../api/adminApi";
import StatsCard from "../components/StatsCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError(null);

      const [statsResult, usersResult] = await Promise.all([
        fetchDashboardStats(),
        fetchUsers({ size: 5, sort: "createdAt,desc" }),
      ]);

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      } else {
        setError(statsResult.error?.message ?? "통계 조회 실패");
      }

      if (usersResult.success && usersResult.data) {
        setRecentUsers(usersResult.data.content);
      }

      setLoading(false);
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">대시보드</h1>
        <p className="text-gray-500 mt-1">서비스 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="총 회원"
          value={(stats?.userStats.totalUsers ?? 0).toLocaleString() + "명"}
          icon={Users}
          color="orange"
        />
        <StatsCard
          title="활성 회원"
          value={(stats?.userStats.activeUsers ?? 0).toLocaleString() + "명"}
          icon={UserCheck}
          color="purple"
        />
        <StatsCard
          title="이번달 신규 가입"
          value={(stats?.userStats.newUsersThisMonth ?? 0).toLocaleString() + "명"}
          icon={UserPlus}
          color="green"
        />
        <StatsCard
          title="이번달 추천"
          value={(stats?.recommendationStats.recommendationsThisMonth ?? 0).toLocaleString() + "건"}
          icon={Zap}
          color="blue"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">퀴즈 통계</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">전체 세션</span>
              <span className="font-bold text-gray-800">
                {(stats?.quizStats.totalSessions ?? 0).toLocaleString()}회
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">완료된 세션</span>
              <span className="font-bold text-gray-800">
                {(stats?.quizStats.completedSessions ?? 0).toLocaleString()}회
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">완료율</span>
              <span className="font-bold text-[#FB5010]">
                {(stats?.quizStats.completionRate ?? 0).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FB5010] rounded-full transition-all"
                style={{ width: `${stats?.quizStats.completionRate ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recommendation Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4">추천 통계</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-black text-gray-800">
                {(stats?.recommendationStats.totalRecommendations ?? 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">전체 추천 수</p>
            </div>
            <div className="text-center p-6 bg-[#FB5010]/5 rounded-xl">
              <p className="text-3xl font-black text-[#FB5010]">
                {(stats?.recommendationStats.recommendationsThisMonth ?? 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">이번달 추천 수</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">최근 가입 회원</h3>
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-1 text-sm text-[#FB5010] hover:underline"
          >
            전체보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  플랜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  가입일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FB5010] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name?.charAt(0) ?? "?"}
                      </div>
                      <span className="font-medium text-gray-800">{user.name ?? "-"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.planName === "PRO"
                          ? "bg-[#FB5010]/10 text-[#FB5010]"
                          : user.planName === "BASIC"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.planName ?? "FREE"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-600"
                          : user.status === "SUSPENDED"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status === "ACTIVE"
                        ? "활성"
                        : user.status === "SUSPENDED"
                          ? "정지"
                          : "삭제"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
