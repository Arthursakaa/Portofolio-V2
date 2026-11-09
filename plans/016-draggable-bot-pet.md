# 016 — Draggable BOT.v2 pet (desktop only, lazy-loaded)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive, interactive)
- **Category**: Missed opportunity (interactive delight)
- **Estimated scope**: 2 new files (`lib/arcadeStore.ts`, `arcade/PetLayer.tsx`),
  `ArcadeCorner.tsx`, `globals.css` (+1 block, 1 comment fix)
- **Depends on**: 014, 015. Plans 019 and 020 use the store created here.

## Problem

Plan 015 gives BOT.v2 a home, but it can't leave it. The goal is one
interactive toy: drag BOT.v2 out of the Arcade Corner and drop it anywhere.
It falls to the bottom of the screen, stays with you while you scroll, and can
be called home. It must stay a decoration: light, out of the way, and absent on
phones (per the decision: phones get the static version from 015).

## Target

### Behaviour

| Situation | Behaviour |
| --- | --- |
| Fine pointer (`(hover: hover) and (pointer: fine)`) | After the page is idle, `PetLayer` loads. Pressing on BOT in the dock and moving ≥ 4px pulls it out. |
| Coarse pointer (phones, tablets) | `PetLayer` is never loaded (0 bytes). BOT stays static in the dock (plan 015 behaviour). |
| Dragging | BOT follows the pointer 1:1 (`position: fixed`, moved with the `translate` property written to a ref, no React re-render per frame). Cursor `grabbing`. |
| Release | Falls to `floor = innerHeight - height - 12px` with gravity `2600 px/s²`, bounces once (restitution `0.3`), then stops. `requestAnimationFrame` runs only during the fall. |
| Reduced motion (OS or ANIM:OFF) | No fall animation: BOT snaps to the floor. Blink and hop are already disabled by plan 014's CSS. |
| Click on the floating BOT (moved < 4px) | Hop + blip, same as the dock. |
| While out | The dock shows an empty charging pad and a `CALL BOT HOME` button. Clicking it returns BOT to the dock. |
| Window resize | BOT is clamped back inside the viewport. |
| Reload | BOT is home again (`petOut` is not persisted). |

### Why a portal

The floating BOT is rendered with `createPortal` into `document.body`. Any
element whose `transform`, `translate`, `rotate`, `scale`, or `filter` is not
`none` becomes the containing block for `position: fixed` descendants. That
includes reveal items that are still hidden (they have `translate: 0 12px`).
Rendering inside the Contact section would let a fixed BOT get trapped. The
portal avoids that entirely.

**Correction to an earlier comment.** The scroll-reveal v2 comment in
`globals.css` says the `translate` property avoids creating a containing block.
That is wrong: `translate` creates one too while it is not `none`. Reveals are
still safe because the revealed state is `translate: none`. Step 6 fixes the
comment.

### Lazy loading (Next.js 16, from `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`)

`next/dynamic` with `{ ssr: false }` is allowed in a Client Component and must
be declared at module top level. `ArcadeCorner` is a Client Component, so:

```tsx
const PetLayer = dynamic(() => import("./PetLayer").then((m) => m.PetLayer), { ssr: false });
```

The component is only rendered (and its chunk only downloaded) when
`petEnabled` is true: fine pointer **and** the browser has gone idle
(`requestIdleCallback`, falling back to `setTimeout(…, 1200)` where it is
missing, e.g. older Safari).

## Repo conventions to follow

- External browser state is read with `useSyncExternalStore` (see the
  reduced-motion store in `src/app/page.tsx`). Never `setState` synchronously
  in an effect body: `react-hooks/set-state-in-effect` is an error in this
  repo's ESLint config. `setState` inside callbacks (idle callback, pointer
  handlers, timers) is fine.
- localStorage: versioned key, minimal fields, every access in `try/catch`
  (`.kiro/skills/react-best-practices/rules/client-localstorage-schema.md`).
  Parsed data is validated before use.
- Hover/pointer gating uses `(hover: hover) and (pointer: fine)`, the same query
  as `.pixel-btn:hover` in `globals.css`.
- Reduced motion = `prefers-reduced-motion: reduce` **or** the root
  `.reduce-motion` class (the ANIM toggle).

