# 014 — Pixel sprite kit (foundation for 015–020)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive foundation)
- **Category**: Missed opportunity / cohesion
- **Estimated scope**: 4 new files, `globals.css` (+1 block)
- **Depends on**: nothing. Plans 015–020 depend on this.

## Problem

The site's pixel art is hand-written SVG, one `<rect>` per pixel (see
`src/components/MiniPixelDev.tsx`). Plans 015–020 add five sprites (BOT.v2,
a walking cat, a sleeping cat, a save-point crystal, a coin). Hand-writing
rects for each would be long and error-prone, and the colours would drift from
the site palette.

## Target

A tiny renderer that turns a text grid into merged SVG rects, plus the sprite
data. Each character is one pixel and maps to a palette colour; `.` is
transparent. Horizontal runs of the same colour merge into one `<rect>`, so a
12×14 sprite renders about 40 rects instead of 168.

- 100% original art in the site palette. No third-party characters, no new
  dependencies, no image files.
- Sprites are decorative: `aria-hidden="true"`; whatever wraps them supplies
  the accessible name.
- Multi-frame sprites are stacked `<g>` layers. CSS swaps frames by opacity
  with `step-end` keyframes, which means hard cuts like a real sprite sheet.

Palette (same hex values as `globals.css` / `PROJECT_CONTEXT.md` §3):

| Char | Colour | Use |
| --- | --- | --- |
| `k` | `#2b2723` ink | outlines |
| `o` | `#ea580c` retro orange | antenna, cat fur |
| `b` | `#38bdf8` sky blue | BOT head (matches the BOT.v2 avatar in `PixelCompanion.tsx`) |
| `g` | `#10b981` retro green | BOT body |
| `w` | `#fffdf9` paper card | highlights, muzzle, belly |
| `y` | `#eab308` retro yellow | coin |
| `d` | `#ca8a04` dark gold | coin slot |

## Repo conventions to follow

- Pixel SVG: `shapeRendering="crispEdges"`, see `MiniPixelDev.tsx`.
- Brand colours are the hex values above; never introduce new hues.
- Reduced motion is overridden in both `@media (prefers-reduced-motion: reduce)`
  and `.reduce-motion` (see the end of `globals.css`).
- Frame swaps must not leave two frames visible when the global reduced-motion
  clamp ends an animation early. The **base** (non-animated) style must
  therefore always be "main frame visible, alt frame hidden".

## Steps

### 0. Record the bundle baseline (needed by 020's budget check)

Run `npm run build`, then in PowerShell from the repo root:

```powershell
$html = Get-Content .next\server\app\index.html -Raw
$srcs = [regex]::Matches($html, 'src="/_next/(static/chunks/[^"]+\.js)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
function Get-GzipSize($path) { $bytes = [IO.File]::ReadAllBytes($path); $ms = New-Object IO.MemoryStream; $gz = New-Object IO.Compression.GZipStream($ms, [IO.Compression.CompressionLevel]::Optimal); $gz.Write($bytes, 0, $bytes.Length); $gz.Close(); $ms.ToArray().Length }
$total = ($srcs | ForEach-Object { Get-GzipSize (Join-Path .next $_) } | Measure-Object -Sum).Sum
"initial JS (gzip): {0:N1} KB across {1} files" -f ($total / 1024), $srcs.Count
```

If `.next\server\app\index.html` does not exist, run `npx next start -p 3131`
and use `(Invoke-WebRequest -UseBasicParsing http://localhost:3131/).Content`
as `$html` instead. Write the number into `plans/README.md` under
"Pixel arcade plans → Bundle budget" as the baseline.

### 1. Create `src/components/sprites/PixelSprite.tsx`

```tsx
import type { CSSProperties } from "react";

export type SpritePalette = Readonly<Record<string, string>>;

export interface SpriteLayer {
  rows: readonly string[];
  className?: string;
}

interface Run {
  x: number;
  y: number;
  w: number;
  ch: string;
}

// Pure cache of constant sprite data (safe to share across requests)
const runCache = new WeakMap<readonly string[], Run[]>();

function toRuns(rows: readonly string[]): Run[] {
  const cached = runCache.get(rows);
  if (cached) return cached;
  const runs: Run[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === ".") {
        x += 1;
        continue;
      }
      let w = 1;
      while (row[x + w] === ch) w += 1;
      runs.push({ x, y, w, ch });
      x += w;
    }
  });
  runCache.set(rows, runs);
  return runs;
}

interface PixelSpriteProps {
  layers: readonly SpriteLayer[];
  palette: SpritePalette;
  /** CSS pixels per sprite pixel */
  scale?: number;
  className?: string;
  style?: CSSProperties;
}

/** Renders text-grid pixel art as crisp SVG. Decorative: always aria-hidden. */
export function PixelSprite({ layers, palette, scale = 3, className, style }: PixelSpriteProps) {
  const height = layers[0].rows.length;
  const width = layers[0].rows[0].length;

  if (process.env.NODE_ENV !== "production") {
    for (const layer of layers) {
      if (layer.rows.length !== height || layer.rows.some((r) => r.length !== width)) {
        console.error("PixelSprite: every layer must be a", width, "x", height, "grid", layer.rows);
      }
    }
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      width={width * scale}
      height={height * scale}
      shapeRendering="crispEdges"
      className={className}
      style={style}
    >
      {layers.map((layer, i) => (
        <g key={i} className={layer.className}>
          {toRuns(layer.rows).map((r) => (
            <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={palette[r.ch] ?? "currentColor"} />
          ))}
        </g>
      ))}
    </svg>
  );
}
```

