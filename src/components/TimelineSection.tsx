"use client";

import { useEffect, useRef, useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";
import { CatWalkSprite } from "@/components/sprites/CatSprites";
import { PixelSprite } from "@/components/sprites/PixelSprite";
import { BASE_PALETTE, SAVE_CRYSTAL } from "@/components/sprites/spriteData";

interface TimelineSectionProps {
  soundEnabled?: boolean;
}

interface RailMetrics {
  firstY: number;
  lastY: number;
  nodeYs: number[];
}

export function TimelineSection({ soundEnabled }: TimelineSectionProps) {
  const { timeline } = portfolioData;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  const spineRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const manualLockRef = useRef(false);
  const lockTimerRef = useRef<number>(0);

  const [metrics, setMetrics] = useState<RailMetrics>({
    firstY: 24,
    lastY: 400,
    nodeYs: [],
  });

  // Measure exact checkpoint centers so the 2-tone rail & quest marker align pixel-perfectly
  useEffect(() => {
    const container = spineRef.current;
    if (!container) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      if (containerRect.height === 0) return;

      const ys = timeline.map((_, i) => {
        const el = nodeRefs.current[i];
        if (!el) return 24 + i * 140;
        const r = el.getBoundingClientRect();
        return r.top - containerRect.top + r.height / 2;
      });

      if (ys.length > 0) {
        setMetrics({
          firstY: ys[0],
          lastY: ys[ys.length - 1],
          nodeYs: ys,
        });
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [timeline]);

  // Calibrated scroll tracking: activates each checkpoint as its card reaches the comfortable reading zone
  useEffect(() => {
    let rafId = 0;

    const updateFromScroll = () => {
      rafId = 0;
      if (isHoveringCard || manualLockRef.current) return;

      const viewportH = window.innerHeight;
      // Reading focal line sits around the middle of the viewport (52% from top)
      const readingLineY = viewportH * 0.52;

      let nextActive = 0;
      for (let i = 0; i < timeline.length; i++) {
        const el = nodeRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const nodeCenterY = rect.top + rect.height / 2;
        if (nodeCenterY <= readingLineY) {
          nextActive = i;
        }
      }

      setActiveIndex((prev) => (prev !== nextActive ? nextActive : prev));
    };

    const onScroll = () => {
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(updateFromScroll);
      }
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      if (lockTimerRef.current !== 0) window.clearTimeout(lockTimerRef.current);
    };
  }, [timeline.length, isHoveringCard]);

  const selectStage = (index: number, scrollIntoView = false) => {
    if (soundEnabled) retroSound.playSelect();
    manualLockRef.current = true;
    if (lockTimerRef.current !== 0) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      manualLockRef.current = false;
      lockTimerRef.current = 0;
    }, 900);
    setActiveIndex(index);

    if (scrollIntoView) {
      const el = nodeRefs.current[index];
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const totalSpan = Math.max(1, metrics.lastY - metrics.firstY);
  const activeY = metrics.nodeYs[activeIndex] ?? metrics.firstY;
  const progressRatio = Math.min(1, Math.max(0, (activeY - metrics.firstY) / totalSpan));

  return (
    <section id="experience" data-reveal className="relative py-16 border-b-2 border-[#2b2723] bg-[#f4efe6]">
      <HiddenCoin index={3} className="absolute top-5 left-6 sm:left-1/3" />
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header + Interactive Save Point */}
        <div
          data-reveal-item={0}
          className="mb-10 pb-4 border-b-2 border-[#2b2723] flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#ea580c] inline-block border border-[#2b2723]" />
              <span className="font-pixel text-[10px] text-[#575049]">
                04 // EXPERIENCE &amp; EDUCATION
              </span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723] pixel-wipe">
              ACADEMIC &amp; PROJECT TIMELINE
            </h2>
          </div>

          {/* Save Point Mascot & Interactive Stage Selector */}
          <div className="flex items-center justify-between sm:justify-end gap-3 bg-[#fffdf9] border-2 border-[#2b2723] px-3 py-2 shadow-[2px_2px_0_0_#2b2723]">
            <div aria-hidden="true" className="flex items-end gap-1.5 pr-2 border-r-2 border-[#2b2723]/20">
              <CatWalkSprite scale={2} />
              <PixelSprite
                layers={[{ rows: SAVE_CRYSTAL }]}
                palette={BASE_PALETTE}
                scale={2}
                className="save-bob"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-pixel text-[8px] text-[#575049]">QUEST LOG</span>
                <span className="font-pixel text-[8px] text-[#ea580c]">
                  0{activeIndex + 1}/0{timeline.length}
                </span>
              </div>
              <div className="flex items-center gap-1" role="tablist" aria-label="Timeline quest stages">
                {timeline.map((item, idx) => {
                  const isCurrent = idx === activeIndex;
                  const isPassed = idx < activeIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      suppressHydrationWarning
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`Jump to stage ${idx + 1}: ${item.role}`}
                      onClick={() => selectStage(idx, true)}
                      className={`w-5 h-4 font-pixel text-[8px] border border-[#2b2723] transition-transform cursor-pointer ${
                        isCurrent
                          ? "bg-[#ea580c] text-[#fffdf9] -translate-y-0.5 shadow-[1px_1px_0_0_#2b2723]"
                          : isPassed
                          ? "bg-[#ea580c]/25 text-[#2b2723] hover:bg-[#ea580c]/40"
                          : "bg-[#f4efe6] text-[#575049] hover:bg-[#e9e2d5]"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RPG Questline Path */}
        <div
          ref={spineRef}
          onMouseLeave={() => setIsHoveringCard(false)}
          className="timeline-spine space-y-6 relative"
        >
          {/* 1. Continuous Base Rail (Muted Paper Channel) */}
          <div
            aria-hidden="true"
            style={{
              top: `${metrics.firstY}px`,
              height: `${totalSpan}px`,
            }}
            className="timeline-rail-base absolute left-4 sm:left-6 -translate-x-1/2 w-2 bg-[#ded5c5] border-x-2 border-[#2b2723] z-0"
          />

          {/* 2. Smooth Orange Progress Fill Bar */}
          <div
            aria-hidden="true"
            style={{
              top: `${metrics.firstY}px`,
              height: `${totalSpan}px`,
              transform: `scaleY(${progressRatio})`,
            }}
            className="timeline-rail-fill absolute left-4 sm:left-6 -translate-x-1/2 w-2 bg-[#ea580c] border-x-2 border-[#2b2723] origin-top z-0"
          />

          {/* 3. Pixel Quest Marker (8-Bit Arrow Cursor docked at active checkpoint) */}
          <div
            aria-hidden="true"
            style={{
              transform: `translateY(${activeY}px)`,
            }}
            className="timeline-quest-marker absolute top-0 left-[29px] sm:left-[40px] z-20 pointer-events-none"
          >
            <div className="-translate-y-1/2 quest-pointer-bob">
              <svg
                width="14"
                height="14"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                shapeRendering="crispEdges"
                className="drop-shadow-[1px_1px_0_#2b2723]"
              >
                {/* 8-bit Right-Pointing Quest Cursor */}
                <path
                  d="M0 0H2V1H4V2H6V3H7V4H6V5H4V6H2V7H0V0Z"
                  fill="#2b2723"
                />
                <path
                  d="M1 1H2V2H4V3H5V4H4V5H2V6H1V1Z"
                  fill="#ea580c"
                />
                <rect x="1" y="2" width="2" height="1" fill="#eab308" />
              </svg>
            </div>
          </div>

          {timeline.map((item, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                data-reveal
                data-reveal-item={0}
                onMouseEnter={() => {
                  setIsHoveringCard(true);
                  if (activeIndex !== index) {
                    setActiveIndex(index);
                    if (soundEnabled) retroSound.playBlip(620, "triangle", 0.03);
                  }
                }}
                className="relative z-10 pl-11 sm:pl-16 group"
              >
                {/* Interactive Checkpoint Node Centered on the Rail */}
                <button
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  type="button"
                  suppressHydrationWarning
                  aria-label={`Select quest stage ${index + 1}: ${item.role}`}
                  onClick={() => selectStage(index)}
                  className={`timeline-checkpoint absolute left-4 sm:left-6 top-6 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#2b2723] flex items-center justify-center cursor-pointer ${
                    isActive
                      ? "bg-[#eab308] scale-110 shadow-[2px_2px_0_0_#2b2723]"
                      : isCompleted
                      ? "bg-[#ea580c] shadow-[1px_1px_0_0_#2b2723]"
                      : "bg-[#fffdf9] shadow-[1px_1px_0_0_#2b2723] hover:bg-[#e9e2d5]"
                  }`}
                >
                  {isCompleted ? (
                    /* Pixel Checkmark for Completed Stages */
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 5 5"
                      fill="none"
                      shapeRendering="crispEdges"
                      aria-hidden="true"
                    >
                      <rect x="0" y="2" width="1" height="1" fill="#fffdf9" />
                      <rect x="1" y="3" width="1" height="1" fill="#fffdf9" />
                      <rect x="2" y="2" width="1" height="1" fill="#fffdf9" />
                      <rect x="3" y="1" width="1" height="1" fill="#fffdf9" />
                      <rect x="4" y="0" width="1" height="1" fill="#fffdf9" />
                    </svg>
                  ) : isActive ? (
                    <span className="w-2 h-2 bg-[#2b2723] block" />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-[#575049]/60 block group-hover:bg-[#2b2723]" />
                  )}
                </button>

                {/* Event Card */}
                <div
                  onClick={() => selectStage(index)}
                  className={`bg-[#fffdf9] pixel-border p-5 pixel-card-interactive cursor-pointer ${
                    isActive
                      ? "border-l-4 border-l-[#ea580c] shadow-[4px_4px_0_0_#2b2723]"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2b2723]/20 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-pixel text-[9px] px-2 py-0.5 ${
                          isActive
                            ? "bg-[#ea580c] text-[#fffdf9]"
                            : "bg-[#2b2723] text-[#fffdf9]"
                        }`}
                      >
                        {item.period}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#575049]">
                        STAGE 0{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive ? (
                        <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-[#eab308]/25 text-[#2b2723] border border-[#2b2723]">
                          ACTIVE
                        </span>
                      ) : isCompleted ? (
                        <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-[#ea580c]/15 text-[#ea580c] border border-[#ea580c]/40">
                          CLEARED
                        </span>
                      ) : null}
                      <span
                        className={`font-pixel text-[8px] px-2 py-0.5 border border-[#2b2723] ${
                          item.type === "Education"
                            ? "bg-[#2563eb]/15 text-[#2563eb]"
                            : item.type === "Milestone"
                            ? "bg-[#10b981]/15 text-[#047857]"
                            : "bg-[#ea580c]/15 text-[#ea580c]"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-pixel text-sm sm:text-base text-[#2b2723]">
                    {item.role}
                  </h3>
                  <p className="font-mono text-xs font-semibold text-[#575049] mb-2">
                    {item.organization}
                  </p>
                  <p className="text-sm text-[#2b2723] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
