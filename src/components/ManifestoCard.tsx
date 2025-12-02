import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ManifestoCardProps {
  className?: string;
}

const paragraphs = [
  "Here's to the crazy ones.\nThe rebels. The troublemakers.\nThe round pegs in the square holes.\nThe ones who see things differently.",
  "They're not fond of rules.\nAnd they have no respect for the status quo.",
  "You can praise them, disagree with them,\nquote them, disbelieve them, glorify or\nvilify them. About the only thing you\ncan't do is ignore them. Because they\nchange things.",
  "They invent. They imagine. They heal.\nThey explore. They create. They inspire.\nThey push the human race forward.",
  "Maybe they have to be crazy. How else\ncan you stare at an empty canvas and\nsee a work of art? Or sit in silence\nand hear a song that's never been\nwritten? Or gaze at a red planet and\nsee a laboratory on wheels? We make\ntools for these kinds of people.",
];

export function ManifestoCard({ className }: ManifestoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full max-w-lg transition-all duration-500 ease-out",
        isHovered ? "scale-[1.02]" : "scale-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Folded corner effect */}
      <div
        className={cn(
          "absolute -top-0 -right-0 w-16 h-16 z-10 transition-all duration-300",
          isHovered ? "w-20 h-20" : "w-16 h-16"
        )}
        style={{
          background: "linear-gradient(135deg, transparent 50%, #e5e5e5 50%)",
          borderTopRightRadius: "0.5rem",
        }}
      />
      <div
        className={cn(
          "absolute top-0 right-0 z-20 transition-all duration-300",
          isHovered ? "w-20 h-20" : "w-16 h-16"
        )}
        style={{
          background: "linear-gradient(315deg, #f5f5f5 50%, transparent 50%)",
          boxShadow: isHovered
            ? "-3px 3px 6px rgba(0,0,0,0.15)"
            : "-2px 2px 4px rgba(0,0,0,0.1)",
        }}
      />

      <Card
        className={cn(
          "relative bg-white/95 backdrop-blur-sm p-8 md:p-10",
          "rounded-lg overflow-hidden",
          "transition-shadow duration-500",
          isHovered
            ? "shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            : "shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
        )}
      >
        {/* Content */}
        <div className="font-mono text-gray-800 text-sm md:text-base leading-relaxed space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={cn(
                "whitespace-pre-line",
                "animate-in fade-in slide-in-from-bottom-4",
                "fill-mode-both"
              )}
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: "600ms",
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Watermark */}
        <div
          className={cn(
            "absolute bottom-6 right-8 text-6xl font-bold text-gray-200/60",
            "select-none pointer-events-none",
            "transition-all duration-300",
            isHovered ? "text-gray-300/70 scale-110" : "text-gray-200/60"
          )}
        >
          MD
        </div>

        {/* Subtle paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </Card>
    </div>
  );
}
