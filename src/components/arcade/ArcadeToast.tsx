"use client";

import { useEffect } from "react";
import { arcade, useArcade } from "@/lib/arcadeStore";

/** Transient arcade messages (plans 019/020). Mounted once at the page root. */
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
        <p
          key={toast.id}
          className="arcade-toast bg-[#2b2723] text-[#fffdf9] border-2 border-[#eab308] shadow-[3px_3px_0_0_#eab308] px-4 py-2 font-pixel text-[9px] sm:text-[10px] tracking-wider text-center"
        >
          {toast.text}
        </p>
      ) : null}
    </div>
  );
}
