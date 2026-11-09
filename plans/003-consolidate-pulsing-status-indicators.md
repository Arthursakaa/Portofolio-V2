# 003 — Calm the perpetual pulsing status indicators

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW
- **Category**: Physicality & cohesion
- **Estimated scope**: 3 files, class-level edits only

## Problem

Several small status dots run Tailwind's default perpetual loops
(`animate-pulse` = opacity 1→.5→1 forever; `animate-ping` = scale 1→2 +
fade forever). Individually each is a fine "live/available" affordance, but
they run on unrelated elements across the page simultaneously, and none of
them are gated by the app's `reducedMotion` toggle (they rely only on the
global duration clamp). The AUDIT playbook treats forever-loops as something to
justify or reduce.

Locations:

```tsx
/* src/components/HeaderNav.tsx:58 — brand "online" dot */
<span className="w-3 h-3 bg-[#10b981] border border-[#2b2723] inline-block animate-pulse" />
```

```tsx
/* src/components/PlayerCard.tsx:135 — availability dot */
<span className="w-2 h-2 bg-[#10b981] animate-ping" />
```

```tsx
/* src/components/ResumeSection.tsx:51 — docket "live" dot */
<span className="w-2.5 h-2.5 bg-[#10b981] border border-[#2b2723] inline-block animate-pulse" />
```

The `animate-ping` on the PlayerCard is the strongest offender: its default
Tailwind keyframe scales the element to 2x and fades — on a 2px dot with a
border it reads as a faint flicker rather than a deliberate "radar ping," and
it has no second element behind it to ping over.

## Target

Keep ONE deliberate, well-formed pulsing indicator as the single "I am
available" focal point (the PlayerCard availability bar — it is the most
meaningful placement for a recruiter), and make it a proper ping with a static
dot plus an expanding ring. Reduce the two incidental brand/docket dots to
static (no loop), since their "live" meaning is decorative and they compete for
attention.

Target for the PlayerCard availability dot — a static core dot with a separate
pinging ring layered behind it (standard Tailwind ping pattern):

```tsx
/* src/components/PlayerCard.tsx — target (replaces the single animate-ping span) */
<span className="relative inline-flex w-2 h-2">
  <span className="absolute inline-flex h-full w-full rounded-none bg-[#10b981] opacity-75 motion-safe:animate-ping" />
  <span className="relative inline-flex w-2 h-2 bg-[#10b981]" />
</span>
```

Target for the two decorative dots — drop the loop, keep the colour:

```tsx
/* src/components/HeaderNav.tsx:58 — target */
<span className="w-3 h-3 bg-[#10b981] border border-[#2b2723] inline-block" />
```

```tsx
/* src/components/ResumeSection.tsx:51 — target */
<span className="w-2.5 h-2.5 bg-[#10b981] border border-[#2b2723] inline-block" />
```

Note the `motion-safe:` variant on the surviving ping: Tailwind's `motion-safe:`
only applies the animation when the user has NOT requested reduced motion, so
the single remaining loop is automatically a11y-gated without extra JS.

## Repo conventions to follow

- The app uses hard pixel edges (no rounded corners anywhere). Use
  `rounded-none` on the ping ring to keep the square 8-bit silhouette — do NOT
  introduce `rounded-full`.
- Accent green for "available/live" is `#10b981` throughout (see
  `globals.css:13`, used on every status dot). Keep it.
- `motion-safe:` is the idiomatic Tailwind reduced-motion gate; prefer it over
  hand-wiring the `reducedMotion` prop into these tiny decorative spans.

## Steps

1. `src/components/PlayerCard.tsx:135`: replace the single
   `<span className="w-2 h-2 bg-[#10b981] animate-ping" />` with the two-layer
   static-dot-plus-pinging-ring markup from the Target section above. Keep it
   inside the existing `<div className="flex items-center gap-1.5">`.
2. `src/components/HeaderNav.tsx:58`: remove the `animate-pulse` class from the
   brand dot span (leave all other classes).
3. `src/components/ResumeSection.tsx:51`: remove the `animate-pulse` class from
   the docket dot span (leave all other classes).

## Boundaries

- Do NOT remove or restyle the availability bar text or layout — only the dot.
- Do NOT change any colours.
- Do NOT introduce rounded corners.
- Do NOT touch any other `animate-*` usage (e.g. the terminal cursor
  `animate-blink` is intentional and out of scope).
- Do NOT add dependencies.
- If any cited line does not contain the stated class (drift), STOP and report.

## Verification

- **Mechanical**: `npm run build` compiles clean.
- **Feel check**: `npm run dev`, then:
  - PlayerCard availability bar: a solid square green dot with a square ring
    expanding and fading out of it on a steady rhythm — reads clearly as
    "available now," not a flicker.
  - Header brand dot and Resume docket dot: solid green, no pulsing.
  - Toggle OS reduced-motion (DevTools Rendering): the PlayerCard ping stops
    (via `motion-safe:`), dot stays visible.
- **Done when**: exactly one looping status indicator remains (the PlayerCard
  ping), it is square and reduced-motion-safe, and the other two dots are
  static.
