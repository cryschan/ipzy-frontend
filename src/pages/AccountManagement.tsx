import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Camera, Loader2, ChevronRight, UserX } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import WithdrawConfirmDialog from "../components/WithdrawConfirmDialog";

export default function AccountManagement() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("이름은 필수입니다.");
      return;
    }

    setSaving(true);
    setError(null);

    // Mock: 저장 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    navigate("/mypage");
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);

    // Mock: 탈퇴 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setWithdrawing(false);
    logout();
    // React 라우팅 우회하여 홈으로 이동
    window.location.replace("/");
  };

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/mypage")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-black tracking-tighter">계정 관리</span>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-[#FB5010] rounded-full flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-white" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">{user?.email}</p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 프로필 정보 섹션 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold mb-4">프로필 정보</h3>

            {/* 이름 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FB5010] focus:border-transparent"
                placeholder="이름을 입력하세요"
                maxLength={100}
              />
            </div>

            {/* 전화번호 (변경 불가) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                value={form.phone}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                placeholder="010-1234-5678"
              />
              <p className="text-xs text-gray-400 mt-1">전화번호는 변경할 수 없습니다</p>
            </div>

          </div>

          {/* 저장 버튼 */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#FB5010] text-white py-4 rounded-full font-bold hover:bg-[#E04600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : (
              "저장하기"
            )}
          </button>
        </form>

        {/* 계정 탈퇴 섹션 */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowWithdrawConfirm(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <UserX className="w-5 h-5 text-red-400" />
              <div className="text-left">
                <span className="font-medium text-red-500 block">계정 탈퇴</span>
                <span className="text-xs text-gray-400">
                  탈퇴 시 모든 데이터가 삭제됩니다
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 하단 여백 */}
        <div className="h-8" />
      </div>

      {/* 탈퇴 확인 다이얼로그 */}
      <WithdrawConfirmDialog
        isOpen={showWithdrawConfirm}
        loading={withdrawing}
        onConfirm={handleWithdraw}
        onCancel={() => setShowWithdrawConfirm(false)}
      />
    </main>
  );
}
