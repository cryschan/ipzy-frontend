import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  className?: string;
  delay?: number;
}

export function FeatureCard({ title, description, icon, className, delay = 0 }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative transition-all duration-500 ease-out",
        isHovered ? "scale-[1.02]" : "scale-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}ms both`,
      }}
    >
      {/* Folded corner */}
      <div
        className={cn(
          "absolute -top-0 -right-0 w-10 h-10 z-10 transition-all duration-300",
          isHovered ? "w-12 h-12" : "w-10 h-10"
        )}
        style={{
          background: "linear-gradient(135deg, transparent 50%, #e5e5e5 50%)",
          borderTopRightRadius: "0.5rem",
        }}
      />
      <div
        className={cn(
          "absolute top-0 right-0 z-20 transition-all duration-300",
          isHovered ? "w-12 h-12" : "w-10 h-10"
        )}
        style={{
          background: "linear-gradient(315deg, #f5f5f5 50%, transparent 50%)",
          boxShadow: isHovered
            ? "-2px 2px 4px rgba(0,0,0,0.12)"
            : "-1px 1px 2px rgba(0,0,0,0.08)",
        }}
      />

      <Card
        className={cn(
          "relative bg-white/95 backdrop-blur-sm p-6",
          "rounded-lg overflow-hidden h-full",
          "transition-shadow duration-500",
          isHovered
            ? "shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
            : "shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
        )}
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="font-mono font-bold text-lg text-gray-800 mb-2">{title}</h3>
        <p className="font-mono text-sm text-gray-600 leading-relaxed">{description}</p>
      </Card>
    </div>
  );
}