## Steps

### 1. Create `src/lib/arcadeStore.ts`

This store also holds the coin and neko state that plans 019 and 020 use.

```ts
import { useSyncExternalStore } from "react";

export const COIN_COUNT = 5;
const STORAGE_KEY = "arthur-portfolio:arcade:v1";

export interface ArcadeToast {
  id: number;
  text: string;
}

export interface ArcadeState {
  /** BOT.v2 is out of its dock (plan 016). Not persisted. */
  petOut: boolean;
  /** Collected coin indices, 0..COIN_COUNT-1 (plan 019). Persisted. */
  coins: readonly number[];
  /** Konami "neko mode" (plan 020). Persisted. */
  neko: boolean;
  /** Transient toast (plans 019/020). Not persisted. */
  toast: ArcadeToast | null;
}

const SERVER_STATE: ArcadeState = { petOut: false, coins: [], neko: false, toast: null };

let state: ArcadeState = SERVER_STATE;
let hydratedFromStorage = false;
const listeners = new Set<() => void>();

function readStorage() {
  if (hydratedFromStorage || typeof window === "undefined") return;
  hydratedFromStorage = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return;
    const p = parsed as { coins?: unknown; neko?: unknown };
    const coins = Array.isArray(p.coins)
      ? [...new Set(p.coins.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < COIN_COUNT))]
      : [];
    state = { ...state, coins, neko: p.neko === true };
  } catch {
    // Private mode, disabled storage, or bad JSON: start fresh
  }
}

function writeStorage() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ coins: state.coins, neko: state.neko }));
  } catch {
    // Quota exceeded or storage disabled: progress just isn't remembered
  }
}

function update(patch: Partial<ArcadeState>, persist = false) {
  readStorage();
  state = { ...state, ...patch };
  if (persist) writeStorage();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  readStorage();
  return state;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

/** Arcade state for components. Server and first hydration render use defaults. */
export function useArcade() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

let toastSeq = 0;
/** Time of the last drag release, so the click that follows a drag can be ignored */
let lastDragEnd = 0;

export const arcade = {
  getState: getSnapshot,
  setPetOut(petOut: boolean) {
    update({ petOut });
  },
  markDragEnd() {
    lastDragEnd = Date.now();
  },
  justDragged() {
    return Date.now() - lastDragEnd < 300;
  },
  collectCoin(index: number) {
    const s = getSnapshot();
    if (index < 0 || index >= COIN_COUNT || s.coins.includes(index)) return s.coins.length;
    update({ coins: [...s.coins, index] }, true);
    return state.coins.length;
  },
  resetCoins() {
    update({ coins: [] }, true);
  },
  setNeko(neko: boolean) {
    update({ neko }, true);
  },
  showToast(text: string) {
    toastSeq += 1;
    update({ toast: { id: toastSeq, text } });
  },
  clearToast(id: number) {
    if (getSnapshot().toast?.id === id) update({ toast: null });
  },
};

/** True when the OS asks for reduced motion or the ANIM toggle is off */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.querySelector(".reduce-motion") !== null
  );
}
```

### 2. Create `src/components/arcade/PetLayer.tsx`

```tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const floorY = () => window.innerHeight - PET_H - MARGIN;
const clampPos = (p: Pos): Pos => ({
  x: clamp(p.x, MARGIN, window.innerWidth - PET_W - MARGIN),
  y: clamp(p.y, MARGIN, floorY()),
});

/** Desktop-only draggable BOT.v2. Loaded lazily by ArcadeCorner. */
export function PetLayer() {
  const { petOut, neko } = useArcade();
  const petRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef<Pos>({ x: 0, y: 0 });
  const grab = useRef<Pos>({ x: 0, y: 0 });
  const rafId = useRef(0);
  const [hopTick, setHopTick] = useState(0);

  const paint = () => {
    const el = petRef.current;
    if (el) el.style.translate = `${pos.current.x}px ${pos.current.y}px`;
  };

  const stopFall = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = 0;
  };

  const fall = () => {
    stopFall();
    const target = floorY();
    if (prefersReducedMotion()) {
      pos.current = { ...pos.current, y: target };
      paint();
      return;
    }
    let vy = 0;
    let last = performance.now();
    let bounced = false;
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      vy += GRAVITY * dt;
      let y = pos.current.y + vy * dt;
      if (y >= target) {
        y = target;
        if (!bounced && vy > 300) {
          vy = -vy * RESTITUTION;
          bounced = true;
        } else {
          pos.current = { ...pos.current, y };
          paint();
          rafId.current = 0;
          return;
        }
      }
      pos.current = { ...pos.current, y };
      paint();
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
  };

  /**
   * Shared drag routine for the dock button and the floating pet.
   * `target` is passed explicitly: in React handlers `nativeEvent.currentTarget`
   * is React's root container, not the element.
   */
  const beginPress = (e: PointerEvent, target: HTMLElement, startFromDock: HTMLElement | null) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    let dragging = false;
    target.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      if (!dragging) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
        dragging = true;
        stopFall();
        if (startFromDock) {
          const r = startFromDock.getBoundingClientRect();
          pos.current = { x: r.left, y: r.top };
          grab.current = { x: startX - r.left, y: startY - r.top };
          arcade.setPetOut(true);
        } else {
          grab.current = { x: startX - pos.current.x, y: startY - pos.current.y };
        }
        document.documentElement.classList.add("pet-dragging");
      }
      pos.current = clampPos({ x: ev.clientX - grab.current.x, y: ev.clientY - grab.current.y });
      paint();
    };

    const onUp = () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
      if (dragging) {
        document.documentElement.classList.remove("pet-dragging");
        arcade.markDragEnd();
        fall();
      }
    };

    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
  };

  // Let the dock button start a drag (the dock lives in ArcadeCorner)
  useEffect(() => {
    const dock = document.querySelector<HTMLElement>("[data-pet-dock]");
    if (!dock) return;
    const onDown = (e: PointerEvent) => beginPress(e, dock, dock);
    dock.addEventListener("pointerdown", onDown);
    return () => dock.removeEventListener("pointerdown", onDown);
    // beginPress only touches refs and the store, so binding once is safe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Layout effect: place the pet before the browser paints, so it never flashes
  // at the top-left corner on the frame it mounts. Also keeps it on screen on
  // resize and stops any fall when it goes home.
  useLayoutEffect(() => {
    if (!petOut) {
      stopFall();
      return;
    }
    paint();
    const onResize = () => {
      pos.current = clampPos(pos.current);
      paint();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petOut]);

  useEffect(() => stopFall, []);

  if (!petOut) return null;

  return createPortal(
    <div
      ref={petRef}
      aria-hidden="true"
      className="arcade-pet"
      onPointerDown={(e) => beginPress(e.nativeEvent, e.currentTarget, null)}
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
    document.body
  );
}
```

If ESLint's React Compiler rules flag the `eslint-disable` lines or the
handler-in-effect pattern, keep the behaviour and restructure: move
`beginPress`, `fall`, `stopFall`, and `paint` to module-level functions that
take the refs as arguments. Do not silence other rules.

### 3. Add pet CSS to `src/app/globals.css`

After the sprite block from plan 014:

```css
/* Draggable BOT.v2 (plan 016). Positioned with `translate` from JS. */
.arcade-pet {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 45; /* above the sticky header (z-40), under the CRT overlay (z-50) */
  width: 48px;
  height: 56px;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.pet-dragging,
.pet-dragging * {
  cursor: grabbing !important;
  user-select: none !important;
}
```

### 4. Wire the pet into `src/components/arcade/ArcadeCorner.tsx`

- Imports: add `useEffect` and `useSyncExternalStore` to the React import,
  `import dynamic from "next/dynamic";`, and
  `import { arcade, useArcade } from "@/lib/arcadeStore";`.
- Module top level (outside the component):
  ```tsx
  const PetLayer = dynamic(() => import("./PetLayer").then((m) => m.PetLayer), { ssr: false });

  const FINE_POINTER = "(hover: hover) and (pointer: fine)";
  function subscribeFinePointer(onChange: () => void) {
    const mq = window.matchMedia(FINE_POINTER);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }
  const getFinePointer = () => window.matchMedia(FINE_POINTER).matches;
  const getServerFinePointer = () => false;
  ```
