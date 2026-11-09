"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { PixelExternalIcon, PixelSparkleIcon, PixelCodeIcon } from "./PixelIcons";
import { ProjectVisualBanner } from "./ProjectVisuals";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";

interface ProjectsSectionProps {
  soundEnabled: boolean;
}

const CATEGORIES = ["All Projects", "Full-Stack", "AI & ML", "Frontend"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export function ProjectsSection({ soundEnabled }: ProjectsSectionProps) {
  const { projects } = portfolioData;
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All Projects");
  const [expandedArchIds, setExpandedArchIds] = useState<Record<string, boolean>>({});

  const toggleCardView = (id: string) => {
    if (soundEnabled) retroSound.playToggle(!expandedArchIds[id]);
    setExpandedArchIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "All Projects") return true;
    if (activeFilter === "Full-Stack") {
      return (
        p.category.toLowerCase().includes("full-stack") ||
        p.category.toLowerCase().includes("commerce")
      );
    }
    if (activeFilter === "AI & ML") {
      return p.category.toLowerCase().includes("ai");
    }
    if (activeFilter === "Frontend") {
      return p.category.toLowerCase().includes("frontend");
    }
    return true;
  });

  return (
    <section id="projects" data-reveal className="relative py-16 border-b-2 border-[#2b2723] bg-[#f4efe6]">
      <HiddenCoin index={1} className="absolute bottom-5 left-6 sm:left-14" />
      <div className="max-w-6xl mx-auto px-4">
        {/* Clear Section Header */}
        <div data-reveal-item={0} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-[#2b2723]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#10b981] inline-block border border-[#2b2723]" />
              <span className="font-pixel text-[10px] text-[#575049]">
                02 // SELECTED PROJECTS
              </span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723] pixel-wipe">
              FEATURED ENGINEERING WORK
            </h2>
          </div>

          {/* Interactive Category Filter Buttons */}
          <div
            className="flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Filter projects by category"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                suppressHydrationWarning
                role="tab"
                aria-selected={activeFilter === cat}
                onClick={() => {
                  if (soundEnabled) retroSound.playSelect();
                  setActiveFilter(cat);
                }}
                className={`pixel-btn px-3 py-1.5 font-pixel text-[9px] ${
                  activeFilter === cat
                    ? "bg-[#2b2723] text-[#fffdf9]"
                    : "bg-[#fffdf9] text-[#2b2723] hover:bg-[#e9e2d5]"
                }`}
              >
                {cat}
              </button>
            ))}

            <a
              href={portfolioData.profile.socials.githubRepos}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEnabled && retroSound.playLaser()}
              className="pixel-btn px-3 py-1.5 bg-[#ea580c] font-pixel text-[9px] text-white hover:bg-[#c2410c] inline-flex items-center gap-1.5"
            >
              <span>All GitHub Repos</span>
              <PixelExternalIcon size={12} />
            </a>
          </div>
        </div>

        {/* Project Grid with Visual Illustrations & Interactive Architecture Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredProjects.map((project, index) => {
            const showArch = Boolean(expandedArchIds[project.id]);
            return (
              <div key={project.id} data-reveal data-reveal-item={index % 2} className="h-full">
              <article className="h-full bg-[#fffdf9] pixel-border-lg pixel-card-interactive flex flex-col justify-between overflow-hidden">
                <div>
                  {/* Top Visual Preview Banner / Interactive Architecture Toggle */}
                  <div className="relative h-48 w-full border-b-2 border-[#2b2723] bg-[#1e293b] overflow-hidden">
                    {/* Both layers stay mounted and cross-fade, so rapid toggling retargets instead of hard-cutting */}
                    <div
                      aria-hidden={showArch}
                      className={`absolute inset-0 transition-[opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        showArch ? "opacity-0 blur-[2px] pointer-events-none" : "opacity-100 blur-0"
                      }`}
                    >
                      <ProjectVisualBanner projectId={project.id} />
                    </div>

                    <div
                      aria-hidden={!showArch}
                      className={`absolute inset-0 w-full h-full bg-[#2b2723] text-[#f4efe6] p-4 flex flex-col justify-center font-mono text-xs overflow-y-auto transition-[opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        showArch ? "opacity-100 blur-0" : "opacity-0 blur-[2px] pointer-events-none"
                      }`}
                    >
                      <p className="font-pixel text-[9px] text-[#10b981] mb-2">
                        SYSTEM ARCHITECTURE &amp; KEY DELIVERABLES:
                      </p>
                      <ul className="space-y-1.5 list-disc list-inside text-xs text-[#e9e2d5]">
                        {project.highlights.map((h, i) => (
                          <li key={i} className="leading-snug">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Mode Switcher inside Banner */}
                    <div className="absolute bottom-2 right-2 z-10">
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => toggleCardView(project.id)}
                        className="pixel-btn px-2.5 py-1 text-[8px] font-pixel bg-[#fffdf9] text-[#2b2723] hover:bg-[#ea580c] hover:text-white"
                      >
                        {showArch ? "View Visual Preview" : "View Architecture Notes"}
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="font-pixel text-[8px] bg-[#2b2723] text-[#fffdf9] px-2 py-0.5">
                        PROJECT 0{index + 1}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-[8px] text-[#ea580c] bg-[#ea580c]/10 border border-[#ea580c] px-1.5 py-0.5">
                          {project.category}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-[#575049]">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-pixel text-base sm:text-lg text-[#2b2723] mb-2">
                      {project.title}
                    </h3>

                    <p className="text-sm text-[#2b2723] leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Bottom: Stack & Links */}
                <div className="px-5 pb-5 pt-3 border-t-2 border-[#2b2723]/15 space-y-4 bg-[#f4efe6]/50">
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-[#fffdf9] text-[#2b2723] border border-[#2b2723]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* External Action Links */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEnabled && retroSound.playLaser()}
                      className="pixel-btn px-3.5 py-2 bg-[#2b2723] text-[#fffdf9] font-pixel text-[9px] hover:bg-[#3d3732] inline-flex items-center gap-1.5"
                    >
                      <PixelCodeIcon size={12} />
                      <span>Source Code</span>
                    </a>

                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEnabled && retroSound.playPowerUp()}
                        className="pixel-btn px-3.5 py-2 bg-[#10b981] text-white font-pixel text-[9px] hover:bg-[#059669] inline-flex items-center gap-1.5"
                      >
                        <PixelSparkleIcon size={12} />
                        <span>Live Demo</span>
                      </a>
                    ) : null}

                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => toggleCardView(project.id)}
                      className="pixel-btn px-3 py-2 bg-[#fffdf9] text-[#2b2723] font-pixel text-[9px] hover:bg-[#e9e2d5]"
                    >
                      {showArch ? "Hide Details" : "Key Highlights"}
                    </button>
                  </div>
                </div>
              </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
