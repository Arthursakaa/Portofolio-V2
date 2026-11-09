"use client";

import { useState } from "react";
import { PixelArrowUpIcon, PixelSparkleIcon } from "./PixelIcons";
import { retroSound } from "@/lib/audio";
import { CatSleepSprite } from "@/components/sprites/CatSprites";
import { DARK_BG_PALETTE } from "@/components/sprites/spriteData";

interface FooterProps {
  soundEnabled: boolean;
}

export function Footer({ soundEnabled }: FooterProps) {
  // Sleeping cat wakes briefly on Back to Top (plan 018)
  const [wakeTick, setWakeTick] = useState(0);
  const [awake, setAwake] = useState(false);

  const scrollToTop = () => {
    if (soundEnabled) retroSound.playWarp();
    setAwake(true);
    setWakeTick((t) => t + 1);
    window.setTimeout(() => setAwake(false), 1200);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#2b2723] text-[#f4efe6] py-10 border-t-2 border-[#2b2723] relative z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Credits */}
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-pixel text-xs text-[#10b981] inline-flex items-center gap-2">
            <PixelSparkleIcon size={12} />
            <span>I GEDE ARTHUR SAKA DEWANTARA</span>
          </p>
          <p className="font-mono text-xs text-[#d6d3d1]">
            Computer Science @ BINUS University • Full-Stack &amp; AI Portfolio
          </p>
          <p className="font-mono text-[11px] text-[#a8a29e]">
            Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>

        <div className="flex items-end gap-4">
          {/* Sleeping cat */}
          <div aria-hidden="true" className="relative pb-1">
            {awake ? (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-pixel text-[10px] text-[#eab308]">!</span>
            ) : (
              <span className="footer-zzz absolute -top-6 right-0 font-pixel text-[8px] text-[#a8a29e]">
                <span>z</span>
                <span>z</span>
                <span>z</span>
              </span>
            )}
            <span key={wakeTick} className={`block ${wakeTick > 0 ? "sprite-hop" : ""}`}>
              <CatSleepSprite scale={3} palette={DARK_BG_PALETTE} />
            </span>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={scrollToTop}
            aria-label="Return to top of page"
            className="pixel-btn px-4 py-2 bg-[#f4efe6] text-[#2b2723] font-pixel text-[9px] hover:bg-white inline-flex items-center gap-2"
          >
            <PixelArrowUpIcon size={12} />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
