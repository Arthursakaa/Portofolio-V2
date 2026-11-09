"use client";

import { useEffect } from "react";

const GROUP_SELECTOR = '[data-reveal]:not([data-revealed="true"])';

/**
 * Marks every [data-reveal] group as data-revealed="true" the first time it
 * scrolls into view. Writes the attribute straight to the DOM (no React state,
 * so revealing never re-renders anything). The visuals live in globals.css.
 * Mount once, near the root of the page.
 */
export function ScrollRevealObserver() {
  useEffect(() => {
    const reveal = (el: Element) => {
      (el as HTMLElement).dataset.revealed = "true";
    };

    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(GROUP_SELECTOR).forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target); // run once
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );

    const observeWithin = (root: ParentNode) => {
      root.querySelectorAll(GROUP_SELECTOR).forEach((el) => io.observe(el));
    };

    observeWithin(document);

    // Groups mounted after first paint (e.g. project cards re-added by a filter)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(GROUP_SELECTOR)) io.observe(node);
          observeWithin(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
