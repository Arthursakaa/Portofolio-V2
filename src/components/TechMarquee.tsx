"use client";

const MARQUEE_ITEMS = [
  { label: "NEXT.JS", accent: "#fffdf9" },
  { label: "REACT", accent: "#38bdf8" },
  { label: "REACT NATIVE", accent: "#38bdf8" },
  { label: "EXPO", accent: "#fffdf9" },
  { label: "TYPESCRIPT", accent: "#60a5fa" },
  { label: "LARAVEL 12", accent: "#fb923c" },
  { label: "GO (GIN)", accent: "#38bdf8" },
  { label: "EXPRESS.JS", accent: "#10b981" },
  { label: "MYSQL", accent: "#eab308" },
  { label: "POSTGRESQL", accent: "#60a5fa" },
  { label: "PYTHON", accent: "#eab308" },
  { label: "SCIKIT-LEARN", accent: "#fb923c" },
  { label: "OLLAMA AI", accent: "#10b981" },
  { label: "WEBSOCKETS", accent: "#10b981" },
  { label: "TAILWIND CSS", accent: "#38bdf8" },
  { label: "GO TESTING", accent: "#fffdf9" },
] as const;

export function TechMarquee() {
  return (
    <div
      aria-label="Core technology stack ticker"
      className="retro-marquee relative w-full overflow-hidden border-y-2 border-[#2b2723] bg-[#2b2723] py-2.5 select-none"
    >
      {/* Subtle left/right edge fades matching dark ink bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16 bg-gradient-to-r from-[#2b2723] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16 bg-gradient-to-l from-[#2b2723] to-transparent"
      />

      <div className="retro-marquee-track flex w-max items-center">
        {[0, 1].map((dupIdx) => (
          <div
            key={dupIdx}
            aria-hidden={dupIdx === 1 ? "true" : undefined}
            className={`flex shrink-0 items-center ${dupIdx === 1 ? "retro-marquee-dup" : ""}`}
          >
            {MARQUEE_ITEMS.map((item) => (
              <span
                key={`${dupIdx}-${item.label}`}
                className="inline-flex items-center gap-3 px-3 sm:px-4 font-pixel text-[9px] sm:text-[10px] tracking-wider transition-colors duration-150 hover:text-[#ea580c]"
                style={{ color: item.accent }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-1.5 h-1.5 bg-[#ea580c] shrink-0"
                />
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
