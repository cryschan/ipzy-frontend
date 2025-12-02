import { useState } from "react";
import { Plus, Search, Package, Shirt, Footprints } from "lucide-react";
import DataTable from "../components/DataTable";
import StatsCard from "../components/StatsCard";
import { mockProducts, type MockProduct } from "../utils/mockData";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      key: "name",
      label: "상품",
      render: (product: MockProduct) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Package className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "카테고리",
      render: (product: MockProduct) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.category === "top"
              ? "bg-blue-100 text-blue-600"
              : product.category === "bottom"
              ? "bg-green-100 text-green-600"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {product.category === "top" ? "상의" : product.category === "bottom" ? "하의" : "신발"}
        </span>
      ),
    },
    {
      key: "price",
      label: "가격",
      render: (product: MockProduct) => (
        <span className="font-medium">₩{product.price.toLocaleString()}</span>
      ),
    },
    {
      key: "isAvailable",
      label: "상태",
      render: (product: MockProduct) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.isAvailable ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
          }`}
        >
          {product.isAvailable ? "판매중" : "품절"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "등록일",
      render: (product: MockProduct) => (
        <span className="text-gray-500">{product.createdAt}</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <button className="text-sm text-[#FB5010] hover:underline">수정</button>
      ),
    },
  ];

  const topCount = mockProducts.filter((p) => p.category === "top").length;
  const bottomCount = mockProducts.filter((p) => p.category === "bottom").length;
  const shoesCount = mockProducts.filter((p) => p.category === "shoes").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">상품 관리</h1>
          <p className="text-gray-500 mt-1">총 {mockProducts.length}개의 상품</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#FB5010] text-white rounded-lg hover:bg-[#E04600] transition-colors">
          <Plus className="w-4 h-4" />
          <span>상품 등록</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="전체 상품" value={mockProducts.length + "개"} icon={Package} color="orange" />
        <StatsCard title="상의" value={topCount + "개"} icon={Shirt} color="blue" />
        <StatsCard title="하의" value={bottomCount + "개"} icon={Package} color="green" />
        <StatsCard title="신발" value={shoesCount + "개"} icon={Footprints} color="purple" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="상품명 또는 브랜드 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-[#FB5010] focus:outline-none"
          >
            <option value="all">모든 카테고리</option>
            <option value="top">상의</option>
            <option value="bottom">하의</option>
            <option value="shoes">신발</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredProducts}
        columns={columns}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProducts.length / 10)}
        onPageChange={setCurrentPage}
        emptyMessage="상품이 없습니다."
      />
    </div>
  );
}
