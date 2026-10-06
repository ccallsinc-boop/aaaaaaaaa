/**
 * Where the buy buttons go.
 *
 * The front offer checks out on Hotmart, as a plain link to Hotmart's own page.
 * Hotmart detects the buyer's country and shows the checkout in their currency,
 * so one link serves every market. The upsell still uses its own checkout (see
 * src/lib/upsell.ts), which is why isUpsellConfigured() compares the two.
 *
 * Named by role rather than by provider, so the next switch touches one file.
 */

/** Hotmart checkout for the front offer: the emulator method. */
export const FRONT_CHECKOUT_URL =
  "https://pay.hotmart.com/X105105907P?off=lkpibdcw&bid=1791252016768";

/**
 * Xpag checkout for the same front offer, served by the /xpag copy of the landing.
 *
 * The page at / keeps selling through Hotmart; /xpag is the same page with every
 * buy button pointing here instead, so ads can send traffic to either. One link
 * serves every country the offer accepts (Mexico, Colombia, Argentina).
 *
 * Empty means not configured: /xpag answers 404 until it is filled, so the page
 * can never go live with buttons that lead nowhere.
 */
export const XPAG_CHECKOUT_URL = "https://xpag.global/pay/ZAOzjS5J";

/** Which checkout a landing sells through. */
export type CheckoutProvider = "hotmart" | "xpag";

export function isXpagConfigured(): boolean {
  return XPAG_CHECKOUT_URL.trim().length > 0;
}

/** Kept as the single default so no component hardcodes a URL. */
export const DEFAULT_CHECKOUT_URL = FRONT_CHECKOUT_URL;

/**
 * Per-currency overrides, for the day a market needs an offer of its own.
 * Empty means every market uses the link above.
 */
const BY_CURRENCY: Record<string, string> = {};

export function checkoutUrlFor(currency: string, fallback = DEFAULT_CHECKOUT_URL): string {
  return BY_CURRENCY[currency.toUpperCase()] ?? fallback;
}
