import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "이 도구 덕분에 침묵 속에서 아직 쓰여지지 않은 노래를 들을 수 있었어요.",
    author: "Music Creator",
    location: "Seoul, Korea",
  },
  {
    quote: "빈 캔버스를 바라보며 예술 작품을 볼 수 있게 해준 유일한 앱입니다.",
    author: "Digital Artist",
    location: "Tokyo, Japan",
  },
  {
    quote: "미친 아이디어도 현실로 만들 수 있다는 걸 보여줬어요.",
    author: "Startup Founder",
    location: "San Francisco, USA",
  },
];

function TestimonialCard({ quote, author, location, delay }: {
  quote: string;
  author: string;
  location: string;
  delay: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isHovered ? "scale-[1.02]" : "scale-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`,
      }}
    >
      <Card
        className={cn(
          "bg-white/90 backdrop-blur-sm p-6 rounded-lg h-full",
          "transition-shadow duration-500",
          isHovered
            ? "shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
            : "shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
        )}
      >
        <div className="text-4xl mb-4">"</div>
        <p className="font-mono text-gray-700 mb-6 leading-relaxed">{quote}</p>
        <div className="border-t border-gray-100 pt-4">
          <p className="font-mono font-bold text-gray-800">{author}</p>
          <p className="font-mono text-sm text-gray-500">{location}</p>
        </div>
      </Card>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-100/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-mono text-3xl font-bold text-center text-gray-800 mb-4">
          From the Crazy Ones
        </h2>
        <p className="font-mono text-gray-600 text-center mb-12">
          세상을 바꾸는 사람들의 이야기
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              {...testimonial}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
