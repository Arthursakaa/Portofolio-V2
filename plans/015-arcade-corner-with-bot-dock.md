# 015 — "Arcade Corner" under the Contact terminal, with BOT.v2's dock

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive)
- **Category**: Missed opportunity (empty space + rare delight)
- **Estimated scope**: 1 new component, `ContactTerminal.tsx` (wrapper change)
- **Depends on**: 014 (sprite kit). Plans 016, 019, 020 build on this corner.

## Problem

In the Contact section the two columns have very different heights. At 1366px
the terminal (right column) ends around 600px into the section, while the
contact card on the left runs past 900px. That leaves an empty block of roughly
300px under the terminal. BOT.v2, the site's guide robot, only exists as the
CSS avatar in the guide strip under the hero.

Current right column (`src/components/ContactTerminal.tsx`):

```tsx
{/* Right Column: Interactive Developer Terminal (7 Cols) */}
<div data-reveal-item={1} className="lg:col-span-7 bg-[#2b2723] text-[#f4efe6] pixel-border-lg p-5 sm:p-6 font-mono relative overflow-hidden">
  ...terminal...
</div>
```

## Target

The right column becomes a stack: the terminal, then an **Arcade Corner**
panel. The corner is BOT.v2's home ("dock") and, later, the coin-hunt HUD.

- Panel: same card language as the rest of the site
  (`bg-[#f4efe6] pixel-border-lg p-5`), header strip `ARCADE CORNER` with the
  pixelarticons `Gamepad` icon, a small pixel "room" with a floor line, BOT.v2
  standing on a charging pad, and a speech bubble.
- BOT.v2 blinks (`sprite-blink` from plan 014). Clicking or pressing
  Enter/Space on it makes it hop and say the next line. The blip is
  `retroSound.playBlip(750, "triangle", 0.05)`, the same sound as the guide
  strip avatar.
- This plan is fully static on every device: no dragging yet (that is 016).
- Speech lines (cycle in order):
  1. `BEEP BOOP! I'm BOT.v2.`
  2. `Arthur built me with zero image files.`
  3. `Hiring an intern? Scroll up for the Role Matcher!`
  4. `Psst... 5 coins are hidden on this page.` (true once plan 019 ships;
     until then leave it out of the array)

Because the global SFX safety net in `page.tsx` plays `playSelect()` on every
button click and throttles the next sound, the dock button gets
`data-sfx="none"` so its own blip plays instead.

## Repo conventions to follow

- `retroSound` already no-ops when SFX is off (`canPlay()` checks `enabled`
  in `src/lib/audio.ts`), so components call it directly without a
  `soundEnabled` prop.
- pixelarticons: import named components from the package root, e.g.
  `import { Gamepad } from "@nsmr/pixelart-react";`. Never use its `Icon`
  component (it imports the whole icon map). The package has
  `"sideEffects": false`, so only named imports are bundled.
- Reveal: the new wrapper takes over `data-reveal-item={1}` from the terminal.
  Never nest items, and never put an item on an element with its own
  transition (plan 008).
- Re-keying an element replays a one-shot CSS animation (same trick as the copy
  pop in `ContactTerminal.tsx`, `key={copyTick}`).

## Steps

### 1. Create `src/components/arcade/ArcadeCorner.tsx`

