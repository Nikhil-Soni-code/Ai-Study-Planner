import { useState, useEffect } from "react";

const STAGES = [
  "Analyzing subjects & weak areas...",
  "Calculating study weights...",
  "Preparing AI prompt parameters...",
  "Generating study schedule roadmap...",
  "Building study calendar blocks...",
];

export default function LoadingScreen() {
  const [stage, setStage] = useState(0);
  const [heavyTraffic, setHeavyTraffic] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Show traffic warnings if loader takes longer than 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeavyTraffic(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-50/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 transition-colors">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
        
        {/* Animated Spin Ring */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
        </div>

        {/* Loading Header */}
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
          Compiling Study Routine
        </h3>
        <p className="text-xs text-slate-455 mt-1 leading-relaxed">
          Google Gemini is engineering your customized study calendar...
        </p>

        {/* Heavy Traffic Alert Banner */}
        {heavyTraffic && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-[10px] font-bold animate-pulse text-center leading-relaxed">
            ⚠️ Gemini AI is currently experiencing high demand. <br />
            We're retrying automatically. This may take a few seconds.
          </div>
        )}

        {/* Multi-step Progressive Indicator */}
        <div className="mt-6 space-y-3.5 text-left border-t border-slate-100 pt-6">
          {STAGES.map((text, index) => {
            const isCompleted = index < stage;
            const isActive = index === stage;

            return (
              <div key={text} className="flex items-center gap-3 transition-opacity duration-200">
                {isCompleted ? (
                  <span className="flex-shrink-0 w-4 h-4 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : isActive ? (
                  <span className="flex-shrink-0 w-4 h-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                  </span>
                ) : (
                  <span className="flex-shrink-0 w-4 h-4 rounded-full border border-slate-200" />
                )}
                
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isActive 
                      ? "text-slate-800 font-bold" 
                      : isCompleted 
                        ? "text-slate-400" 
                        : "text-slate-300"
                  }`}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
