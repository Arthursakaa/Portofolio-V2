"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import {
  PixelCopyIcon,
  PixelCheckIcon,
  PixelMailIcon,
  PixelExternalIcon,
} from "./PixelIcons";
import { retroSound } from "@/lib/audio";
import { ArcadeCorner, toggleNekoMode } from "@/components/arcade/ArcadeCorner";
import { arcade, COIN_COUNT } from "@/lib/arcadeStore";

interface ContactTerminalProps {
  soundEnabled: boolean;
}

interface LogLine {
  cmd?: string;
  output: string[];
  /** Initial entry: prints line by line when the terminal scrolls in */
  boot?: boolean;
}

const QUICK_COMMANDS = ["help", "about", "projects", "skills", "cv", "email", "clear"] as const;

export function ContactTerminal({ soundEnabled }: ContactTerminalProps) {
  const { profile, projects, skills } = portfolioData;
  const [copied, setCopied] = useState(false);
  // Increments on every copy so the confirmation pop replays even while `copied` is already true
  const [copyTick, setCopyTick] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<LogLine[]>([
    {
      cmd: "./get_contact_info.sh",
      boot: true,
      output: [
        `NAME       : ${profile.fullName}`,
        `UNIVERSITY : ${profile.guild} (Computer Science)`,
        `ROLE       : ${profile.role}`,
        `STATUS     : ${profile.status}`,
        `Click any command pill above or type 'help' below to inspect details.`,
      ],
    },
  ]);

  const copyEmail = () => {
    if (soundEnabled) retroSound.playCoin();
    navigator.clipboard.writeText(profile.socials.email);
    setCopied(true);
    setCopyTick((t) => t + 1);
    setTimeout(() => setCopied(false), 2500);
  };

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;
    if (soundEnabled) retroSound.playSelect();

    if (cmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    }

    let out: string[] = [];
    switch (cmd) {
      case "help":
        out = [
          "AVAILABLE COMMANDS:",
          "  about     — Display developer background & summary",
          "  projects  — List featured software projects",
          "  skills    — Inspect technical stack & tools",
          "  cv        — Display Curriculum Vitae / Resume info & status",
          "  email     — Copy email address to clipboard",
          "  coins     — Track the hidden coin hunt",
          "  clear     — Clear terminal screen",
        ];
        break;
      case "about":
        out = [profile.about];
        break;
      case "projects":
        out = projects.map(
          (p, i) => `[0${i + 1}] ${p.title} (${p.year}) — ${p.stack.slice(0, 3).join(", ")}`
        );
        break;
      case "skills":
        out = skills.map(
          (s) => `${s.name}: ${s.items.map((item) => item.name).join(" • ")}`
        );
        break;
      case "cv":
      case "resume":
        out = [
          "CURRICULUM VITAE / RESUME:",
          `  Candidate : ${profile.fullName}`,
          `  Degree    : B.Comp.Sc. in ${profile.major} (${profile.guild})`,
          `  Location  : ${profile.location}`,
          `  Status    : Open for Full-Stack Developer Internship (2026)`,
          `  File      : ${profile.resumeUrl}`,
          "  Tip       : Click [Download CV] in Hero or visit Section 05 to download.",
        ];
        break;
      case "email":
      case "contact":
        navigator.clipboard.writeText(profile.socials.email);
        setCopied(true);
        setCopyTick((t) => t + 1);
        setTimeout(() => setCopied(false), 2500);
        out = [
          `EMAIL: ${profile.socials.email}`,
          `Email address copied to clipboard.`,
        ];
        break;
      case "coins": {
        const n = arcade.getState().coins.length;
        out =
          n === COIN_COUNT
            ? [`COINS: ${n}/${COIN_COUNT}. Coin Collector unlocked!`, "Type 'coins reset' to hunt again."]
            : [`COINS: ${n}/${COIN_COUNT} collected.`, "Hint: they hide in the empty margins of each section."];
        break;
      }
      case "coins reset":
        arcade.resetCoins();
        out = ["Coin hunt reset. Happy hunting!"];
        break;
      case "secret":
        out = ["Old-school cheat codes still work here: ↑ ↑ ↓ ↓ ← → ← → B A"];
        break;
      case "neko":
        toggleNekoMode();
        out = [arcade.getState().neko ? "NEKO MODE ON =^.^=" : "NEKO MODE OFF"];
        break;
      default:
        out = [
          `Command not recognized: '${rawCmd}'. Type 'help' to see available commands.`,
        ];
    }

    setHistory((prev) => [...prev, { cmd: rawCmd, output: out }]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (soundEnabled && e.key !== "Enter") {
      retroSound.playKeypress();
    }
    if (e.key === "Enter") {
      executeCommand(inputVal);
    }
  };

  return (
    <section id="contact" data-reveal className="py-16 border-b-2 border-[#2b2723] bg-[#fffdf9]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Clear Section Header */}
        <div data-reveal-item={0} className="mb-10 pb-4 border-b-2 border-[#2b2723]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#8b5cf6] inline-block border border-[#2b2723]" />
            <span className="font-pixel text-[10px] text-[#575049]">
              06 // CONTACT &amp; CONNECT
            </span>
          </div>
          <h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723] pixel-wipe">
            GET IN TOUCH
          </h2>
        </div>

        <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Recruiter Contact Card (5 Cols) */}
          <div data-reveal-item={0} className="lg:col-span-5 bg-[#f4efe6] pixel-border-lg p-6 space-y-5">
            <div>
              <span className="font-pixel text-[9px] text-[#047857] bg-[#10b981]/20 border border-[#047857] px-2 py-0.5 inline-block mb-2">
                OPEN FOR FULL-STACK INTERNSHIP
              </span>
              <h3 className="font-pixel text-base text-[#2b2723]">
                Direct Contact Channels
              </h3>
              <p className="text-sm text-[#575049] mt-2 leading-relaxed">
                Interested in discussing Full-Stack Developer internships, production web projects, or engineering collaborations? Reach out directly below.
              </p>
            </div>

            <div className="bg-[#fffdf9] border-2 border-[#2b2723] p-4 space-y-3 font-mono text-xs">
              <div>
                <p className="text-[10px] font-pixel text-[#575049]">EMAIL ADDRESS</p>
                <p className="font-bold text-sm text-[#2b2723] mt-0.5 break-all">
                  {profile.socials.email}
                </p>
              </div>
              <div className="pt-2 border-t border-[#2b2723]/15">
                <p className="text-[10px] font-pixel text-[#575049]">LINKEDIN</p>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-xs text-[#2563eb] hover:underline mt-0.5 inline-block break-all"
                >
                  linkedin.com/in/i-gede-arthur-saka-dewantara
                </a>
              </div>
              <div className="pt-2 border-t border-[#2b2723]/15">
                <p className="text-[10px] font-pixel text-[#575049]">GITHUB PROFILE</p>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEnabled && retroSound.playLaser()}
                  className="font-bold text-xs text-[#2563eb] hover:underline mt-0.5 inline-block"
                >
                  github.com/Arthursakaa
                </a>
              </div>
              <div className="pt-2 border-t border-[#2b2723]/15">
                <p className="text-[10px] font-pixel text-[#575049]">UNIVERSITY &amp; LOCATION</p>
                <p className="font-bold text-xs text-[#2b2723] mt-0.5">
                  BINUS University • {profile.location}
                </p>
              </div>
            </div>

            {/* Direct CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <button
                type="button"
                suppressHydrationWarning
                onClick={copyEmail}
                className="pixel-btn w-full justify-center px-4 py-3 bg-[#10b981] text-white font-pixel text-[10px] hover:bg-[#059669] inline-flex items-center gap-2"
              >
                {copied ? (
                  <span key={copyTick} className="animate-confirm-pop inline-flex">
                    <PixelCheckIcon size={12} />
                  </span>
                ) : (
                  <PixelCopyIcon size={12} />
                )}
                <span>{copied ? "Email Copied to Clipboard!" : "Copy Email Address"}</span>
              </button>

              <a
                href={`mailto:${profile.socials.email}`}
                onClick={() => soundEnabled && retroSound.playLaser()}
                className="pixel-btn w-full justify-center px-4 py-3 bg-[#ea580c] text-white font-pixel text-[10px] hover:bg-[#c2410c] inline-flex items-center gap-2"
              >
                <PixelMailIcon size={12} />
                <span>Send Email Directly</span>
              </a>

              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEnabled && retroSound.playLaser()}
                className="pixel-btn w-full justify-center px-4 py-3 bg-[#2563eb] text-white font-pixel text-[10px] hover:bg-[#1d4ed8] inline-flex items-center gap-2"
              >
                <PixelExternalIcon size={12} />
                <span>Connect on LinkedIn</span>
              </a>

              <a
                href={profile.socials.githubRepos}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEnabled && retroSound.playLaser()}
                className="pixel-btn w-full justify-center px-4 py-3 bg-[#fffdf9] text-[#2b2723] font-pixel text-[10px] hover:bg-[#e9e2d5] inline-flex items-center gap-2"
              >
                <span>Explore GitHub Repositories</span>
                <PixelExternalIcon size={12} />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Developer Terminal (7 Cols) */}
          <div data-reveal-item={1} className="lg:col-span-7 space-y-6">
          <div className="bg-[#2b2723] text-[#f4efe6] pixel-border-lg p-5 sm:p-6 font-mono relative overflow-hidden">
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between border-b border-[#f4efe6]/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#ea580c] inline-block" />
                <span className="w-3 h-3 bg-[#eab308] inline-block" />
                <span className="w-3 h-3 bg-[#10b981] inline-block" />
                <span className="font-pixel text-[9px] text-[#e9e2d5] ml-2">
                  INTERACTIVE_TERMINAL.SH
                </span>
              </div>
              <span className="font-pixel text-[8px] text-[#10b981]">
                [READY]
              </span>
            </div>

            {/* Quick Command Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4 pb-3 border-b border-[#f4efe6]/10">
              <span className="text-[10px] text-[#a8a29e] mr-1">CLICK COMMAND:</span>
              {QUICK_COMMANDS.map((c) => (
                <button
                  key={c}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => executeCommand(c)}
                  className="px-2.5 py-1 text-[10px] font-mono bg-[#1f1b18] text-[#38bdf8] border border-[#38bdf8]/40 hover:bg-[#38bdf8] hover:text-black transition-colors cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Terminal Output History */}
            <div className="space-y-3 text-xs sm:text-sm max-h-64 overflow-y-auto pr-1 mb-4">
              {history.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  {item.cmd ? (
                    <p
                      className={`text-[#10b981] font-bold ${item.boot ? "boot-line" : ""}`}
                      style={item.boot ? ({ "--line": 0 } as React.CSSProperties) : undefined}
                    >
                      arthur@binus:~$ <span className="text-white">{item.cmd}</span>
                    </p>
                  ) : null}
                  <div className="bg-[#1f1b18] border-l-2 border-[#38bdf8] pl-3 py-2 space-y-1 text-xs text-[#e9e2d5]">
                    {item.output.map((line, lIdx) => (
                      <p
                        key={lIdx}
                        className={`leading-relaxed ${item.boot ? "boot-line" : ""}`}
                        style={item.boot ? ({ "--line": lIdx + 1 } as React.CSSProperties) : undefined}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Command Prompt Input */}
            <div className="flex items-center gap-2 bg-[#1f1b18] border border-[#f4efe6]/30 px-3 py-2.5">
              <label
                htmlFor="terminal-input"
                className="text-[#10b981] font-bold text-xs whitespace-nowrap"
              >
                arthur@binus:~$
              </label>
              <input
                id="terminal-input"
                type="text"
                suppressHydrationWarning
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type help, about, projects, skills, or clear..."
                className="w-full bg-transparent text-[#fffdf9] text-xs focus:outline-none placeholder:text-[#a8a29e]"
              />
            </div>
          </div>

          {/* BOT.v2's home, coin HUD, and draggable pet (plans 015, 016, 019) */}
          <ArcadeCorner soundEnabled={soundEnabled} />
          </div>
        </div>
      </div>
    </section>
  );
}
