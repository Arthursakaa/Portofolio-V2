"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { portfolioData, type Project, type ProjectImage } from "@/data/portfolio";
import { PixelExternalIcon, PixelSparkleIcon, PixelCodeIcon, PixelPlayIcon } from "./PixelIcons";
import { ProjectVisualBanner } from "./ProjectVisuals";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";

interface ProjectsSectionProps {
  soundEnabled: boolean;
}

const CATEGORIES = ["All Projects", "Full-Stack", "Mobile", "AI & ML"] as const;
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
    if (activeFilter === "Mobile") {
      return p.category.toLowerCase().includes("mobile");
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
            {CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  suppressHydrationWarning
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    if (soundEnabled) retroSound.playSelect();
                    setActiveFilter(cat);
                  }}
                  className={`relative pixel-btn px-3 py-1.5 font-pixel text-[9px] overflow-hidden ${
                    isActive
                      ? "text-[#fffdf9]"
                      : "bg-[#fffdf9] text-[#2b2723] hover:bg-[#e9e2d5]"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="project-filter-pill"
                      transition={{ type: "spring", duration: 0.3, bounce: 0.12 }}
                      className="absolute inset-0 bg-[#2b2723] -z-0"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}

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
        <motion.div
          layout
          transition={{ layout: { type: "spring", duration: 0.35, bounce: 0.08 } }}
          className={
            filteredProjects.length === 1
              ? "max-w-2xl mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 gap-7"
          }
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project, index) => {
              const showArch = Boolean(expandedArchIds[project.id]);
              const gallery = getProjectGallery(project);
              const activeSlideIdx = activeSlideById[project.id] ?? 0;
              const currentSlide = gallery[activeSlideIdx];
              const isSpanFull = filteredProjects.length === 3 && index === 0;

              return (
                <motion.div
                  key={project.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{
                    layout: { type: "spring", duration: 0.35, bounce: 0.1 },
                    opacity: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
                    scale: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
                    y: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
                  }}
                  className={`h-full ${isSpanFull ? "md:col-span-2" : ""}`}
                >
                <article
                  className={`h-full bg-[#fffdf9] pixel-border-lg pixel-card-interactive overflow-hidden ${
                    isSpanFull
                      ? "grid grid-cols-1 lg:grid-cols-12"
                      : "flex flex-col justify-between"
                  }`}
                >
                  {/* Visual Preview Banner / Interactive Architecture Toggle */}
                  <div
                    className={`group/banner relative w-full bg-[#1e293b] overflow-hidden ${
                      isSpanFull
                        ? "lg:col-span-6 h-56 sm:h-64 lg:h-full lg:min-h-[320px] border-b-2 lg:border-b-0 lg:border-r-2 border-[#2b2723]"
                        : "h-52 sm:h-56 border-b-2 border-[#2b2723]"
                    }`}
                  >
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
                      className={`absolute inset-0 w-full h-full bg-[#2b2723] text-[#f4efe6] p-4 sm:p-5 flex flex-col justify-center font-mono text-xs overflow-y-auto transition-[opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${showArch ? "opacity-100 blur-0 z-10" : "opacity-0 blur-[2px] pointer-events-none"
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

                  {/* Content & Actions Column (wrapped together so Featured split aligns cleanly) */}
                  <div
                    className={`flex flex-col justify-between ${
                      isSpanFull ? "lg:col-span-6" : "flex-1"
                    }`}
                  >
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

                      <p className="text-sm text-[#2b2723] leading-relaxed max-w-prose">
                        {project.description}
                      </p>
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
                        {project.githubRepos && project.githubRepos.length > 0 ? (
                          project.githubRepos.map((repo) => (
                            <a
                              key={repo.url}
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => soundEnabled && retroSound.playLaser()}
                              className="pixel-btn px-3.5 py-2 bg-[#2b2723] text-[#fffdf9] font-pixel text-[9px] hover:bg-[#3d3732] inline-flex items-center gap-1.5"
                            >
                              <PixelCodeIcon size={12} />
                              <span>{repo.label}</span>
                            </a>
                          ))
                        ) : (
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
                        )}

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
                  </div>
                </article>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full-Resolution Project Screenshot Lightbox Modal */}
      <AnimatePresence>
        {previewModal ? (
          (() => {
            const modalGallery = getProjectGallery(previewModal.project);
            const activeSlide = modalGallery[previewModal.slideIndex] ?? modalGallery[0];
            if (!activeSlide) return null;

            return (
              <motion.div
                key="project-preview-backdrop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-preview-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b2723]/75 backdrop-blur-xs"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    if (soundEnabled) retroSound.playSelect();
                    setPreviewModal(null);
                  }
                }}
              >
                <motion.div
                  key="project-preview-dialog"
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full max-w-4xl bg-[#fffdf9] pixel-border-lg p-5 sm:p-6 max-h-[92vh] overflow-y-auto no-scrollbar relative shadow-[6px_6px_0_0_#2b2723]"
                >
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
                  className="border-2 border-[#2b2723] p-2 sm:p-3 mb-4 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: activeSlide.bg ?? "#f4efe6" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeSlide.src}
                      src={activeSlide.src}
                      alt={`${previewModal.project.title} — ${activeSlide.label}`}
                      initial={{ opacity: 0, scale: 0.985 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.985 }}
                      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                      className="w-full max-h-[60vh] object-contain"
                    />
                  </AnimatePresence>
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
                  </motion.div>
                </motion.div>
              );
            })()
          ) : null}
        </AnimatePresence>
      </section>
  );
}
