# 008 — Staggered scroll reveals for section contents (reveal engine v2)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: MEDIUM (additive — makes scrolling feel alive)
- **Category**: Missed opportunity / cohesion
- **Estimated scope**: 1 new file, 1 deleted file, `globals.css`, `layout.tsx`, `page.tsx`, 6 section components
- **Supersedes**: plan 005 (section-level fade-up). Plans 009 and 012 depend on this plan.

## Problem

Plan 005 made each below-the-fold `<section>` fade up 16px once, as a single
block. Two limits:

1. **Everything inside a section arrives at once.** A section with a header, a
   three-card grid, and a recruiter panel moves as one slab. The AUDIT playbook
   (category 7) says group entrances want a 30–80ms stagger.
2. **Tall sections reveal content the user can't see yet.** Projects and
   Timeline are taller than the viewport. The whole section reveals when its
   top edge appears, so the lower cards finish animating off-screen and are
   static by the time the user scrolls to them.

The current wiring is one hook per section. Example:

```tsx
/* src/components/ProjectsSection.tsx — current */
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
// ...
const revealRef = useRevealOnScroll<HTMLElement>();
// ...
<section id="projects" ref={revealRef} data-reveal className="py-16 border-b-2 border-[#2b2723] bg-[#f4efe6]">
```

```css
/* src/app/globals.css — current (section moves as one block) */
[data-reveal] {
  opacity: 0;
  translate: 0 16px;
  transition:
    opacity 480ms var(--ease-out-strong),
    translate 480ms var(--ease-out-strong);
}
[data-reveal][data-revealed="true"] {
  opacity: 1;
  translate: none;
}
```

## Target

A markup-driven reveal model with two attributes and one observer:

- `data-reveal` marks a **group**: an element that is observed and becomes
  `data-revealed="true"` the first time it scrolls into view. A group does not
  move by itself.
- `data-reveal-item="N"` marks an **item**: an element that fades up 12px when
  every `data-reveal` ancestor is revealed, delayed by `N × 60ms`.
- An element with **both** attributes reveals itself when it enters view (used
  for tall lists, so each card triggers at its own scroll position).
- One `<ScrollRevealObserver />` in `page.tsx` observes every group. A
  `MutationObserver` picks up groups mounted later (e.g. project cards that
  reappear after a filter change), so nothing can stay invisible.

Exact values:

| Value | Setting | Why |
| --- | --- | --- |
| Item duration | 400ms | Section-level explanatory entrance; the AUDIT allows >300ms for marketing/explanatory motion (plan 005 used 480ms for whole sections, items are smaller) |
| Item travel | `translate: 0 12px` | Smaller than 005's 16px because items are smaller than sections |
| Easing | `var(--ease-out-strong)` = `cubic-bezier(0.23, 1, 0.32, 1)` | Entering → strong ease-out (AUDIT §2) |
| Stagger | 60ms per index, indices 0–5 (max delay 300ms) | AUDIT §7: 30–80ms; capped so the last item starts by 300ms |
| Trigger | `threshold: 0`, `rootMargin: "0px 0px -12% 0px"` | Fires when the element's top passes 88% of the viewport height; works for elements of any height |

### Rule that prevents transition clashes (important)

`data-reveal-item` sets `transition` and `transition-delay` on the element.
**Never put `data-reveal-item` on an element that has its own transition**
(`.pixel-card-interactive`, `.pixel-btn`, or anything with a `transition-*`
class). One `transition` declaration would override the other: either the
hover lift breaks or gets delayed by up to 300ms, or the reveal stops
animating. Put the item attribute on a plain wrapper `<div>` instead. Every
step below already follows this rule.

### Why the `translate` property, not `transform`

A `transform` on an element makes it the containing block for descendant
`position: fixed/sticky` elements. That mis-positioned the CRT overlay in an
earlier bug (see the NOTE comment in `globals.css` above the current
`[data-reveal]` block). The individual `translate` property animates the same
way on the compositor and composes with any `transform` the element already
uses (e.g. the `.pixel-card-interactive:hover` lift).

## Repo conventions to follow

