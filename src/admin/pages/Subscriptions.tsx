import { useState } from "react";
import { Crown, Zap, Users } from "lucide-react";
import DataTable from "../components/DataTable";
import StatsCard from "../components/StatsCard";
import { mockSubscriptions, mockPlanDistribution, type MockSubscription } from "../utils/mockData";

export default function Subscriptions() {
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSubscriptions = mockSubscriptions.filter((sub) => {
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesPlan && matchesStatus;
  });

  const columns = [
    {
      key: "userName",
      label: "회원",
      render: (sub: MockSubscription) => (
        <div>
          <p className="font-medium text-gray-800">{sub.userName}</p>
          <p className="text-sm text-gray-500">{sub.userEmail}</p>
        </div>
      ),
    },
    {
      key: "plan",
      label: "플랜",
      render: (sub: MockSubscription) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            sub.plan === "pro"
              ? "bg-[#FB5010]/10 text-[#FB5010]"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {sub.plan.toUpperCase()}
        </span>
      ),
    },
    {
      key: "amount",
      label: "금액",
      render: (sub: MockSubscription) => (
        <span className="font-medium">₩{sub.amount.toLocaleString()}</span>
      ),
    },
    {
      key: "startDate",
      label: "시작일",
      render: (sub: MockSubscription) => (
        <span className="text-gray-500">{sub.startDate}</span>
      ),
    },
    {
      key: "endDate",
      label: "종료일",
      render: (sub: MockSubscription) => (
        <span className="text-gray-500">{sub.endDate}</span>
      ),
    },
    {
      key: "status",
      label: "상태",
      render: (sub: MockSubscription) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            sub.status === "active"
              ? "bg-green-100 text-green-600"
              : sub.status === "cancelled"
              ? "bg-orange-100 text-orange-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {sub.status === "active" ? "활성" : sub.status === "cancelled" ? "취소" : "만료"}
        </span>
      ),
    },
  ];

  const activeCount = mockSubscriptions.filter((s) => s.status === "active").length;
  const proCount = mockSubscriptions.filter((s) => s.plan === "pro" && s.status === "active").length;
  const basicCount = mockSubscriptions.filter((s) => s.plan === "basic" && s.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">구독 관리</h1>
        <p className="text-gray-500 mt-1">구독 현황을 관리합니다</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="전체 구독"
          value={activeCount + "명"}
          icon={Users}
          color="orange"
        />
        <StatsCard
          title="Pro 구독"
          value={proCount + "명"}
          icon={Crown}
          color="purple"
        />
        <StatsCard
          title="Basic 구독"
          value={basicCount + "명"}
          icon={Zap}
          color="blue"
        />
        <StatsCard
          title="이번 달 매출"
          value={"₩" + ((proCount * 19900 + basicCount * 9900) / 10000).toFixed(1) + "만"}
          icon={Crown}
          color="green"
        />
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">플랜 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">Free</span>
              <span className="text-gray-500">₩0/월</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">월 5회 추천, 저장 10개</p>
            <p className="text-sm">
              <span className="font-medium">{mockPlanDistribution.free.count}</span>
              <span className="text-gray-500">명 이용 중</span>
            </p>
          </div>
          {/* Basic */}
          <div className="p-4 border-2 border-blue-200 rounded-xl bg-blue-50/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-600">Basic</span>
              <span className="text-blue-600">₩9,900/월</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">월 30회 추천, 저장 50개</p>
            <p className="text-sm">
              <span className="font-medium">{mockPlanDistribution.basic.count}</span>
              <span className="text-gray-500">명 이용 중</span>
            </p>
          </div>
          {/* Pro */}
          <div className="p-4 border-2 border-[#FB5010] rounded-xl bg-[#FB5010]/5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#FB5010]">Pro</span>
              <span className="text-[#FB5010]">₩19,900/월</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">무제한 추천, 무제한 저장</p>
            <p className="text-sm">
              <span className="font-medium">{mockPlanDistribution.pro.count}</span>
              <span className="text-gray-500">명 이용 중</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
          >
            <option value="all">모든 플랜</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="cancelled">취소</option>
            <option value="expired">만료</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredSubscriptions}
        columns={columns}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredSubscriptions.length / 10)}
        onPageChange={setCurrentPage}
        emptyMessage="구독 내역이 없습니다."
      />
    </div>
  );
}
