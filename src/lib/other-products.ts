import { DEFAULT_MARKET, type ResolvedMarket } from "@/lib/markets";

/**
 * This repo serves three different products, which is easy to miss:
 *   /          /pt /en /uk /es /in   Framers, the 424 PC game pack
 *   /es2                             Generative Energy, a pro-metabolic PDF guide
 *   /clips                           Framers Clips, a video clipping tool
 *
 * Only the front offer is priced off OFFER_PRICE (campaign.ts) with live conversion. The other
 * two keep their own fixed prices here, so the shared LocaleProvider can serve
 * them without inheriting the pack's price.
 */

function fixedUsd(price: number): ResolvedMarket {
  return {
    market: DEFAULT_MARKET,
    rate: 1,
    price,
    perGameValue: price,
    fxSource: "fixed",
    country: null,
    // These products are not part of the game pack's launch window.
    now: 0,
    campaignEndsAt: null,
    priceAfter: null,
    // These products have no upsell.
    upsellPrice: 0,
  };
}

export const GENERATIVE_ENERGY = {
  price: 5.3,
  currency: "USD",
  resolved: fixedUsd(5.3),
};

export const FRAMERS_CLIPS = {
  price: 2.99,
  currency: "EUR",
};
