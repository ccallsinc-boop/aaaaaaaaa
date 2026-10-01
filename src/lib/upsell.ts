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
 * TWO VALUES MUST COME FROM HOTMART BEFORE THIS GOES LIVE:
 *   ACCEPT_URL  the one-click upsell link of the Hotmart funnel
 *   DECLINE_URL where Hotmart sends someone who refuses (usually the members area)
 * Until they are filled, isUpsellConfigured() is false and the route answers 404
 * rather than showing a buy button that goes nowhere.
 */

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

export function isUpsellConfigured(): boolean {
  return UPSELL_ACCEPT_URL.trim().length > 0;
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
