interface LoginRequiredModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function LoginRequiredModal({ isOpen, onConfirm }: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#FB5010]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-[#FB5010]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-[#1a1a1a] mb-3">로그인이 필요해요</h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-8 leading-relaxed">
          AI가 추천한 코디를 보려면
          <br />
          로그인을 해야만 결과를 볼 수 있어요
        </p>

        {/* Button */}
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-[#FB5010] text-white font-bold rounded-lg hover:bg-[#FB5010]/90 transition-colors"
        >
          로그인하러 가기
        </button>
      </div>
    </div>
  );
}
