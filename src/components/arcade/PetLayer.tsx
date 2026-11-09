"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { BotSprite } from "@/components/sprites/BotSprite";
import { arcade, prefersReducedMotion, useArcade } from "@/lib/arcadeStore";
import { retroSound } from "@/lib/audio";

const PET_W = 48; // 12 sprite px x 4
const PET_H = 56; // 14 sprite px x 4
const MARGIN = 12;
const GRAVITY = 2600; // px/s^2
const RESTITUTION = 0.3;
const DRAG_THRESHOLD = 4; // px before a press becomes a drag

type Pos = { x: number; y: number };

interface PetRefs {
  el: RefObject<HTMLDivElement | null>;
  pos: RefObject<Pos>;
  raf: RefObject<number>;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const floorY = () => window.innerHeight - PET_H - MARGIN;
const clampPos = (p: Pos): Pos => ({
  x: clamp(p.x, MARGIN, window.innerWidth - PET_W - MARGIN),
  y: clamp(p.y, MARGIN, floorY()),
});

// Module-level helpers take the refs explicitly, so effects can bind them once.

function paint(refs: PetRefs) {
  const el = refs.el.current;
  if (el) el.style.translate = `${refs.pos.current.x}px ${refs.pos.current.y}px`;
}

function stopFall(refs: PetRefs) {
  if (refs.raf.current) cancelAnimationFrame(refs.raf.current);
  refs.raf.current = 0;
}

/** Gravity + one bounce. requestAnimationFrame runs only while falling. */
function fall(refs: PetRefs) {
  stopFall(refs);
  const target = floorY();
  if (prefersReducedMotion()) {
    refs.pos.current = { ...refs.pos.current, y: target };
    paint(refs);
    return;
  }
  let vy = 0;
  let last = performance.now();
  let bounced = false;
  const step = (now: number) => {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    vy += GRAVITY * dt;
    let y = refs.pos.current.y + vy * dt;
    if (y >= target) {
      y = target;
      if (!bounced && vy > 300) {
        vy = -vy * RESTITUTION;
        bounced = true;
      } else {
        refs.pos.current = { ...refs.pos.current, y };
        paint(refs);
        refs.raf.current = 0;
        return;
      }
    }
    refs.pos.current = { ...refs.pos.current, y };
    paint(refs);
    refs.raf.current = requestAnimationFrame(step);
  };
  refs.raf.current = requestAnimationFrame(step);
}

/**
 * Shared drag routine for the dock button and the floating pet.
 * `target` is passed explicitly: in React handlers `nativeEvent.currentTarget`
 * is React's root container, not the element.
 */
function beginPress(refs: PetRefs, e: PointerEvent, target: HTMLElement, fromDock: boolean) {
  if (e.button !== 0) return;
  const startX = e.clientX;
  const startY = e.clientY;
  let dragging = false;
  let grab: Pos = { x: 0, y: 0 };
  target.setPointerCapture(e.pointerId);

  const onMove = (ev: PointerEvent) => {
    if (!dragging) {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
      dragging = true;
      stopFall(refs);
      if (fromDock) {
        const r = target.getBoundingClientRect();
        refs.pos.current = { x: r.left, y: r.top };
        grab = { x: startX - r.left, y: startY - r.top };
        arcade.setPetOut(true);
      } else {
        grab = { x: startX - refs.pos.current.x, y: startY - refs.pos.current.y };
      }
      document.documentElement.classList.add("pet-dragging");
    }
    refs.pos.current = clampPos({ x: ev.clientX - grab.x, y: ev.clientY - grab.y });
    paint(refs);
  };

  const onUp = () => {
    target.removeEventListener("pointermove", onMove);
    target.removeEventListener("pointerup", onUp);
    target.removeEventListener("pointercancel", onUp);
    if (dragging) {
      document.documentElement.classList.remove("pet-dragging");
      arcade.markDragEnd();
      fall(refs);
    }
  };

  target.addEventListener("pointermove", onMove);
  target.addEventListener("pointerup", onUp);
  target.addEventListener("pointercancel", onUp);
}

/** Desktop-only draggable BOT.v2. Loaded lazily by ArcadeCorner. */
export function PetLayer() {
  const { petOut, neko } = useArcade();
  const el = useRef<HTMLDivElement | null>(null);
  const pos = useRef<Pos>({ x: 0, y: 0 });
  const raf = useRef(0);
  const [hopTick, setHopTick] = useState(0);

  // Let the dock button (rendered by ArcadeCorner) start a drag
  useEffect(() => {
    const refs: PetRefs = { el, pos, raf };
    const dock = document.querySelector<HTMLElement>("[data-pet-dock]");
    if (!dock) return;
    const onDown = (e: PointerEvent) => beginPress(refs, e, dock, true);
    dock.addEventListener("pointerdown", onDown);
    return () => {
      dock.removeEventListener("pointerdown", onDown);
      stopFall(refs);
    };
  }, []);

  // Layout effect: place the pet before the browser paints, so it never flashes
  // at the top-left corner on the frame it mounts. Also keeps it on screen on
  // resize and stops any fall when it goes home.
  useLayoutEffect(() => {
    const refs: PetRefs = { el, pos, raf };
    if (!petOut) {
      stopFall(refs);
      return;
    }
    paint(refs);
    const onResize = () => {
      refs.pos.current = clampPos(refs.pos.current);
      paint(refs);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [petOut]);

  if (!petOut) return null;

  return createPortal(
    <div
      ref={el}
      aria-hidden="true"
      className="arcade-pet"
      onPointerDown={(e) => beginPress({ el, pos, raf }, e.nativeEvent, e.currentTarget, false)}
      onClick={() => {
        if (arcade.justDragged()) return;
        retroSound.playBlip(750, "triangle", 0.05);
        setHopTick((t) => t + 1);
      }}
    >
      <span key={hopTick} className={`block ${hopTick > 0 ? "sprite-hop" : ""}`}>
        <BotSprite neko={neko} className="sprite-blink" scale={4} />
      </span>
    </div>,
    // Portal into the page root (not <body>): it carries the ANIM toggle's
    // .reduce-motion class and has no transform, so fixed positioning still works.
    document.querySelector("[data-app-root]") ?? document.body
  );
}
