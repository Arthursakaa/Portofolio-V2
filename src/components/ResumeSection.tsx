"use client";

import { portfolioData } from "@/data/portfolio";
import {
  PixelDownloadIcon,
  PixelExternalIcon,
  PixelCheckIcon,
} from "./PixelIcons";
import { retroSound } from "@/lib/audio";
import { HiddenCoin } from "@/components/arcade/HiddenCoin";

interface ResumeSectionProps {
  soundEnabled: boolean;
}

export function ResumeSection({ soundEnabled }: ResumeSectionProps) {
  const { profile, resume } = portfolioData;

  const handleDownloadSound = () => {
    if (soundEnabled) {
      retroSound.playCoin();
    }
  };

  return (
    <section id="resume" data-reveal className="relative py-16 border-b-2 border-[#2b2723] bg-[#f4efe6]">
      <HiddenCoin index={4} className="absolute bottom-5 left-1/2" />
      <div className="max-w-6xl mx-auto px-4">
        {/* Clean Section Header Matching Other Sections */}
        <div data-reveal-item={0} className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-10 pb-4 border-b-2 border-[#2b2723]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#2563eb] inline-block border border-[#2b2723]" />
              <span className="font-pixel text-[10px] text-[#575049]">
                06 // VERIFIED CREDENTIALS
              </span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723] pixel-wipe">
              CURRICULUM VITAE
            </h2>
          </div>

          <p className="font-mono text-xs text-[#575049] max-w-sm">
            Download formal resume and technical documentation for Full-Stack Developer internship evaluation and recruiter review.
          </p>
        </div>

        {/* Main Retro CV Docket Card */}
        <div data-reveal className="bg-[#fffdf9] pixel-border-lg p-5 sm:p-7">
          {/* Top Control Strip */}
          <div data-reveal-item={0} className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#2b2723] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#10b981] border border-[#2b2723] inline-block" />
              <span className="font-pixel text-[10px] text-[#2b2723]">
                DOCKET ID: ARS-2026-CV
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[8px] bg-[#10b981]/20 text-[#047857] border border-[#10b981] px-2 py-0.5 font-bold">
                STATUS: {resume.status.toUpperCase()}
              </span>
              <span className="font-pixel text-[8px] bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb] px-2 py-0.5">
                {resume.format}
              </span>
            </div>
          </div>

          {/* Clean 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Candidate & Qualification Summary (7 cols) */}
            <div data-reveal-item={1} className="lg:col-span-7 space-y-4">
              <div>
                <span className="font-pixel text-[9px] text-[#ea580c] block">
                  CANDIDATE DOSSIER
                </span>
                <h3 className="font-pixel text-base sm:text-lg text-[#2b2723] mt-0.5">
                  {profile.fullName}
                </h3>
                <p className="font-vt text-xl text-[#2563eb]">
                  &gt; {profile.guild} — B.Comp.Sc. ({profile.major})
                </p>
              </div>

              {/* Executive Summary Box */}
              <div className="bg-[#f4efe6] border border-[#2b2723] p-4 text-xs text-[#2b2723] leading-relaxed space-y-2">
                <p className="font-pixel text-[8px] text-[#575049] border-b border-[#ded5c5] pb-1 font-bold">
                  EXECUTIVE SUMMARY
                </p>
                <p>
                  Computer Science undergraduate at BINUS University based in Malang, Indonesia. Focused on full-stack web engineering, high-throughput microservices, and applied machine learning integration.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#ded5c5] text-[11px]">
                  <div>
                    <span className="font-pixel text-[8px] text-[#575049] block">LOCATION</span>
                    <span className="font-semibold">{profile.location}</span>
                  </div>
                  <div>
                    <span className="font-pixel text-[8px] text-[#575049] block">AVAILABILITY</span>
                    <span className="font-bold text-[#047857]">Open for Full-Stack Intern (2026)</span>
                  </div>
                </div>
              </div>

              {/* Technical Highlights */}
              <div className="space-y-2 pt-1">
                <p className="font-pixel text-[8px] text-[#2b2723]">
                  KEY EVALUATION HIGHLIGHTS:
                </p>
                <ul className="space-y-1.5 text-xs text-[#2b2723]">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#10b981] shrink-0">
                      <PixelCheckIcon size={12} />
                    </span>
                    <span>
                      <strong>Full-Stack Architecture:</strong> Laravel 12 domain logic, Go 1.25 high-throughput services, and reactive Next.js 16/React 19 interfaces.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#10b981] shrink-0">
                      <PixelCheckIcon size={12} />
                    </span>
                    <span>
                      <strong>Real-Time Systems:</strong> Bi-directional communication using Laravel Reverb WebSockets &amp; event broadcasting.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#10b981] shrink-0">
                      <PixelCheckIcon size={12} />
                    </span>
                    <span>
                      <strong>Machine Learning Integration:</strong> Python, scikit-learn, and Flask inference endpoints for educational diagnostic models.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Download Card (5 cols) */}
            <div data-reveal-item={2} className="lg:col-span-5 flex flex-col justify-center">
              <div className="bg-[#f4efe6] border-2 border-[#2b2723] p-5 text-center space-y-4 shadow-[4px_4px_0_0_#2b2723]">
                {/* Retro Document Illustration */}
                <div className="w-18 h-22 mx-auto bg-[#fffdf9] border-2 border-[#2b2723] p-2 relative shadow-[2px_2px_0_0_#2b2723] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#ded5c5] border-b-2 border-l-2 border-[#2b2723]" />
                  <div className="space-y-1 mt-0.5">
                    <div className="w-5 h-1 bg-[#ea580c]" />
                    <div className="w-8 h-1 bg-[#2b2723]" />
                  </div>
                  <div className="space-y-1 my-1">
                    <div className="w-full h-1 bg-[#ded5c5]" />
                    <div className="w-10 h-1 bg-[#ded5c5]" />
                    <div className="w-12 h-1 bg-[#ded5c5]" />
                    <div className="w-8 h-1 bg-[#ded5c5]" />
                  </div>
                  <div className="border border-[#10b981] px-1 py-0.5 text-[6px] font-pixel text-[#10b981]">
                    VERIFIED
                  </div>
                </div>

                <div>
                  <h4 className="font-pixel text-xs text-[#2b2723]">
                    {resume.fileName}
                  </h4>
                  <p className="font-vt text-base text-[#575049] mt-0.5">
                    Updated for 2026 Full-Stack Intern Applications
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href={resume.fileUrl}
                    download={resume.fileName}
                    onClick={handleDownloadSound}
                    suppressHydrationWarning
                    className="pixel-btn w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-pixel text-xs tracking-wider flex items-center justify-center gap-2"
                    title="Click to download PDF resume"
                  >
                    <PixelDownloadIcon size={14} />
                    <span>DOWNLOAD CV (PDF)</span>
                  </a>

                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEnabled && retroSound.playSelect()}
                    suppressHydrationWarning
                    className="pixel-btn w-full py-2 bg-[#fffdf9] hover:bg-[#ded5c5] text-[#2b2723] font-pixel text-[10px] tracking-wider flex items-center justify-center gap-2"
                    title="Open PDF directly in browser"
                  >
                    <PixelExternalIcon size={12} />
                    <span>PREVIEW IN BROWSER</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
