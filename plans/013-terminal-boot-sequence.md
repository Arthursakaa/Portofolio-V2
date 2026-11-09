# 013 — Terminal "boot sequence" when the Contact terminal scrolls in (retro moment)

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: LOW (additive)
- **Category**: Missed opportunity (rare delight moment)
- **Estimated scope**: `ContactTerminal.tsx` (~10 lines), `globals.css`
  (+1 block), `layout.tsx` (noscript fallback)
- **Depends on**: plan 008 (uses the Contact grid's `[data-reveal]` group, and
  the terminal is `data-reveal-item={1}` there)

## Problem

The Contact terminal starts with a pre-filled entry: the command
`./get_contact_info.sh` and five output lines. They are all there the instant
the terminal appears, which wastes the most "terminal" moment on the page.

```tsx
/* src/components/ContactTerminal.tsx — current */
interface LogLine {
  cmd?: string;
  output: string[];
}
// ...
const [history, setHistory] = useState<LogLine[]>([
  {
    cmd: "./get_contact_info.sh",
    output: [ /* 5 lines */ ],
  },
]);
// ...
{history.map((item, idx) => (
  <div key={idx} className="space-y-1">
    {item.cmd ? (
      <p className="text-[#10b981] font-bold">
        arthur@binus:~$ <span className="text-white">{item.cmd}</span>
      </p>
    ) : null}
    <div className="bg-[#1f1b18] border-l-2 border-[#38bdf8] pl-3 py-2 space-y-1 text-xs text-[#e9e2d5]">
      {item.output.map((line, lIdx) => (
        <p key={lIdx} className="leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  </div>
))}
```

## Target

When the Contact grid is revealed, the boot entry prints line by line: the
command line first, then each output line. Each line appears instantly, the way
a real terminal prints, 80ms after the previous one. Printing starts 300ms
after the reveal, once the terminal panel has mostly faded in (plan 008: item 1
= 60ms delay + 400ms fade).

| Value | Setting |
| --- | --- |
| Per-line effect | opacity 0 → 1 with a 0ms transition (an instant print, not a fade) |
| Line spacing | 80ms (top of the AUDIT §7 stagger range) |
| Start offset | 300ms |
| Lines | 6 (1 command + 5 output): last line prints at 300 + 5 × 80 = 700ms |

Only the **initial boot entry** prints this way. Output from commands the user
runs appears instantly as it does today. Typing commands is a repeated action,
and the AUDIT says repeated actions get no added animation.

Each line gets its own index through an inline custom property (`--line`) set on
that line's element. A variable set on each element is fine; the AUDIT only
warns against a parent variable driving all of its children.

CSS, added to `src/app/globals.css` after the pixel-wipe block (plan 012), or
after the scroll-reveal v2 block if 012 is not done yet:

```css
/* Terminal boot sequence (plan 013). Initial terminal lines print one by one
   when the Contact grid is revealed. --line is set inline per line. */
.boot-line {
  transition: opacity 0ms linear;
  transition-delay: calc(300ms + var(--line, 0) * 80ms);
}

[data-reveal]:not([data-revealed="true"]) .boot-line {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .boot-line {
    opacity: 1 !important;
    transition: none !important;
  }
}

.reduce-motion .boot-line {
  opacity: 1 !important;
  transition: none !important;
}
```

## Repo conventions to follow

- Terminal styling and state live entirely in `ContactTerminal.tsx`; keep the
  change local.
- Reduced motion is overridden in both places; the no-JS fallback is in
  `layout.tsx`.

## Steps

1. In `src/components/ContactTerminal.tsx`, extend the `LogLine` interface:
   ```tsx
   interface LogLine {
     cmd?: string;
     output: string[];
     /** Initial entry: prints line by line when the terminal scrolls in */
     boot?: boolean;
   }
   ```
2. In the `useState<LogLine[]>([...])` initial value, add `boot: true` to the
   `./get_contact_info.sh` entry. Commands added by `executeCommand` must not
   set it.
3. In the history render, for entries with `item.boot`:
   - On the command `<p className="text-[#10b981] font-bold">`, add
     `boot-line` to the className when `item.boot` is true, and
     `style={item.boot ? ({ "--line": 0 } as React.CSSProperties) : undefined}`.
   - On each output `<p key={lIdx} className="leading-relaxed">`, add
     `boot-line` when `item.boot` is true, and
     `style={item.boot ? ({ "--line": lIdx + 1 } as React.CSSProperties) : undefined}`.
   Example for the output line:
   ```tsx
   <p
     key={lIdx}
     className={`leading-relaxed ${item.boot ? "boot-line" : ""}`}
     style={item.boot ? ({ "--line": lIdx + 1 } as React.CSSProperties) : undefined}
   >
     {line}
   </p>
   ```
   (`React` is already available as a type namespace in this file; it is used
   in `React.KeyboardEvent`.)
4. In `src/app/globals.css`, add the CSS from Target.
5. In `src/app/layout.tsx`, append `.boot-line{opacity:1!important}` to the
   noscript `<style>` string.

## Boundaries

- Do NOT animate output from user-run commands.
- Do NOT add a typing (character-by-character) effect; whole lines print.
- Do NOT add sounds to the boot sequence.
- Do NOT add dependencies.
- If plan 008 is not in place (the Contact grid has no `data-reveal`), STOP:
  the lines would stay hidden.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npm run build` pass.
- **Feel check** (`npm run dev`, hard reload):
  - Scroll to Contact: the terminal fades in, then the prompt line
    `arthur@binus:~$ ./get_contact_info.sh` prints, followed by five output
    lines about 80ms apart. It is finished in under a second.
  - Run `help`, then `clear`, then `about`: output appears instantly each time.
  - Land on `#contact` from the nav link: the boot sequence still plays once.
  - ANIM:OFF and "Emulate prefers-reduced-motion: reduce": all lines are
    visible immediately.
  - DevTools Animations panel at 10%: lines pop in one at a time, no fades.
- **Done when**: only the initial terminal entry prints line by line, once, on
  first reveal, and reduced motion shows it statically.
