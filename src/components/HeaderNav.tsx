"use client";

import { retroSound } from "@/lib/audio";
import { MiniPixelDev } from "./MiniPixelDev";

interface HeaderNavProps {
  scanlines: boolean;
  setScanlines: (v: boolean | ((prev: boolean) => boolean)) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean | ((prev: boolean) => boolean)) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean | ((prev: boolean) => boolean)) => void;
}

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
] as const;

export function HeaderNav({
  scanlines,
  setScanlines,
  soundEnabled,
  setSoundEnabled,
  reducedMotion,
  setReducedMotion,
}: HeaderNavProps) {
  const toggleSound = () => {
    const next = !soundEnabled;
    if (next) {
      retroSound.setEnabled(true);
      retroSound.playPowerUp();
      setSoundEnabled(true);
    } else {
      retroSound.playPowerDown();
      setTimeout(() => {
        retroSound.setEnabled(false);
        setSoundEnabled(false);
      }, 160);
    }
  };

  return (
    <header className="relative sm:sticky top-0 z-40 bg-[#f4efe6]/95 backdrop-blur-sm border-b-2 border-[#2b2723] px-3 sm:px-4 py-2">
      {/* Below xl the full row (brand + nav + toggles) does not fit, so brand and
          toggles share the first row and the nav drops to its own row instead of
          being clipped. flex-wrap is the failsafe if fonts render wider. */}
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-2.5">
        {/* Brand + Mini Pixel Developer Animation */}
        <div className="order-1 flex items-center gap-2.5 sm:gap-3 shrink-0">
          <a
            href="#"
            onClick={() => soundEnabled && retroSound.playSelect()}
            className="flex items-center gap-2 group"
          >
            <span className="w-3 h-3 bg-[#10b981] border border-[#2b2723] inline-block" />
            <span className="font-pixel text-xs text-[#2b2723] font-bold tracking-wider group-hover:text-[#ea580c] transition-colors">
              ARTHUR SAKA
            </span>
          </a>

          {/* Mini Pixel Dev Animation (No Side Text, Perfectly Theme-Matched) */}
          <div className="border-l-2 border-[#2b2723]/30 pl-2.5 sm:pl-3 flex items-center">
            <MiniPixelDev soundEnabled={soundEnabled} reducedMotion={reducedMotion} />
          </div>
        </div>

        {/* Clear, Intuitive Navigation Menu - Scrollbar Hidden on All Devices */}
        <nav
          aria-label="Main Navigation"
          className="order-3 xl:order-2 w-full xl:w-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pt-0.5 pb-1 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => soundEnabled && retroSound.playSelect()}
              className="pixel-btn px-2.5 py-1.5 text-[10px] font-pixel bg-[#fffdf9] hover:bg-[#e9e2d5] text-[#2b2723] whitespace-nowrap shrink-0"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Retro Experience Toggles */}
        <div className="order-2 xl:order-3 ml-auto xl:ml-0 flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleSound}
            title={`Sound FX: ${soundEnabled ? "ON" : "OFF"}`}
            aria-label="Toggle Sound Effects"
            aria-pressed={soundEnabled}
            className={`pixel-btn px-2 py-1 text-[9px] font-pixel shrink-0 min-w-[83px] text-center ${
              soundEnabled
                ? "bg-[#10b981] text-white"
                : "bg-[#e9e2d5] text-[#575049]"
            }`}
          >
            SFX:{soundEnabled ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              if (soundEnabled) retroSound.playToggle(!scanlines);
              setScanlines((p) => !p);
            }}
            title={`CRT Scanlines: ${scanlines ? "ON" : "OFF"}`}
            aria-label="Toggle CRT Scanline Effect"
            aria-pressed={scanlines}
            className={`pixel-btn px-2 py-1 text-[9px] font-pixel shrink-0 min-w-[83px] text-center ${
              scanlines
                ? "bg-[#ea580c] text-white"
                : "bg-[#e9e2d5] text-[#575049]"
            }`}
          >
            CRT:{scanlines ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              if (soundEnabled) retroSound.playToggle(!reducedMotion);
              setReducedMotion((p) => !p);
            }}
            title={`Animations: ${reducedMotion ? "OFF" : "ON"}`}
            aria-label="Toggle Motion Animations"
            aria-pressed={!reducedMotion}
            className={`pixel-btn px-2 py-1 text-[9px] font-pixel shrink-0 min-w-[92px] text-center ${
              !reducedMotion
                ? "bg-[#2563eb] text-white"
                : "bg-[#e9e2d5] text-[#575049]"
            }`}
          >
            ANIM:{reducedMotion ? "OFF" : "ON"}
          </button>
        </div>
      </div>

      {/* Scroll progress "XP bar": fills in 48 steps as the page scrolls (globals.css .xp-bar) */}
      <div aria-hidden="true" className="xp-bar absolute inset-x-0 -bottom-[2px] h-[3px] bg-[#ea580c]" />
    </header>
  );
}
