"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { EngineeringPillarIllustration } from "./ProjectVisuals";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";

interface AboutSectionProps {
  soundEnabled: boolean;
}

const PILLARS = [
  {
    id: "fullstack" as const,
    title: "Full-Stack Web & Mobile",
    subtitle: "React • Next.js • React Native • Expo",
    description:
      "Building responsive web applications and cross-platform mobile apps backed by clean component architecture, TypeScript, and structured state management.",
    deliverables: ["Responsive Web Apps", "Cross-Platform Mobile", "SSR & State Management"],
  },
  {
    id: "backend" as const,
    title: "Backend & Service Architecture",
    subtitle: "Laravel • Go (Gin) • Express • MySQL",
    description:
      "Designing relational database schemas, JWT-secured RESTful APIs, automated Go tests, and real-time event broadcasting with WebSockets.",
    deliverables: ["REST API & Auth", "Database Modeling", "Real-Time WebSockets"],
  },
  {
    id: "ai" as const,
    title: "AI & Applied Machine Learning",
    subtitle: "Python • scikit-learn • Ollama • Flask",
    description:
      "Training supervised classification models and integrating local Vision/LLM inference and fallback engines directly into user-facing web and mobile products.",
    deliverables: ["Predictive Models", "Ollama Vision / LLM", "ML API Integration"],
  },
];

const ROLE_HIGHLIGHTS = [
  {
    role: "Full-Stack / Mobile Intern",
    whyFit:
      "Ready to own features end-to-end across web and mobile. Experienced connecting relational MySQL schemas, structuring RESTful APIs in Go and Laravel, and building responsive React, Next.js, and React Native (Expo) interfaces.",
    keyTech: ["Next.js / React", "React Native & Expo", "TypeScript", "Laravel (PHP)", "Go (Gin)"],
  },
  {
    role: "Frontend / Mobile Intern",
    whyFit:
      "Focused on component architecture, responsive UI/UX, and smooth client state. Experienced with modern React 19, Next.js App Router, React Native (Expo), TypeScript, and Tailwind CSS.",
    keyTech: ["React & Next.js", "React Native & Expo", "TypeScript", "Tailwind CSS", "Responsive UI/UX"],
  },
  {
    role: "Backend / AI Engineer Intern",
    whyFit:
      "Comfortable modeling relational schemas, writing Go (Gin, GORM) REST services with unit/HTTP tests, and integrating Python ML or Ollama Vision/LLM inference with reliable fallback handling.",
    keyTech: ["Go (Gin / GORM)", "Go Testing", "Python & Flask", "Ollama / scikit-learn", "MySQL & WebSockets"],
  },
];

export function AboutSection({ soundEnabled }: AboutSectionProps) {
  const { profile } = portfolioData;
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);

  return (
    <section id="about" data-reveal className="relative py-16 border-b-2 border-[#2b2723] bg-[#fffdf9]">
      <HiddenCoin index={0} className="absolute top-5 right-6 sm:right-12" />
      <div className="max-w-6xl mx-auto px-4">
        {/* Clear Section Header for HRD / Recruiters */}
        <div data-reveal-item={0} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b-2 border-[#2b2723]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#ea580c] inline-block border border-[#2b2723]" />
              <span className="font-pixel text-[10px] text-[#575049]">
                01 // ABOUT & CAPABILITIES
              </span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723] pixel-wipe">
              WHAT I DO & BRING TO A TEAM
            </h2>
          </div>
          <p className="font-mono text-xs text-[#575049] max-w-md">
            Overview of my core engineering skills across Full-Stack Web, Mobile, Backend, and AI — ready for internships where these technologies fit.
          </p>
        </div>

        {/* 3 Visual Engineering Pillars (With Thematic Pixel SVG Illustrations) */}
        <div data-reveal className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {PILLARS.map((pillar, i) => (
            <div key={pillar.id} data-reveal-item={i} className="h-full">
            <div className="h-full bg-[#f4efe6] pixel-border p-5 flex flex-col justify-between pixel-card-interactive">
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <EngineeringPillarIllustration type={pillar.id} />
                  <div>
                    <h3 className="font-pixel text-xs sm:text-sm text-[#2b2723] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="font-mono text-[11px] text-[#2563eb] font-semibold mt-1">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#2b2723] leading-relaxed mb-4">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#2b2723]/20 flex flex-wrap gap-1.5">
                {pillar.deliverables.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] font-mono bg-[#fffdf9] px-2 py-0.5 border border-[#2b2723] text-[#2b2723] font-medium"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
            </div>
          ))}
        </div>

        {/* Interactive HRD / Recruiter Role Matcher */}
        <div data-reveal data-reveal-item={0} className="bg-[#f4efe6] pixel-border-lg p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-5 border-b-2 border-[#2b2723]">
            <div>
              <span className="font-pixel text-[9px] text-[#ea580c] block mb-1">
                INTERACTIVE RECRUITER BRIEF
              </span>
              <h3 className="font-pixel text-sm sm:text-base text-[#2b2723]">
                Hiring for an Internship? Select a Role to See My Fit:
              </h3>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Target Internship Roles">
              {ROLE_HIGHLIGHTS.map((item, idx) => (
                <button
                  key={item.role}
                  type="button"
                  suppressHydrationWarning
                  role="tab"
                  aria-selected={selectedRoleIdx === idx}
                  onClick={() => {
                    if (soundEnabled) retroSound.playSelect();
                    setSelectedRoleIdx(idx);
                  }}
                  className={`pixel-btn px-3 py-2 font-pixel text-[9px] ${
                    selectedRoleIdx === idx
                      ? "bg-[#2b2723] text-[#fffdf9]"
                      : "bg-[#fffdf9] text-[#2b2723] hover:bg-[#e9e2d5]"
                  }`}
                >
                  {item.role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <p className="font-mono text-xs font-bold text-[#047857] uppercase">
                Why I Match: {ROLE_HIGHLIGHTS[selectedRoleIdx].role}
              </p>
              <p className="text-sm sm:text-base text-[#2b2723] leading-relaxed">
                {ROLE_HIGHLIGHTS[selectedRoleIdx].whyFit}
              </p>
              <p className="text-xs text-[#575049] pt-1 leading-relaxed">
                {profile.about}
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#fffdf9] border-2 border-[#2b2723] p-4 shadow-[3px_3px_0_0_#2b2723]">
              <p className="font-pixel text-[9px] text-[#575049] mb-2.5">
                CORE COMPETENCIES FOR THIS ROLE:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {ROLE_HIGHLIGHTS[selectedRoleIdx].keyTech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 bg-[#10b981]/15 border border-[#2b2723] text-xs font-mono font-bold text-[#2b2723]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-[#2b2723]/20 flex items-center justify-between text-xs font-mono">
                <span className="text-[#575049]">Education:</span>
                <span className="font-bold text-[#2b2723]">BINUS University (CS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

