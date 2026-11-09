"use client";

import { useState } from "react";
import { retroSound } from "@/lib/audio";
import { useArcade } from "@/lib/arcadeStore";

const COMPANION_MESSAGES = [
  "Hi! I'm Arthur's pixel assistant. Scroll down to explore his projects & skills!",
  "Hiring for an internship? Check out the Role Matcher in the 'About' section below!",
  "Every project card includes both a Visual UI Preview and System Architecture notes.",
  "Toggle [CRT] at the top navbar if you want a nostalgic 90s monitor scanline effect.",
  "Check out EduBot below — it's a live Machine Learning learning-style diagnostic web app!",
];

interface PixelCompanionProps {
  reducedMotion: boolean;
  soundEnabled: boolean;
}

export function PixelCompanion({ reducedMotion, soundEnabled }: PixelCompanionProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { neko } = useArcade();

  const nextMessage = () => {
    if (soundEnabled) retroSound.playBlip(750, "triangle", 0.05);
    setIsTransitioning(true);
    setTimeout(() => {
      setMsgIndex((prev) => (prev + 1) % COMPANION_MESSAGES.length);
      setIsTransitioning(false);
    }, 140);
  };

  return (
    <aside
      aria-label="Interactive Portfolio Guide"
      className="bg-[#fffdf9] pixel-border p-4 text-xs flex flex-col sm:flex-row items-center gap-4"
    >
      {/* Pixel Robot Avatar */}
      <button
        type="button"
        suppressHydrationWarning
        onClick={nextMessage}
        className={`pixel-btn group relative flex flex-col items-center justify-center p-2.5 bg-[#f4efe6] hover:border-[#ea580c] ${
          !reducedMotion && !isTransitioning ? "animate-pulse" : ""
        }`}
        title="Click me for portfolio navigation tips!"
        aria-label="Click assistant for another tip"
      >
        <div className="w-10 h-10 flex flex-col justify-between items-center py-0.5">
          {/* Antenna, or cat ears in neko mode (plan 020) */}
          {neko ? (
            <div className="flex gap-3 mb-0.5" aria-hidden="true">
              <span className="w-2 h-2 bg-[#ea580c] border border-[#2b2723]" />
              <span className="w-2 h-2 bg-[#ea580c] border border-[#2b2723]" />
            </div>
          ) : (
            <div className="w-2 h-2 bg-[#ea580c] border border-[#2b2723] mb-0.5" />
          )}
          {/* Head */}
          <div className="w-9 h-5 bg-[#38bdf8] border-2 border-[#2b2723] flex items-center justify-around px-1">
            <span className="w-1.5 h-1.5 bg-[#2b2723] block" />
            <span className="w-1.5 h-1.5 bg-[#2b2723] block" />
          </div>
          {/* Mouth/Body */}
          <div className="w-7 h-2.5 bg-[#10b981] border border-[#2b2723] flex items-center justify-center">
            <span className="text-[7px] font-pixel text-[#2b2723] font-bold">GUIDE</span>
          </div>
        </div>
        <span className="font-pixel text-[8px] text-[#2b2723] mt-1 tracking-wider">
          BOT.v2
        </span>
      </button>

      {/* Speech bubble with blur-masked state crossfade */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="font-pixel text-[9px] text-[#ea580c]">
            [INTERACTIVE GUIDE]
          </span>
          <span className="text-[10px] text-[#575049] font-mono">
            TIP {msgIndex + 1} OF {COMPANION_MESSAGES.length}
          </span>
        </div>
        <p
          className={`text-[#2b2723] font-vt tracking-wide text-lg sm:text-xl leading-snug transition-[filter,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isTransitioning ? "blur-[2px] opacity-60" : "blur-0 opacity-100"
          }`}
        >
          &ldquo;{COMPANION_MESSAGES[msgIndex]}&rdquo;
        </p>
        <button
          type="button"
          suppressHydrationWarning
          onClick={nextMessage}
          className="mt-1 text-[11px] font-mono text-[#2563eb] hover:text-[#1d4ed8] underline underline-offset-2 font-semibold cursor-pointer"
        >
          &gt; Next tip
        </button>
      </div>
    </aside>
  );
}
