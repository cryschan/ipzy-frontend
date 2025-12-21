import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  emptyMessage = "데이터가 없습니다.",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#FB5010] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ""}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ""}`}
                  >
                    {column.render
                      ? column.render(item)
                      : ((item as Record<string, unknown>)[column.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            페이지 {currentPage} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page ? "bg-[#FB5010] text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
