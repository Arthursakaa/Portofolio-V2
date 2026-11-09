# 010 — Scroll progress "XP bar" on the header (CSS scroll timeline)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive)
- **Category**: Missed opportunity (scroll-linked, retro moment)
- **Estimated scope**: `HeaderNav.tsx` (+1 element), `globals.css` (+1 block)
- **Depends on**: plan 009 (the header must actually stick, or the bar scrolls
  away and is never seen)

## Problem

On a long single page there is no sense of how far along you are. The site's
game theme suggests an obvious, cheap affordance: an experience bar that fills
as you scroll, drawn over the header's bottom border.

Current header opening tag (after plan 009):

```tsx
/* src/components/HeaderNav.tsx */
<header className="relative sm:sticky top-0 z-40 bg-[#f4efe6]/95 backdrop-blur-sm border-b-2 border-[#2b2723] px-3 sm:px-4 py-2">
```

## Target

A 3px orange bar along the bottom edge of the header. It scales from 0 to the
full width as the page scrolls from top to bottom, in **48 chunky steps**
(`steps(48)`), so it fills like an 8-bit meter instead of a smooth line.

- Driven by `animation-timeline: scroll(root block)`: pure CSS, runs on the
  compositor, no scroll listeners.
- Animates the individual `scale` property (composite-only, and not `transform`,
  see plan 008 for why).
- Browsers without scroll-timeline support don't show the bar at all
  (`display: none` by default, enabled inside `@supports`). Support: Chrome/Edge
  115+, Safari 26+, Firefox 159+.
- Easing: `steps(48, end)`. Scroll-linked motion is constant motion, which the
  AUDIT maps to `linear`; `steps()` is linear progress quantised into blocks,
  chosen deliberately for the retro personality.

Markup, added as the **last child** of `<header>` (after the
`<div className="max-w-6xl mx-auto ...">` row):

```tsx
{/* Scroll progress "XP bar": fills in 48 steps as the page scrolls (globals.css .xp-bar) */}
<div aria-hidden="true" className="xp-bar absolute inset-x-0 -bottom-[2px] h-[3px] bg-[#ea580c]" />
```

`-bottom-[2px]` puts the bar on top of the header's 2px bottom border, so the
ink line visibly fills orange from left to right.

CSS, added to `src/app/globals.css` after the scroll-reveal block from plan 008:

```css
/* Scroll progress "XP bar" (plan 010). Hidden unless scroll timelines are
   supported. Animates `scale`, not `transform`. */
.xp-bar {
  display: none;
}

@keyframes xpFill {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}

@supports (animation-timeline: scroll()) {
  .xp-bar {
    display: block;
    transform-origin: left center;
    animation: xpFill 1ms steps(48, end) both;
    animation-timeline: scroll(root block);
  }
}
```

The `1ms` duration is intentional. With a scroll timeline, a time duration is
converted to "the whole scroll range". A non-zero value is the most compatible
way to write that, and it also behaves the same when the app's reduced-motion
rules force `animation-duration: 0.01ms`.

### Reduced motion: the bar stays on

The bar moves only because the user scrolled. It does not move content or slide
anything into view, and it tells you where you are on the page. The AUDIT says
reduced motion means fewer, gentler animations, not zero, and to keep the ones
that help comprehension. So no reduced-motion override is added. The global
clamps in `globals.css` (`animation-duration: 0.01ms`,
`animation-iteration-count: 1`) still give a full single iteration across the
scroll range. The verification step confirms this.

## Repo conventions to follow

- Accent orange `#ea580c` (`--color-retro-orange`, `globals.css`) is the
  brand's progress/attention colour.
- Decorative elements get `aria-hidden="true"` (see the ping dot in
  `PlayerCard.tsx`).

## Steps

1. In `src/components/HeaderNav.tsx`, add the XP bar `<div>` (from Target) as
   the last child inside `<header>`, after the closing `</div>` of
   `<div className="max-w-6xl mx-auto flex flex-wrap ...">`.
2. In `src/app/globals.css`, add the `.xp-bar`, `@keyframes xpFill`, and
   `@supports` block from Target after the scroll-reveal v2 block.

## Boundaries

- Do NOT add a scroll event listener or React state for this.
- Do NOT animate `width`; use `scale`.
- Do NOT change the header's border or layout.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` pass. In DevTools
  console, `CSS.supports("animation-timeline: scroll()")` → `true` in Chrome.
- **Feel check** (`npm run dev`, hard reload, width ≥ 640px):
  - At the top of the page the header's bottom border is plain ink.
  - Scrolling down fills it orange from the left in visible blocks; at the very
    bottom it is fully orange. Scrolling up empties it.
  - Click ANIM:OFF: the bar still tracks scrolling. Do the same with DevTools →
    Rendering → "Emulate CSS prefers-reduced-motion: reduce".
  - Below 640px the header is not sticky (plan 009), so the bar is only visible
    near the top. This is expected.
  - In a browser without scroll timelines the header looks exactly as before.
- **Done when**: the header border fills in 48 steps proportional to scroll
  position, with no JavaScript involved.
