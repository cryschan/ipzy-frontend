import { PhoneMockup } from "./PhoneMockup";
import { ManifestoCard } from "./ManifestoCard";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-20">
      {/* Left: Manifesto */}
      <div className="flex-1 max-w-xl">
        <ManifestoCard className="animate-float" />
      </div>

      {/* Right: Phone Mockup */}
      <div className="flex-1 flex justify-center">
        <PhoneMockup className="animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex flex-col">
            {/* App Header */}
            <div className="text-center py-4">
              <h3 className="font-mono text-lg font-bold text-gray-800">Crazy Tools</h3>
              <p className="font-mono text-xs text-gray-500">for crazy people</p>
            </div>

            {/* App Content - Mini cards */}
            <div className="flex-1 space-y-3 overflow-hidden">
              {[
                "Create",
                "Imagine",
                "Explore",
                "Inspire"
              ].map((item, i) => (
                <div
                  key={item}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  style={{
                    animation: `slideIn 0.5s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <p className="font-mono text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            {/* App Footer */}
            <div className="pt-4">
              <div className="bg-gray-900 text-white rounded-xl py-3 text-center font-mono text-sm">
                Get Started
              </div>
            </div>
          </div>
        </PhoneMockup>
      </div>
    </section>
  );
}
