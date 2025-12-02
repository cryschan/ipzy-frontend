import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  FileQuestion,
  Settings,
  Crown,
  Receipt,
} from "lucide-react";

const menuItems = [
  { path: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { path: "/admin/users", label: "회원 관리", icon: Users },
  { path: "/admin/subscriptions", label: "구독 관리", icon: Crown },
  { path: "/admin/payments", label: "결제 내역", icon: Receipt },
  { path: "/admin/products", label: "상품 관리", icon: Package },
  { path: "/admin/quiz", label: "퀴즈 관리", icon: FileQuestion },
  { path: "/admin/settings", label: "설정", icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1a1a] text-white hidden lg:block z-20">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FB5010] rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg">뭐입지</h1>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#FB5010] text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="text-center">
          <p className="text-gray-600 text-xs">뭐입지 Admin v1.0</p>
        </div>
      </div>
    </aside>
  );
}
