import { useNavigate } from "react-router-dom";
import { Home, RefreshCw, WifiOff } from "lucide-react";
import Logo from "../components/Logo";

export default function NetworkError() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Logo size={32} color="#1a1a1a" bgColor="white" />
            <span className="text-xl font-black tracking-tighter">뭐입지</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Network Error Visual */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <WifiOff className="w-16 h-16 text-gray-400" />
            </div>
            {/* Animated dots */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#FB5010] rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="w-3 h-3 bg-[#FB5010] rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="w-3 h-3 bg-[#FB5010] rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-black text-[#1a1a1a] mb-3">
            인터넷 연결을 확인해 주세요
          </h1>
          <p className="text-gray-500 mb-8">
            네트워크 연결이 불안정해요.<br />
            Wi-Fi 또는 데이터 연결 상태를 확인해 주세요.
          </p>

          {/* Connection Tips */}
          <div className="bg-white rounded-2xl p-6 mb-6 text-left shadow-sm">
            <h3 className="font-bold text-sm text-gray-700 mb-3">연결 확인 방법</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-start gap-2">
                <span className="text-[#FB5010] font-bold">1.</span>
                <span>Wi-Fi 또는 모바일 데이터가 켜져 있는지 확인</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FB5010] font-bold">2.</span>
                <span>비행기 모드가 꺼져 있는지 확인</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FB5010] font-bold">3.</span>
                <span>라우터 재시작 시도</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FB5010] text-white rounded-full font-bold hover:bg-[#E04600] transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>다시 시도</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>홈으로 가기</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
