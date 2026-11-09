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
