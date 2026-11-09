# 018 — Sleeping cat in the footer that wakes on "Back to Top"

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive)
- **Category**: Missed opportunity (rare delight, cat touch)
- **Estimated scope**: `Footer.tsx`, `globals.css` (+1 block)
- **Depends on**: 014 (sprites). Story link: the cat from plan 017 walks the
  timeline and naps at the end of the page.

## Problem

The footer is a dark strip with credits on the left and "Back to Top" on the
right, with empty space between. It is the end of the page, a natural spot for
a small reward.

Current right side (`src/components/Footer.tsx`):

```tsx
{/* Back to top button */}
<button
  type="button"
  suppressHydrationWarning
  onClick={scrollToTop}
  aria-label="Return to top of page"
  className="pixel-btn px-4 py-2 bg-[#f4efe6] text-[#2b2723] font-pixel text-[9px] hover:bg-white inline-flex items-center gap-2"
>
```

## Target

- A curled orange cat (`CatSleepSprite`, 14×6 at 3× = 42×18px) sleeps just
  left of the "Back to Top" button. On the dark footer the outline uses
  `DARK_BG_PALETTE` (paper outline), so it stays visible.
- Three pixel `z` letters float up and fade in turn (2.4s loop, 0.8s apart).
  This is the only motion while asleep.
- Clicking "Back to Top" wakes the cat for 1.2s: the `z`s disappear, a `!`
  bubble pops above it, and the cat hops once (plan 014's `.sprite-hop`).
  The scroll to top happens as before.
- Reduced motion / ANIM:OFF: no floating `z`s (they stay as a static `z`),
  and no hop. The `!` still appears, since it is an instant state change, not
  movement.

## Repo conventions to follow

- One-shot animations are replayed by re-keying (`key={wakeTick}`), like the
  copy pop in `ContactTerminal.tsx`.
- `setTimeout` inside an event handler to reset state is fine; there is no
  effect.
- Fonts: `font-pixel` for the `z` and `!` glyphs.

## Steps

### 1. `src/components/Footer.tsx`

- Imports: `import { useState } from "react";`,
  `import { CatSleepSprite } from "@/components/sprites/CatSprites";`,
  `import { DARK_BG_PALETTE } from "@/components/sprites/spriteData";`
- State and handler:
  ```tsx
  const [wakeTick, setWakeTick] = useState(0);
  const [awake, setAwake] = useState(false);

  const scrollToTop = () => {
    if (soundEnabled) retroSound.playWarp();
    setAwake(true);
    setWakeTick((t) => t + 1);
    window.setTimeout(() => setAwake(false), 1200);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  ```
  (Keep the existing `playWarp` line; only the three state lines are new.)
- Wrap the existing "Back to Top" `<button>` in a row with the cat:
  ```tsx
  <div className="flex items-end gap-4">
    <div aria-hidden="true" className="relative pb-1">
      {awake ? (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-pixel text-[10px] text-[#eab308]">!</span>
      ) : (
        <span className="footer-zzz absolute -top-6 right-0 font-pixel text-[8px] text-[#a8a29e]">
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </span>
      )}
      <span key={wakeTick} className={`block ${wakeTick > 0 ? "sprite-hop" : ""}`}>
        <CatSleepSprite scale={3} palette={DARK_BG_PALETTE} />
      </span>
    </div>
    {/* existing Back to Top <button> unchanged */}
  </div>
  ```

### 2. `src/app/globals.css`

Add after the plan 017 block:

```css
/* Footer cat "zzz" (plan 018): three letters float up and fade in turn */
.footer-zzz span {
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0;
  animation: footerZ 2.4s steps(4, end) infinite;
}

.footer-zzz span:nth-child(2) { animation-delay: 0.8s; }
.footer-zzz span:nth-child(3) { animation-delay: 1.6s; }

@keyframes footerZ {
  0%   { opacity: 0; translate: 0 0; }
  20%  { opacity: 1; }
  100% { opacity: 0; translate: 6px -14px; }
}

@media (prefers-reduced-motion: reduce) {
  .footer-zzz span { animation: none !important; }
  .footer-zzz span:first-child { opacity: 1; }
}

.reduce-motion .footer-zzz span { animation: none !important; }
.reduce-motion .footer-zzz span:first-child { opacity: 1; }
```

## Boundaries

- Do NOT change the Back to Top button's classes, label, or scroll behaviour.
- Do NOT make the cat itself clickable.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src`, `npm run build` pass.
- **Feel check** (`npm run dev`, scroll to the bottom):
  - A small orange cat with a light outline sleeps next to "Back to Top", with
    `z`s drifting up one after another in small hard steps.
  - Click "Back to Top": a yellow `!` pops above the cat, it hops once, and the
    page scrolls up. Scroll back down after a second: it's asleep again.
  - At 390px the footer stacks (existing `flex-col`); the cat stays next to the
    button and nothing overflows.
  - ANIM:OFF: one static `z`, no hop; the `!` still shows on click.
- **Done when**: the footer cat sleeps, wakes on Back to Top, and is calm under
  reduced motion.
