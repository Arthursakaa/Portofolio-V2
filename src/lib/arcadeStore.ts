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
