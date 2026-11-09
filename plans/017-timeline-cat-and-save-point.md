# 017 — Cat walks down the Timeline spine + "SAVE POINT" crystal

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive)
- **Category**: Missed opportunity (scroll-linked, cat touch)
- **Estimated scope**: `TimelineSection.tsx`, `globals.css` (+1 block)
- **Depends on**: 014 (sprites), 011 (the `--spine` view timeline)

## Problem

The Experience section is narrower than the others (`max-w-4xl`), so wide
screens have empty margins, and its header has nothing on the right (the other
section headers have a description there). The spine already draws itself with
scroll (plan 011), but nothing travels along it.

## Target

### A. A cat that walks down the spine as you scroll

An orange pixel cat (`CatWalkSprite`, 14×10 at 2× = 28×20px) is rotated 90°
so it faces down and its feet touch the spine. It rides the tip of the spine:
same timeline (`--spine`) and same range (`entry 0% exit 0%`) as the spine
itself, so cat and tip always line up. Its legs alternate **only while you
scroll** (the leg frames also run on the scroll timeline), and stop when you
stop.

Positioning trick (composite-only, no `top` animation):

- `.timeline-cat-track` is absolutely positioned and has the **full height of
  the path**, zero width, sitting just right of the spine.
- The cat sits at the track's **bottom**.
- The track animates `translate: 0 -100%` → `0 0`. Percentages are of the
  track's own height, which equals the path height, so at progress `p` the cat
  is exactly at `p × height`. That is where the spine's tip is.

Spine geometry (from `TimelineSection.tsx`): `before:left-4 sm:before:left-6
before:w-1` → spine right edge at **20px** (mobile) and **28px** (≥640px).
Cards start at `pl-10` (40px) and `sm:pl-16` (64px), so the rotated cat
(20px wide) fits exactly in the gap on mobile.

Static fallback (no view-timeline support, OS reduced motion, or ANIM:OFF):
no animation, so the track rests at `translate: none` and the cat sits at the
bottom of the path, next to the last checkpoint ("Current Quest"). Legs show
frame A.

### B. "SAVE POINT" crystal in the Timeline header

A 10×9 crystal (`SAVE_CRYSTAL`, 3× = 30×27px) with a `SAVE POINT` label sits on
the right of the header, hidden below 640px. It bobs 3px in two hard steps
every 1.2s. This is the one deliberate idle loop on the page besides BOT's
blink, and it is cheap (a single `translate`).

## Repo conventions to follow

