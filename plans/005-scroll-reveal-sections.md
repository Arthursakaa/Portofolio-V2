# 005 — Add scroll-reveal entrances for below-the-fold sections

- **Status**: DONE
- **Commit**: pre-git (no commit — repository is not under git yet)
- **Severity**: MEDIUM (missed opportunity — additive)
- **Category**: Missed opportunity / cohesion
- **Estimated scope**: 2 new files + CSS additions + ~6 one-line wrappers

## Problem

The hero content animates in on mount via `.stagger-enter`
(`globals.css:160-167`, used in `HeroSection.tsx` and `PlayerCard.tsx`). But
everything below the fold — About, Projects, Skills, Timeline, Resume, Contact
— simply pops into existence as the user scrolls to it. There is unused
"delight budget": a brief, gated fade-up as each section enters the viewport
would explain the arrival of content and make the long scroll feel intentional,
without adding weight.

Current section roots (each is the element to animate), with their files:

- `AboutSection.tsx` — `<section id="about" ...>`
- `ProjectsSection.tsx:44` — `<section id="projects" ...>`
- `SkillsInventory.tsx` — `<section id="skills" ...>`
- `TimelineSection.tsx` — `<section id="experience" ...>` (verify id/root)
- `ResumeSection.tsx` — `<section id="resume" ...>`
- `ContactTerminal.tsx:117` — `<section id="contact" ...>`

> Executor: open each file and confirm the outermost `<section>` element and
> its current className before wrapping. Ids above are from the nav map in
> `HeaderNav.tsx:15-21`; the section root is the correct target, not an inner
> div.

## Why no animation library

This project deliberately ships **zero motion libraries** (see
`PROJECT_CONTEXT.md` §2 and §7: CSS-only motion, Web Audio synth, local fonts —
the stack is intentionally dependency-light). Adding Framer Motion / Motion for
a fade-up would contradict that architecture and add bundle weight to a
portfolio that prizes fast loads. Use a tiny IntersectionObserver hook + CSS
instead. Do NOT `npm install` anything.

## Target

A reusable `useRevealOnScroll` hook returns a `ref` and an `isVisible` boolean.
A `Reveal` wrapper component applies a `data-revealed` attribute that CSS
animates. The animation is a short composite-only fade-up, reduced-motion-safe,
and runs **once** per element (no re-trigger on scroll back up).

New hook — `src/hooks/useRevealOnScroll.ts`:

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion: reveal immediately, skip the observer.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // run once
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px", ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}
```

New wrapper — `src/components/Reveal.tsx`:

```tsx
"use client";

import { ReactNode } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
}

export function Reveal({ children, className = "", as = "div" }: RevealProps) {
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();
  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      data-reveal
      data-revealed={isVisible ? "true" : "false"}
      className={className}
    >
      {children}
    </Tag>
  );
}
```

> IMPORTANT — do NOT wrap the `<section>` elements in an extra `<Reveal>` tag,
> because that would break the `id="..."` scroll anchors and the nav links.
> Instead, apply the reveal **directly to each existing `<section>`** using the
> hook (see Steps). The `Reveal` component above is provided only for optional
> reuse on inner groups; the section-level reveal is done inline.

CSS additions — append to `src/app/globals.css` after the `.stagger-*` block:

```css
/* Scroll-reveal: composite-only fade-up, runs once, reduced-motion-safe */
[data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 480ms var(--ease-out-strong),
    transform 480ms var(--ease-out-strong);
  will-change: opacity, transform;
}

[data-reveal][data-revealed="true"] {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

Durations: 480ms is above the 300ms UI budget on purpose — these are
section-level "explanatory/marketing" entrances (the AUDIT playbook allows
longer for explanatory/marketing motion), not interactive UI feedback. Keep the
translate at a modest 16px (never a large offset) and transform/opacity only.

## Repo conventions to follow

- Strong easing token `--ease-out-strong` (`globals.css:26`) — use it, do not
  invent a new curve.
- Existing entrance keyframe `.stagger-enter` uses `translateY(8px) scale(0.98)`
  + opacity (`globals.css:148-158`). The scroll reveal uses a slightly larger
  16px translate (bigger element, bigger travel) but the same opacity+transform
  recipe and the same easing token — cohesive, not identical.
- `"use client"` is required at the top of any file using hooks/observers (every
  component in this app already uses it — see `page.tsx:1`).
- Path alias `@/` maps to `src/` (used everywhere, e.g.
  `import { retroSound } from "@/lib/audio"`). Put the hook at
  `src/hooks/useRevealOnScroll.ts`.

## Steps

1. Create `src/hooks/useRevealOnScroll.ts` with the hook code above.
2. Create `src/components/Reveal.tsx` with the wrapper above (kept for optional
   reuse; not required by the section wiring below).
3. Append the CSS block above to `src/app/globals.css`.
4. For EACH of the six section components, apply the reveal to the outermost
   `<section>` without changing its `id` or structure. Pattern (shown for
   ProjectsSection, repeat per file):
   - At the top of the component body, call the hook:
     ```tsx
     const { ref, isVisible } = useRevealOnScroll<HTMLElement>();
     ```
   - Add the import:
     ```tsx
     import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
     ```
   - On the `<section>` element, add `ref={ref}`, `data-reveal`, and
     `data-revealed={isVisible ? "true" : "false"}`. Keep the existing
     `id` and `className` exactly.
     ```tsx
     <section
       id="projects"
       ref={ref}
       data-reveal
       data-revealed={isVisible ? "true" : "false"}
       className="py-16 border-b-2 border-[#2b2723] bg-[#f4efe6]"
     >
     ```
   Apply the same three-attribute addition to the section roots in
   `AboutSection.tsx`, `SkillsInventory.tsx`, `TimelineSection.tsx`,
   `ResumeSection.tsx`, and `ContactTerminal.tsx`.
5. Do NOT apply a reveal to `HeroSection` — it already animates on mount via
   `.stagger-enter`, and it is above the fold.

## Boundaries

- Do NOT install any npm package.
- Do NOT wrap sections in extra elements — the reveal attributes go on the
  existing `<section>` so `id` anchors keep working.
- Do NOT reveal the hero or the header/footer.
- Do NOT stagger children inside sections in this plan (that is plan 007).
- Keep each section's existing `id` and `className` byte-for-byte; only add the
  three attributes and the ref.
- If a section's outermost element is not a `<section>` with the cited `id`
  (drift), STOP and report that file.

## Verification

- **Mechanical**: `npm run build` (webpack) compiles with no type errors;
  confirm the `@/hooks/...` import resolves (tsconfig path alias).
- **Feel check**: `npm run dev`, scroll slowly from top to bottom:
  - Each section fades up ~16px into place as it enters the viewport, once.
    Scrolling back up and down again does NOT replay it.
  - Clicking nav links (About, Projects, Skills, Experience, Resume, Contact)
    still jumps to the correct section (ids intact). If a target was still
    hidden (opacity 0), it reveals on arrival — confirm you never land on an
    invisible section.
  - Toggle OS reduced-motion (DevTools Rendering → emulate
    prefers-reduced-motion): every section is visible immediately with no
    movement.
  - In DevTools Performance, confirm the reveal animates transform/opacity only
    (no layout/paint spikes).
- **Done when**: all six below-the-fold sections reveal once on scroll, nav
  anchors work, and reduced motion shows everything statically.