- Easing token: `--ease-out-strong` in `src/app/globals.css:26`.
- Client components start with `"use client";` (see `src/app/page.tsx:1`).
- Path alias `@/` → `src/` (e.g. `import { retroSound } from "@/lib/audio";`).
- Reduced motion is handled in two places in `globals.css`: inside
  `@media (prefers-reduced-motion: reduce)` and with `.reduce-motion` (the app's
  ANIM:OFF toggle, set on the root `<div>` in `page.tsx`). Every new hidden
  state must be overridden in **both** places.
- No Next.js-specific APIs are used here (plain React client component + DOM
  observers), so the `node_modules/next/dist/docs/` check required by
  `AGENTS.md` is not needed for this plan.

## Steps

### 1. Create `src/components/ScrollRevealObserver.tsx`

```tsx
"use client";

import { useEffect } from "react";

const GROUP_SELECTOR = '[data-reveal]:not([data-revealed="true"])';

/**
 * Marks every [data-reveal] group as data-revealed="true" the first time it
 * scrolls into view. Writes the attribute straight to the DOM (no React state,
 * so revealing never re-renders anything). The visuals live in globals.css.
 * Mount once, near the root of the page.
 */
export function ScrollRevealObserver() {
  useEffect(() => {
    const reveal = (el: Element) => {
      (el as HTMLElement).dataset.revealed = "true";
    };

    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(GROUP_SELECTOR).forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target); // run once
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );

    const observeWithin = (root: ParentNode) => {
      root.querySelectorAll(GROUP_SELECTOR).forEach((el) => io.observe(el));
    };

    observeWithin(document);

    // Groups mounted after first paint (e.g. project cards re-added by a filter)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(GROUP_SELECTOR)) io.observe(node);
          observeWithin(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
```

### 2. Mount it in `src/app/page.tsx`

Add the import next to the other component imports:

```tsx
import { ScrollRevealObserver } from "@/components/ScrollRevealObserver";
```

Render it as the first child of the root `<div className={`min-h-screen flex flex-col relative ...`}>`,
before the `{scanlines ? (...) : null}` overlay block:

```tsx
<ScrollRevealObserver />
```

### 3. Replace the reveal CSS in `src/app/globals.css`

Replace the whole block that starts with the comment
`/* Scroll-reveal for below-the-fold sections: composite-only fade-up, runs once.`
and ends with the `[data-reveal][data-revealed="true"] { ... }` rule with:

```css
/* Scroll reveal v2 (plan 008).
   [data-reveal]       = group: observed by ScrollRevealObserver, gets
                         data-revealed="true" once. A group never moves itself.
   [data-reveal-item]  = item: fades up when every ancestor group is revealed,
                         delayed by N x 60ms. An element with BOTH attributes
                         reveals itself when it enters view.
   Never put data-reveal-item on an element with its own transition
   (.pixel-card-interactive, .pixel-btn): wrap it in a plain <div> instead.
   Uses the `translate` property, not `transform`: a transform would make the
   element a containing block for fixed/sticky descendants. */
[data-reveal-item] {
  transition:
    opacity 400ms var(--ease-out-strong),
    translate 400ms var(--ease-out-strong);
}

[data-reveal]:not([data-revealed="true"]) [data-reveal-item],
[data-reveal-item][data-reveal]:not([data-revealed="true"]) {
  opacity: 0;
  translate: 0 12px;
}

[data-reveal-item="1"] { transition-delay: 60ms; }
[data-reveal-item="2"] { transition-delay: 120ms; }
[data-reveal-item="3"] { transition-delay: 180ms; }
[data-reveal-item="4"] { transition-delay: 240ms; }
[data-reveal-item="5"] { transition-delay: 300ms; }
```

### 4. Replace the reduced-motion overrides for reveals in `globals.css`

The hidden-state selector above has specificity (0,3,0), so the overrides
must use `!important`.

Inside `@media (prefers-reduced-motion: reduce) { ... }`, replace:

```css
  /* Sections are visible immediately; no movement */
  [data-reveal] {
    opacity: 1;
    translate: none;
    transition: none;
  }
```

with:

