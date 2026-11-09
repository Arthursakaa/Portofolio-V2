# 009 — Make the page scroll on the root (fixes the sticky header, enables scroll timelines)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: HIGH (existing bug + prerequisite for plans 010 and 011)
- **Category**: Performance / correctness of scroll-linked motion
- **Estimated scope**: `globals.css` (2 rules + 1 block), `HeaderNav.tsx` (1 class)

## Problem

`globals.css` sets `overflow-x: hidden` on both `html` and `body`:

```css
/* src/app/globals.css — current */
html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  overflow-x: hidden;
}
```

When `overflow-x` is `hidden`, the browser computes `overflow-y` as `auto`,
which turns `<body>` into a scroll container. Body never actually scrolls (the
page scrolls on `<html>`), but it is still the "nearest scroll container" for
everything inside it. That breaks two things, both measured in headless Chrome
at 1366×800 (current build):

| Check | Current (`hidden`) | With `overflow-x: clip` |
| --- | --- | --- |
| Computed `overflow-y` of `html` / `body` | `auto` / `auto` | `visible` / `visible` |
| Header `top` after scrolling 2000px | **-2000px** (scrolls away) | **0px** (sticks) |
| Scroller that `animation-timeline: view()` binds to | **`body`** (never scrolls) | `html` |
| `view()` progress for an element centred in the viewport | **6%** (wrong) | 40% (tracks scroll) |

1. **The sticky header has never stuck.** `HeaderNav` uses `sticky top-0`,
   but sticky positions relative to its nearest scroll container (`body`),
   which never scrolls, so the header scrolls away with the page.
2. **CSS scroll-driven animations would read the wrong scroller.** `view()` and
   `scroll()` (nearest) bind to `body` and barely move. Plans 010 and 011
   depend on this being fixed.

`overflow-x: clip` hides horizontal overflow the same way `hidden` does, but it
does not create a scroll container. Support: Chrome 90+, Firefox 81+,
Safari 16+.

## Target

```css
/* src/app/globals.css — target */
html {
  scroll-behavior: smooth;
  overflow-x: clip;
  /* Sticky header must not cover anchor targets. Values = measured header
     height + ~8px. Header heights: 136.5px <640px (not sticky there),
     101px 640–1279px, 55px >=1280px. Re-measure if the header layout changes. */
  scroll-padding-top: 0;
}

@media (min-width: 640px) {
  html { scroll-padding-top: 112px; }
}

@media (min-width: 1280px) {
  html { scroll-padding-top: 64px; }
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  overflow-x: clip;
}
```

Header (`src/components/HeaderNav.tsx`), opening `<header>` tag:

```tsx
/* current */
<header className="sticky top-0 z-40 bg-[#f4efe6]/95 backdrop-blur-sm border-b-2 border-[#2b2723] px-3 sm:px-4 py-2">
/* target */
<header className="relative sm:sticky top-0 z-40 bg-[#f4efe6]/95 backdrop-blur-sm border-b-2 border-[#2b2723] px-3 sm:px-4 py-2">
```

**Why the header is not sticky below 640px.** Below 640px the header is three
rows (brand, toggles, nav) and 136.5px tall, which is 17% of an 800px phone
screen. Pinning that much chrome on a phone costs more than it gives. From
640px up it is 101px (two rows), and from 1280px up it is 55px (one row).
`relative` keeps the header a positioned element on mobile, which plan 010
needs for its absolutely positioned progress bar.

This is a product decision. If sticky on phones is wanted, use `sticky` at all
widths and set the base `scroll-padding-top` to `144px`.

## Repo conventions to follow

- Global element rules live at the top of `src/app/globals.css` (`html`,
  `body` blocks right after `:root`). Edit them in place.
- `PROJECT_CONTEXT.md` §3 describes the navbar as sticky; this plan makes the
  code match that intent.

## Steps

1. In `src/app/globals.css`, in the `html { ... }` block, change
   `overflow-x: hidden;` to `overflow-x: clip;` and add the
   `scroll-padding-top: 0;` line with the comment from the Target. Add the two
   `@media` blocks right after the `html` block.
2. In the `body { ... }` block, change `overflow-x: hidden;` to
   `overflow-x: clip;`.
3. In `src/components/HeaderNav.tsx`, change `sticky top-0` on the `<header>`
   to `relative sm:sticky top-0`. Leave every other class as-is.

## Boundaries

- Do NOT change `scroll-behavior: smooth` or the `prefers-reduced-motion`
  override that sets `scroll-behavior: auto`.
- Do NOT change the header's background, blur, border, or layout classes.
- Do NOT use `overflow: hidden` anywhere on `html`/`body` again; it brings the
  bug back. Use `clip`.
- Do NOT add dependencies.
- If `overflow-x: hidden` is not on both `html` and `body` (drift), STOP and
  report.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` pass.
- **Scroller check** (DevTools console on the running page, width ≥ 640px):
  - `getComputedStyle(document.body).overflowY` → `"visible"`.
  - Scroll down a few screens, then
    `document.querySelector("header").getBoundingClientRect().top` → `0`.
- **Feel check** (`npm run dev`, hard reload):
  - At ≥ 640px the header stays pinned while you scroll; below 640px it
    scrolls away.
  - Click each nav link (About … Contact) at 1366px and at 1024px: the
    section's top border lands just below the header, not hidden under it.
  - The page still has no horizontal scrollbar and cannot be dragged sideways
    on a phone (DevTools device mode, 390px).
  - "Back to Top" in the footer still scrolls smoothly to the top.
  - With CRT on, the scanline overlay still covers the whole viewport.
- **Done when**: the header sticks at ≥ 640px, anchors land below it, and
  `document.body` is no longer a scroll container.
