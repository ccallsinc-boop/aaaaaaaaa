/**
 * Where each market's "buy" button goes.
 *
 * The screen now shows a price converted from R$17,99 at the live rate, so the
 * checkout has to charge that same amount or the funnel lies to the visitor.
 * Until the Xpag side is decided, everything points at the links that are
 * already in production and BY_CURRENCY stays empty.
 *
 * To make a currency charge locally: add its code here with the matching Xpag
 * link. No component changes are needed.
 */

/** Link used when a currency has no entry of its own. */
export const DEFAULT_CHECKOUT_URL = "https://xpag.global/pay/2Kf006h0";

/** The link the Spanish landing has always used. */
export const ES_CHECKOUT_URL = "https://xpag.global/pay/oPheL733";

/** The Spanish quiz sells through a different Xpag product than the landing. */
export const ES_QUIZ_CHECKOUT_URL = "https://xpag.global/pay/VUv0nMnI";

/**
 * Per-currency checkout links. Example, once the products exist:
 *   MXN: "https://xpag.global/pay/xxxxxxxx",
 *   BRL: "https://xpag.global/pay/yyyyyyyy",
 */
const BY_CURRENCY: Record<string, string> = {};

export function checkoutUrlFor(currency: string, fallback = DEFAULT_CHECKOUT_URL): string {
  return BY_CURRENCY[currency.toUpperCase()] ?? fallback;
}

/** True while a currency still checks out through a link priced in another currency. */
export function checkoutMatchesCurrency(currency: string): boolean {
  return BY_CURRENCY[currency.toUpperCase()] != null;
}
