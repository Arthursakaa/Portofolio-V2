"use client";

import { useEffect, useRef } from "react";
import { Gamepad, Trophy } from "@nsmr/pixelart-react";
import { PixelSprite } from "@/components/sprites/PixelSprite";
import { BASE_PALETTE, COIN } from "@/components/sprites/spriteData";
import { COIN_COUNT, useArcade } from "@/lib/arcadeStore";
import { retroSound } from "@/lib/audio";
import { toggleNekoMode } from "./ArcadeCorner";

interface ArcadeHintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

const COIN_HINTS = [
  { index: 0, title: "Coin 01 // About Section", clue: "Terselip di sudut atas kartu 01 About & Capabilities." },
  { index: 1, title: "Coin 02 // Projects Section", clue: "Tersembunyi di bawah galeri Selected Projects." },
  { index: 2, title: "Coin 03 // Timeline Section", clue: "Berada di samping jalur Academic & Project Timeline." },
  { index: 3, title: "Coin 04 // Resume Section", clue: "Menempel di bagian bawah Curriculum Vitae Docket." },
  { index: 4, title: "Coin 05 // Contact Terminal", clue: "Di dekat terminal interaktif atau area Arcade Corner." },
];

export function ArcadeHintsModal({ isOpen, onClose, soundEnabled }: ArcadeHintsModalProps) {
  const { coins, neko } = useArcade();
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (soundEnabled) retroSound.playSelect();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, soundEnabled]);

  if (!isOpen) return null;

  const handleToggleNeko = () => {
    if (soundEnabled) retroSound.playSelect();
    toggleNekoMode();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="arcade-hints-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b2723]/65 backdrop-blur-xs animate-confirm-pop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (soundEnabled) retroSound.playSelect();
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-[#fffdf9] pixel-border-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto no-scrollbar relative shadow-[6px_6px_0_0_#2b2723]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#2b2723] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-[#ea580c] border border-[#2b2723]" />
            <div>
              <h2 id="arcade-hints-title" className="font-pixel text-xs sm:text-sm text-[#2b2723] flex items-center gap-2">
                <Gamepad size={14} className="text-[#ea580c]" />
                ARCADE SECRETS &amp; HINTS
              </h2>
              <p className="font-mono text-[11px] text-[#575049] mt-0.5">
                Buku panduan rahasia easter eggs &amp; interaktivitas tersembunyi
              </p>
            </div>
          </div>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              if (soundEnabled) retroSound.playSelect();
              onClose();
            }}
            aria-label="Tutup petunjuk arcade"
            className="pixel-btn px-2.5 py-1 bg-[#f4efe6] hover:bg-[#e9e2d5] text-[#2b2723] font-pixel text-[9px]"
          >
            [✕ ESC]
          </button>
        </div>

        {/* Content Modules */}
        <div className="space-y-4">
          {/* 1. Neko Mode / Konami Code */}
          <div className="bg-[#f4efe6] pixel-border p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] bg-[#ea580c] text-[#fffdf9] px-2 py-0.5">
                SECRET CHEAT // 01
              </span>
              <span className="font-pixel text-[8px] text-[#2b2723]">
                STATUS: {neko ? "ENABLED =^.^=" : "LOCKED"}
              </span>
            </div>
            <h3 className="font-pixel text-xs text-[#2b2723]">KONAMI CODE &bull; NEKO MODE</h3>
            <p className="font-mono text-xs text-[#2b2723] leading-relaxed">
              Tekan kombinasi tombol panah keyboard secara berurutan di mana saja:
            </p>
            <div className="flex flex-wrap items-center gap-1.5 py-1">
              {["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"].map((key, i) => (
                <span
                  key={i}
                  className="font-pixel text-[10px] bg-[#fffdf9] border border-[#2b2723] px-2 py-1 shadow-[1px_1px_0_0_#2b2723]"
                >
                  {key}
                </span>
              ))}
            </div>
            <p className="font-mono text-[11px] text-[#575049]">
              Efek: Memasangkan telinga kucing retro pada BOT.v2 &amp; mengaktifkan sound effect khusus.
              Bisa juga diketik langsung <code className="bg-[#fffdf9] px-1 border border-[#2b2723]">neko</code> di terminal kontak!
            </p>
            <div className="pt-1">
              <button
                type="button"
                suppressHydrationWarning
                onClick={handleToggleNeko}
                className={`pixel-btn px-3 py-1.5 font-pixel text-[9px] ${
                  neko ? "bg-[#10b981] text-white" : "bg-[#2b2723] text-white"
                }`}
              >
                {neko ? "DISABLE NEKO MODE" : "TEST TOGGLE NEKO MODE NOW"}
              </button>
            </div>
          </div>

          {/* 2. Hidden Coins Quest */}
          <div className="bg-[#f4efe6] pixel-border p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] bg-[#eab308] text-[#2b2723] px-2 py-0.5">
                SIDE QUEST // 02
              </span>
              <span className="font-pixel text-[8px] text-[#2b2723] flex items-center gap-1">
                <PixelSprite layers={[{ rows: COIN }]} palette={BASE_PALETTE} scale={1.2} />
                {coins.length}/{COIN_COUNT} DITEMUKAN
              </span>
            </div>
            <h3 className="font-pixel text-xs text-[#2b2723] flex items-center gap-2">
              <Trophy size={14} className="text-[#ca8a04]" />
              PERBURUAN 5 KOIN EMAS TERSEMBUNYI
            </h3>
            <p className="font-mono text-xs text-[#2b2723] leading-relaxed">
              Ada 5 koin emas 8-bit yang berkilau di sepanjang halaman web ini. Klik koin untuk mengumpulkannya:
            </p>
            <div className="space-y-1.5 pt-1">
              {COIN_HINTS.map((h) => {
                const isFound = coins.includes(h.index);
                return (
                  <div
                    key={h.index}
                    className={`flex items-start gap-2 p-2 border ${
                      isFound
                        ? "bg-[#10b981]/10 border-[#10b981] text-[#047857]"
                        : "bg-[#fffdf9] border-[#2b2723]/30 text-[#2b2723]"
                    }`}
                  >
                    <span className="font-pixel text-[8px] mt-0.5">
                      {isFound ? "[✓]" : "[?]"}
                    </span>
                    <div className="text-[11px] font-mono leading-tight">
                      <span className="font-bold">{h.title}</span>
                      <p className="text-[10px] text-[#575049] mt-0.5">{h.clue}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. BOT.v2 Drag & Drop Mascot */}
          <div className="bg-[#f4efe6] pixel-border p-3.5 space-y-2">
            <span className="font-pixel text-[9px] bg-[#2563eb] text-[#fffdf9] px-2 py-0.5 inline-block">
              COMPANION // 03
            </span>
            <h3 className="font-pixel text-xs text-[#2b2723]">INTERAKSI MASKOT BOT.v2</h3>
            <ul className="font-mono text-xs text-[#2b2723] space-y-1 list-disc list-inside">
              <li>
                <strong>Klik / Sentuh:</strong> Sapa BOT.v2 untuk melihat reaksi emosional (^ ^ senang, gelombang antena, dan obrolan lucu).
              </li>
              <li>
                <strong>Tahan &amp; Seret (Desktop):</strong> Tarik BOT.v2 keluar dari doknya! BOT akan mengambang dan memiliki gravitasi fisika saat dilepas.
              </li>
              <li>
                <strong>Idle Sleep:</strong> Jika didiamkan tanpa interaksi, BOT.v2 akan tertidur lelap dengan partikel mimpi zZz.
              </li>
            </ul>
          </div>

          {/* 4. Terminal Commands */}
          <div className="bg-[#f4efe6] pixel-border p-3.5 space-y-2">
            <span className="font-pixel text-[9px] bg-[#2b2723] text-[#fffdf9] px-2 py-0.5 inline-block">
              TERMINAL CLI // 04
            </span>
            <h3 className="font-pixel text-xs text-[#2b2723]">PERINTAH SHELL INTERAKTIF</h3>
            <p className="font-mono text-xs text-[#2b2723]">
              Gunakan terminal di bawah ini untuk eksplorasi cepat seperti engineer profesional:
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {["help", "about", "projects", "skills", "cv", "email", "coins", "neko", "clear"].map((c) => (
                <code
                  key={c}
                  className="bg-[#fffdf9] border border-[#2b2723] px-2 py-0.5 shadow-[1px_1px_0_0_#2b2723]"
                >
                  {c}
                </code>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t-2 border-[#2b2723] flex items-center justify-between">
          <p className="font-mono text-[10px] text-[#575049]">
            Progres tersimpan otomatis di memori browser Anda.
          </p>
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              if (soundEnabled) retroSound.playSelect();
              onClose();
            }}
            className="pixel-btn px-4 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-pixel text-[9px]"
          >
            MENGERTI!
          </button>
        </div>
      </div>
    </div>
  );
}
