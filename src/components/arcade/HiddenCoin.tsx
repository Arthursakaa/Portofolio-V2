"use client";

import { useState } from "react";
import { PixelSprite } from "@/components/sprites/PixelSprite";
import { BASE_PALETTE, COIN } from "@/components/sprites/spriteData";
import { arcade, COIN_COUNT, prefersReducedMotion, useArcade } from "@/lib/arcadeStore";
import { retroSound } from "@/lib/audio";

/** One collectible coin for the hidden coin hunt (plan 019). */
export function HiddenCoin({ index, className }: { index: number; className: string }) {
  const { coins } = useArcade();
  const [collecting, setCollecting] = useState(false);
  if (coins.includes(index)) return null;

  const collect = () => {
    if (collecting) return;
    retroSound.playCoin();
    setCollecting(true);
    window.setTimeout(() => {
      const total = arcade.collectCoin(index);
      if (total === COIN_COUNT) arcade.showToast("ACHIEVEMENT UNLOCKED: COIN COLLECTOR");
    }, prefersReducedMotion() ? 0 : 360);
  };

  return (
    <div className={`${className} z-10`}>
      <button
        type="button"
        suppressHydrationWarning
        data-sfx="none"
        onClick={collect}
        aria-label={`Hidden coin ${index + 1} of ${COIN_COUNT}`}
        title="A shiny coin!"
        className={`relative block cursor-pointer p-1 ${collecting ? "coin-collect" : "coin-bob"}`}
      >
        <PixelSprite layers={[{ rows: COIN }]} palette={BASE_PALETTE} scale={3} />
        {collecting ? (
          <span aria-hidden="true" className="absolute -top-3 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-[#ca8a04]">
            +1
          </span>
        ) : null}
      </button>
    </div>
  );
}
