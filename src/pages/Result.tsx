import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, HomeIcon, Loader2, RotateCcw } from "lucide-react";
import { getRecommendationsBySession, type RecommendationGeneration } from "../api/quiz";
import { getStoredSession, regenerateRecommendations } from "../utils/quizApi";

import { QUIZ_PATH } from "@/constants/navigation";

export default function Result() {
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationGeneration | null>(null);

  // 추천 결과 로드
  useEffect(() => {
    const loadRecommendation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const session = getStoredSession();
        if (!session) {
          setError("세션 정보가 없습니다. 퀴즈를 다시 진행해주세요.");
          return;
        }

        const recs = await getRecommendationsBySession(session.sessionId);
        if (recs.length > 0) {
          setRecommendation(recs[0]);
        } else {
          setError("추천 결과가 없습니다.");
        }
      } catch (err) {
        console.error("추천 결과 로드 실패:", err);
        setError(err instanceof Error ? err.message : "추천 결과를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendation();
  }, []);

  const navigateToQuiz = async () => {
    try {
      const session = getStoredSession();
      if (!session) {
        navigate(QUIZ_PATH);
        return;
      }

      setIsRegenerating(true);
      await regenerateRecommendations(session.sessionId);

      // 재생성 후 다시 로드
      const recs = await getRecommendationsBySession(session.sessionId);
      if (recs.length > 0) {
        setRecommendation(recs[0]);
      }
    } catch (error) {
      console.error("추천 재생성 실패:", error);
      alert("추천을 다시 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const navigateToHome = () => {
    navigate("/");
  };

  // 카테고리별 아이템 매핑
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      TOP: "Top",
      BOTTOM: "Bottom",
      OUTER: "Outer",
      SHOES: "Shoes",
      ACCESSORY: "Accessory",
    };
    return labels[category] || category;
  };

  // 로딩 중
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white text-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FB5010] mx-auto mb-4" />
          <p className="text-gray-600">추천 결과를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <main className="min-h-screen bg-white text-[#1a1a1a] flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(QUIZ_PATH)}
            className="px-6 py-3 bg-[#FB5010] text-white font-bold rounded-full hover:bg-[#E04600] transition-colors"
          >
            퀴즈 다시 시작
          </button>
        </div>
      </main>
    );
  }

  // 추천 결과가 없음
  if (!recommendation || !recommendation.result) {
    return (
      <main className="min-h-screen bg-white text-[#1a1a1a] flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-gray-600 mb-4">추천 결과가 없습니다.</p>
          <button
            onClick={() => navigate(QUIZ_PATH)}
            className="px-6 py-3 bg-[#FB5010] text-white font-bold rounded-full hover:bg-[#E04600] transition-colors"
          >
            퀴즈 다시 시작
          </button>
        </div>
      </main>
    );
  }

  const { result, reason } = recommendation;
  const { compositeImageUrl, totalPrice, items } = result;

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="text-xl font-black tracking-tighter hover:text-[#FB5010] transition-colors"
          >
            뭐입지
          </button>
        </div>
      </header>

      {/* Result Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#FB5010] text-sm font-bold tracking-widest uppercase mb-4">
            AI's Pick
          </p>
          <h1 className="text-4xl md:text-5xl font-black">Your Outfit</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Outfit Visual */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              {compositeImageUrl ? (
                <img
                  src={compositeImageUrl}
                  alt="추천 코디"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[120px] md:text-[150px] font-black text-gray-300">?</span>
                    <p className="text-gray-400 text-sm mt-4">이미지 준비 중</p>
                  </div>
                </div>
              )}
            </div>
            {/* Price Tag */}
            <div className="absolute bottom-6 right-6 bg-[#FB5010] text-white px-6 py-4 shadow-lg">
              <p className="text-xs uppercase tracking-widest opacity-80">Total</p>
              <p className="text-2xl font-black">₩{totalPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Products */}
            <div className="space-y-6 flex-1">
              {items.map((item, i) => (
                <a
                  key={i}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 border-b border-gray-100 pb-6 hover:bg-gray-50 transition-colors -mx-2 px-2 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden rounded">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.parentElement!.innerHTML =
                            '<span class="text-2xl text-gray-300">?</span>';
                        }}
                      />
                    ) : (
                      <span className="text-2xl text-gray-300">?</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="text-[#FB5010] text-xs font-bold uppercase tracking-widest mb-1">
                      {getCategoryLabel(item.category)}
                    </p>
                    <p className="font-bold text-lg">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold">₩{item.price.toLocaleString()}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* AI Reason */}
            <div className="bg-[#1a1a1a] text-white p-6 mt-6">
              <p className="text-[#FB5010] text-xs font-bold uppercase tracking-widest mb-3">
                AI's Comment
              </p>
              <p className="text-sm leading-relaxed text-gray-300">"{reason}"</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={navigateToHome}
                disabled={isRegenerating}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-[#1a1a1a] px-6 py-4 font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HomeIcon className="w-5 h-5" />
                <span>홈으로 가기</span>
              </button>
              <button
                onClick={navigateToQuiz}
                disabled={isRegenerating}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FB5010] text-white px-6 py-4 font-bold hover:bg-[#E04600] transition-colors rounded-full disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>추천 생성 중...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    <span>다시 추천받기</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-16 text-center border-t border-gray-100 pt-12">
          <p className="text-gray-500 text-sm mb-4">친구에게 공유하기</p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-lg">📱</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-lg">💬</span>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <span className="text-lg">🔗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-[#1a1a1a] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">다른 스타일도 궁금하다면?</h2>
          <button
            onClick={navigateToHome}
            className="group inline-flex items-center gap-3 bg-[#FB5010] text-white px-8 py-4 font-bold hover:bg-[#E04600] transition-colors rounded-full"
          >
            <span>새로운 코디 추천받기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </main>
  );
}