### 2. Create `src/components/sprites/spriteData.ts`

Copy the grids exactly. Every row in a sprite has the same length (the dev
check in step 1 reports mistakes).

```ts
// Original pixel art for the portfolio. One char = one pixel, "." = transparent.
// Palette keys are documented in plans/014-pixel-sprite-kit.md.

export const BASE_PALETTE = {
  k: "#2b2723",
  o: "#ea580c",
  b: "#38bdf8",
  g: "#10b981",
  w: "#fffdf9",
  y: "#eab308",
  d: "#ca8a04",
} as const;

/** For sprites on the dark footer: outlines switch to paper so they stay visible */
export const DARK_BG_PALETTE = { ...BASE_PALETTE, k: "#f4efe6" } as const;

// BOT.v2 — 12 x 14. Body layers leave rows 0-1 empty for the antenna/ears layer.
export const BOT_BODY_OPEN = [
  "............",
  "............",
  "..kkkkkkkk..",
  "..kbbbbbbk..",
  "..kbkbbkbk..",
  "..kbkbbkbk..",
  "..kbbkkbbk..",
  "..kkkkkkkk..",
  "...kkkkkk...",
  "..kggggggk..",
  ".kkgwggwgkk.",
  "..kggggggk..",
  "..kkkkkkkk..",
  "..kk....kk..",
] as const;

export const BOT_BODY_BLINK = [
  "............",
  "............",
  "..kkkkkkkk..",
  "..kbbbbbbk..",
  "..kbbbbbbk..",
  "..kbkbbkbk..",
  "..kbbkkbbk..",
  "..kkkkkkkk..",
  "...kkkkkk...",
  "..kggggggk..",
  ".kkgwggwgkk.",
  "..kggggggk..",
  "..kkkkkkkk..",
  "..kk....kk..",
] as const;

export const BOT_ANTENNA = [
  ".....oo.....",
  ".....kk.....",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
] as const;

/** Neko mode (plan 020): cat ears replace the antenna */
export const BOT_EARS = [
  "...k....k...",
  "..kok..kok..",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
  "............",
] as const;

// Orange cat, side view facing right — 14 x 10. Legs are separate frames.
export const CAT_BODY = [
  "........k....k",
  "........kk..kk",
  "........kooook",
  "k.......kookok",
  "k.......kooowk",
  "k.kkkkkkoooook",
  "kkoooooooooook",
  ".kooowwwwooook",
  ".kkkkkkkkkkkkk",
  "..............",
] as const;

const CAT_EMPTY_ROW = "..............";
export const CAT_LEGS_A = [...Array(9).fill(CAT_EMPTY_ROW), "..k.k.....k.k."] as readonly string[];
export const CAT_LEGS_B = [...Array(9).fill(CAT_EMPTY_ROW), "...kk.....kk.."] as readonly string[];

// Sleeping cat (curled loaf, eye closed) — 14 x 6
export const CAT_SLEEP = [
  ".........k..k.",
  "...kkkkkkkkkk.",
  "..koooooooook.",
  ".koooooookkok.",
  "kkooooooooook.",
  "k.kkkkkkkkkkk.",
] as const;

// Save-point crystal — 10 x 9 (plan 017)
export const SAVE_CRYSTAL = [
  "....kk....",
  "...kbbk...",
  "..kbwbbk..",
  ".kbwbbbbk.",
  "kbbbbbbbbk",
  ".kbbbbbbk.",
  "..kbbbbk..",
  "...kbbk...",
  "....kk....",
] as const;

// Coin — 8 x 8 (plan 019)
export const COIN = [
  "..kkkk..",
  ".kyyyyk.",
  "kywyyyyk",
  "kywydyyk",
  "kyyydyyk",
  "kyyyyyyk",
  ".kyyyyk.",
  "..kkkk..",
] as const;
```

### 3. Create `src/components/sprites/BotSprite.tsx`

