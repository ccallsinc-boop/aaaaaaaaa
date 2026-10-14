/**
 * Keeps the ad click's UTMs with the visitor until the checkout.
 *
 * The checkout is another site, so the UTMs of the landing URL are lost on the
 * buy click unless they are appended to the checkout link. This module stores the
 * last ad click ("touch") in localStorage and appends its UTMs, plus a short id in
 * `src`, to every link that points to a checkout host. Hotmart returns `src` in
 * its webhook, and the sale finds the touch, and its UTMs, by that id.
 *
 * Browser-safe and free of side effects at import time; the server imports the
 * id pattern from here too.
 */

import { ATTRIBUTION_WINDOW_DAYS, CHECKOUT_HOSTS } from "./tracker-config";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

export type TouchParams = Partial<Record<UtmKey, string>>;

export type Touch = {
  id: string;
  /** Epoch ms of the click. */
  at: number;
  params: TouchParams;
};

/** 12 lowercase letters or digits: short enough for any checkout's `src` field. */
export const TOUCH_ID_PATTERN = /^[a-z0-9]{12}$/;

/** The checkout parameter that carries the touch id. */
export const TOUCH_ID_PARAM = "src";

const STORAGE_KEY = "framers_touch";
const MAX_PARAM_LENGTH = 500;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function newTouchId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  // 256 is not a multiple of 36, so the first letters are very slightly more
  // likely. Irrelevant for an id that only has to be unique, not secret.
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/**
 * A new touch when the URL carries any UTM, else null. Only the UTMs are kept:
 * they are all the dashboard reads, so click ids such as fbclid stay out.
 */
export function touchFromSearch(search: string, now: number): Touch | null {
  const query = new URLSearchParams(search);
  const params: TouchParams = {};
  for (const key of UTM_KEYS) {
    const value = query.get(key)?.trim();
    if (value) params[key] = value.slice(0, MAX_PARAM_LENGTH);
  }
  if (Object.keys(params).length === 0) return null;
  return { id: newTouchId(), at: now, params };
}

function isTouch(value: unknown): value is Touch {
  if (value == null || typeof value !== "object") return false;
  const touch = value as Partial<Touch>;
  return (
    typeof touch.id === "string" &&
    TOUCH_ID_PATTERN.test(touch.id) &&
    typeof touch.at === "number" &&
    touch.params != null &&
    typeof touch.params === "object"
  );
}

/** The stored touch, unless it is missing, malformed or older than the window. */
export function readTouch(now: number): Touch | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const touch: unknown = JSON.parse(raw);
    if (!isTouch(touch)) return null;
    if (now - touch.at > ATTRIBUTION_WINDOW_DAYS * 24 * 60 * 60 * 1000) return null;
    return touch;
  } catch {
    // Private mode or blocked storage: no attribution, the funnel keeps working.
    return null;
  }
}

export function saveTouch(touch: Touch): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(touch));
  } catch {
    // Same as above: storage is optional.
  }
}

/**
 * The checkout link with the touch appended, or null when the link is not a
 * checkout or already carries everything. Parameters already on the link win:
 * a link built with its own UTMs or `src` is left as it is.
 */
export function decorateCheckoutUrl(href: string, touch: Touch): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (!CHECKOUT_HOSTS.includes(url.hostname)) return null;

  let changed = false;
  for (const key of UTM_KEYS) {
    const value = touch.params[key];
    if (value && !url.searchParams.has(key)) {
      url.searchParams.set(key, value);
      changed = true;
    }
  }
  if (!url.searchParams.has(TOUCH_ID_PARAM)) {
    url.searchParams.set(TOUCH_ID_PARAM, touch.id);
    changed = true;
  }
  return changed ? url.toString() : null;
}
