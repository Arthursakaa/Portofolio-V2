"use client";

import { portfolioData } from "@/data/portfolio";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";

interface SkillsInventoryProps {
  soundEnabled: boolean;
}

export function SkillsInventory({ soundEnabled }: SkillsInventoryProps) {
  const { skills } = portfolioData;

  return (
    <section id="skills" data-reveal className="relative py-16 border-b-2 border-[#2b2723] bg-[#fffdf9]">
      <HiddenCoin index={2} className="absolute bottom-5 right-6 sm:right-1/4" />
      <div className="max-w-6xl mx-auto px-4">
        {/* Clear Section Header */}
        <div data-reveal-item={0} className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-10 pb-4 border-b-2 border-[#2b2723]">
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

          <p className="font-mono text-xs text-[#575049] max-w-sm">
            Languages, frameworks, databases, and developer tools I use to build and ship software.
          </p>
        </div>

        {/* 4 Category Skill Cards */}
        <div data-reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category, idx) => (
            <div
              key={category.name}
              data-reveal-item={idx}
              className="bg-[#f4efe6] pixel-border p-4 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="border-b-2 border-[#2b2723] pb-2 mb-3">
                  <span className="font-pixel text-[8px] text-[#ea580c] block">
                    CATEGORY 0{idx + 1}
                  </span>
                  <h3 className="font-pixel text-xs text-[#2b2723] mt-1">
                    {category.name}
                  </h3>
                </div>

                {/* Items in Category */}
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      onMouseEnter={() => soundEnabled && retroSound.playBlip(600, "square", 0.02)}
                      className="bg-[#fffdf9] border-2 border-[#2b2723] p-2.5 flex items-center justify-between shadow-[2px_2px_0_0_#2b2723] pixel-card-interactive"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#10b981] border border-[#2b2723] inline-block shrink-0" />
                        <span className="font-bold text-xs text-[#2b2723]">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-pixel text-[7px] text-[#575049] bg-[#e9e2d5] px-1.5 py-0.5 border border-[#2b2723]/30">
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom summary */}
              <div className="mt-4 pt-2 border-t border-[#2b2723]/30 flex justify-between text-[9px] font-pixel text-[#575049]">
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