```css
  /* Reveal items are visible immediately; no movement */
  [data-reveal-item] {
    opacity: 1 !important;
    translate: none !important;
    transition: none !important;
  }
```

And replace the app-toggle block:

```css
/* App-level ANIM:OFF toggle mirrors the system preference for reveals */
.reduce-motion [data-reveal] {
  opacity: 1;
  translate: none;
  transition: none;
}
```

with:

```css
/* App-level ANIM:OFF toggle mirrors the system preference for reveals */
.reduce-motion [data-reveal-item] {
  opacity: 1 !important;
  translate: none !important;
  transition: none !important;
}
```

### 5. Update the no-JS fallback in `src/app/layout.tsx`

Replace:

```tsx
<style>{`[data-reveal]{opacity:1!important;translate:none!important}`}</style>
```

with:

```tsx
<style>{`[data-reveal-item]{opacity:1!important;translate:none!important}`}</style>
```

### 6. Remove the per-section hook from all six sections

In each of `AboutSection.tsx`, `ProjectsSection.tsx`, `SkillsInventory.tsx`,
`TimelineSection.tsx`, `ResumeSection.tsx`, `ContactTerminal.tsx`:

- Delete the line `import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";`
- Delete the line `const revealRef = useRevealOnScroll<HTMLElement>();`
- On the outer `<section>`, delete `ref={revealRef}` and **keep** `data-reveal`
  (the section stays a group).

Then delete the file `src/hooks/useRevealOnScroll.ts` and the now-empty
`src/hooks/` folder. Run `grep -r useRevealOnScroll src` afterwards; it must
return nothing.

### 7. Mark up items, section by section

Add only the attributes shown. Keep every existing `className`, `key`, and
handler unless a step says to move it.

**`src/components/AboutSection.tsx`**

- Section header `<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b-2 border-[#2b2723]">`
  → add `data-reveal-item={0}`.
- Pillars grid `<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">`
  → add `data-reveal` (group).
- Each pillar card has `pixel-card-interactive`, so wrap it. Change the map
  from `{PILLARS.map((pillar) => (` to `{PILLARS.map((pillar, i) => (` and
  replace the card's opening tag:
  ```tsx
  <div
    key={pillar.id}
    className="bg-[#f4efe6] pixel-border p-5 flex flex-col justify-between pixel-card-interactive"
  >
  ```
  with a wrapper plus the same card (the `key` moves to the wrapper, the card
  gains `h-full` so the cards stay equal height):
  ```tsx
  <div key={pillar.id} data-reveal-item={i} className="h-full">
    <div className="h-full bg-[#f4efe6] pixel-border p-5 flex flex-col justify-between pixel-card-interactive">
  ```
  Add one extra `</div>` to close the wrapper after the card's closing `</div>`.
- Recruiter panel `<div className="bg-[#f4efe6] pixel-border-lg p-5 sm:p-6">`
  → add `data-reveal data-reveal-item={0}` (reveals itself; it has no
  transition of its own).

**`src/components/ProjectsSection.tsx`**

- Section header `<div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-[#2b2723]">`
  → add `data-reveal-item={0}`.
- Each `<article>` has `pixel-card-interactive`, so wrap it. Replace:
  ```tsx
  <article
    key={project.id}
    className="bg-[#fffdf9] pixel-border-lg pixel-card-interactive flex flex-col justify-between overflow-hidden"
  >
  ```
  with:
  ```tsx
  <div key={project.id} data-reveal data-reveal-item={index % 2} className="h-full">
  <article className="h-full bg-[#fffdf9] pixel-border-lg pixel-card-interactive flex flex-col justify-between overflow-hidden">
  ```
  and add `</div>` right after the matching `</article>`. Each card reveals on
  its own when it scrolls in, and the right-hand card of a row lags by 60ms
  (`index % 2`).

**`src/components/SkillsInventory.tsx`**

- Section header `<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-10 pb-4 border-b-2 border-[#2b2723]">`
  → add `data-reveal-item={0}`.
- Category grid `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`
  → add `data-reveal` (group).
