import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 9900,
    description: "스타일링을 시작하는 분들께",
    icon: Zap,
    color: "#3B82F6",
    features: [
      "월 30회 코디 추천",
      "기본 스타일 분석",
      "코디 저장 (최대 50개)",
      "이메일 지원",
    ],
    notIncluded: ["프리미엄 브랜드 추천", "체형 맞춤 분석", "1:1 스타일 상담"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19900,
    description: "완벽한 스타일을 원하는 분들께",
    icon: Crown,
    color: "#FB5010",
    popular: true,
    features: [
      "무제한 코디 추천",
      "AI 심층 스타일 분석",
      "코디 저장 무제한",
      "프리미엄 브랜드 추천",
      "체형 맞춤 분석",
      "1:1 스타일 상담 (월 2회)",
      "우선 고객 지원",
      "신상품 우선 알림",
    ],
    notIncluded: [],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user, subscribe } = useAuth();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const success = await subscribe(planId as "basic" | "pro");
    if (success) {
      navigate("/payment", { state: { plan: planId } });
    }
  };

  const currentPlan = user?.subscription?.plan || "free";

  return (
    <main className="min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-black tracking-tighter">구독 플랜</span>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-4">
            나에게 맞는 플랜 선택하기
          </h1>
          <p className="text-gray-500 text-base">
            언제든지 취소할 수 있어요. 부담 없이 시작하세요.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between relative bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${
                  plan.popular
                    ? "border-[#FB5010] shadow-lg"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FB5010] text-white text-xs font-bold px-4 py-1 rounded-full">
                    인기
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-black">
                    ₩{plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500">/월</span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${plan.color}15` }}
                      >
                        <Check
                          className="w-3 h-3"
                          style={{ color: plan.color }}
                        />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-40">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-400">-</span>
                      </div>
                      <span className="text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-4 rounded-full font-bold transition-colors ${
                    isCurrentPlan
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : plan.popular
                      ? "bg-[#FB5010] text-white hover:bg-[#E04600]"
                      : "bg-[#1a1a1a] text-white hover:bg-[#333]"
                  }`}
                >
                  {isCurrentPlan ? "현재 플랜" : "시작하기"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Free Plan Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <h3 className="font-bold mb-2">무료로도 사용할 수 있어요</h3>
          <p className="text-sm text-gray-500 mb-4">
            Free 플랜으로 월 5회 코디 추천을 받아보세요.
          </p>
          {currentPlan === "free" && (
            <span className="inline-block bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
              현재 Free 플랜 이용 중
            </span>
          )}
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-center">자주 묻는 질문</h3>
          <div className="space-y-4">
            {[
              {
                q: "언제든지 취소할 수 있나요?",
                a: "네, 언제든지 취소할 수 있으며 다음 결제일까지는 서비스를 이용하실 수 있습니다.",
              },
              {
                q: "플랜을 변경할 수 있나요?",
                a: "네, Basic에서 Pro로 언제든지 업그레이드할 수 있습니다. 차액만 결제됩니다.",
              },
              {
                q: "결제 수단은 무엇이 있나요?",
                a: "신용카드, 체크카드, 카카오페이, 네이버페이를 지원합니다.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <p className="font-medium mb-2">{faq.q}</p>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
