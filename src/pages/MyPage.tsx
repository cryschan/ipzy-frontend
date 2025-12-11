import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Trash2, ChevronRight, User, Heart, Crown, Zap, CreditCard, UserCog } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { navigateToQuiz } from "../utils/quizApi";

export default function MyPage() {
  const navigate = useNavigate();
  const { user, savedOutfits, logout, removeOutfit, cancelSubscription } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Route Guard에서 이미 처리하지만 타입 안전성을 위해 체크
  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-black tracking-tighter">마이페이지</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FB5010] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-[#FB5010]">{savedOutfits.length}</p>
              <p className="text-sm text-gray-500">저장한 코디</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-black">12</p>
              <p className="text-sm text-gray-500">추천받은 코디</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-black">3</p>
              <p className="text-sm text-gray-500">구매한 아이템</p>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">구독 정보</h3>
              {user.subscription.isActive && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  활성
                </span>
              )}
            </div>

            {user.subscription.plan === "free" ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">현재 무료 플랜을 이용 중이에요</p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="bg-[#FB5010] text-white px-6 py-3 rounded-full font-bold hover:bg-[#E04600] transition-colors"
                >
                  프리미엄 구독하기
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      user.subscription.plan === "pro"
                        ? "bg-[#FB5010]/10"
                        : "bg-blue-500/10"
                    }`}
                  >
                    {user.subscription.plan === "pro" ? (
                      <Crown className="w-6 h-6 text-[#FB5010]" />
                    ) : (
                      <Zap className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {user.subscription.plan === "pro" ? "Pro" : "Basic"} 플랜
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.subscription.plan === "pro" ? "₩19,900" : "₩9,900"}/월
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">시작일</span>
                    <span>{user.subscription.startDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">다음 결제일</span>
                    <span>{user.subscription.endDate}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/pricing")}
                    className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-full font-medium hover:bg-[#333] transition-colors text-sm"
                  >
                    플랜 변경
                  </button>
                  <button
                    onClick={cancelSubscription}
                    className="flex-1 border border-gray-200 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm text-gray-500"
                  >
                    구독 취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Menu */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => navigate("/mypage/account")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <UserCog className="w-5 h-5 text-gray-500" />
              <span className="font-medium">계정 관리</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => navigate("/pricing")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#FB5010]" />
              <span className="font-medium">구독 관리</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="font-medium">찜한 아이템</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Saved Outfits */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">저장한 코디</h3>
            <span className="text-sm text-gray-500">{savedOutfits.length}개</span>
          </div>

          {savedOutfits.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-4">아직 저장한 코디가 없어요</p>
              <button
                onClick={() => navigateToQuiz(navigate)}
                className="text-[#FB5010] font-bold hover:underline"
              >
                코디 추천받으러 가기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  {/* Date & Delete */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400">{outfit.date}</span>
                    <button
                      onClick={() => removeOutfit(outfit.id)}
                      className="p-1 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {/* Top */}
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative">
                      <span className="text-3xl text-gray-300">?</span>
                      <span className="absolute bottom-1 left-1 text-[8px] bg-black/50 text-white px-1 rounded">
                        TOP
                      </span>
                    </div>
                    {/* Bottom */}
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative">
                      <span className="text-3xl text-gray-300">?</span>
                      <span className="absolute bottom-1 left-1 text-[8px] bg-black/50 text-white px-1 rounded">
                        BOTTOM
                      </span>
                    </div>
                    {/* Shoes */}
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative">
                      <span className="text-3xl text-gray-300">?</span>
                      <span className="absolute bottom-1 left-1 text-[8px] bg-black/50 text-white px-1 rounded">
                        SHOES
                      </span>
                    </div>
                  </div>

                  {/* Item Names */}
                  <div className="space-y-1 mb-4">
                    <p className="text-sm">
                      <span className="text-gray-400">Top:</span> {outfit.top.name}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Bottom:</span> {outfit.bottom.name}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-400">Shoes:</span> {outfit.shoes.name}
                    </p>
                  </div>

                  {/* Total & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-lg font-black">₩{outfit.total.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => window.open("https://www.musinsa.com", "_blank")}
                      className="bg-[#FB5010] text-white px-4 py-2 text-sm font-bold rounded-full hover:bg-[#E04600] transition-colors"
                    >
                      구매하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Recommendation CTA */}
        <button
          onClick={() => navigateToQuiz(navigate)}
          className="w-full bg-[#1a1a1a] text-white py-4 rounded-full font-bold hover:bg-[#333] transition-colors"
        >
          새로운 코디 추천받기
        </button>
      </div>
    </main>
  );
}
