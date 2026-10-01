/**
 * The one-click upsell shown right after checkout.
 *
 * The front offer sells 12 titles. The rest of the library is the upsell, which
 * is what makes a R$17,99 front price work: the margin is on this page, not on
 * the first one.
 *
 * Price is a base in BRL, converted per market by the same engine as the front,
 * so a Mexican buyer sees pesos here too instead of jumping currency mid-funnel.
 *
 * STILL NEEDED FROM HOTMART:
 *   ACCEPT_URL   a checkout of the upgrade's OWN, not the front offer's
 *   DECLINE_URL  where a refusal goes (optional, falls back to the members area)
 * Until ACCEPT_URL points somewhere of its own, isUpsellConfigured() is false and
 * the route answers 404, so the page cannot bill the wrong amount.
 */

/**
 * The front offer's checkout, inlined so the guard below does not import the
 * checkout module and create a cycle.
 */
const FRONT_CHECKOUT_FOR_GUARD = "https://pay.hotmart.com/X105105907P?checkoutMode=2&off=s8885qbi";

/**
 * Price of the full library upgrade, in BRL. Confirmed value, not a placeholder.
 * Every other currency is this number at the live rate, same as the front offer,
 * so the funnel never switches currency on the buyer.
 */
export const UPSELL_PRICE_BRL = 37;

/**
 * Hotmart checkout for the upgrade, opened through the Hotmart widget.
 *
 * WARNING: this is currently the SAME product and offer code as the front offer
 * (X105105907P, off=s8885qbi). Anyone accepting the upsell is therefore charged
 * the front price for the front product, not R$37 for the remaining 412 titles.
 * Create a separate Hotmart product (or at least a separate offer code) for the
 * upgrade and replace the value here, otherwise the page promises one thing and
 * the checkout bills another, which is how refunds and chargebacks start.
 */
export const UPSELL_ACCEPT_URL = "https://pay.hotmart.com/X105105907P?checkoutMode=2&off=s8885qbi";

/** Where a refusal goes. Empty falls back to the members area route. */
export const UPSELL_DECLINE_URL = "";

/** Fallback for the decline link so it is never a dead anchor. */
export const UPSELL_DECLINE_FALLBACK = "/biblioteca";

/**
 * The page only goes live once it has a checkout of its own.
 *
 * Pointing at the front offer is treated as "not configured", not as ready: that
 * URL bills the front price for the front product, so a live page would charge a
 * buyer a second time for the 12 games they just bought while promising them the
 * other 412. Paste the separate Hotmart offer into UPSELL_ACCEPT_URL and the
 * route starts answering on its own.
 */
export function isUpsellConfigured(frontUrl: string = FRONT_CHECKOUT_FOR_GUARD): boolean {
  const url = UPSELL_ACCEPT_URL.trim();
  return url.length > 0 && url !== frontUrl.trim();
}

/**
 * True while the upgrade still points at the front offer's checkout, which would
 * bill the wrong amount. Surfaced as a console warning in development so the
 * collision is not discovered through a customer complaint.
 */
export function upsellSharesFrontCheckout(frontUrl: string): boolean {
  return UPSELL_ACCEPT_URL.trim() === frontUrl.trim();
}

export function upsellDeclineHref(): string {
  return UPSELL_DECLINE_URL.trim() || UPSELL_DECLINE_FALLBACK;
}
