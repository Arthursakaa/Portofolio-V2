"use client";

const RETRO_PALETTE = ["#ea580c", "#10b981", "#eab308", "#2563eb", "#fffdf9"];

function isMotionReduced(): boolean {
  if (typeof window === "undefined") return true;
  if (document.querySelector("[data-app-root]")?.classList.contains("reduce-motion")) {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Fires retro square-pixel confetti bursts while respecting the global ANIM toggle
 * and OS reduced-motion settings. Dynamically imports canvas-confetti to keep initial bundle lean.
 */
export async function firePixelConfetti(variant: "celebration" | "subtle" = "celebration") {
  if (isMotionReduced()) return;

  try {
    const { default: confetti } = await import("canvas-confetti");

    if (variant === "subtle") {
      confetti({
        particleCount: 24,
        spread: 52,
        startVelocity: 26,
        scalar: 0.85,
        ticks: 110,
        origin: { y: 0.72 },
        colors: RETRO_PALETTE,
        shapes: ["square"],
        disableForReducedMotion: true,
      });
      return;
    }

    // Dual-cannon arcade celebration burst
    confetti({
      particleCount: 38,
      angle: 60,
      spread: 55,
      origin: { x: 0.08, y: 0.72 },
      colors: RETRO_PALETTE,
      shapes: ["square"],
      scalar: 0.95,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 38,
      angle: 120,
      spread: 55,
      origin: { x: 0.92, y: 0.72 },
      colors: RETRO_PALETTE,
      shapes: ["square"],
      scalar: 0.95,
      disableForReducedMotion: true,
    });
  } catch {
    // Non-critical delight effect; fail silently
  }
}
