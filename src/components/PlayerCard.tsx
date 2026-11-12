"use client";

import { useState } from "react";
import Image from "next/image";
import { portfolioData } from "@/data/portfolio";
import { retroSound } from "@/lib/audio";
import { PixelDocumentIcon } from "./PixelIcons";

interface PlayerCardProps {
  soundEnabled: boolean;
}

export function PlayerCard({ soundEnabled }: PlayerCardProps) {
  const { profile, resume } = portfolioData;
  const [ditherActive, setDitherActive] = useState(true);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto bg-[#fffdf9] pixel-border-lg p-4 sm:p-5 relative stagger-enter stagger-delay-2">
      {/* Card Header Strip */}
      <div className="flex items-center justify-between border-b-2 border-[#2b2723] pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#ea580c] border border-[#2b2723]" />
          <span className="font-pixel text-[10px] text-[#2b2723]">
            DEVELOPER PROFILE CARD
          </span>
        </div>
        <span className="font-pixel text-[9px] bg-[#2b2723] text-[#fffdf9] px-1.5 py-0.5">
          CS @ BINUS
        </span>
      </div>

      {/* Photo Viewport with Pixel Stepping Frame */}
      <div className="relative border-2 border-[#2b2723] bg-[#e9e2d5] p-2 mb-4 group overflow-hidden">
        {/* Pixel Corner Accents */}
        <span className="absolute top-0 left-0 w-2 h-2 bg-[#2b2723] z-10" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-[#2b2723] z-10" />
        <span className="absolute bottom-0 left-0 w-2 h-2 bg-[#2b2723] z-10" />
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#2b2723] z-10" />

        <div className="relative w-full aspect-[4/5] bg-[#ded5c5] flex items-center justify-center overflow-hidden border border-[#2b2723]/30">
          {!imgError ? (
            <div className="relative w-full h-full">
              <Image
                src={profile.photo}
                alt={profile.fullName}
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                className={`object-cover object-top ${
                  ditherActive ? "retro-dither" : ""
                }`}
                onError={() => setImgError(true)}
                priority
              />
              {/* Scanline subtle overlay inside card */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-40 group-hover:opacity-10 transition-opacity duration-200" />
            </div>
          ) : (
            /* Fallback Retro Pixel Avatar in CSS if profile image hasn't been uploaded yet */
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-20 h-20 bg-[#2b2723] p-1 flex flex-col justify-between items-center mb-3 shadow-[3px_3px_0_0_#ea580c]">
                <div className="w-12 h-6 bg-[#38bdf8] flex items-center justify-around px-1 mt-2">
                  <span className="w-2 h-2 bg-[#2b2723]" />
                  <span className="w-2 h-2 bg-[#2b2723]" />
                </div>
                <div className="w-16 h-4 bg-[#ea580c] flex items-center justify-center mb-1">
                  <span className="font-pixel text-[7px] text-white">BINUS</span>
                </div>
              </div>
              <p className="font-pixel text-[9px] text-[#2b2723] mb-1">
                [PHOTO PLACEHOLDER]
              </p>
              <p className="text-[11px] text-[#575049] font-mono leading-tight">
                Save your photo as:
                <br />
                <code className="bg-[#fffdf9] border border-[#2b2723] px-1 text-[10px] text-[#ea580c] mt-0.5 inline-block">
                  public/profile.jpg
                </code>
              </p>
            </div>
          )}

          {/* Dither Mode Indicator Badge */}
          <div className="absolute bottom-2 right-2 z-20">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => {
                if (soundEnabled) retroSound.playToggle(!ditherActive);
                setDitherActive((p) => !p);
              }}
              title="Toggle Retro Dither vs Original Photo"
              aria-pressed={ditherActive}
              className="pixel-btn px-2 py-1 text-[8px] font-pixel bg-[#fffdf9]/95 text-[#2b2723] hover:bg-[#ea580c] hover:text-white"
            >
              {ditherActive ? "FILTER: RETRO" : "FILTER: ORIGINAL"}
            </button>
          </div>
        </div>

        {/* Hover Cue */}
        <p className="text-center font-vt text-sm text-[#575049] mt-1.5 tracking-wider">
          Hover photo to view original • Click button to lock
        </p>
      </div>

      {/* Clear, Recruiter-Friendly Profile Summary */}
      <div className="space-y-2 font-mono text-xs text-[#2b2723]">
        <div className="bg-[#f4efe6] border border-[#2b2723] p-2.5 space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-pixel text-[8px] text-[#575049]">NAME</span>
            <span className="font-bold">{profile.displayName}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-pixel text-[8px] text-[#575049]">UNIVERSITY</span>
            <span className="text-[#2563eb] font-semibold">{profile.guild}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-pixel text-[8px] text-[#575049]">DEGREE</span>
            <span>B.Sc. {profile.major}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-pixel text-[8px] text-[#575049]">SPECIALTY</span>
            <span>Web, Backend &amp; AI</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-pixel text-[8px] text-[#575049]">LOCATION</span>
            <span>{profile.location}</span>
          </div>
        </div>

        {/* Availability Status Bar */}
        <div className="bg-[#10b981]/15 border-2 border-[#10b981] p-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative inline-flex w-2 h-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-none bg-[#10b981] opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex w-2 h-2 bg-[#10b981]" />
            </span>
            <span className="font-pixel text-[8px] text-[#047857]">
              OPEN TO TECH INTERNSHIPS
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#047857]">2026</span>
        </div>

        {/* Direct CV Download Pill */}
        <a
          href={profile.resumeUrl}
          download={resume.fileName}
          onClick={() => soundEnabled && retroSound.playCoin()}
          suppressHydrationWarning
          className="pixel-btn w-full py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-pixel text-[9px] tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#2b2723]"
          title="Download Curriculum Vitae (PDF)"
        >
          <PixelDocumentIcon size={12} />
          <span>DOWNLOAD CV (PDF)</span>
        </a>
      </div>
    </div>
  );
}
