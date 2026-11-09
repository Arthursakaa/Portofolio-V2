# 011 — Timeline spine draws itself as you scroll (CSS view timeline)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive)
- **Category**: Missed opportunity (scroll-linked)
- **Estimated scope**: `TimelineSection.tsx` (+1 class), `globals.css` (+1 block)
- **Depends on**: plan 009 (scroll timelines must bind to the root scroller).
  Do it after plan 008, which also edits `TimelineSection.tsx`.

## Problem

The Experience section is a vertical path of checkpoints. The path's spine is
a static 4px ink line drawn with a `::before` pseudo-element:

```tsx
/* src/components/TimelineSection.tsx — current */
<div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-1 before:bg-[#2b2723] before:z-0">
```

A timeline is the one place on the page where motion can carry meaning: the
line can "travel" down to each checkpoint as the reader moves through it.

## Target

The spine scales from 0 to its full height in step with scrolling. Its tip
tracks a line at 65% of the viewport height, so the spine reaches each
checkpoint just as that checkpoint is in comfortable reading position.

- A named view timeline on the path container: `view-timeline: --spine block`.
- `view-timeline-inset: 0 35%` shrinks the bottom of the view range by 35%, so
  "entering view" happens at the 65% line instead of the bottom edge.
- `animation-range: entry 0% exit 0%`: progress runs from the path's top
  crossing the 65% line (0%) to the path's bottom crossing it (100%). The tip
  therefore sits on that line the whole way down.
- Animates the `scale` property on `::before`, from `scale: 1 0` to `scale: 1 1`,
  with `transform-origin: top`. Composite-only.
- Easing `linear`: scroll-linked progress should map 1:1 to scroll (AUDIT §2,
  constant motion).
- Unsupported browsers keep today's full static spine (rules live in
  `@supports`).

CSS, added to `src/app/globals.css` after the XP bar block from plan 010:

```css
/* Timeline spine draws with scroll (plan 011). The container owns a named view
   timeline; its ::before (the spine) reads it. Tip tracks the 65% line. */
@keyframes spineGrow {
  from { scale: 1 0; }
  to   { scale: 1 1; }
}

@supports (animation-timeline: view()) {
  .timeline-spine {
    view-timeline: --spine block;
    view-timeline-inset: 0 35%;
  }

  .timeline-spine::before {
    transform-origin: top;
    animation: spineGrow 1ms linear both;
    animation-timeline: --spine;
    animation-range: entry 0% exit 0%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-spine::before {
    animation: none !important;
    scale: none !important;
  }
}

.reduce-motion .timeline-spine::before {
  animation: none !important;
  scale: none !important;
}
```

Unlike the XP bar, this spine moves content-like geometry (a line sweeping down
the page), so under reduced motion it is shown fully drawn and static.

## Repo conventions to follow

- Reduced motion is overridden in both `@media (prefers-reduced-motion: reduce)`
  and `.reduce-motion` (see the existing blocks at the end of `globals.css`).
- `1ms` duration on scroll timelines, same as plan 010 (time durations are
  converted to the full range; non-zero is the most compatible form).

## Steps

1. In `src/components/TimelineSection.tsx`, add `timeline-spine` to the
   className of the path container (the `<div className="space-y-6 relative before:absolute ...">`).
   Keep every existing class.
2. In `src/app/globals.css`, add the CSS from Target after the XP bar block.

## Boundaries

- Do NOT change the spine's position, width, or colour classes.
- Do NOT animate `height`; use `scale`.
- Do NOT touch the checkpoint dots or event cards (plan 008 handles their
  reveal).
- Do NOT add dependencies.
- If the path container does not use `before:` utilities for the spine
  (drift), STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` pass.
- **Timeline check** (DevTools console, Chrome, with the Experience section on
  screen):
  `getComputedStyle(document.querySelector(".timeline-spine"), "::before").animationName`
  → `"spineGrow"`.
- **Feel check** (`npm run dev`, hard reload):
  - Scroll toward Experience: the spine is short when the section enters and
    its tip stays roughly two-thirds of the way down the screen as you scroll.
    It reaches each checkpoint dot as that entry comes into reading position.
  - Scrolling back up retracts it smoothly.
  - When the bottom of the timeline passes the 65% line, the spine is fully
    drawn.
  - ANIM:OFF and "Emulate prefers-reduced-motion: reduce": the spine is fully
    drawn and static.
  - DevTools Animations panel: only `scale` animates.
- **Done when**: the spine draws in step with scrolling, stays fully drawn
  under reduced motion, and is unchanged in browsers without view timelines.
