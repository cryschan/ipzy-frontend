import { ArrowRight, RotateCcw, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navigateToQuiz } from "../utils/quizApi";

// 모의 데이터
const mockResult = {
  top: {
    name: "오버핏 옥스포드 셔츠",
    brand: "무신사 스탠다드",
    price: 59000,
    image: null,
  },
  bottom: {
    name: "와이드 슬랙스 팬츠",
    brand: "커버낫",
    price: 79000,
    image: null,
  },
  shoes: {
    name: "레더 코트 스니커즈",
    brand: "컨버스",
    price: 51000,
    image: null,
  },
  total: 189000,
  reason:
    "데이트에 어울리는 깔끔한 스타일로, 체형과 예산을 모두 고려했습니다. 오버핏 셔츠로 편안하면서도 세련된 느낌을 연출하고, 와이드 슬랙스로 다리 라인을 보완했어요.",
};

export default function Result() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigateToQuiz(navigate);
  };

  const handleHome = () => {
    navigate("/");
  };

  const handlePurchase = () => {
    // 무신사로 이동 (실제 구현 시 장바구니 연동)
    window.open("https://www.musinsa.com", "_blank");
  };

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleHome}
            className="text-xl font-black tracking-tighter hover:text-[#FB5010] transition-colors"
          >
            뭐입지
          </button>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">다시하기</span>
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
          <h1 className="text-4xl md:text-5xl font-black">
            Your Outfit
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Outfit Visual */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[120px] md:text-[150px] font-black text-gray-300">?</span>
                  <p className="text-gray-400 text-sm mt-4">이미지 준비 중</p>
                </div>
              </div>
            </div>
            {/* Price Tag */}
            <div className="absolute bottom-6 right-6 bg-[#FB5010] text-white px-6 py-4 shadow-lg">
              <p className="text-xs uppercase tracking-widest opacity-80">Total</p>
              <p className="text-2xl font-black">₩{mockResult.total.toLocaleString()}</p>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Products */}
            <div className="space-y-6 flex-1">
              {[
                { label: "Top", item: mockResult.top },
                { label: "Bottom", item: mockResult.bottom },
                { label: "Shoes", item: mockResult.shoes },
              ].map((product, i) => (
                <div
                  key={i}
                  className="flex gap-4 border-b border-gray-100 pb-6"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-20 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl text-gray-300">?</span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="text-[#FB5010] text-xs font-bold uppercase tracking-widest mb-1">
                      {product.label}
                    </p>
                    <p className="font-bold text-lg">{product.item.name}</p>
                    <p className="text-sm text-gray-500">{product.item.brand}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold">₩{product.item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Reason */}
            <div className="bg-[#1a1a1a] text-white p-6 mt-6">
              <p className="text-[#FB5010] text-xs font-bold uppercase tracking-widest mb-3">
                AI's Comment
              </p>
              <p className="text-sm leading-relaxed text-gray-300">
                "{mockResult.reason}"
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handlePurchase}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FB5010] text-white px-6 py-4 font-bold hover:bg-[#E04600] transition-colors rounded-full"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>무신사에서 구매하기</span>
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-[#1a1a1a] px-6 py-4 font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
                <span>다시 추천받기</span>
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
            onClick={handleRetry}
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
