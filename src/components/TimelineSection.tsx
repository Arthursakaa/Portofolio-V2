"use client";

import { portfolioData } from "@/data/portfolio";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";
import { CatWalkSprite } from "@/components/sprites/CatSprites";
import { PixelSprite } from "@/components/sprites/PixelSprite";
import { BASE_PALETTE, SAVE_CRYSTAL } from "@/components/sprites/spriteData";

interface TimelineSectionProps {
  soundEnabled?: boolean;
}

export function TimelineSection({ soundEnabled }: TimelineSectionProps) {
  const { timeline } = portfolioData;

  return (
    <section id="experience" data-reveal className="relative py-16 border-b-2 border-[#2b2723] bg-[#f4efe6]">
      <HiddenCoin index={3} className="absolute top-5 left-6 sm:left-1/3" />
      <div className="max-w-4xl mx-auto px-4">
        {/* Clear Section Header */}
        <div data-reveal-item={0} className="mb-10 pb-4 border-b-2 border-[#2b2723] flex items-end justify-between gap-4">
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

          {/* Save-point crystal (plan 017) */}
          <div aria-hidden="true" className="hidden sm:flex flex-col items-center gap-1 shrink-0">
            <PixelSprite layers={[{ rows: SAVE_CRYSTAL }]} palette={BASE_PALETTE} scale={3} className="save-bob" />
            <span className="font-pixel text-[8px] text-[#575049]">SAVE POINT</span>
          </div>
        </div>

        {/* Timeline Path */}
        <div className="timeline-spine space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-1 before:bg-[#2b2723] before:z-0">
          {timeline.map((item, index) => (
            <div key={index} data-reveal data-reveal-item={0} className="relative z-10 pl-10 sm:pl-16 group">
              {/* Checkpoint Dot */}
              <div className="absolute left-2.5 sm:left-4.5 top-3 -translate-x-1/2 w-4 h-4 bg-[#fffdf9] border-2 border-[#2b2723] flex items-center justify-center shadow-[1px_1px_0_0_#2b2723] group-hover:bg-[#ea580c] transition-colors">
                <span className="w-1.5 h-1.5 bg-[#2b2723] block group-hover:bg-white" />
              </div>

              {/* Event Card */}
              <div
                onClick={() => soundEnabled && retroSound.playSelect()}
                onMouseEnter={() => soundEnabled && retroSound.playBlip(620, "triangle", 0.03)}
                className="bg-[#fffdf9] pixel-border p-5 pixel-card-interactive cursor-default"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2b2723]/20 pb-2 mb-3">
                  <span className="font-pixel text-[9px] bg-[#2b2723] text-[#fffdf9] px-2 py-0.5">
                    {item.period}
                  </span>
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
          ))}

          {/* Cat that walks down the spine with scroll (plan 017). Last child: no space-y margin. */}
          <div aria-hidden="true" className="timeline-cat-track">
            <div className="timeline-cat">
              <CatWalkSprite scale={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
