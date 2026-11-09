# 006 — Crossfade the project card Visual ⇄ Architecture view switch

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (missed opportunity — additive)
- **Category**: Missed opportunity / interruptibility
- **Estimated scope**: 1 file (`ProjectsSection.tsx`), ~20 lines

## Problem

Each project card has a switcher that swaps the top banner between a visual
preview and the architecture notes (`ProjectsSection.tsx:116-142`). Today the
swap is an instant hard cut — `!showArch ? <Banner/> : <ArchNotes/>` — which
teleports between two unrelated states. The AUDIT playbook flags state swaps
that teleport as missed opportunities; a brief blur-masked crossfade (the same
technique already used in `PixelCompanion.tsx`) would smooth it.

```tsx
/* src/components/ProjectsSection.tsx:118-139 — current (hard cut) */
<div className="relative h-48 w-full border-b-2 border-[#2b2723] bg-[#1e293b] overflow-hidden">
  {!showArch ? (
    <ProjectVisualBanner projectId={project.id} />
  ) : (
    <div className="w-full h-full bg-[#2b2723] ... ">...</div>
  )}
  ...
</div>
```

## Target

Render BOTH layers absolutely-positioned in the banner box and cross-fade
between them with opacity, masked by a subtle blur during the transition. The
toggle state (`showArch`) drives which layer is on top. Because this uses CSS
`transition` on `opacity`/`filter` (not keyframes), rapid toggling retargets
mid-animation instead of restarting — correct per the interruptibility rules.

```tsx
/* src/components/ProjectsSection.tsx — target shape of the banner box */
<div className="relative h-48 w-full border-b-2 border-[#2b2723] bg-[#1e293b] overflow-hidden">
  {/* Visual layer */}
  <div
    className={`absolute inset-0 transition-[opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
      showArch ? "opacity-0 blur-[2px] pointer-events-none" : "opacity-100 blur-0"
    }`}
  >
    <ProjectVisualBanner projectId={project.id} />
  </div>

  {/* Architecture layer */}
  <div
    className={`absolute inset-0 w-full h-full bg-[#2b2723] text-[#f4efe6] p-4 flex flex-col justify-center font-mono text-xs overflow-y-auto transition-[opacity,filter] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
      showArch ? "opacity-100 blur-0" : "opacity-0 blur-[2px] pointer-events-none"
    }`}
  >
    <p className="font-pixel text-[9px] text-[#10b981] mb-2">
      SYSTEM ARCHITECTURE &amp; KEY DELIVERABLES:
    </p>
    <ul className="space-y-1.5 list-disc list-inside text-xs text-[#e9e2d5]">
      {project.highlights.map((h, i) => (
        <li key={i} className="leading-snug">{h}</li>
      ))}
    </ul>
  </div>

  {/* Mode switcher button stays as-is, on top (z-10) */}
  <div className="absolute bottom-2 right-2 z-10">...</div>
</div>
```

200ms sits inside the UI duration budget (150–250ms for this kind of toggle).
Blur stays 2px (well under 20px). `pointer-events-none` on the hidden layer
prevents the invisible layer from stealing clicks/scroll.

## Repo conventions to follow

- Blur-masked crossfade already exists in `PixelCompanion.tsx:77-80`
  (`transition-[filter,opacity]` + `blur-[2px]`). Imitate it.
- Strong ease-out `cubic-bezier(0.23,1,0.32,1)` = `--ease-out-strong`
  (`globals.css:26`).
- The architecture-notes markup (heading + `<ul>` of `project.highlights`) must
  stay identical — only its wrapper becomes an absolutely-positioned,
  opacity-animated layer.

## Steps

1. In `src/components/ProjectsSection.tsx`, locate the banner box
   (`<div className="relative h-48 ...">`, ~line 118).
2. Replace the `{!showArch ? (...) : (...)}` conditional with the two
   always-rendered absolutely-positioned layers from the Target section, driven
   by `showArch` via opacity/blur classes.
3. Keep the existing mode-switcher button block
   (`<div className="absolute bottom-2 right-2 z-10">...`) exactly as-is, after
   the two layers.
4. Leave `toggleCardView`, the sound call, and all card-body/footer markup
   unchanged.

## Boundaries

- Do NOT change the architecture-notes content or the `ProjectVisualBanner`
  usage.
- Do NOT animate width/height/layout — opacity + filter only.
- Do NOT add dependencies.
- Keep both layers inside the existing `h-48` box so the card never changes
  height during the swap.
- If the banner box or the `showArch` conditional is not at the cited location
  (drift), STOP and report.

## Verification

- **Mechanical**: `npm run build` compiles clean.
- **Feel check**: `npm run dev`, scroll to Projects, click
  "View Architecture Notes" / "View Visual Preview" on a card:
  - The two states cross-fade over ~200ms with a faint blur during the swap;
    no hard cut, no height jump.
  - Spam the toggle fast: it should smoothly retarget (fade toward whichever
    state is current) and never restart from a flash — because it uses
    transitions, not keyframes.
  - While the visual layer is hidden, clicks/scroll go to the visible layer
    (the hidden one has `pointer-events-none`).
  - In DevTools Animations panel at 10%, confirm no double-sharp overlap — the
    blur masks the midpoint.
- **Done when**: the banner swap is a smooth, interruptible crossfade and the
  card height is stable throughout.
