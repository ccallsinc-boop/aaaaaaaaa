/**
 * The one-click upsell shown right after checkout.
 *
 * The front offer sells 12 titles. The rest of the library is the upsell.
 *
 * Price is set in the currency its Hotmart offer is configured in, and converted
 * per market by the same engine as the front (see buildResolvedMarket), so a
 * Mexican buyer sees pesos here too instead of jumping currency mid-funnel. A
 * buyer in UPSELL_CURRENCY sees UPSELL_PRICE exactly.
 *
 * The route only answers once ACCEPT_URL points at a checkout of its own. Sharing
 * the front offer's link would bill the front price for the front product, so the
 * guard below treats that case as "not configured" rather than as ready.
 */

import { FRONT_CHECKOUT_URL } from "./checkout";

/** ISO 4217 code of the currency the upsell's Hotmart offer is priced in. */
export const UPSELL_CURRENCY = "COP";

/**
 * Price of the full library upgrade, in UPSELL_CURRENCY. Matches the Hotmart
 * offer. Every other currency is this number at the live rate, same as the front.
 */
export const UPSELL_PRICE = 11349.73;

/** Hotmart checkout for the upgrade. A product of its own, separate from the front. */
export const UPSELL_ACCEPT_URL = "https://pay.hotmart.com/T105093133X?off=jnocgnre";

/** Where a refusal goes. Empty falls back to the members area route. */
export const UPSELL_DECLINE_URL = "";

/** Fallback for the decline link so it is never a dead anchor. */
export const UPSELL_DECLINE_FALLBACK = "/biblioteca";

/** The page only goes live once it has a checkout that is not the front one. */
export function isUpsellConfigured(frontUrl: string = FRONT_CHECKOUT_URL): boolean {
  const url = UPSELL_ACCEPT_URL.trim();
  return url.length > 0 && url !== frontUrl.trim();
}

/** True while the upgrade still points at the front checkout, which would bill wrong. */
export function upsellSharesFrontCheckout(frontUrl: string = FRONT_CHECKOUT_URL): boolean {
  return UPSELL_ACCEPT_URL.trim() === frontUrl.trim();
}

export function upsellDeclineHref(): string {
  return UPSELL_DECLINE_URL.trim() || UPSELL_DECLINE_FALLBACK;
}
