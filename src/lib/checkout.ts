/**
 * Where the buy buttons go.
 *
 * Checkout moved from Xpag to Hotmart. Hotmart handles local currency and the
 * order bumps and upsells that now carry the rest of the library, so the landing
 * only needs one link.
 *
 * The link is rendered as an <a> carrying HOTMART_WIDGET_CLASSES, which the
 * Hotmart widget script binds to in order to open the checkout in an overlay.
 * If the widget fails to load, the href still navigates to the same checkout, so
 * the button never becomes dead.
 */

/** Hotmart product + offer code for the front offer. */
export const HOTMART_CHECKOUT_URL =
  "https://pay.hotmart.com/X105105907P?checkoutMode=2&off=s8885qbi";

/** Kept as the single default so no component hardcodes a URL. */
export const DEFAULT_CHECKOUT_URL = HOTMART_CHECKOUT_URL;

/**
 * Per-currency overrides, for the day a market needs its own Hotmart offer code.
 * Empty means every market uses the link above, which is what Hotmart's own
 * currency handling expects.
 */
const BY_CURRENCY: Record<string, string> = {};

export function checkoutUrlFor(currency: string, fallback = DEFAULT_CHECKOUT_URL): string {
  return BY_CURRENCY[currency.toUpperCase()] ?? fallback;
}
