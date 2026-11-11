"use client";

import { useState, useEffect } from "react";
import { portfolioData, type Project, type ProjectImage } from "@/data/portfolio";
import { PixelExternalIcon, PixelSparkleIcon, PixelCodeIcon, PixelPlayIcon } from "./PixelIcons";
import { ProjectVisualBanner } from "./ProjectVisuals";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";

interface ProjectsSectionProps {
  soundEnabled: boolean;
}

const CATEGORIES = ["All Projects", "Full-Stack", "AI & ML", "Frontend"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

function getProjectGallery(project: Project): ProjectImage[] {
  if (project.images && project.images.length > 0) {
    return project.images;
  }
  if (project.imageUrl) {
    return [{ src: project.imageUrl, label: "UI Preview", bg: "#edf4fd" }];
  }
  return [];
}

export function ProjectsSection({ soundEnabled }: ProjectsSectionProps) {
  const { projects } = portfolioData;
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All Projects");
  const [expandedArchIds, setExpandedArchIds] = useState<Record<string, boolean>>({});
  const [activeSlideById, setActiveSlideById] = useState<Record<string, number>>({});
  const [previewModal, setPreviewModal] = useState<{ project: Project; slideIndex: number } | null>(null);

  useEffect(() => {
    if (!previewModal) return;
    const gallery = getProjectGallery(previewModal.project);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (soundEnabled) retroSound.playSelect();
        setPreviewModal(null);
      } else if (e.key === "ArrowLeft" && gallery.length > 1) {
        if (soundEnabled) retroSound.playSelect();
        setPreviewModal((prev) =>
          prev
            ? {
              ...prev,
              slideIndex: (prev.slideIndex - 1 + gallery.length) % gallery.length,
            }
            : null
        );
      } else if (e.key === "ArrowRight" && gallery.length > 1) {
        if (soundEnabled) retroSound.playSelect();
        setPreviewModal((prev) =>
          prev
            ? {
              ...prev,
              slideIndex: (prev.slideIndex + 1) % gallery.length,
            }
            : null
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewModal, soundEnabled]);

  const toggleCardView = (id: string) => {
    if (soundEnabled) retroSound.playToggle(!expandedArchIds[id]);
    setExpandedArchIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stepSlide = (projectId: string, total: number, delta: number) => {
    if (total <= 1) return;
    if (soundEnabled) retroSound.playSelect();
    setActiveSlideById((prev) => {
      const curr = prev[projectId] ?? 0;
      return { ...prev, [projectId]: (curr + delta + total) % total };
    });
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
                className={`pixel-btn px-3 py-1.5 font-pixel text-[9px] ${activeFilter === cat
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
            const gallery = getProjectGallery(project);
            const activeSlideIdx = activeSlideById[project.id] ?? 0;
            const currentSlide = gallery[activeSlideIdx];

            return (
              <div key={project.id} data-reveal data-reveal-item={index % 2} className="h-full">
                <article className="h-full bg-[#fffdf9] pixel-border-lg pixel-card-interactive flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Top Visual Preview Banner / Interactive Architecture Toggle */}
                    <div className="group/banner relative h-52 sm:h-56 w-full border-b-2 border-[#2b2723] bg-[#1e293b] overflow-hidden">
                      {/* Both layers stay mounted and cross-fade, so rapid toggling retargets instead of hard-cutting */}
                      <div
                        aria-hidden={showArch}
                        className={`absolute inset-0 transition-[opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${showArch ? "opacity-0 blur-[2px] pointer-events-none" : "opacity-100 blur-0"
                          }`}
                      >
                        <ProjectVisualBanner
                          projectId={project.id}
                          imageUrl={currentSlide?.src}
                          imageBg={currentSlide?.bg}
                          title={
                            currentSlide
                              ? `${project.title} — ${currentSlide.label}`
                              : project.title
                          }
                        />
                      </div>

                      {/* Clickable Enlarge Overlay when Screenshot Preview is Visible */}
                      {gallery.length > 0 && !showArch ? (
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => {
                            if (soundEnabled) retroSound.playSelect();
                            setPreviewModal({ project, slideIndex: activeSlideIdx });
                          }}
                          aria-label={`Enlarge ${project.title} screenshot (${currentSlide.label})`}
                          title="Click to inspect full screenshot"
                          className="absolute inset-0 z-10 w-full h-full cursor-zoom-in bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ea580c]"
                        >
                          <span className="sr-only">Enlarge {project.title} screenshot</span>
                        </button>
                      ) : null}

                      <div
                        aria-hidden={!showArch}
                        className={`absolute inset-0 w-full h-full bg-[#2b2723] text-[#f4efe6] p-4 flex flex-col justify-center font-mono text-xs overflow-y-auto transition-[opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${showArch ? "opacity-100 blur-0 z-10" : "opacity-0 blur-[2px] pointer-events-none"
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

                      {/* Multi-Screenshot Slide Controls (Bottom Left) */}
                      {gallery.length > 1 && !showArch ? (
                        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 bg-[#fffdf9]/95 border-2 border-[#2b2723] px-1.5 py-0.5 shadow-[2px_2px_0_0_#2b2723]">
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => stepSlide(project.id, gallery.length, -1)}
                            aria-label={`Previous ${project.title} screenshot`}
                            className="font-pixel text-[8px] px-1 py-0.5 text-[#2b2723] hover:bg-[#ea580c] hover:text-white cursor-pointer"
                          >
                            &lt;
                          </button>
                          <span className="font-pixel text-[7.5px] text-[#2b2723] px-0.5 whitespace-nowrap">
                            {activeSlideIdx + 1}/{gallery.length}
                            <span className="hidden lg:inline text-[#575049]">
                              {" "}
                              &middot; {currentSlide.label}
                            </span>
                          </span>
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => stepSlide(project.id, gallery.length, 1)}
                            aria-label={`Next ${project.title} screenshot`}
                            className="font-pixel text-[8px] px-1 py-0.5 text-[#2b2723] hover:bg-[#ea580c] hover:text-white cursor-pointer"
                          >
                            &gt;
                          </button>
                        </div>
                      ) : null}

                      {/* Interactive Mode Switcher inside Banner */}
                      <div className="absolute bottom-2 right-2 z-20">
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

                      {project.videoUrl ? (
                        <a
                          href={project.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Watch project demo video on YouTube"
                          onClick={() => soundEnabled && retroSound.playPowerUp()}
                          className="pixel-btn px-3.5 py-2 bg-[#ea580c] text-white font-pixel text-[9px] hover:bg-[#c2410c] inline-flex items-center gap-1.5"
                        >
                          <PixelPlayIcon size={12} />
                          <span>Video Demo</span>
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

      {/* Full-Resolution Project Screenshot Lightbox Modal */}
      {previewModal ? (
        (() => {
          const modalGallery = getProjectGallery(previewModal.project);
          const activeSlide = modalGallery[previewModal.slideIndex] ?? modalGallery[0];
          if (!activeSlide) return null;

          return (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-preview-title"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b2723]/75 backdrop-blur-xs animate-confirm-pop"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  if (soundEnabled) retroSound.playSelect();
                  setPreviewModal(null);
                }
              }}
            >
              <div className="w-full max-w-4xl bg-[#fffdf9] pixel-border-lg p-5 sm:p-6 max-h-[92vh] overflow-y-auto no-scrollbar relative shadow-[6px_6px_0_0_#2b2723]">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-3 border-b-2 border-[#2b2723] pb-3 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-pixel text-[8px] bg-[#ea580c] text-[#fffdf9] px-2 py-0.5 border border-[#2b2723]">
                        {previewModal.project.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#575049]">
                        {activeSlide.label} ({previewModal.slideIndex + 1}/{modalGallery.length})
                      </span>
                    </div>
                    <h3
                      id="project-preview-title"
                      className="font-pixel text-xs sm:text-sm text-[#2b2723] leading-snug"
                    >
                      {previewModal.project.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      if (soundEnabled) retroSound.playSelect();
                      setPreviewModal(null);
                    }}
                    aria-label="Close project screenshot preview"
                    className="pixel-btn px-2.5 py-1 bg-[#f4efe6] hover:bg-[#e9e2d5] text-[#2b2723] font-pixel text-[9px] shrink-0"
                  >
                    [✕ ESC]
                  </button>
                </div>

                {/* Large Screenshot Viewport */}
                <div
                  className="border-2 border-[#2b2723] p-2 sm:p-3 mb-4 flex items-center justify-center"
                  style={{ backgroundColor: activeSlide.bg ?? "#f4efe6" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeSlide.src}
                    alt={`${previewModal.project.title} — ${activeSlide.label}`}
                    className="w-full max-h-[60vh] object-contain"
                  />
                </div>

                {/* Screen Switcher Tabs when Multiple Screenshots Exist */}
                {modalGallery.length > 1 ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {modalGallery.map((img, idx) => (
                        <button
                          key={img.src}
                          type="button"
                          suppressHydrationWarning
                          onClick={() => {
                            if (soundEnabled) retroSound.playSelect();
                            setPreviewModal({ ...previewModal, slideIndex: idx });
                            setActiveSlideById((prev) => ({
                              ...prev,
                              [previewModal.project.id]: idx,
                            }));
                          }}
                          className={`pixel-btn px-3 py-1.5 font-pixel text-[8px] ${idx === previewModal.slideIndex
                              ? "bg-[#2b2723] text-[#fffdf9]"
                              : "bg-[#f4efe6] text-[#2b2723] hover:bg-[#e9e2d5]"
                            }`}
                        >
                          0{idx + 1}. {img.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => {
                          if (soundEnabled) retroSound.playSelect();
                          const nextIdx =
                            (previewModal.slideIndex - 1 + modalGallery.length) %
                            modalGallery.length;
                          setPreviewModal({ ...previewModal, slideIndex: nextIdx });
                          setActiveSlideById((prev) => ({
                            ...prev,
                            [previewModal.project.id]: nextIdx,
                          }));
                        }}
                        className="pixel-btn px-3 py-1.5 bg-[#fffdf9] hover:bg-[#e9e2d5] font-pixel text-[8px] text-[#2b2723]"
                      >
                        &lt; Prev
                      </button>
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => {
                          if (soundEnabled) retroSound.playSelect();
                          const nextIdx =
                            (previewModal.slideIndex + 1) % modalGallery.length;
                          setPreviewModal({ ...previewModal, slideIndex: nextIdx });
                          setActiveSlideById((prev) => ({
                            ...prev,
                            [previewModal.project.id]: nextIdx,
                          }));
                        }}
                        className="pixel-btn px-3 py-1.5 bg-[#fffdf9] hover:bg-[#e9e2d5] font-pixel text-[8px] text-[#2b2723]"
                      >
                        Next &gt;
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })()
      ) : null}
    </section>
  );
}
