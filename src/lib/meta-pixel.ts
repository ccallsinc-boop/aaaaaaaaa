export const META_PIXEL_ID = "1817580416258631";
export const META_PIXEL_ID_2 = "1525335515584061";
export const META_PIXEL_ID_4 = "3224733084388549";
export const META_PIXEL_IDS = [META_PIXEL_ID, META_PIXEL_ID_2];

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

export type MetaParams = {
  value?: number;
  currency?: string;
  content_name?: string;
  content_type?: string;
  content_ids?: string[];
  content_category?: string;
  [key: string]: unknown;
};

/**
 * Fires the event once, on the browser pixel only.
 * The Conversions API mirror was removed: it was duplicating PageView and
 * InitiateCheckout in Events Manager. CAPI stays available for server-side
 * events (see src/lib/meta.functions.ts) that the browser pixel cannot send.
 */
export function trackMeta(eventName: string, params: MetaParams = {}) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", eventName, params);
}

/** Sends a funnel-specific event without treating it as a standard Meta event. */
export function trackMetaCustom(eventName: string, params: MetaParams = {}) {
  if (typeof window === "undefined") return;
  window.fbq?.("trackCustom", eventName, params);
}

const fired = new Set<string>();

/** Same as trackMeta, but only once per page session (for scroll/view signals). */
export function trackMetaOnce(
  key: string,
  eventName: string,
  params: MetaParams = {},
) {
  if (fired.has(key)) return;
  fired.add(key);
  trackMeta(eventName, params);
}
