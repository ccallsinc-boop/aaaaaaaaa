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

/** Hotmart one-click upsell URL. Empty until the funnel is built. */
export const UPSELL_ACCEPT_URL = "";

/** Where a refusal goes. Empty falls back to the members area route. */
export const UPSELL_DECLINE_URL = "";

/** Fallback for the decline link so it is never a dead anchor. */
export const UPSELL_DECLINE_FALLBACK = "/biblioteca";

export function isUpsellConfigured(): boolean {
  return UPSELL_ACCEPT_URL.trim().length > 0;
}

export function upsellDeclineHref(): string {
  return UPSELL_DECLINE_URL.trim() || UPSELL_DECLINE_FALLBACK;
}