```tsx
import { PixelSprite } from "./PixelSprite";
import { BASE_PALETTE, BOT_ANTENNA, BOT_BODY_BLINK, BOT_BODY_OPEN, BOT_EARS } from "./spriteData";

interface BotSpriteProps {
  /** Neko mode: cat ears instead of the antenna (plan 020) */
  neko?: boolean;
  scale?: number;
  /** Add "sprite-blink" to make it blink every few seconds */
  className?: string;
}

/** BOT.v2, the site mascot. 12 x 14 sprite pixels. */
export function BotSprite({ neko = false, scale = 4, className }: BotSpriteProps) {
  return (
    <PixelSprite
      scale={scale}
      palette={BASE_PALETTE}
      className={className}
      layers={[
        { rows: BOT_BODY_OPEN, className: "sprite-frame-main" },
        { rows: BOT_BODY_BLINK, className: "sprite-frame-alt" },
        { rows: neko ? BOT_EARS : BOT_ANTENNA },
      ]}
    />
  );
}
```

### 4. Create `src/components/sprites/CatSprites.tsx`

```tsx
import { PixelSprite, type SpritePalette } from "./PixelSprite";
import { BASE_PALETTE, CAT_BODY, CAT_LEGS_A, CAT_LEGS_B, CAT_SLEEP } from "./spriteData";

/** Walking cat, 14 x 10 sprite pixels. Legs alternate via .cat-legs-a / .cat-legs-b. */
export function CatWalkSprite({ scale = 2, className }: { scale?: number; className?: string }) {
  return (
    <PixelSprite
      scale={scale}
      palette={BASE_PALETTE}
      className={className}
      layers={[
        { rows: CAT_BODY },
        { rows: CAT_LEGS_A, className: "cat-legs-a" },
        { rows: CAT_LEGS_B, className: "cat-legs-b" },
      ]}
    />
  );
}

/** Sleeping cat, 14 x 6 sprite pixels. */
export function CatSleepSprite({
  scale = 3,
  palette = BASE_PALETTE,
  className,
}: {
  scale?: number;
  palette?: SpritePalette;
  className?: string;
}) {
  return <PixelSprite scale={scale} palette={palette} className={className} layers={[{ rows: CAT_SLEEP }]} />;
}
```

### 5. Add sprite CSS to `src/app/globals.css`

Add after the terminal boot sequence block (plan 013), before the
`/* Respect reduced motion */` block:

```css
/* Pixel sprites (plan 014). Base state is always "main frame visible, alt
   frame hidden", so an animation cut short by the reduced-motion clamp can
   never leave two frames overlapping. */
.sprite-frame-alt,
.cat-legs-b {
  opacity: 0;
}

@keyframes spriteBlinkMain {
  0%   { opacity: 1; }
  94%  { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes spriteBlinkAlt {
  0%   { opacity: 0; }
  94%  { opacity: 1; }
  100% { opacity: 1; }
}

.sprite-blink .sprite-frame-main {
  animation: spriteBlinkMain 3.6s step-end infinite;
}

.sprite-blink .sprite-frame-alt {
  animation: spriteBlinkAlt 3.6s step-end infinite;
}

/* One-shot hop for sprites (BOT.v2 dock/pet, footer cat). Replay by re-keying. */
@keyframes spriteHop {
  0%   { translate: 0 0; }
  35%  { translate: 0 -10px; }
  100% { translate: 0 0; }
}

.sprite-hop {
  animation: spriteHop 320ms var(--ease-out-strong);
}

@media (prefers-reduced-motion: reduce) {
  .sprite-blink .sprite-frame-main,
  .sprite-blink .sprite-frame-alt,
  .sprite-hop {
    animation: none !important;
  }
}

.reduce-motion .sprite-blink .sprite-frame-main,
.reduce-motion .sprite-blink .sprite-frame-alt,
.reduce-motion .sprite-hop {
  animation: none !important;
}
```

The blink is about 216ms out of every 3.6s. It is a perpetual loop on purpose:
it only runs on BOT.v2, and a mascot that never blinks reads as a static image.

## Boundaries

- Do NOT render any sprite yet; this plan only adds the kit. Plans 015–019
  place them.
- Do NOT import images, sprite sheets, or third-party characters.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src`, `npm run build` pass.
- Baseline number recorded in `plans/README.md`.
- Quick render check: temporarily render
  `<BotSprite className="sprite-blink" />`, `<CatWalkSprite />`,
  `<CatSleepSprite />` somewhere in `HeroSection` with `npm run dev`. There
  must be no `PixelSprite:` console errors. At 400% browser zoom, BOT reads as
  the blue-headed, green-bodied guide robot, the cats read as cats, and BOT
  blinks. Adjust single pixels if a sprite does not read, keeping the grid
  sizes. **Remove the temporary render afterwards.**
- **Done when**: the kit compiles, the grids validate, and nothing is visible on
  the page yet.
