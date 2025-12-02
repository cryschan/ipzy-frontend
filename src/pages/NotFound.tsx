import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import Logo from "../components/Logo";

export default function NotFound() {
  const navigate = useNavigate();

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
          {/* 404 Visual */}
          <div className="relative mb-8">
            <div className="text-[180px] font-black text-gray-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#FB5010] rounded-full flex items-center justify-center animate-bounce">
                <Search className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-black text-[#1a1a1a] mb-3">
            페이지를 찾을 수 없어요
          </h1>
          <p className="text-gray-500 mb-8">
            요청하신 페이지가 존재하지 않거나<br />
            이동되었을 수 있어요.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>이전 페이지</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FB5010] text-white rounded-full font-bold hover:bg-[#E04600] transition-colors"
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
