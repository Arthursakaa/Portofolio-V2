"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { portfolioData } from "@/data/portfolio";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";
import { TechIconBadge } from "./TechIcons";
import { PixelArrowRightIcon } from "./PixelIcons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface SkillUsageDetail {
  usage: string;
  projects: string[];
}

const SKILL_USAGE_MAP: Record<string, SkillUsageDetail> = {
  react: {
    usage: "Component architecture, interactive UI states, and App Router web apps.",
    projects: ["Portfolio V2", "EduBot"],
  },
  expo: {
    usage: "Cross-platform 7-screen mobile app with TypeScript, NativeWind, and Zustand.",
    projects: ["FitnessVals Mobile"],
  },
  ts: {
    usage: "Type-safe frontend, mobile, and API data modeling across web and native apps.",
    projects: ["FitnessVals Mobile", "Portfolio V2"],
  },
  tailwind: {
    usage: "Utility-first responsive layouts, custom retro design tokens, and NativeWind styling.",
    projects: ["FitnessVals", "DeBouquets", "EduBot", "Portfolio V2"],
  },
  vite: {
    usage: "Blade templating, fast Vite bundling, and Chart.js analytics dashboards.",
    projects: ["FitnessVals Web", "DeBouquets", "EduBot"],
  },
  laravel: {
    usage: "Multi-role MVC apps, Eloquent relational schemas, migrations, and Reverb WebSockets.",
    projects: ["FitnessVals Web", "DeBouquets"],
  },
  go: {
    usage: "JWT-protected Gin & GORM REST APIs, SQL-guarded bookings, and systems coursework.",
    projects: ["FitnessVals Backend"],
  },
  node: {
    usage: "Decoupled Express.js REST APIs with JWT auth, bcryptjs, Helmet, and rate limiting.",
    projects: ["EduBot"],
  },
  database: {
    usage: "Relational schema design, migrations, and cloud-hosted SQL databases (TiDB / MySQL).",
    projects: ["FitnessVals", "DeBouquets", "EduBot"],
  },
  api: {
    usage: "RESTful API architecture, JWT authentication, and live WebSocket event broadcasting.",
    projects: ["FitnessVals", "DeBouquets", "EduBot"],
  },
  python: {
    usage: "Machine learning pipelines, inference APIs, and data preprocessing scripts.",
    projects: ["EduBot"],
  },
  scikit: {
    usage: "DecisionTreeClassifier VAK learning-style prediction with score normalization.",
    projects: ["EduBot"],
  },
  ollama: {
    usage: "Local Vision & LLM meal analysis (minicpm-v) paired with an offline fallback engine.",
    projects: ["FitnessVals"],
  },
  data: {
    usage: "Tabular dataset cleaning, feature preparation, and numerical preprocessing for ML.",
    projects: ["EduBot"],
  },
  flask: {
    usage: "Lightweight Python microservice serving real-time ML inference over HTTP.",
    projects: ["EduBot"],
  },
  test: {
    usage: "Go unit and httptest endpoint tests covering JWT auth, AI service, and routes.",
    projects: ["FitnessVals Backend"],
  },
  git: {
    usage: "Branching, pull request reviews, and collaborative multi-repo workflows.",
    projects: ["FitnessVals", "DeBouquets", "EduBot"],
  },
  postman: {
    usage: "REST API endpoint testing, contract verification, and Zod request validation.",
    projects: ["FitnessVals", "EduBot"],
  },
  zustand: {
    usage: "Lightweight mobile client state management and Axios HTTP client integration.",
    projects: ["FitnessVals Mobile"],
  },
  cloud: {
    usage: "UI wireframing in Figma and production deployments across Vercel and Railway.",
    projects: ["EduBot", "Portfolio V2"],
  },
};

interface SkillsInventoryProps {
  soundEnabled: boolean;
}

