# 012 — Pixel-wipe reveal for section headings (retro moment)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive)
- **Category**: Missed opportunity / cohesion (signature retro moment)
- **Estimated scope**: 6 section components (+1 class each), `globals.css`
  (+1 block), `layout.tsx` (noscript fallback)
- **Depends on**: plan 008 (uses the section `[data-reveal]` group state)

## Problem

After plan 008, every section's header block fades up. The pixel-font `h2`
headings are the strongest retro element on the page, but they arrive the same
way as everything else. One consistent, retro-specific move on all six
headings would give the scroll a signature without adding noise.

The six headings (one per section):

| File | Heading text |
| --- | --- |
| `AboutSection.tsx` | `WHAT I DO & BRING TO A TEAM` |
| `ProjectsSection.tsx` | `FEATURED ENGINEERING WORK` |
| `SkillsInventory.tsx` | `TECH STACK & TOOLS` |
| `TimelineSection.tsx` | `ACADEMIC & PROJECT TIMELINE` |
| `ResumeSection.tsx` | `CURRICULUM VITAE` |
| `ContactTerminal.tsx` | `GET IN TOUCH` |

Each is `<h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723]">` inside
the section header block that plan 008 marks `data-reveal-item={0}`.

## Target

When the section's group is revealed, the heading is uncovered left to right in
12 hard steps, like a cartridge title being drawn. It uses
`clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` (AUDIT §8 recommends
`clip-path: inset()` reveals, and the animation-performance skill lists
`clip-path` as composited in current Chrome/Firefox).

| Value | Setting |
| --- | --- |
| Duration | 480ms |
| Timing | `steps(12, end)`, a deliberate retro quantisation |
| Delay | 120ms (starts after the header block begins fading up) |
| Hidden state | `clip-path: inset(0 100% 0 0)` while the section group is not revealed |

`steps()` instead of an ease-out curve is a personality choice (AUDIT §7:
motion should match the product's personality). A pixel-font heading that
appears in blocks reads as 8-bit. It is used only here, on six headings that
each animate once, so it stays a signature rather than a gimmick.

CSS, added to `src/app/globals.css` after the timeline spine block (plan 011),
or after the scroll-reveal v2 block if 011 is not done yet:

```css
/* Pixel-wipe for section headings (plan 012). Uncovers left to right in 12
   steps once the section group is revealed. */
.pixel-wipe {
  transition: clip-path 480ms steps(12, end) 120ms;
}

[data-reveal]:not([data-revealed="true"]) .pixel-wipe {
  clip-path: inset(0 100% 0 0);
}

@media (prefers-reduced-motion: reduce) {
  .pixel-wipe {
    clip-path: none !important;
    transition: none !important;
  }
}

.reduce-motion .pixel-wipe {
  clip-path: none !important;
  transition: none !important;
}
```

The `h2` has its own transition, but it is not a `data-reveal-item` (the item
attribute is on its parent header block), so it follows plan 008's rule that
items and own-transition elements never share an element.

## Repo conventions to follow

- Reduced motion is overridden in both places (`@media` and `.reduce-motion`).
- The no-JS fallback lives in `src/app/layout.tsx` inside `<noscript><style>`.

## Steps

1. In each of the six files above, add `pixel-wipe` to the `h2` className,
   e.g. `<h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723] pixel-wipe">`.
   Do not touch other headings (`h3`, hero `h1`).
2. In `src/app/globals.css`, add the CSS from Target.
3. In `src/app/layout.tsx`, extend the noscript style so headings are never
   clipped without JS. Replace:
   ```tsx
   <style>{`[data-reveal-item]{opacity:1!important;translate:none!important}`}</style>
   ```
   with:
   ```tsx
   <style>{`[data-reveal-item]{opacity:1!important;translate:none!important}.pixel-wipe{clip-path:none!important}`}</style>
   ```

## Boundaries

- Only the six section `h2` elements get `pixel-wipe`.
- Do NOT add `steps()` timing anywhere else.
- Do NOT add dependencies.
- If plan 008 is not in place (no `[data-reveal]` on the six `<section>`s),
  STOP: the hidden state would never be released.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` pass.
- **Feel check** (`npm run dev`, hard reload):
  - Scroll to each section: the header block fades up, and a beat later the
    heading is uncovered left to right in visible blocks, finishing within about
    0.6s.
  - On a phone width where a heading wraps to two lines, both lines uncover
    together. That is expected.
  - Scroll back up and down: no replay.
  - ANIM:OFF and "Emulate prefers-reduced-motion: reduce": headings are fully
    visible immediately.
  - DevTools Animations panel at 10%: 12 distinct jumps, no smooth sweep.
- **Done when**: all six headings pixel-wipe once on first reveal and are never
  clipped under reduced motion or without JS.
