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
export const CAT_LEGS_A: readonly string[] = [...Array<string>(9).fill(CAT_EMPTY_ROW), "..k.k.....k.k."];
export const CAT_LEGS_B: readonly string[] = [...Array<string>(9).fill(CAT_EMPTY_ROW), "...kk.....kk.."];

// Sleeping cat (loaf with head up, eye closed) — 14 x 7
export const CAT_SLEEP = [
  "........k....k",
  "........kk..kk",
  "........kooook",
  "..kkkkkkkokkok",
  ".koooooooooowk",
  "kooooooooooook",
  "kkkkkkkkkkkkkk",
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
