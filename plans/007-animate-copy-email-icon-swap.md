# 007 — Animate the copy-email icon/label swap

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (missed opportunity — additive)
- **Category**: Missed opportunity / feedback
- **Estimated scope**: 1 file (`ContactTerminal.tsx`), ~10 lines

## Problem

When the user copies the email, the button instantly swaps its icon
(`PixelCopyIcon` → `PixelCheckIcon`) and its label
(`ContactTerminal.tsx:204-205`). The confirmation is the key moment of feedback
for a "copy" action, and right now it teleports — no acknowledgement that
something just happened beyond the text changing.

```tsx
/* src/components/ContactTerminal.tsx:204-205 — current (instant swap) */
{copied ? <PixelCheckIcon size={12} /> : <PixelCopyIcon size={12} />}
<span>{copied ? "Email Copied to Clipboard!" : "Copy Email Address"}</span>
```

`copied` is toggled true in `copyEmail`/`executeCommand` and reset after 2500ms
(`ContactTerminal.tsx:45-46, 101-102`).

## Target

Give the check icon a tiny "pop" when it appears — a one-shot scale-in from
0.6→1 with opacity, 160ms, strong ease-out — so the confirmation registers as
an event, not a silent text change. This is a rare, intentional success moment
(the delight budget the AUDIT playbook reserves for confirmations), so a small
pop is warranted. Keep the label swap as-is (text should read instantly).

Add a keyframe to `globals.css`:

```css
/* One-shot confirmation pop (copy success, etc.) */
@keyframes confirmPop {
  0%   { opacity: 0; transform: scale(0.6); }
  60%  { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-confirm-pop {
  animation: confirmPop 160ms var(--ease-out-strong);
}

@media (prefers-reduced-motion: reduce) {
  .animate-confirm-pop { animation: none; }
}
```

Note the start is `scale(0.6)`, NOT `scale(0)` — the AUDIT playbook forbids
`scale(0)` ("nothing appears from nothing"). The brief overshoot to 1.08 gives
it physicality. Because the key is re-mounted when `copied` flips, the keyframe
plays once per copy.

Apply in the button:

```tsx
/* src/components/ContactTerminal.tsx — target */
{copied ? (
  <span key="check" className="motion-safe:animate-confirm-pop inline-flex">
    <PixelCheckIcon size={12} />
  </span>
) : (
  <PixelCopyIcon size={12} />
)}
<span>{copied ? "Email Copied to Clipboard!" : "Copy Email Address"}</span>
```

The `key="check"` ensures React mounts a fresh node each time `copied` becomes
true, so the one-shot animation replays on every copy (not just the first).

## Repo conventions to follow

- One-shot entrance keyframes live in `globals.css` (see `enterFadeUp`,
  `blink` at `globals.css:148-177`). Add `confirmPop` in the same region.
- `--ease-out-strong` (`globals.css:26`) is the UI ease-out token.
- `motion-safe:` is the reduced-motion gate used for Tailwind-driven loops
  (and is the pattern plan 003 introduces); use it here too so the pop is
  automatically suppressed under reduced motion. The explicit
  `@media (prefers-reduced-motion)` rule on `.animate-confirm-pop` is a
  belt-and-braces fallback.

## Steps

1. Append the `confirmPop` keyframe, `.animate-confirm-pop` class, and its
   reduced-motion rule to `src/app/globals.css` (near the other one-shot
   keyframes).
2. In `src/components/ContactTerminal.tsx:204`, wrap the `<PixelCheckIcon>` in
   a `<span key="check" className="motion-safe:animate-confirm-pop inline-flex">`
   as shown in the Target. Leave the `PixelCopyIcon` branch and the label
   `<span>` unchanged.

## Boundaries

- Do NOT change the 2500ms reset timing or the copy logic.
- Do NOT animate the copy (idle) icon — only the check (success) icon.
- Do NOT use `scale(0)` anywhere.
- Do NOT add dependencies.
- If the icon swap is not at the cited line (drift), STOP and report.

## Verification

- **Mechanical**: `npm run build` compiles clean.
- **Feel check**: `npm run dev`, scroll to Contact, click "Copy Email Address":
  - The check icon pops in (scale 0.6 → slight overshoot → 1) over ~160ms; the
    label switches to "Email Copied to Clipboard!" instantly.
  - After 2.5s it reverts to the copy icon + original label.
  - Click copy again (or type `email` in the terminal) — the pop replays every
    time, not just once (thanks to `key="check"`).
  - Toggle OS reduced-motion: the icon still swaps but does not pop.
- **Done when**: copying produces a one-shot scale-in confirmation that replays
  on each copy and is suppressed under reduced motion.
