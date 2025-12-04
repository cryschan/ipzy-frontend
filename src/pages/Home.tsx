import { ArrowRight, Menu, X, User, Gift, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    navigate("/quiz");
  };

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo size={32} color="#1a1a1a" bgColor="white" />
            <span className="text-xl font-black tracking-tighter">뭐입지</span>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/mypage")}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </button>
                <button
                  onClick={handleStart}
                  className="bg-[#FB5010] text-white px-4 py-2 text-sm font-medium hover:bg-[#E04600] transition-colors rounded-full"
                >
                  Start
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={handleStart}
                  className="bg-[#FB5010] text-white px-4 py-2 text-sm font-medium hover:bg-[#E04600] transition-colors rounded-full"
                >
                  Start
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {user ? (
              <button
                onClick={() => {
                  navigate("/mypage");
                  setMenuOpen(false);
                }}
                className="text-2xl font-bold"
              >
                마이페이지
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="text-2xl font-bold"
              >
                로그인
              </button>
            )}
            <button
              onClick={() => {
                handleStart();
                setMenuOpen(false);
              }}
              className="text-2xl font-bold"
            >
              Start
            </button>
            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-bold"
            >
              About
            </a>
            <button
              onClick={() => {
                handleStart();
                setMenuOpen(false);
              }}
              className="bg-[#FB5010] text-white px-8 py-3 text-lg font-medium rounded-full"
            >
              코디 추천 받기
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-screen pt-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1 mb-6">
              <p className="text-[#FB5010] text-sm font-bold tracking-widest uppercase mb-4">
                AI Styling Service
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6">
                오늘
                <br />
                <span className="text-[#FB5010]">뭐입지?</span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-md mb-8 leading-relaxed">
                4가지 질문으로 찾는 나만의 스타일.
                <br />
                AI가 추천하는 무신사 코디.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStart}
                  className="group flex items-center justify-center gap-3 bg-[#FB5010] text-white px-8 py-4 font-bold hover:bg-[#E04600] transition-colors rounded-full"
                >
                  <span>코디 추천 받기</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-[#1a1a1a] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-full">
                  더 알아보기
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 w-24 h-24 bg-[#FB5010] rounded-full opacity-80" />
                <div className="absolute bottom-12 left-8 w-16 h-16 bg-[#1a1a1a] rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-[200px] font-black text-white/50">
                    ?
                  </span>
                </div>
                {/* Magazine Style Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] text-white p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs tracking-widest uppercase">
                      Issue 001
                    </span>
                    <span className="text-xs">2025</span>
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-[#FB5010] text-white p-6 shadow-2xl">
                <p className="text-3xl font-black">4</p>
                <p className="text-xs tracking-widest uppercase">Questions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Trial Banner */}
      <section className="py-16 bg-gradient-to-r from-[#FB5010] to-[#FF6B35] text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    무료 체험
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black">
                  회원가입하면{" "}
                  <span className="underline decoration-4">5회 무료</span> 체험!
                </h3>
                <p className="text-white/80 mt-1">
                  카드 등록 없이 AI 코디 추천을 경험해보세요
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-[#FB5010] px-8 py-4 font-bold rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              무료로 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-24 md:py-32 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <p className="text-[#FB5010] text-sm font-bold tracking-widest uppercase mb-4">
                How it works
              </p>
              <h2 className="text-4xl md:text-6xl font-black">4 Questions</h2>
            </div>
            <p className="text-gray-400 max-w-sm mt-4 md:mt-0">
              간단한 4가지 질문으로 당신에게 딱 맞는 스타일을 찾아드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                q: "어디 가요?",
                opts: "학교 · 회사 · 데이트 · 외출",
              },
              {
                num: "02",
                q: "어떻게 보이고 싶어요?",
                opts: "깔끔 · 편하게 · 멋있게",
              },
              { num: "03", q: "체형 고민?", opts: "없음 · 배 · 마른편 · 키" },
              { num: "04", q: "예산은?", opts: "10만 · 20만 · 30만 · 무관" },
            ].map((item, i) => (
              <div
                key={i}
                className="group border border-white/10 p-6 hover:border-[#FB5010] transition-colors"
              >
                <span className="text-5xl font-black text-[#FB5010]">
                  {item.num}
                </span>
                <h3 className="text-xl font-bold mt-6 mb-3">{item.q}</h3>
                <p className="text-sm text-gray-500">{item.opts}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={handleStart}
              className="group inline-flex items-center gap-3 bg-[#FB5010] text-white px-10 py-5 font-bold text-lg hover:bg-[#E04600] transition-colors rounded-full"
            >
              <span>시작하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1a1a] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <Logo size={36} color="white" bgColor="#1a1a1a" />
              <span className="text-2xl font-black">뭐입지</span>
              <span className="text-gray-500">|</span>
              <span className="text-sm text-gray-500">AI Styling Service</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 뭐입지. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