- In the component:
  ```tsx
  const { petOut } = useArcade();
  const finePointer = useSyncExternalStore(subscribeFinePointer, getFinePointer, getServerFinePointer);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!finePointer) return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => setIdle(true), 1200);
    return () => window.clearTimeout(t);
  }, [finePointer]);

  const petEnabled = finePointer && idle;
  ```
- `pokeBot`: first line `if (petOut || arcade.justDragged()) return;`.
- Dock button: render the sprite only when `!petOut`. When `petOut`, render an
  empty 48×56 placeholder (`<span className="block w-12 h-14" />`) so the room
  doesn't change height. Mark the button `aria-disabled={petOut}` and set
  `aria-label` to `"BOT.v2 is out exploring"` while out. **Do not use the
  `disabled` attribute**: the dock owns the pointer capture during a drag, and
  some browsers stop delivering pointer events to disabled buttons, which would
  freeze the drag.
- Add `touch-action: none` on the dock only when `petEnabled`
  (`style={petEnabled ? { touchAction: "none" } : undefined}`), so a mouse drag
  never selects text. Touch devices never get `petEnabled`.
- Replace the hint paragraph with:
  ```tsx
  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
    <p className="font-mono text-[11px] text-[#575049]">
      {petEnabled ? "Drag BOT.v2 out to play. It follows you around the page." : "Tap BOT.v2 to say hi."}
    </p>
    {petOut ? (
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => arcade.setPetOut(false)}
        className="pixel-btn px-2.5 py-1 font-pixel text-[8px] bg-[#fffdf9] text-[#2b2723] hover:bg-[#e9e2d5]"
      >
        CALL BOT HOME
      </button>
    ) : null}
  </div>
  ```
- At the end of the component's root `<div>`, render `{petEnabled ? <PetLayer /> : null}`.

### 5. Neko prop in the dock

Pass the neko flag to the dock sprite now, so 020 only has to flip the store:
`const { petOut, neko } = useArcade();` and `<BotSprite neko={neko} … />`.

### 6. Fix the reveal comment in `globals.css`

In the `/* Scroll reveal v2 (plan 008). … */` comment, replace the last two
lines:

```
   Uses the `translate` property, not `transform`: a transform would make the
   element a containing block for fixed/sticky descendants. */
```

with:

```
   Note: `translate` (like `transform`) makes the element a containing block
   for fixed descendants while it is not `none`. The revealed state is
   `translate: none`, so nothing is left behind. Fixed UI (the BOT.v2 pet, the
   arcade toast) is portalled to <body> or mounted at the page root. */
```

## Boundaries

- Do NOT load `PetLayer` on coarse pointers.
- Do NOT persist `petOut`.
- Do NOT use React state for the pet's position (refs plus `style.translate`).
- Do NOT keep a permanent `requestAnimationFrame` loop; it runs only while
  falling.
- Do NOT add dependencies (no drag or physics library).

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src`, `npm run build` pass.
- **Bundle**: in the production HTML (`index.html` or the `next start` page
  source), none of the initial `<script src>` chunks contain the string
  `arcade-pet`. That proves `PetLayer` is in a separate lazy chunk.
- **Feel check** (desktop, `npm run dev`):
  - Click BOT in the dock: it hops, nothing is pulled out.
  - Press and drag BOT: it lifts out at the exact spot you grabbed, follows the
    cursor, and the dock shows an empty pad plus `CALL BOT HOME`.
  - Release mid-screen: it falls, bounces once, and rests about 12px above the
    bottom edge. Scroll the page: it stays put on screen.
  - Drag it onto the sticky header: it draws above the header.
  - Turn CRT on: scanlines draw over the pet too.
  - ANIM:OFF, then drag and release: it snaps straight to the floor.
  - Resize the window narrower than the pet's x: it moves back on screen.
  - `CALL BOT HOME`: it disappears from the screen and is back in the dock,
    blinking.
  - Reload: it is home.
- **Phone check** (DevTools device mode, 390px, touch): no `arcade-pet` element
  ever appears, the hint says "Tap BOT.v2 to say hi.", and the Network panel
  shows no `PetLayer` chunk.
- **Done when**: BOT.v2 can be dragged around on desktop, phones stay static,
  and the pet code is only downloaded on fine-pointer devices after idle.
