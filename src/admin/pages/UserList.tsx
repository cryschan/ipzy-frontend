import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import {
  type AdminUserResponse,
  type AdminUserSearchParams,
  fetchUsers,
  type UserStatus,
} from "../../api/adminApi";
import { formatDateKorean } from "../../utils/date";
import DataTable from "../components/DataTable";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 검색/필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);

      const params: AdminUserSearchParams = {
        page: currentPage - 1, // 백엔드는 0부터 시작
        size: 10,
        sort: "createdAt,desc",
      };

      if (searchTerm) {
        params.keyword = searchTerm;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter as UserStatus;
      }

      const result = await fetchUsers(params);

      if (result.success && result.data) {
        setUsers(result.data.content);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
      } else {
        setError(result.error?.message ?? "회원 목록 조회 실패");
      }

      setLoading(false);
    };

    void loadUsers();
  }, [currentPage, searchTerm, statusFilter]);

  // 검색/필터 변경 시 첫 페이지로 이동
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "name",
      label: "회원",
      render: (user: AdminUserResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FB5010] rounded-full flex items-center justify-center text-white font-medium">
            {user.name?.charAt(0) ?? "?"}
          </div>
          <div>
            <p className="font-medium text-gray-800">{user.name ?? "-"}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      label: "플랜",
      render: (user: AdminUserResponse) => (
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
      ),
    },
    {
      key: "status",
      label: "상태",
      render: (user: AdminUserResponse) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.status === "ACTIVE"
              ? "bg-green-100 text-green-600"
              : user.status === "SUSPENDED"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.status === "ACTIVE" ? "활성" : user.status === "SUSPENDED" ? "정지" : "삭제"}
        </span>
      ),
    },
    {
      key: "provider",
      label: "가입 경로",
      render: (user: AdminUserResponse) => (
        <span className="text-gray-500">{user.provider ?? "-"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "가입일",
      render: (user: AdminUserResponse) => (
        <span className="text-gray-500">{formatDateKorean(user.createdAt)}</span>
      ),
    },
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">회원 관리</h1>
          <p className="text-gray-500 mt-1">총 {totalElements.toLocaleString()}명의 회원</p>
        </div>
        {/* TODO: CSV 내보내기 기능 구현 후 활성화
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <Download className="w-4 h-4" />
          <span>CSV 내보내기</span>
        </button>
*/}
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
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="이름 또는 이메일 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
            >
              <option value="all">모든 상태</option>
              <option value="ACTIVE">활성</option>
              {/* TODO: 정지 기능 구현 후 활성화
              <option value="SUSPENDED">정지</option>
              */}
              <option value="DELETED">삭제</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      ) : (
        <DataTable
          data={users}
          columns={columns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
          emptyMessage="검색 결과가 없습니다."
        />
      )}
    </div>
  );
}
