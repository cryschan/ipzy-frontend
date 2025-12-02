import { useState } from "react";
import { CreditCard, Wallet, RefreshCcw, XCircle } from "lucide-react";
import DataTable from "../components/DataTable";
import StatsCard from "../components/StatsCard";
import { mockPayments, type MockPayment } from "../utils/mockData";

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    return matchesStatus && matchesMethod;
  });

  const columns = [
    {
      key: "userName",
      label: "회원",
      render: (payment: MockPayment) => (
        <span className="font-medium text-gray-800">{payment.userName}</span>
      ),
    },
    {
      key: "plan",
      label: "플랜",
      render: (payment: MockPayment) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            payment.plan === "pro"
              ? "bg-[#FB5010]/10 text-[#FB5010]"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {payment.plan.toUpperCase()}
        </span>
      ),
    },
    {
      key: "amount",
      label: "금액",
      render: (payment: MockPayment) => (
        <span className="font-bold">₩{payment.amount.toLocaleString()}</span>
      ),
    },
    {
      key: "method",
      label: "결제수단",
      render: (payment: MockPayment) => (
        <div className="flex items-center gap-2">
          {payment.method === "card" ? (
            <>
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span>카드 {payment.cardLast4 && `****${payment.cardLast4}`}</span>
            </>
          ) : payment.method === "kakao" ? (
            <span className="text-yellow-600 font-medium">카카오페이</span>
          ) : (
            <span className="text-green-600 font-medium">네이버페이</span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "결제일시",
      render: (payment: MockPayment) => (
        <span className="text-gray-500">{payment.createdAt}</span>
      ),
    },
    {
      key: "status",
      label: "상태",
      render: (payment: MockPayment) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            payment.status === "completed"
              ? "bg-green-100 text-green-600"
              : payment.status === "refunded"
              ? "bg-orange-100 text-orange-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {payment.status === "completed" ? "완료" : payment.status === "refunded" ? "환불" : "실패"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (payment: MockPayment) => (
        payment.status === "completed" && (
          <button className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
            환불
          </button>
        )
      ),
    },
  ];

  const totalRevenue = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = mockPayments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = mockPayments.filter((p) => p.status === "completed").length;
  const refundedCount = mockPayments.filter((p) => p.status === "refunded").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">결제 내역</h1>
        <p className="text-gray-500 mt-1">결제 및 환불을 관리합니다</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="총 매출"
          value={"₩" + (totalRevenue / 10000).toFixed(1) + "만"}
          icon={Wallet}
          color="green"
        />
        <StatsCard
          title="결제 완료"
          value={completedCount + "건"}
          icon={CreditCard}
          color="blue"
        />
        <StatsCard
          title="환불"
          value={refundedCount + "건"}
          icon={RefreshCcw}
          color="orange"
        />
        <StatsCard
          title="환불 금액"
          value={"₩" + (refundedAmount / 10000).toFixed(1) + "만"}
          icon={XCircle}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
          >
            <option value="all">모든 상태</option>
            <option value="completed">완료</option>
            <option value="refunded">환불</option>
            <option value="failed">실패</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
          >
            <option value="all">모든 결제수단</option>
            <option value="card">카드</option>
            <option value="kakao">카카오페이</option>
            <option value="naver">네이버페이</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredPayments}
        columns={columns}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredPayments.length / 10)}
        onPageChange={setCurrentPage}
        emptyMessage="결제 내역이 없습니다."
      />
    </div>
  );
}
