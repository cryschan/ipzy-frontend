import { Loader2, AlertTriangle, X, Sparkles, Heart, History, CreditCard } from "lucide-react";

interface WithdrawConfirmDialogProps {
  isOpen: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const BENEFITS_TO_LOSE = [
  {
    icon: Sparkles,
    title: "AI 코디 추천",
    description: "맞춤형 스타일 추천 서비스",
  },
  {
    icon: Heart,
    title: "저장한 코디",
    description: "저장해둔 모든 코디 정보",
  },
  {
    icon: History,
    title: "추천 히스토리",
    description: "지금까지의 추천 기록",
  },
  {
    icon: CreditCard,
    title: "구독 혜택",
    description: "프리미엄 구독 및 결제 내역",
  },
];

export default function WithdrawConfirmDialog({
  isOpen,
  loading = false,
  onConfirm,
  onCancel,
}: WithdrawConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onCancel}
      />

      {/* Dialog - 모바일에서는 하단에서 올라옴 */}
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* 경고 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-xl font-bold text-center mb-2">
          정말 탈퇴하시겠어요?
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          탈퇴하시면 아래 혜택을 더 이상 이용할 수 없어요
        </p>

        {/* 잃게 되는 혜택 목록 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="space-y-3">
            {BENEFITS_TO_LOSE.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <benefit.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">{benefit.title}</p>
                  <p className="text-xs text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-red-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-600 font-medium mb-1">
            주의사항
          </p>
          <ul className="text-xs text-red-500 space-y-1">
            <li>• 탈퇴 후 모든 데이터는 즉시 삭제됩니다</li>
            <li>• 삭제된 데이터는 복구할 수 없습니다</li>
            <li>• 동일 계정으로 재가입해도 복원되지 않습니다</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                탈퇴 처리 중...
              </>
            ) : (
              "탈퇴하기"
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            계속 이용하기
          </button>
        </div>
      </div>
    </div>
  );
}