export function SkillsInventory({ soundEnabled }: SkillsInventoryProps) {
  const { skills } = portfolioData;
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useGSAP(
    () => {
      if (
        shouldReduceMotion ||
        typeof window === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.querySelector("[data-app-root]")?.classList.contains("reduce-motion")
      ) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>("[data-skill-category]");
      cards.forEach((card, cardIdx) => {
        const chips = card.querySelectorAll<HTMLElement>("[data-skill-chip]");
        if (!chips.length) return;

        gsap.from(chips, {
          y: 10,
          opacity: 0,
          duration: 0.3,
          delay: cardIdx * 0.05,
          stagger: 0.035,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            once: true,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [shouldReduceMotion], revertOnUpdate: true }
  );

  const handleToggleSkill = (key: string) => {
    if (soundEnabled) retroSound.playSelect();
    setSelectedKey((prev) => (prev === key ? null : key));
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      data-reveal
      className="relative py-16 border-b-2 border-[#2b2723] bg-[#fffdf9]"
    >
      <HiddenCoin index={2} className="absolute bottom-5 right-6 sm:right-1/4" />
      <div className="max-w-6xl mx-auto px-4">
        {/* Clear Section Header */}
        <div
          data-reveal-item={0}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-10 pb-4 border-b-2 border-[#2b2723]"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#2563eb] inline-block border border-[#2b2723]" />
              <span className="font-pixel text-[10px] text-[#575049]">
                03 // TECHNICAL SKILLS
              </span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723] pixel-wipe">
              TECH STACK &amp; TOOLS
            </h2>
          </div>

          <div className="sm:text-right">
            <p className="font-mono text-xs text-[#575049] max-w-md">
              Languages, frameworks, databases, and developer tools I use to build and ship software.
            </p>
            <p className="font-pixel text-[8px] text-[#ea580c] mt-1.5">
              CLICK ANY ITEM TO INSPECT PROJECT USAGE
            </p>
          </div>
        </div>

        {/* 2x2 Category Skill Cards (spacious layout so tech names never truncate) */}
        <div data-reveal className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((category, idx) => (
            <div
              key={category.name}
              data-reveal-item={idx}
              data-skill-category
              className="bg-[#f4efe6] pixel-border p-5 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="border-b-2 border-[#2b2723] pb-2.5 mb-3.5 flex items-end justify-between gap-2">
                  <div>
                    <span className="font-pixel text-[8px] text-[#ea580c] block">
                      CATEGORY 0{idx + 1}
                    </span>
                    <h3 className="font-pixel text-xs sm:text-sm text-[#2b2723] mt-1">
                      {category.name}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#575049]">
                    {category.slot}
                  </span>
                </div>

                {/* Clickable Items in Category */}
                <div className="space-y-2.5">
                  {category.items.map((item) => {
                    const isSelected = selectedKey === item.iconKey;
                    const detail = SKILL_USAGE_MAP[item.iconKey];

                    return (
                      <div
                        key={item.name}
                        data-skill-chip
                        className={`border-2 border-[#2b2723] shadow-[2px_2px_0_0_#2b2723] transition-colors duration-150 ${
                          isSelected
                            ? "bg-[#fff8ef] border-l-4 border-l-[#ea580c]"
                            : "bg-[#fffdf9] pixel-card-interactive"
                        }`}
                      >
                        <button
                          type="button"
                          suppressHydrationWarning
                          aria-expanded={isSelected}
                          onMouseEnter={() =>
                            soundEnabled && retroSound.playBlip(600, "square", 0.02)
                          }
                          onClick={() => handleToggleSkill(item.iconKey)}
                          className="w-full p-2.5 sm:px-3 sm:py-2.5 flex items-center justify-between gap-3 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <TechIconBadge iconKey={item.iconKey} size="md" />
                            <span className="font-bold text-xs sm:text-[13px] text-[#2b2723] leading-snug">
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-pixel text-[7px] sm:text-[8px] text-[#575049] bg-[#e9e2d5] px-2 py-0.5 border border-[#2b2723]/30">
                              {item.tag}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`font-pixel text-[9px] w-4 text-center transition-colors ${
                                isSelected ? "text-[#ea580c]" : "text-[#575049]"
                              }`}
                            >
                              {isSelected ? "-" : "+"}
                            </span>
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isSelected && detail ? (
                            <motion.div
                              key={`${item.iconKey}-detail`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 pt-2 border-t border-dashed border-[#2b2723]/25 bg-[#f4efe6]/70 space-y-2">
                                <p className="text-xs text-[#2b2723] leading-relaxed">
                                  {detail.usage}
                                </p>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-pixel text-[7px] text-[#575049]">
                                      USED IN:
                                    </span>
                                    {detail.projects.map((proj) => (
                                      <span
                                        key={proj}
                                        className="font-mono text-[10px] font-bold bg-[#fffdf9] text-[#2b2723] border border-[#2b2723] px-1.5 py-0.5"
                                      >
                                        {proj}
                                      </span>
                                    ))}
                                  </div>
                                  <a
                                    href="#projects"
                                    onClick={() => soundEnabled && retroSound.playSelect()}
                                    className="font-pixel text-[8px] text-[#ea580c] hover:text-[#c2410c] inline-flex items-center gap-1"
                                  >
                                    <span>PROJECTS</span>
                                    <PixelArrowRightIcon size={10} />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom summary */}
              <div className="mt-4 pt-2.5 border-t border-[#2b2723]/30 flex justify-between text-[9px] font-pixel text-[#575049]">
                <span>{category.items.length} TECHNOLOGIES</span>
                <span className="text-[#047857]">ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
