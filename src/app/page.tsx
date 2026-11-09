"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { HeaderNav } from "@/components/HeaderNav";
import { HeroSection } from "@/components/HeroSection";
import { PixelCompanion } from "@/components/PixelCompanion";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsInventory } from "@/components/SkillsInventory";
import { TimelineSection } from "@/components/TimelineSection";
import { ResumeSection } from "@/components/ResumeSection";
import { ContactTerminal } from "@/components/ContactTerminal";
import { Footer } from "@/components/Footer";
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
import { ArcadeToast } from "@/components/arcade/ArcadeToast";
import { retroSound } from "@/lib/audio";

// OS "reduce motion" preference, read as an external store (no setState in an effect)
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
// Server render has no media query; the client corrects it right after hydration
const getServerReducedMotion = () => false;

export default function Home() {
  const [scanlines, setScanlines] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const systemReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion
  );
  // The ANIM toggle overrides the OS setting until the OS setting changes again.
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [lastSystemReducedMotion, setLastSystemReducedMotion] = useState(systemReducedMotion);
  if (lastSystemReducedMotion !== systemReducedMotion) {
    // React's "adjust state while rendering" pattern: drop the override when the OS value changes
    setLastSystemReducedMotion(systemReducedMotion);
    setMotionOverride(null);
  }
  const reducedMotion = motionOverride ?? systemReducedMotion;

  const setReducedMotion = (next: boolean | ((prev: boolean) => boolean)) => {
    setMotionOverride(typeof next === "function" ? next(reducedMotion) : next);
  };

  // Global SFX Safety Net: Ensures every button, link, and interactive widget triggers sound when SFX is ON
  useEffect(() => {
    if (!soundEnabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "button, a, input[type='button'], [role='button'], [role='tab'], .pixel-btn"
      );
      if (!target) return;
      if (target.getAttribute("data-sfx") === "none") return;

      // playSelect() has built-in throttling, so if a dedicated sound already fired (coin, laser, toggle), it won't duplicate
      retroSound.playSelect();
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, [soundEnabled]);

  return (
    <div
      data-app-root
      className={`min-h-screen flex flex-col relative selection:bg-[#ea580c] selection:text-white ${
        reducedMotion ? "reduce-motion" : ""
      }`}
    >
      <ScrollRevealObserver />
      <ArcadeToast />

      {/* Optional CRT Scanlines Screen Overlay */}
      {scanlines ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 scanlines-overlay"
        />
      ) : null}

      {/* Top Navigation Bar */}
      <HeaderNav
        scanlines={scanlines}
        setScanlines={setScanlines}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        <HeroSection soundEnabled={soundEnabled} />

        {/* Interactive Guide Strip */}
        <div className="max-w-6xl mx-auto px-4 -mt-6 sm:-mt-8 mb-4 relative z-20">
          <PixelCompanion
            reducedMotion={reducedMotion}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* 01. About, Capabilities & Interactive Role Matcher */}
        <AboutSection soundEnabled={soundEnabled} />

        {/* 02. Selected Projects with Visual Illustrations & Architecture Notes */}
        <ProjectsSection soundEnabled={soundEnabled} />

        {/* 03. Technical Skills & Tools */}
        <SkillsInventory soundEnabled={soundEnabled} />

        {/* 04. Experience & Education Timeline */}
        <TimelineSection soundEnabled={soundEnabled} />

        {/* 05. Curriculum Vitae & Official Documentation */}
        <ResumeSection soundEnabled={soundEnabled} />

        {/* 06. Contact & Interactive Terminal */}
        <ContactTerminal soundEnabled={soundEnabled} />
      </main>

      {/* Footer */}
      <Footer soundEnabled={soundEnabled} />
    </div>
  );
}
