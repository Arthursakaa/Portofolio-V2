"use client";

import React from "react";
import { retroSound } from "@/lib/audio";

interface MiniPixelDevProps {
  soundEnabled?: boolean;
  reducedMotion?: boolean;
}

export function MiniPixelDev({ soundEnabled, reducedMotion }: MiniPixelDevProps) {
  const handleClick = () => {
    if (soundEnabled) {
      retroSound.playKeypress();
    }
  };

  return (
    <div
      onClick={handleClick}
      title="Arthur is currently coding... (Click for mechanical click!)"
      className="inline-flex items-center justify-center bg-[#fffdf9] border-2 border-[#2b2723] px-2 py-1 shadow-[2px_2px_0_0_#2b2723] hover:shadow-[3px_3px_0_0_#ea580c] transition-[box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer select-none active:scale-95"
      aria-label="Retro pixel developer coding animation"
    >
      <svg
        viewBox="0 0 54 26"
        className="w-13 h-6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          .anim-type-l {
            animation: devTypeLeft 0.35s infinite ease-in-out alternate;
          }
          .anim-type-r {
            animation: devTypeRight 0.35s infinite ease-in-out alternate;
          }
          .anim-steam {
            animation: devSteam 1.2s infinite linear;
          }
          .anim-screen {
            animation: devScreenGlow 1.8s infinite ease-in-out;
          }
          @keyframes devTypeLeft {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-1.5px); }
          }
          @keyframes devTypeRight {
            0% { transform: translateY(-1.5px); }
            100% { transform: translateY(0px); }
          }
          @keyframes devSteam {
            0% { transform: translateY(0px); opacity: 0.9; }
            50% { transform: translateY(-2px); opacity: 0.5; }
            100% { transform: translateY(-4px); opacity: 0; }
          }
          @keyframes devScreenGlow {
            0%, 100% { fill: #38bdf8; }
            50% { fill: #67e8f9; }
          }
        `}</style>

        {/* Desk Line */}
        <rect x="0" y="22" width="54" height="4" fill="#2b2723" />
        <rect x="0" y="21" width="54" height="1" fill="#ded5c5" />

        {/* Developer Character */}
        {/* Hair / Head */}
        <rect x="9" y="3" width="12" height="4" fill="#2b2723" />
        <rect x="8" y="5" width="14" height="5" fill="#2b2723" />
        <rect x="9" y="7" width="12" height="6" fill="#fed7aa" />

        {/* Glasses (Cyan reflection) */}
        <rect x="15" y="8" width="5" height="3" fill="#2b2723" />
        <rect x="16" y="9" width="3" height="1" fill="#38bdf8" />

        {/* Hoodie Body (Orange - matches Arthur's palette) */}
        <rect x="7" y="13" width="16" height="9" fill="#ea580c" />
        <rect x="13" y="13" width="4" height="9" fill="#2b2723" />

        {/* Animated Left Hand */}
        <rect
          x="19"
          y="17"
          width="3"
          height="3"
          fill="#fed7aa"
          stroke="#2b2723"
          strokeWidth="0.8"
          className={reducedMotion ? undefined : "anim-type-l"}
        />

        {/* Laptop Base & Stand */}
        <rect x="22" y="19" width="16" height="3" fill="#2b2723" />
        <rect x="23" y="18" width="14" height="1" fill="#94a3b8" />

        {/* Laptop Screen with Animated Code Glow */}
        <rect
          x="26"
          y="7"
          width="12"
          height="12"
          fill="#2b2723"
          stroke="#2b2723"
          strokeWidth="1"
        />
        <rect
          x="27"
          y="8"
          width="10"
          height="10"
          fill="#38bdf8"
          className={reducedMotion ? undefined : "anim-screen"}
        />
        {/* Code Lines on Screen */}
        <rect x="28" y="10" width="6" height="1" fill="#0f172a" />
        <rect x="28" y="12" width="8" height="1" fill="#0f172a" />
        <rect x="30" y="14" width="5" height="1" fill="#10b981" />
        <rect x="28" y="16" width="4" height="1" fill="#0f172a" />

        {/* Animated Right Hand */}
        <rect
          x="23"
          y="17"
          width="3"
          height="3"
          fill="#fed7aa"
          stroke="#2b2723"
          strokeWidth="0.8"
          className={reducedMotion ? undefined : "anim-type-r"}
        />

        {/* Coffee Mug on Desk */}
        <rect x="44" y="15" width="6" height="7" fill="#fffdf9" stroke="#2b2723" strokeWidth="1" />
        <rect x="50" y="17" width="2" height="3" fill="#2b2723" />
        <rect x="46" y="15" width="2" height="2" fill="#ea580c" />

        {/* Animated Pixel Steam from Coffee */}
        {/* Steam is hidden when motion is off; a frozen puff would look like a glitch */}
        <g className={reducedMotion ? "hidden" : "anim-steam"}>
          <rect x="46" y="11" width="2" height="2" fill="#a8a29e" />
          <rect x="48" y="9" width="2" height="2" fill="#a8a29e" />
        </g>
      </svg>
    </div>
  );
}

