import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Download } from "lucide-react";
import DataTable from "../components/DataTable";
import { mockUsers, type MockUser } from "../utils/mockData";

export default function UserList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 필터링
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const columns = [
    {
      key: "name",
      label: "회원",
      render: (user: MockUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FB5010] rounded-full flex items-center justify-center text-white font-medium">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      label: "플랜",
      render: (user: MockUser) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.plan === "pro"
              ? "bg-[#FB5010]/10 text-[#FB5010]"
              : user.plan === "basic"
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.plan.toUpperCase()}
        </span>
      ),
    },
    {
      key: "status",
      label: "상태",
      render: (user: MockUser) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.status === "active"
              ? "bg-green-100 text-green-600"
              : user.status === "suspended"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.status === "active" ? "활성" : user.status === "suspended" ? "정지" : "비활성"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "가입일",
      render: (user: MockUser) => <span className="text-gray-500">{user.createdAt}</span>,
    },
    {
      key: "lastLoginAt",
      label: "최근 접속",
      render: (user: MockUser) => <span className="text-gray-500">{user.lastLoginAt}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">회원 관리</h1>
          <p className="text-gray-500 mt-1">총 {mockUsers.length}명의 회원</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <Download className="w-4 h-4" />
          <span>CSV 내보내기</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름 또는 이메일 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
              />
            </div>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
            >
              <option value="all">모든 플랜</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="suspended">정지</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredUsers.length / 10)}
        onPageChange={setCurrentPage}
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
        emptyMessage="검색 결과가 없습니다."
      />
    </div>
  );
}