- Scroll timelines live inside `@supports (animation-timeline: view())`, use
  `1ms` durations, and have overrides in both the reduced-motion media query and
  `.reduce-motion` (see plan 011's block in `globals.css`).
- The path container has `space-y-6`, which adds bottom margins to all children
  except the last. Put the cat track **last** so it gets no margin.
- Sprites are `aria-hidden` (plan 014).

## Steps

### 1. `src/components/TimelineSection.tsx`

- Imports:
  ```tsx
  import { CatWalkSprite } from "@/components/sprites/CatSprites";
  import { PixelSprite } from "@/components/sprites/PixelSprite";
  import { BASE_PALETTE, SAVE_CRYSTAL } from "@/components/sprites/spriteData";
  ```
- Header: change
  ```tsx
  <div data-reveal-item={0} className="mb-10 pb-4 border-b-2 border-[#2b2723]">
  ```
  to
  ```tsx
  <div data-reveal-item={0} className="mb-10 pb-4 border-b-2 border-[#2b2723] flex items-end justify-between gap-4">
  ```
  wrap its two existing children (the label row `<div className="flex items-center gap-2 mb-1">…</div>`
  and the `<h2>`) in a plain `<div>`, and add after that wrapper:
  ```tsx
  <div aria-hidden="true" className="hidden sm:flex flex-col items-center gap-1 shrink-0">
    <PixelSprite layers={[{ rows: SAVE_CRYSTAL }]} palette={BASE_PALETTE} scale={3} className="save-bob" />
    <span className="font-pixel text-[8px] text-[#575049]">SAVE POINT</span>
  </div>
  ```
- Path: after the `{timeline.map(...)}` block, as the **last child** of
  `<div className="timeline-spine space-y-6 relative before:…">`, add:
  ```tsx
  <div aria-hidden="true" className="timeline-cat-track">
    <div className="timeline-cat">
      <CatWalkSprite scale={2} />
    </div>
  </div>
  ```

### 2. `src/app/globals.css`

Add after the plan 016 pet block:

```css
/* Timeline cat (plan 017). The track is as tall as the path; translating it by
   -100% of its own height moves the cat from the top of the path to the bottom,
   on the same --spine timeline as the spine, so it rides the spine's tip. */
.timeline-cat-track {
  position: absolute;
  top: 0;
  left: 20px; /* right edge of the spine: left-4 (16px) + w-1 (4px) */
  width: 0;
  height: 100%;
  z-index: 5;
  pointer-events: none;
}

@media (min-width: 640px) {
  .timeline-cat-track { left: 28px; } /* sm:left-6 (24px) + 4px */
}

.timeline-cat {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 20px;
  height: 28px;
}

/* Sprite is 28x20; rotate it to face down with its feet against the spine */
.timeline-cat svg {
  position: absolute;
  left: -4px;
  top: 4px;
  rotate: 90deg;
}

@keyframes catTrack {
  from { translate: 0 -100%; }
  to   { translate: 0 0; }
}

@keyframes catLegsA {
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes catLegsB {
  0%   { opacity: 0; }
  50%  { opacity: 1; }
  100% { opacity: 1; }
}

@supports (animation-timeline: view()) {
  .timeline-cat-track {
    animation: catTrack 1ms linear both;
    animation-timeline: --spine;
    animation-range: entry 0% exit 0%;
  }

  /* 24 leg cycles over the path: legs move only while the page scrolls */
  .timeline-cat .cat-legs-a {
    animation: catLegsA 1ms step-end 24 both;
    animation-timeline: --spine;
    animation-range: entry 0% exit 0%;
  }

  .timeline-cat .cat-legs-b {
    animation: catLegsB 1ms step-end 24 both;
    animation-timeline: --spine;
    animation-range: entry 0% exit 0%;
  }
}

/* Save-point crystal: 3px bob in two hard steps */
@keyframes saveBob {
  0%   { translate: 0 0; }
  50%  { translate: 0 -3px; }
  100% { translate: 0 -3px; }
}

.save-bob {
  animation: saveBob 1.2s step-end infinite;
}

@media (prefers-reduced-motion: reduce) {
  .timeline-cat-track,
  .timeline-cat .cat-legs-a,
  .timeline-cat .cat-legs-b,
  .save-bob {
    animation: none !important;
  }
}

.reduce-motion .timeline-cat-track,
.reduce-motion .timeline-cat .cat-legs-a,
.reduce-motion .timeline-cat .cat-legs-b,
.reduce-motion .save-bob {
  animation: none !important;
}
```

## Boundaries

- Do NOT change the spine's classes or plan 011's rules.
- Do NOT animate `top`; use the track `translate`.
- Do NOT make the cat interactive (`pointer-events: none`).
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src`, `npm run build` pass.
- **Alignment check** (Chrome DevTools console, Experience section on screen):
  ```js
  const p = document.querySelector(".timeline-spine");
  const cat = document.querySelector(".timeline-cat").getBoundingClientRect();
  const tip = p.getBoundingClientRect().top + p.offsetHeight * parseFloat(getComputedStyle(p, "::before").scale.split(" ")[1] ?? 1);
  Math.abs(cat.bottom - tip) // expect < 2 (px)
  ```
  Check it at three scroll positions inside the section.
- **Leg check**: scroll a few pixels and read
  `getComputedStyle(document.querySelector(".timeline-cat .cat-legs-a")).opacity`.
  It must flip between `1` and `0` as you scroll, and stay put when you stop.
  If it never flips, iteration counts are not honoured on scroll timelines in
  that browser. In that case replace the two leg rules with a single 24-step
  keyframe: `catLegsA` with 48 keyframes alternating `1/0` at `0%, 2.083%, …`,
  `catLegsB` inverted, `animation-iteration-count: 1`.
- **Feel check** (`npm run dev`):
  - Scrolling into Experience: the cat walks down next to the spine, its head
    at the spine's tip, legs moving while you scroll. Scrolling up walks it back.
  - The cat never overlaps the cards or the checkpoint dots, at 390px and 1366px.
  - SAVE POINT crystal bobs in the header at ≥640px and is hidden below.
  - ANIM:OFF / reduced motion: the cat sits at the bottom next to "Current
    Quest", and the crystal is still.
- **Done when**: the cat rides the spine tip with scroll-driven legs, and both
  sprites are static under reduced motion.
