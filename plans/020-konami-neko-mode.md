# 020 — Konami code "NEKO MODE" + final bundle budget check

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive, easter egg)
- **Category**: Missed opportunity (rare delight, cat touch)
- **Estimated scope**: `ArcadeCorner.tsx`, `PixelCompanion.tsx`,
  `ContactTerminal.tsx`
- **Depends on**: 014 (`BOT_EARS`), 015, 016 (store + neko prop), 019 (toast)

## Problem

Retro sites traditionally hide a cheat code. The cat touch so far is a walking
cat (017) and a sleeping cat (018). A classic code that turns the mascot into a
cat-eared robot ties both themes together.

## Target

- Typing **↑ ↑ ↓ ↓ ← → ← → B A** anywhere on the page (not inside a text field)
  toggles **NEKO MODE**:
  - BOT.v2 swaps its antenna for orange cat ears everywhere it appears: the
    Arcade Corner dock, the floating pet (016), and the guide-strip avatar under
    the hero (`PixelCompanion.tsx`).
  - Toast: `NEKO MODE ON =^.^=` or `NEKO MODE OFF`.
  - Sound: `retroSound.playPowerUp()` on, `retroSound.playPowerDown()` off.
  - Saved in localStorage (store's `neko` flag), so it survives a reload.
- **Phones have no arrow keys**, so the terminal also accepts `neko` to toggle it.
- Terminal `secret` prints a hint:
  `Old-school cheat codes still work here: ↑ ↑ ↓ ↓ ← → ← → B A`.
  `secret` and `neko` are NOT listed in `help` (they are easter eggs).

Key matching: compare `e.key` against
`["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]`
(letters compared lowercased). Any wrong key resets progress, except that a
wrong key that equals the first key restarts at step 1. Ignore events whose
target is an `input`, `textarea`, `select`, or `[contenteditable]`, and ignore
events with Ctrl, Meta, or Alt held.

## Repo conventions to follow

- The listener is a subscription in an effect that calls `setState`-free code
  (`arcade.setNeko`, sound, toast). Nothing calls `setState` synchronously in
  the effect body.
- The guide-strip avatar is built from divs (`PixelCompanion.tsx`); its antenna
  is `<div className="w-2 h-2 bg-[#ea580c] border border-[#2b2723] mb-0.5" />`.

## Steps

### 1. Konami listener in `src/components/arcade/ArcadeCorner.tsx`

Add to the module top level:

```tsx
const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

export function toggleNekoMode() {
  const next = !arcade.getState().neko;
  arcade.setNeko(next);
  if (next) retroSound.playPowerUp();
  else retroSound.playPowerDown();
  arcade.showToast(next ? "NEKO MODE ON =^.^=" : "NEKO MODE OFF");
}
```

Inside the component:

```tsx
useEffect(() => {
  let step = 0;
  const onKey = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.closest("input, textarea, select, [contenteditable='true']"))) return;
    const key = e.key.toLowerCase();
    if (key === KONAMI[step]) {
      step += 1;
      if (step === KONAMI.length) {
        step = 0;
        toggleNekoMode();
      }
    } else {
      step = key === KONAMI[0] ? 1 : 0;
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);
```

The arrow keys keep scrolling the page while the code is typed. That is
expected and harmless.

### 2. Ears on the guide-strip avatar in `src/components/PixelCompanion.tsx`

- Import: `import { useArcade } from "@/lib/arcadeStore";` and read
  `const { neko } = useArcade();`.
- Replace the antenna line:
  ```tsx
  {/* Antenna */}
  <div className="w-2 h-2 bg-[#ea580c] border border-[#2b2723] mb-0.5" />
  ```
  with:
  ```tsx
  {/* Antenna, or cat ears in neko mode */}
  {neko ? (
    <div className="flex gap-3 mb-0.5" aria-hidden="true">
      <span className="w-2 h-2 bg-[#ea580c] border border-[#2b2723]" />
      <span className="w-2 h-2 bg-[#ea580c] border border-[#2b2723]" />
    </div>
  ) : (
    <div className="w-2 h-2 bg-[#ea580c] border border-[#2b2723] mb-0.5" />
  )}
  ```

The dock sprite and the floating pet already read `neko` from the store
(plan 016, step 5, and `PetLayer`).

### 3. Terminal commands in `src/components/ContactTerminal.tsx`

- Import: `import { toggleNekoMode } from "@/components/arcade/ArcadeCorner";`
- Cases before `default:`:
  ```tsx
  case "secret":
    out = ["Old-school cheat codes still work here: ↑ ↑ ↓ ↓ ← → ← → B A"];
    break;
  case "neko":
    toggleNekoMode();
    out = [arcade.getState().neko ? "NEKO MODE ON =^.^=" : "NEKO MODE OFF"];
    break;
  ```
  (`arcade` is already imported by plan 019.)

### 4. Final bundle budget check (covers plans 014–020)

Run `npm run build` and the measurement script from plan 014, step 0.
Compare with the baseline recorded in `plans/README.md`:

- **Initial JS (gzip) may grow by at most 8 KB.** That covers the sprite kit,
  sprite data, corner, coins, toast, store, and the two pixelarticons icons.
- `PetLayer` must not be in the initial chunks: search the initial chunk files
  for the string `arcade-pet`; it must not appear.
- Record both numbers in `plans/README.md`.

If the budget is exceeded, report which chunk grew; do not remove features
without asking.

## Boundaries

- Do NOT list `secret` or `neko` in `help`.
- Do NOT trigger the code while the user is typing in the terminal input.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src`, `npm run build` pass.
- **Feel check** (`npm run dev`):
  - Click on the page background, type ↑ ↑ ↓ ↓ ← → ← → B A: the toast says
    `NEKO MODE ON =^.^=`, and BOT.v2 has cat ears in the corner, under the hero,
    and as the floating pet (if it is out). With SFX on, the power-up arpeggio
    plays.
  - Type the code again: ears go back to the antenna, toast `NEKO MODE OFF`.
  - Reload while on: still neko.
  - Type the code inside the terminal input: nothing happens.
  - Terminal `secret` prints the hint; `neko` toggles the mode (also on a phone).
  - `help` does not mention `secret` or `neko`.
- **Budget**: initial JS growth ≤ 8 KB gzip and `PetLayer` absent from the
  initial chunks, both recorded in the README.
- **Done when**: the cheat code toggles neko mode everywhere, persists, works
  from the terminal on phones, and the whole arcade stays inside the budget.
