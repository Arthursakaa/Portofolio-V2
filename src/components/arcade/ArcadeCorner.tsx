"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Gamepad, Trophy } from "@nsmr/pixelart-react";
import { BotSprite } from "@/components/sprites/BotSprite";
import { PixelSprite } from "@/components/sprites/PixelSprite";
import { BASE_PALETTE, COIN } from "@/components/sprites/spriteData";
import { arcade, COIN_COUNT, useArcade } from "@/lib/arcadeStore";
import { retroSound } from "@/lib/audio";

// Draggable pet: separate chunk, only rendered on fine pointers after idle (plan 016)
const PetLayer = dynamic(() => import("./PetLayer").then((m) => m.PetLayer), { ssr: false });

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
function subscribeFinePointer(onChange: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getFinePointer = () => window.matchMedia(FINE_POINTER).matches;
const getServerFinePointer = () => false;

const BOT_LINES = [
  "BEEP BOOP! I'm BOT.v2.",
  "Arthur built me with zero image files.",
  "Hiring an intern? Scroll up for the Role Matcher!",
  "Psst... 5 coins are hidden on this page.",
] as const;
const BOT_LINES_COMPLETE = [...BOT_LINES, "You found every coin. Arthur would love to hear from you!"] as const;

const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

/** Toggles neko mode (plan 020). Used by the Konami listener and the terminal `neko` command. */
export function toggleNekoMode() {
  const next = !arcade.getState().neko;
  arcade.setNeko(next);
  if (next) retroSound.playPowerUp();
  else retroSound.playPowerDown();
  arcade.showToast(next ? "NEKO MODE ON =^.^=" : "NEKO MODE OFF");
}

export function ArcadeCorner() {
  const { petOut, neko, coins } = useArcade();
  const finePointer = useSyncExternalStore(subscribeFinePointer, getFinePointer, getServerFinePointer);
  const [idle, setIdle] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [hopTick, setHopTick] = useState(0);

  const allCoins = coins.length === COIN_COUNT;
  const lines = allCoins ? BOT_LINES_COMPLETE : BOT_LINES;
  const petEnabled = finePointer && idle;

  // Load the pet chunk only once the browser is idle, and only on fine pointers
  useEffect(() => {
    if (!finePointer) return;
    // Older Safari lacks requestIdleCallback even though the DOM types always include it
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => setIdle(true), 1200);
    return () => window.clearTimeout(t);
  }, [finePointer]);

  // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A toggles neko mode (plan 020)
  useEffect(() => {
    let step = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && t.closest("input, textarea, select, [contenteditable='true']")) return;
      const key = e.key.toLowerCase();
      if (key === KONAMI[step]) {
        step += 1;
        if (step === KONAMI.length) {
          step = 0;
          toggleNekoMode();
        }
      } else {
        step = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pokeBot = () => {
    if (petOut || arcade.justDragged()) return;
    retroSound.playBlip(750, "triangle", 0.05);
    setHopTick((t) => t + 1);
    setLineIdx((i) => (i + 1) % lines.length);
  };

  return (
    <div className="bg-[#f4efe6] pixel-border-lg p-5">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b-2 border-[#2b2723] pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Gamepad size={16} className="text-[#2b2723]" aria-hidden="true" />
          <span className="font-pixel text-[10px] text-[#2b2723]">ARCADE CORNER</span>
        </div>
        <span className="flex items-center gap-1.5 font-pixel text-[8px] text-[#2b2723]">
          <PixelSprite layers={[{ rows: COIN }]} palette={BASE_PALETTE} scale={1.5} />
          COINS {coins.length}/{COIN_COUNT}
        </span>
      </div>

      {/* Pixel room */}
      <div className="relative flex items-end gap-4 min-h-[120px] border-b-2 border-[#2b2723]">
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            suppressHydrationWarning
            data-sfx="none"
            data-pet-dock
            onClick={pokeBot}
            aria-disabled={petOut}
            aria-label={petOut ? "BOT.v2 is out exploring" : "BOT.v2 mascot. Click to say hi"}
            title={petOut ? "BOT.v2 is out exploring" : "Say hi to BOT.v2"}
            style={petEnabled ? { touchAction: "none" } : undefined}
            className={`relative p-1 ${petOut ? "cursor-default" : petEnabled ? "cursor-grab" : "cursor-pointer"}`}
          >
            {petOut ? (
              <span className="block w-12 h-14" />
            ) : (
              <span key={hopTick} className={`block ${hopTick > 0 ? "sprite-hop" : ""}`}>
                <BotSprite neko={neko} className="sprite-blink" scale={4} />
              </span>
            )}
          </button>
          {/* Charging pad */}
          <span aria-hidden="true" className="block w-16 h-2 bg-[#2b2723] border-t-2 border-[#10b981]" />
        </div>

        {/* Speech bubble */}
        <p
          aria-live="polite"
          className="mb-8 max-w-[260px] bg-[#fffdf9] border-2 border-[#2b2723] shadow-[2px_2px_0_0_#2b2723] px-3 py-2 font-vt text-lg leading-tight text-[#2b2723]"
        >
          {petOut ? "BRB, exploring the page!" : lines[lineIdx % lines.length]}
        </p>
      </div>

      {allCoins ? (
        <p className="mt-3 inline-flex items-center gap-2 font-pixel text-[9px] text-[#ca8a04]">
          <Trophy size={16} aria-hidden="true" /> COIN COLLECTOR
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-[#575049]">
          {petEnabled ? "Drag BOT.v2 out to play. It follows you around the page." : "Tap BOT.v2 to say hi."}
        </p>
        {petOut ? (
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => arcade.setPetOut(false)}
            className="pixel-btn px-2.5 py-1 font-pixel text-[8px] bg-[#fffdf9] text-[#2b2723] hover:bg-[#e9e2d5]"
          >
            CALL BOT HOME
          </button>
        ) : null}
      </div>

      {petEnabled ? <PetLayer /> : null}
    </div>
  );
}
