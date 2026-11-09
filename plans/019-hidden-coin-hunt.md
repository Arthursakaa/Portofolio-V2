# 019 — Hidden coin hunt (5 coins, HUD, achievement)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive, easter egg)
- **Category**: Missed opportunity (rare delight, interactive)
- **Estimated scope**: 2 new components (`HiddenCoin`, `ArcadeToast`), 5 section
  files (+1 line each), `ArcadeCorner.tsx`, `ContactTerminal.tsx`, `page.tsx`,
  `globals.css`
- **Depends on**: 014 (coin sprite), 015 (corner), 016 (`arcadeStore`)

## Problem

The site is a long scroll with generous 64px top/bottom padding bands in every
section. A small collectible gives curious visitors a reason to look around,
without touching the recruiter-facing content.

## Target

- **Five coins**, one in each of About, Projects, Skills, Experience, Resume.
  Each sits in that section's empty padding band (never on top of content), at a
  different spot so they aren't predictable.
- Each coin is a real `<button>` (`aria-label="Hidden coin N of 5"`), so it
  works with mouse, touch, and keyboard. It bobs 2px in two hard steps every
  1.4s.
- **Collecting**: `retroSound.playCoin()`, a 360ms one-shot (rise 18px + fade)
  with a `+1` label, then the coin is removed. Progress is saved in localStorage
  (`arthur-portfolio:arcade:v1`, from plan 016's store), so collected coins stay
  gone on reload.
- **HUD** in the Arcade Corner header: `COINS 3/5` with a mini coin.
- **5/5**: a toast `ACHIEVEMENT UNLOCKED: COIN COLLECTOR`, plus the pixelarticons
  `Trophy` and the text `COIN COLLECTOR` in the corner. BOT.v2 gets a fourth
  speech line: `You found every coin. Arthur would love to hear from you!`
- **Terminal**: `coins` prints progress and a hint; `coins reset` clears it so
  the hunt can be replayed. `help` lists `coins`.
- **Toast** (`ArcadeToast`): fixed bottom-centre, `role="status"`, visible 3.2s.
  Enter is `translate 0 12px → 0` + opacity in 200ms
  `var(--ease-out-strong)`. It is mounted at the page root (`page.tsx`), not
  inside a section, so no hidden reveal item can become its containing block.

Coin positions (all inside each `<section>`, which gets `relative`):

| Section | File | Coin wrapper classes |
| --- | --- | --- |
| About | `AboutSection.tsx` | `absolute top-5 right-6 sm:right-12` |
| Projects | `ProjectsSection.tsx` | `absolute bottom-5 left-6 sm:left-14` |
| Skills | `SkillsInventory.tsx` | `absolute bottom-5 right-6 sm:right-1/4` |
| Experience | `TimelineSection.tsx` | `absolute top-5 left-6 sm:left-1/3` |
| Resume | `ResumeSection.tsx` | `absolute bottom-5 left-1/2` |

The coin is 24px (8 sprite px × 3). `top-5` / `bottom-5` (20px) keeps it inside
the 64px `py-16` bands.

## Repo conventions to follow

- Store: `useArcade()` and `arcade.*` from `src/lib/arcadeStore.ts` (plan 016).
  The server render and the first hydration render use defaults (no coins
  collected), and the client then hides collected coins. There is no
  hydration mismatch, because that is how `useSyncExternalStore` handles the
  server snapshot.
- Buttons with their own sound get `data-sfx="none"` (otherwise the SFX safety
  net's `playSelect()` throttles the coin chime).
- Reduced motion: `prefersReducedMotion()` from the store decides whether to
  wait for the collect animation (360ms) or remove the coin immediately.

## Steps

### 1. Create `src/components/arcade/HiddenCoin.tsx`

```tsx
"use client";

import { useState } from "react";
import { PixelSprite } from "@/components/sprites/PixelSprite";
import { BASE_PALETTE, COIN } from "@/components/sprites/spriteData";
import { arcade, COIN_COUNT, prefersReducedMotion, useArcade } from "@/lib/arcadeStore";
import { retroSound } from "@/lib/audio";

export function HiddenCoin({ index, className }: { index: number; className: string }) {
  const { coins } = useArcade();
  const [collecting, setCollecting] = useState(false);
  if (coins.includes(index)) return null;

  const collect = () => {
    if (collecting) return;
    retroSound.playCoin();
    setCollecting(true);
    window.setTimeout(() => {
      const total = arcade.collectCoin(index);
      if (total === COIN_COUNT) arcade.showToast("ACHIEVEMENT UNLOCKED: COIN COLLECTOR");
    }, prefersReducedMotion() ? 0 : 360);
  };

  return (
    <div className={`${className} z-10`}>
      <button
        type="button"
        suppressHydrationWarning
        data-sfx="none"
        onClick={collect}
        aria-label={`Hidden coin ${index + 1} of ${COIN_COUNT}`}
        title="A shiny coin!"
        className={`relative block cursor-pointer p-1 ${collecting ? "coin-collect" : "coin-bob"}`}
      >
        <PixelSprite layers={[{ rows: COIN }]} palette={BASE_PALETTE} scale={3} />
        {collecting ? (
          <span aria-hidden="true" className="absolute -top-3 left-1/2 -translate-x-1/2 font-pixel text-[8px] text-[#ca8a04]">
            +1
          </span>
        ) : null}
      </button>
    </div>
  );
}
```

### 2. Place the five coins

In each file from the table: add `relative` to the outer `<section>` className
(e.g. `className="relative py-16 border-b-2 border-[#2b2723] bg-[#fffdf9]"`),
add `import { HiddenCoin } from "@/components/arcade/HiddenCoin";`, and render
the coin as the **first child** of the `<section>`:

```tsx
<HiddenCoin index={0} className="absolute top-5 right-6 sm:right-12" />
```

Indices: About `0`, Projects `1`, Skills `2`, Experience `3`, Resume `4`. Use
the classes from the table.

### 3. Create `src/components/arcade/ArcadeToast.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { arcade, useArcade } from "@/lib/arcadeStore";

/** Transient arcade messages. Mounted once at the page root. */
export function ArcadeToast() {
  const { toast } = useArcade();

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => arcade.clearToast(toast.id), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div role="status" aria-live="polite" className="fixed inset-x-0 bottom-6 z-[55] flex justify-center pointer-events-none px-4">
      {toast ? (
        <p key={toast.id} className="arcade-toast bg-[#2b2723] text-[#fffdf9] border-2 border-[#eab308] shadow-[3px_3px_0_0_#eab308] px-4 py-2 font-pixel text-[9px] sm:text-[10px] tracking-wider text-center">
          {toast.text}
        </p>
      ) : null}
    </div>
  );
}
```

In `src/app/page.tsx`, import it
(`import { ArcadeToast } from "@/components/arcade/ArcadeToast";`) and render
`<ArcadeToast />` right after `<ScrollRevealObserver />`.

### 4. HUD and trophy in `src/components/arcade/ArcadeCorner.tsx`

- Imports: add `Trophy` to the pixelarticons import, and
  `import { PixelSprite } from "@/components/sprites/PixelSprite";`,
  `import { BASE_PALETTE, COIN } from "@/components/sprites/spriteData";`,
  and `COIN_COUNT` from the store.
- Read `coins` from `useArcade()`: `const { petOut, neko, coins } = useArcade();`.
- Replace the header's right-hand `<span>PLAYER 2: BOT.v2</span>` with:
  ```tsx
  <span className="flex items-center gap-1.5 font-pixel text-[8px] text-[#2b2723]">
    <PixelSprite layers={[{ rows: COIN }]} palette={BASE_PALETTE} scale={1.5} />
    COINS {coins.length}/{COIN_COUNT}
  </span>
  ```
- Under the pixel room (before the hint row), when
  `coins.length === COIN_COUNT`:
  ```tsx
  <p className="mt-3 inline-flex items-center gap-2 font-pixel text-[9px] text-[#ca8a04]">
    <Trophy size={16} aria-hidden="true" /> COIN COLLECTOR
  </p>
  ```
- BOT lines: add `"Psst... 5 coins are hidden on this page."` to `BOT_LINES`.
  When all coins are collected, use this array instead:
  `[...BOT_LINES, "You found every coin. Arthur would love to hear from you!"]`.
  Compute it during render (no state).

### 5. Terminal commands in `src/components/ContactTerminal.tsx`

- Import: `import { arcade, COIN_COUNT } from "@/lib/arcadeStore";`
- In `help`, add the line `"  coins     — Track the hidden coin hunt"` before
  the `clear` line.
- Add cases before `default:`:
  ```tsx
  case "coins": {
    const n = arcade.getState().coins.length;
    out =
      n === COIN_COUNT
        ? [`COINS: ${n}/${COIN_COUNT}. Coin Collector unlocked!`, "Type 'coins reset' to hunt again."]
        : [`COINS: ${n}/${COIN_COUNT} collected.`, "Hint: they hide in the empty margins of each section."];
    break;
  }
  case "coins reset":
    arcade.resetCoins();
    out = ["Coin hunt reset. Happy hunting!"];
    break;
  ```

### 6. `src/app/globals.css`

Add after the plan 018 block:

```css
/* Coin hunt (plan 019) */
@keyframes coinBob {
  0%   { translate: 0 0; }
  50%  { translate: 0 -2px; }
  100% { translate: 0 -2px; }
}

.coin-bob {
  animation: coinBob 1.4s step-end infinite;
}

@keyframes coinCollect {
  from { translate: 0 0; opacity: 1; }
  to   { translate: 0 -18px; opacity: 0; }
}

.coin-collect {
  animation: coinCollect 360ms var(--ease-out-strong) forwards;
}

@keyframes toastIn {
  from { translate: 0 12px; opacity: 0; }
  to   { translate: 0 0; opacity: 1; }
}

.arcade-toast {
  animation: toastIn 200ms var(--ease-out-strong);
}

@media (prefers-reduced-motion: reduce) {
  .coin-bob,
  .coin-collect,
  .arcade-toast {
    animation: none !important;
  }
}

.reduce-motion .coin-bob,
.reduce-motion .coin-collect,
.reduce-motion .arcade-toast {
  animation: none !important;
}
```

## Boundaries

- Coins never overlap section content; if one does at some width, move it
  within its padding band, not into the content.
- Do NOT store anything except coin indices and the neko flag.
- Do NOT show a toast for each coin (only for 5/5).
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src`, `npm run build` pass.
- **Feel check** (`npm run dev`):
  - Each of the five sections shows one small bobbing coin in its top or bottom
    margin, at 390px and 1366px, never on top of text or cards.
  - Click a coin: chime (SFX on), it rises and fades with `+1`, and the corner
    HUD goes to `COINS 1/5`.
  - Reload: that coin stays gone and the HUD still says 1/5.
  - Tab to a coin and press Enter: same as clicking.
  - Collect all five: the toast appears at the bottom for about 3s, and the
    corner shows the trophy and `COIN COLLECTOR`.
  - Terminal `coins` shows progress; `coins reset` brings every coin back.
  - In a private window with storage blocked, coins still work for the session
    and no errors appear.
  - ANIM:OFF: coins are still and disappear instantly on click; the toast
    appears without sliding.
- **Done when**: all five coins can be found and collected, progress survives a
  reload, and 5/5 unlocks the achievement.
