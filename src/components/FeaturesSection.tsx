import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: "💡",
    title: "Invent",
    description: "세상에 없던 것을 만들어내는 도구. 당신의 아이디어가 현실이 됩니다.",
  },
  {
    icon: "🎨",
    title: "Create",
    description: "빈 캔버스에서 예술을 보는 사람들을 위해. 창작의 한계를 넓혀갑니다.",
  },
  {
    icon: "🚀",
    title: "Explore",
    description: "미지의 영역을 탐험하세요. 붉은 행성에서 실험실을 보는 상상력처럼.",
  },
  {
    icon: "✨",
    title: "Inspire",
    description: "영감을 불어넣고, 인류를 발전시키는 일. 그것이 우리가 하는 일입니다.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-mono text-3xl font-bold text-center text-gray-800 mb-4">
          Tools for the Crazy Ones
        </h2>
        <p className="font-mono text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          규칙을 좋아하지 않고, 현상 유지에 존경심이 없는 사람들을 위한 도구
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
