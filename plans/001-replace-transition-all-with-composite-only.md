# 001 — Replace `transition-all` with composite-only transitions

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files, ~2 line edits

## Problem

`transition: all` animates every changed property, including non-GPU
properties like `box-shadow` and `background-color`, which run off the
compositor (layout/paint). On a hover that swaps `box-shadow`, the browser
repaints every frame instead of compositing a cached layer. The AUDIT playbook
flags `transition: all` as "always a finding."

Two locations use it:

```tsx
/* src/components/MiniPixelDev.tsx:21 — current */
className="inline-flex items-center justify-center bg-[#fffdf9] border-2 border-[#2b2723] px-2 py-1 shadow-[2px_2px_0_0_#2b2723] hover:shadow-[3px_3px_0_0_#ea580c] transition-all cursor-pointer select-none active:scale-95"
```

```tsx
/* src/app/not-found.tsx:18 — current */
className="inline-block px-5 py-3 bg-[#10b981] text-white font-pixel text-xs border-2 border-[#2b2723] shadow-[3px_3px_0_0_#2b2723] hover:bg-[#059669] transition-all"
```

In MiniPixelDev the hover changes `box-shadow` (offset + color) and `:active`
changes `transform: scale`. `transition-all` means both the shadow paint and
the transform are tweened together with the Tailwind default easing/duration.
In not-found the hover changes only `background-color`.

## Target

Name the exact properties being animated so the compositor only tracks what it
must, and give explicit durations/easing that match the repo's button feel
(the `.pixel-btn` utility uses `150ms var(--ease-out-strong)` for transform).

```tsx
/* src/components/MiniPixelDev.tsx:21 — target */
className="inline-flex items-center justify-center bg-[#fffdf9] border-2 border-[#2b2723] px-2 py-1 shadow-[2px_2px_0_0_#2b2723] hover:shadow-[3px_3px_0_0_#ea580c] transition-[box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer select-none active:scale-95"
```

```tsx
/* src/app/not-found.tsx:18 — target */
className="inline-block px-5 py-3 bg-[#10b981] text-white font-pixel text-xs border-2 border-[#2b2723] shadow-[3px_3px_0_0_#2b2723] hover:bg-[#059669] transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
```

Rationale for the easing literal: Tailwind v4 arbitrary easing
`ease-[cubic-bezier(0.23,1,0.32,1)]` resolves to the exact curve stored in the
repo token `--ease-out-strong` (`globals.css:26`). `box-shadow` on the pixel
dev is unavoidable (the pixel aesthetic uses stepped shadows for the hover
lift) — naming it explicitly keeps the transform on its own composited channel
and stops unintended properties from tweening.

## Repo conventions to follow

- Strong easing token lives in `src/app/globals.css:26`:
  `--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);`
- The exemplar button transition is `.pixel-btn` in `globals.css:84-93`, which
  lists properties explicitly:
  `transition: transform 150ms var(--ease-out-strong), background-color 150ms ease, color 150ms ease, border-color 150ms ease;`
- These two call sites use Tailwind utility classes (not the `.pixel-btn`
  class), so express the transition with Tailwind arbitrary values rather than
  editing CSS.

## Steps

1. In `src/components/MiniPixelDev.tsx:21`, replace `transition-all` with
   `transition-[box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]`.
   Leave every other class (including `hover:shadow-...` and `active:scale-95`)
   untouched.
2. In `src/app/not-found.tsx:18`, replace `transition-all` with
   `transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]`. The
   only animated property on this element is `background-color`, so
   `transition-colors` is the correct narrow scope.

## Boundaries

- Do NOT touch any other component.
- Do NOT change markup, colors, shadow values, or the hover/active targets —
  only the transition declaration.
- Do NOT add new dependencies.
- If `transition-all` is not present at the cited line (drift), STOP and report.

## Verification

- **Mechanical**: run `npm run build` (which uses `next build --webpack`) and
  confirm it compiles with no new type or lint errors.
- **Feel check**: run the UI (`npm run dev`), then:
  - Hover the mini pixel developer badge in the header. The stepped shadow
    should shift to the orange offset shadow smoothly over ~150ms; the badge
    should not jump.
  - Open a non-existent route (e.g. `/does-not-exist`) and hover the
    "RETURN TO HOME BASE" button; the green background should ease to the
    darker green over ~150ms.
  - In DevTools Performance panel, record a hover and confirm no layout
    thrash warnings beyond the expected paint for `box-shadow`.
- **Done when**: no `transition-all` remains in `src/` (grep returns nothing)
  and both hovers animate only their intended properties.
