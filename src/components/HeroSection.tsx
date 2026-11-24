"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { portfolioData } from "@/data/portfolio";
import { PlayerCard } from "./PlayerCard";
import {
  PixelArrowRightIcon,
  PixelExternalIcon,
  PixelDownloadIcon,
} from "./PixelIcons";
import { retroSound } from "@/lib/audio";

gsap.registerPlugin(useGSAP);

const HERO_ROLES = [
  "Full-Stack Web Developer",
  "React Native & Expo Mobile Dev",
  "Go & Laravel Backend Engineer",
  "Applied AI & ML Integrator",
] as const;

interface HeroSectionProps {
  soundEnabled: boolean;
}

export function HeroSection({ soundEnabled }: HeroSectionProps) {
  const { profile, resume } = portfolioData;
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const [roleIdx, setRoleIdx] = useState(0);
  const [typedText, setTypedText] = useState<string>(HERO_ROLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const fullRole = HERO_ROLES[roleIdx];
    let delay = isDeleting ? 28 : 54;

    if (!isDeleting && typedText === fullRole) {
      delay = 1800;
    } else if (isDeleting && typedText === "") {
      delay = 280;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedText === fullRole) {
        setIsDeleting(true);
      } else if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setRoleIdx((prev) => (prev + 1) % HERO_ROLES.length);
      } else if (isDeleting) {
        setTypedText(fullRole.slice(0, Math.max(0, typedText.length - 1)));
      } else {
        setTypedText(fullRole.slice(0, typedText.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [roleIdx, typedText, isDeleting, shouldReduceMotion]);

  const displayRole = shouldReduceMotion
    ? "Full-Stack Web • Mobile • Backend • AI"
    : typedText;

  useGSAP(
    () => {
      if (
        typeof window === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.querySelector("[data-app-root]")?.classList.contains("reduce-motion")
      ) {
        return;
      }

      gsap.from("[data-hero-stat]", {
        y: 10,
        opacity: 0,
        duration: 0.32,
        stagger: 0.05,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });

      gsap.from("[data-hero-cta]", {
        y: 8,
        opacity: 0,
        duration: 0.28,
        stagger: 0.04,
        delay: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-20 border-b-2 border-[#2b2723] overflow-hidden"
    >
      {/* Decorative Retro Grid Background */}
      <div className="absolute inset-0 dot-matrix-bg opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Narrative & Hero Specs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clear Professional Badge */}
            <div className="inline-flex items-center gap-2 bg-[#fffdf9] border-2 border-[#2b2723] px-3 py-1.5 shadow-[2px_2px_0_0_#2b2723] stagger-enter">
              <span className="w-2.5 h-2.5 bg-[#10b981] border border-[#2b2723] inline-block" />
              <span className="font-pixel text-[9px] sm:text-[10px] text-[#2b2723] tracking-wider">
                SOFTWARE &amp; WEB DEVELOPER PORTFOLIO
              </span>
            </div>

            {/* Main Name Heading with Pixel Font */}
            <div className="space-y-2 stagger-enter stagger-delay-1">
              <p className="font-pixel text-xs sm:text-sm text-[#ea580c] tracking-widest">
                SOFTWARE • WEB • MOBILE • AI DEVELOPER
              </p>
              <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-[#2b2723] leading-snug tracking-tight drop-shadow-[2px_2px_0_#fffdf9]">
                {profile.fullName}
              </h1>
              <p className="font-vt text-2xl sm:text-3xl text-[#2563eb] tracking-wide pt-1">
                &gt; {profile.title}
              </p>

              {/* Interactive Retro Typewriter Role Cycler */}
              <div className="flex flex-wrap items-center gap-2 pt-1 min-h-[2.25rem]">
                <span className="font-mono text-xs font-bold text-[#ea580c]">
                  $ role --focus
                </span>
                <span className="inline-flex items-center bg-[#2b2723] text-[#fffdf9] border-2 border-[#2b2723] shadow-[2px_2px_0_0_#ea580c] px-2.5 py-0.5 font-vt text-xl sm:text-2xl tracking-wide min-h-[2rem]">
                  <span>{displayRole}</span>
                  <span
                    aria-hidden="true"
                    className="retro-cursor inline-block w-2 h-4 sm:h-5 bg-[#10b981] ml-1.5"
                  />
                </span>
              </div>
            </div>

            {/* Body Description - Clean, High-Contrast Typography */}
            <p className="text-base sm:text-lg text-[#2b2723] leading-relaxed max-w-xl font-normal stagger-enter stagger-delay-2">
              {profile.tagline}
            </p>

            {/* Quick Recruiter Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-w-2xl">
              <div data-hero-stat className="bg-[#fffdf9] border-2 border-[#2b2723] px-2.5 py-2 shadow-[2px_2px_0_0_#2b2723]">
                <p className="font-pixel text-[8px] text-[#575049]">UNIVERSITY</p>
                <p className="font-bold text-[11px] sm:text-xs text-[#2b2723] leading-tight mt-1">
                  BINUS University
                </p>
              </div>
              <div data-hero-stat className="bg-[#fffdf9] border-2 border-[#2b2723] px-2.5 py-2 shadow-[2px_2px_0_0_#2b2723]">
                <p className="font-pixel text-[8px] text-[#575049]">MAJOR</p>
                <p className="font-bold text-[11px] sm:text-xs text-[#2b2723] leading-tight mt-1">
                  Computer Science
                </p>
              </div>
              <div data-hero-stat className="bg-[#fffdf9] border-2 border-[#2b2723] px-2.5 py-2 shadow-[2px_2px_0_0_#2b2723]">
                <p className="font-pixel text-[8px] text-[#575049]">CORE STACK</p>
                <p className="font-bold text-[11px] sm:text-xs text-[#2b2723] leading-tight mt-1">
                  Next.js · Expo · Go · Laravel
                </p>
              </div>
              <div data-hero-stat className="bg-[#fffdf9] border-2 border-[#2b2723] px-2.5 py-2 shadow-[2px_2px_0_0_#2b2723]">
                <p className="font-pixel text-[8px] text-[#575049]">STATUS</p>
                <p className="font-bold text-[11px] sm:text-xs text-[#047857] leading-tight mt-1">
                  Open to Internships
                </p>
              </div>
            </div>

            {/* Clear Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                data-hero-cta
                href="#projects"
                onClick={() => soundEnabled && retroSound.playSelect()}
                className="pixel-btn px-5 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-pixel text-xs tracking-wider inline-flex items-center gap-2.5"
              >
                <span>View Projects</span>
                <PixelArrowRightIcon size={14} />
              </a>

              <a
                data-hero-cta
                href={profile.resumeUrl}
                download={resume.fileName}
                onClick={() => soundEnabled && retroSound.playCoin()}
                className="pixel-btn px-4 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-pixel text-xs tracking-wider inline-flex items-center gap-2"
                title="Download Arthur Saka's Curriculum Vitae (PDF)"
              >
                <PixelDownloadIcon size={14} />
                <span>Download CV</span>
              </a>

              <a
                data-hero-cta
                href="#about"
                onClick={() => soundEnabled && retroSound.playSelect()}
                className="pixel-btn px-5 py-3 bg-[#fffdf9] hover:bg-[#e9e2d5] text-[#2b2723] font-pixel text-xs tracking-wider inline-flex items-center gap-2"
              >
                <span>About &amp; Fit</span>
              </a>

              <a
                data-hero-cta
                href="#contact"
                onClick={() => soundEnabled && retroSound.playSelect()}
                className="pixel-btn px-4 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-pixel text-xs tracking-wider inline-flex items-center gap-2"
              >
                <span>Contact</span>
              </a>

              <a
                data-hero-cta
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEnabled && retroSound.playLaser()}
                className="pixel-btn px-4 py-3 bg-[#0a66c2] hover:bg-[#084e96] text-white font-pixel text-xs tracking-wider inline-flex items-center gap-2"
              >
                <span>LinkedIn</span>
                <PixelExternalIcon size={14} />
              </a>

              <a
                data-hero-cta
                href={profile.socials.githubRepos}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEnabled && retroSound.playLaser()}
                className="pixel-btn px-4 py-3 bg-[#ded5c5] hover:bg-[#cbbfab] text-[#2b2723] font-pixel text-xs tracking-wider inline-flex items-center gap-2"
              >
                <span>GitHub</span>
                <PixelExternalIcon size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Developer Profile Card (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <PlayerCard soundEnabled={soundEnabled} />
          </div>
        </div>
      </div>
    </section>
  );
}