```tsx
"use client";

import { useState } from "react";
import { Gamepad } from "@nsmr/pixelart-react";
import { BotSprite } from "@/components/sprites/BotSprite";
import { retroSound } from "@/lib/audio";

const BOT_LINES = [
  "BEEP BOOP! I'm BOT.v2.",
  "Arthur built me with zero image files.",
  "Hiring an intern? Scroll up for the Role Matcher!",
] as const;

export function ArcadeCorner() {
  const [lineIdx, setLineIdx] = useState(0);
  const [hopTick, setHopTick] = useState(0);

  const pokeBot = () => {
    retroSound.playBlip(750, "triangle", 0.05);
    setHopTick((t) => t + 1);
    setLineIdx((i) => (i + 1) % BOT_LINES.length);
  };

  return (
    <div className="bg-[#f4efe6] pixel-border-lg p-5">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b-2 border-[#2b2723] pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Gamepad size={16} className="text-[#2b2723]" aria-hidden="true" />
          <span className="font-pixel text-[10px] text-[#2b2723]">ARCADE CORNER</span>
        </div>
        <span className="font-pixel text-[8px] text-[#575049]">PLAYER 2: BOT.v2</span>
      </div>

      {/* Pixel room */}
      <div className="relative flex items-end gap-4 min-h-[120px] border-b-2 border-[#2b2723] pb-0">
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            suppressHydrationWarning
            data-sfx="none"
            data-pet-dock
            onClick={pokeBot}
            aria-label="BOT.v2 mascot. Click to say hi"
            title="Say hi to BOT.v2"
            className="relative cursor-pointer p-1 focus-visible:outline-2"
          >
            <span key={hopTick} className={`block ${hopTick > 0 ? "sprite-hop" : ""}`}>
              <BotSprite className="sprite-blink" scale={4} />
            </span>
          </button>
          {/* Charging pad */}
          <span aria-hidden="true" className="block w-16 h-2 bg-[#2b2723] border-t-2 border-[#10b981]" />
        </div>

        {/* Speech bubble */}
        <p
          aria-live="polite"
          className="mb-8 max-w-[260px] bg-[#fffdf9] border-2 border-[#2b2723] shadow-[2px_2px_0_0_#2b2723] px-3 py-2 font-vt text-lg leading-tight text-[#2b2723]"
        >
          {BOT_LINES[lineIdx]}
        </p>
      </div>

      <p className="mt-3 font-mono text-[11px] text-[#575049]">
        Tap BOT.v2 to say hi.
      </p>
    </div>
  );
}
```

### 2. Rewire the right column in `src/components/ContactTerminal.tsx`

- Add the import: `import { ArcadeCorner } from "@/components/arcade/ArcadeCorner";`
- Replace the terminal's opening tag:
  ```tsx
  <div data-reveal-item={1} className="lg:col-span-7 bg-[#2b2723] text-[#f4efe6] pixel-border-lg p-5 sm:p-6 font-mono relative overflow-hidden">
  ```
  with a wrapper plus the terminal (the terminal loses `data-reveal-item` and
  `lg:col-span-7`):
  ```tsx
  <div data-reveal-item={1} className="lg:col-span-7 space-y-6">
  <div className="bg-[#2b2723] text-[#f4efe6] pixel-border-lg p-5 sm:p-6 font-mono relative overflow-hidden">
  ```
- The terminal's closing `</div>` is the one right after the
  `{/* Live Command Prompt Input */}` block. Directly after it, insert:
  ```tsx
  <ArcadeCorner />
  </div>
  ```
  The new `</div>` closes the wrapper. Count the tags afterwards: the
  `</div>` that closes the grid, the `</div>` that closes `max-w-6xl`, and
  `</section>` must still follow.

## Boundaries

- Do NOT change the terminal's contents, commands, or the boot sequence.
- Do NOT make BOT draggable here (plan 016).
- Do NOT add a coin HUD here (plan 019).
- Do NOT add dependencies (pixelarticons is already installed).
- If the terminal is not `data-reveal-item={1}` with `lg:col-span-7` (drift),
  STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src`, `npm run build` pass.
- **Feel check** (`npm run dev`):
  - At 1366px the corner fills most of the empty space under the terminal; the
    right column no longer ends far above the left one.
  - BOT.v2 blinks every few seconds. Clicking it makes it hop and show the next
    line. Keyboard: Tab to it, press Enter → same result, with a visible orange
    focus ring.
  - With SFX on, the click plays the triangle blip, not the generic select click.
  - Scroll into Contact: the terminal and corner fade up together as one item;
    the terminal boot lines still print.
  - ANIM:OFF: no blink, no hop, and the line still changes.
  - At 390px the corner stacks under the terminal and fits without horizontal
    scrolling.
- **Done when**: BOT.v2 has a home under the terminal that works with mouse,
  touch, and keyboard.