- Category card `<div key={category.name} className="bg-[#f4efe6] pixel-border p-4 flex flex-col justify-between">`
  → add `data-reveal-item={idx}` (it has no transition; `idx` is 0–3). Do NOT
  mark the inner skill rows; they have `pixel-card-interactive`.

**`src/components/TimelineSection.tsx`**

- Section header `<div className="mb-10 pb-4 border-b-2 border-[#2b2723]">`
  → add `data-reveal-item={0}`.
- Each entry `<div key={index} className="relative z-10 pl-10 sm:pl-16 group">`
  → add `data-reveal data-reveal-item={0}` (each entry reveals itself as it
  scrolls in). Do not touch the inner event card (`pixel-card-interactive`) or
  the checkpoint dot (`-translate-x-1/2` already uses `translate`).

**`src/components/ResumeSection.tsx`**

- Section header `<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-10 pb-4 border-b-2 border-[#2b2723]">`
  → add `data-reveal-item={0}`.
- Docket card `<div className="bg-[#fffdf9] pixel-border-lg p-5 sm:p-7">`
  → add `data-reveal` (group only, so its children don't double-move).
- Top control strip `<div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#2b2723] pb-3 mb-6">`
  → add `data-reveal-item={0}`.
- Left column `<div className="lg:col-span-7 space-y-4">` → add `data-reveal-item={1}`.
- Right column `<div className="lg:col-span-5 flex flex-col justify-center">` → add `data-reveal-item={2}`.

**`src/components/ContactTerminal.tsx`**

- Section header `<div className="mb-10 pb-4 border-b-2 border-[#2b2723]">`
  → add `data-reveal-item={0}`.
- Two-column grid `<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">`
  → add `data-reveal` (group).
- Contact card `<div className="lg:col-span-5 bg-[#f4efe6] pixel-border-lg p-6 space-y-5">`
  → add `data-reveal-item={0}`.
- Terminal `<div className="lg:col-span-7 bg-[#2b2723] text-[#f4efe6] pixel-border-lg p-5 sm:p-6 font-mono relative overflow-hidden">`
  → add `data-reveal-item={1}`.

## Boundaries

- Do NOT add reveals to `HeroSection`, `PlayerCard`, `PixelCompanion`,
  `HeaderNav`, or `Footer`. The hero keeps its on-load `.stagger-enter`.
- Do NOT put `data-reveal-item` on any element with `pixel-card-interactive`,
  `pixel-btn`, or a `transition-*` class.
- Do NOT nest an item inside another item (double movement). The item map above
  has no nesting; keep it that way.
- Do NOT use `transform` for reveals; use `translate`.
- Do NOT add dependencies.
- If any cited element or className is not found as written (drift), STOP and
  report that file instead of improvising.

## Verification

- **Mechanical**:
  - `npx tsc --noEmit` passes.
  - `npm run build` (`next build --webpack`) passes.
  - `npx eslint src` reports nothing new. One error at `src/app/page.tsx:24`
    (`react-hooks/set-state-in-effect`) existed before this plan.
  - `grep -r useRevealOnScroll src` returns nothing.
- **Feel check** (`npm run dev`, hard reload):
  - Scroll slowly from the hero down. In each section, the header arrives
    first, then the content follows 60ms apart. Nothing moves more than ~12px.
  - Projects: each card reveals as it enters the viewport; the right card of a
    row lags the left by a beat. Cards in lower rows are still animating when
    you reach them, not already static.
  - Timeline: each entry reveals at its own scroll position.
  - Scroll back up and down: nothing replays.
  - Hover a pillar card, a project card, a timeline card: the lift responds
    immediately (no 60–300ms lag). A lag means an item attribute landed on an
    element with its own transition.
  - Change the Projects filter (e.g. "AI & ML" then "All Projects"): re-added
    cards fade in; none stay invisible.
  - Click every nav link: you never land on invisible content.
  - Click ANIM:OFF, reload: everything is visible, nothing moves. Do the same
    with DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce".
  - DevTools Animations panel at 10%: items animate `opacity` and `translate`
    only.
- **Done when**: all six sections stagger their contents on scroll, tall lists
  reveal per card, hover lifts are not delayed, nothing replays, and reduced
  motion shows everything statically.
