import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function PhoneMockup({ className, children, style }: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "relative mx-auto",
        "w-[280px] h-[580px]",
        "bg-gray-900 rounded-[3rem]",
        "p-3",
        "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]",
        className
      )}
      style={style}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10" />

      {/* Screen */}
      <div className="relative w-full h-full bg-white rounded-[2.25rem] overflow-hidden">
        {children || (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 font-mono text-sm">App Screen</span>
          </div>
        )}
      </div>

      {/* Side button */}
      <div className="absolute right-[-2px] top-28 w-1 h-12 bg-gray-700 rounded-l-sm" />
      <div className="absolute left-[-2px] top-24 w-1 h-8 bg-gray-700 rounded-r-sm" />
      <div className="absolute left-[-2px] top-36 w-1 h-16 bg-gray-700 rounded-r-sm" />
    </div>
  );
}
