import { useNavigate } from "react-router-dom";
import { Users, Crown, Wallet, Zap, ChevronRight, UserPlus, CreditCard, Heart } from "lucide-react";
import StatsCard from "../components/StatsCard";
import { mockStats, mockPlanDistribution, mockActivities, mockUsers } from "../utils/mockData";

export default function Dashboard() {
  const navigate = useNavigate();

  const activityIcons = {
    signup: UserPlus,
    subscription: Crown,
    recommendation: Heart,
    payment: CreditCard,
  };

  const activityColors = {
    signup: "bg-green-100 text-green-600",
    subscription: "bg-purple-100 text-purple-600",
    recommendation: "bg-pink-100 text-pink-600",
    payment: "bg-blue-100 text-blue-600",
  };

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
          value={mockStats.totalUsers.toLocaleString() + "명"}
          change={mockStats.totalUsersChange}
          icon={Users}
          color="orange"
        />
        <StatsCard
          title="활성 구독"
          value={mockStats.activeSubscriptions.toLocaleString() + "명"}
          change={mockStats.activeSubscriptionsChange}
          icon={Crown}
          color="purple"
        />
        <StatsCard
          title="이번 달 매출"
          value={"₩" + (mockStats.monthlyRevenue / 10000).toFixed(1) + "만"}
          change={mockStats.monthlyRevenueChange}
          icon={Wallet}
          color="green"
        />
        <StatsCard
          title="오늘 추천"
          value={mockStats.todayRecommendations.toLocaleString() + "건"}
          change={mockStats.todayRecommendationsChange}
          icon={Zap}
          color="blue"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">플랜 분포</h3>
          <div className="space-y-4">
            {/* Free */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Free</span>
                <span className="font-medium">{mockPlanDistribution.free.count}명 ({mockPlanDistribution.free.percentage}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400 rounded-full"
                  style={{ width: `${mockPlanDistribution.free.percentage}%` }}
                />
              </div>
            </div>
            {/* Basic */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Basic</span>
                <span className="font-medium">{mockPlanDistribution.basic.count}명 ({mockPlanDistribution.basic.percentage}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${mockPlanDistribution.basic.percentage}%` }}
                />
              </div>
            </div>
            {/* Pro */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pro</span>
                <span className="font-medium">{mockPlanDistribution.pro.count}명 ({mockPlanDistribution.pro.percentage}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FB5010] rounded-full"
                  style={{ width: `${mockPlanDistribution.pro.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">유료 전환율</span>
              <span className="font-bold text-[#FB5010]">
                {((mockPlanDistribution.basic.count + mockPlanDistribution.pro.count) / mockStats.totalUsers * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">최근 활동</h3>
            <button className="text-sm text-[#FB5010] hover:underline">전체보기</button>
          </div>
          <div className="space-y-4">
            {mockActivities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];
              return (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">플랜</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.slice(0, 5).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/users/${user.id}`)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FB5010] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.plan === "pro" ? "bg-[#FB5010]/10 text-[#FB5010]" :
                      user.plan === "basic" ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {user.plan.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === "active" ? "bg-green-100 text-green-600" :
                      user.status === "suspended" ? "bg-red-100 text-red-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {user.status === "active" ? "활성" : user.status === "suspended" ? "정지" : "비활성"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
