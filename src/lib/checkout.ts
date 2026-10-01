/**
 * Where the buy buttons go.
 *
 * Checkout runs on Xpag. Unlike Hotmart, Xpag has no overlay widget: the button
 * is a plain link and the buyer lands on Xpag's own page. All the widget wiring
 * that used to live here and in the CTA components is gone, along with the two
 * third-party requests it made on every page load.
 *
 * Named by role rather than by provider, so the next switch touches one file.
 */

/** Xpag checkout for the front offer: the 12 games. */
export const FRONT_CHECKOUT_URL = "https://xpag.global/pay/GYMl3Clw";

/** Kept as the single default so no component hardcodes a URL. */
export const DEFAULT_CHECKOUT_URL = FRONT_CHECKOUT_URL;

/**
 * Per-currency overrides, for the day a market needs its own Xpag product.
 * Empty means every market uses the link above.
 */
const BY_CURRENCY: Record<string, string> = {};

export function checkoutUrlFor(currency: string, fallback = DEFAULT_CHECKOUT_URL): string {
  return BY_CURRENCY[currency.toUpperCase()] ?? fallback;
}
