# 004 — Tokenise the PixelCompanion crossfade easing

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW
- **Category**: Easing & cohesion/tokens
- **Estimated scope**: 1 file, 1 line (+ optionally 1 token reuse)

## Problem

`PixelCompanion.tsx` does a nice blur-masked crossfade when cycling tips — this
is exactly the technique the AUDIT playbook recommends for masking a state swap
(category 7). But the easing/duration are hand-typed Tailwind built-ins rather
than the repo's shared strong-easing token, so it drifts from the rest of the
app's motion feel (`.pixel-btn`, `.stagger-enter`, `.retro-dither` all use
`var(--ease-out-strong)`).

```tsx
/* src/components/PixelCompanion.tsx:77-79 — current */
className={`text-[#2b2723] font-vt tracking-wide text-lg sm:text-xl leading-snug transition-[filter,opacity] duration-150 ease-out ${
  isTransitioning ? "blur-[2px] opacity-60" : "blur-0 opacity-100"
}`}
```

The `ease-out` here is the weak CSS built-in, while the rest of the app uses
the strong `cubic-bezier(0.23, 1, 0.32, 1)`. There is also a JS timing coupling
to be aware of: the `setTimeout` that swaps the message is `140ms`
(`PixelCompanion.tsx:30`), and the CSS transition is `150ms` — close enough
that the swap happens at the blurriest point. Keep that relationship.

## Target

Swap the weak built-in easing for the repo's strong-easing curve via a Tailwind
arbitrary value, matching `--ease-out-strong` exactly. Duration stays `150ms`
to keep it aligned with the `140ms` JS swap.

```tsx
/* src/components/PixelCompanion.tsx:77-79 — target */
className={`text-[#2b2723] font-vt tracking-wide text-lg sm:text-xl leading-snug transition-[filter,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
  isTransitioning ? "blur-[2px] opacity-60" : "blur-0 opacity-100"
}`}
```

The blur stays at `2px` — well under the 20px budget the AUDIT playbook sets
for transition-time blur, and correct as a crossfade mask.

## Repo conventions to follow

- `--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1)` in `globals.css:26` is
  the canonical UI ease-out. `ease-[cubic-bezier(0.23,1,0.32,1)]` is the
  Tailwind-arbitrary spelling of it (this file uses Tailwind utilities, not the
  CSS variable directly, so inline the curve).
- Exemplar of this exact curve used as a transition elsewhere:
  `.retro-dither` in `globals.css:137`.

## Steps

1. In `src/components/PixelCompanion.tsx:77`, replace `ease-out` with
   `ease-[cubic-bezier(0.23,1,0.32,1)]`. Change nothing else on the line — keep
   `transition-[filter,opacity]`, `duration-150`, and the conditional
   `blur-[2px] opacity-60 / blur-0 opacity-100`.

## Boundaries

- Do NOT change the `140ms` setTimeout in `nextMessage`.
- Do NOT change the blur radius or opacity values.
- Do NOT touch the pulsing avatar button logic.
- Do NOT add dependencies.
- If `ease-out` is not present on the cited line (drift), STOP and report.

## Verification

- **Mechanical**: `npm run build` compiles clean.
- **Feel check**: `npm run dev`, scroll to the guide strip under the hero,
  click "Next tip" repeatedly:
  - The old tip blurs out and the new tip sharpens in; at normal speed it
    should feel like a crisp, decisive swap (the strong ease-out front-loads
    the motion) rather than the softer default.
  - In DevTools Animations panel at 10% speed, confirm the text never shows two
    fully-sharp overlapping strings — the blur masks the swap.
- **Done when**: the crossfade uses `cubic-bezier(0.23,1,0.32,1)` and feels
  consistent with button/press motion elsewhere.
