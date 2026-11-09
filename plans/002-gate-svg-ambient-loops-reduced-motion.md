# 002 — Make MiniPixelDev ambient loops respect reduced motion + repo tokens

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: MEDIUM
- **Category**: Accessibility (primary) + Cohesion/tokens (secondary)
- **Estimated scope**: 2 files (`MiniPixelDev.tsx`, `HeaderNav.tsx`), ~15 lines

## Problem

`MiniPixelDev.tsx` runs four perpetual ambient loops — the developer's two
typing hands, the coffee steam, and the screen glow — defined in an inline
`<style>` block **inside the SVG** (`src/components/MiniPixelDev.tsx:31-60`):

```tsx
/* src/components/MiniPixelDev.tsx:31-42 — current */
<style>{`
  .anim-type-l { animation: devTypeLeft 0.35s infinite ease-in-out alternate; }
  .anim-type-r { animation: devTypeRight 0.35s infinite ease-in-out alternate; }
  .anim-steam  { animation: devSteam 1.2s infinite linear; }
  .anim-screen { animation: devScreenGlow 1.8s infinite ease-in-out; }
`}</style>
```

Two problems:

1. **Accessibility.** The app has a user-facing `ANIM:ON/OFF` toggle
   (`HeaderNav.tsx:124-145`) that sets a `reduce-motion` class on the root
   (`page.tsx:56`). The global `prefers-reduced-motion` rule in
   `globals.css:180-188` and the `.reduce-motion *` rule in `globals.css:190-196`
   both clamp `animation-duration` to `0.01ms`. These DO cascade into SVG
   children, so system reduced-motion is technically handled — BUT the loops
   are `infinite alternate`, and the component never receives the app's
   `reducedMotion` state, so the only "off" path is the global clamp. The
   component cannot be reasoned about in isolation, and the clamp approach
   (0.01ms duration) is a blunt override rather than an intentional "stop these
   loops" decision. A clean, explicit gate is preferable for a perpetual
   ambient animation the AUDIT playbook calls out ("loops that run forever").
2. **Tokens/cohesion.** The loop easings are hand-typed CSS built-ins
   (`ease-in-out`, `linear`) and durations are hard-coded, disconnected from
   the repo's easing tokens. Ambient loops like this are fine to keep, but they
   should be explicitly gatable.

> NOTE for executor: the global clamp DOES already visually freeze these loops
> under reduced motion. This plan's value is making the gate explicit and
> component-local so the toggle intent is obvious and the component is
> self-describing — not fixing a hard a11y bug. Keep the change minimal.

## Target

Pass the existing `reducedMotion` state down to `MiniPixelDev` and skip the
animation classes when it is true, so the SVG renders a static (but complete)
developer scene. The pixel dev still looks right frozen — hands rest, steam
hidden, screen a solid cyan.

```tsx
/* target — MiniPixelDev receives reducedMotion and conditionally applies classes */
interface MiniPixelDevProps {
  soundEnabled?: boolean;
  reducedMotion?: boolean;
}
// className={reducedMotion ? "" : "anim-type-l"}  etc.
```

Durations and easings for the loops stay as-is (they are correct for ambient
motion — `linear` steam and `ease-in-out` typing are appropriate); this plan
does NOT re-token them, only gates them. (Re-tokenising inline SVG keyframes
would require moving them to global CSS for no feel gain; out of scope.)

## Repo conventions to follow

- `reducedMotion` is already threaded from `page.tsx` down to
  `PixelCompanion` as a prop (`page.tsx:85-88`) and consumed there
  (`PixelCompanion.tsx:43` uses `!reducedMotion && ...`). Imitate that exact
  pattern.
- `HeaderNav` already receives `reducedMotion` (`HeaderNav.tsx:11, 29`) and
  renders `<MiniPixelDev soundEnabled={soundEnabled} />` at
  `HeaderNav.tsx:66`. Thread the prop through there.

## Steps

1. In `src/components/MiniPixelDev.tsx`, extend the props interface:
   ```tsx
   interface MiniPixelDevProps {
     soundEnabled?: boolean;
     reducedMotion?: boolean;
   }
   export function MiniPixelDev({ soundEnabled, reducedMotion }: MiniPixelDevProps) {
   ```
2. In the same file, for each of the four animated SVG nodes, make the class
   conditional. Current classes: `anim-type-l` (left hand rect),
   `anim-type-r` (right hand rect), `anim-screen` (screen glow rect),
   `anim-steam` (steam `<g>`). Change each `className="anim-xxx"` to
   `className={reducedMotion ? undefined : "anim-xxx"}`. Leave all geometry,
   fills, and strokes unchanged so the frozen scene is still complete.
3. In `src/components/HeaderNav.tsx:66`, pass the prop through:
   ```tsx
   <MiniPixelDev soundEnabled={soundEnabled} reducedMotion={reducedMotion} />
   ```
   `reducedMotion` is already a destructured prop of `HeaderNav` (line 29), so
   no new wiring is needed above this component.

## Boundaries

- Do NOT move the keyframes out of the SVG `<style>` block.
- Do NOT change the keyframe values, durations, or easings.
- Do NOT touch `page.tsx` — `HeaderNav` already has `reducedMotion`.
- Do NOT add dependencies.
- If `MiniPixelDev` is not rendered by `HeaderNav` at the cited line (drift),
  STOP and report.

## Verification

- **Mechanical**: `npm run build` compiles with no new type errors (the new
  optional prop must not break the existing `<MiniPixelDev soundEnabled=... />`
  call anywhere else — grep `MiniPixelDev` to confirm the header is the only
  caller).
- **Feel check**: `npm run dev`, then:
  - With `ANIM:ON` (default), the dev's hands bob, steam rises, screen glows —
    unchanged from before.
  - Click `ANIM:OFF` in the header. The typing, steam, and screen glow all
    stop immediately; the scene stays visually complete (hands resting, screen
    a solid cyan, no steam). No flicker on toggle.
  - In DevTools Rendering panel, set "Emulate prefers-reduced-motion: reduce"
    and reload; the loops are frozen on first paint.
- **Done when**: toggling `ANIM:OFF` visibly halts all four MiniPixelDev loops
  via the prop (not only via the global duration clamp), and `ANIM:ON` restores
  them.
