/**
 * The front offer's price, and its optional launch window.
 *
 * The price is set in the currency the checkout offer is configured in: the
 * offer is priced in US dollars, so the page is too. A visitor in the US sees
 * exactly OFFER_PRICE; every other market sees it converted at the live rate
 * (see buildResolvedMarket in markets.ts), and Hotmart confirms the final amount
 * in the buyer's currency at checkout.
 *
 * The launch window, when configured, is enforced by the code: while it is open
 * the price is `launchPrice`, and once it closes the page shows `priceAfter` for
 * everyone. That only stays true if the checkout changes on the same date, so a
 * window needs a second offer at `priceAfter` to switch to. With a single offer
 * there is no window: CAMPAIGN is null, the countdown and the crossed-out "after
 * launch" price disappear, and nothing on the page promises a rise that the
 * checkout would not apply.
 *
 * Do NOT extend `endsAt` while leaving the price unchanged: that turns the
 * countdown into fake urgency.
 */

/** ISO 4217 code of the currency the checkout offer is priced in. */
export const OFFER_CURRENCY = "USD";

/** Price of the front offer, in OFFER_CURRENCY. Matches the Hotmart offer. */
export const OFFER_PRICE = 15;

/**
 * Price anchor: what playing these games costs the usual way, in OFFER_CURRENCY.
 *
 * Without a real higher price there is nothing honest to strike through, and a
 * made-up "was" price is a fake discount. The anchor is therefore a comparison the
 * visitor can check: the hardware these titles normally require. Both are floors,
 * kept below current US retail on purpose, so "more than" stays true: the cheapest
 * current console sells for more than $300, and a PC that runs Red Dead Redemption 2
 * for more than $600. They are converted per market like the price itself, and
 * rounded down.
 */
export const ANCHOR_CONSOLE_FROM = 300;
export const ANCHOR_GAMING_PC_FROM = 600;

export type Campaign = {
  /** ISO 8601 instant when launch pricing ends. */
  endsAt: string;
  /** Price in OFFER_CURRENCY while the window is open. */
  launchPrice: number;
  /** Price in OFFER_CURRENCY once it closes. This must actually take effect. */
  priceAfter: number;
};

export const CAMPAIGN: Campaign | null = null;

export function campaignIsOpen(now: number): boolean {
  if (!CAMPAIGN) return false;
  return now < Date.parse(CAMPAIGN.endsAt);
}

/** The base price in OFFER_CURRENCY at a given instant. */
export function basePriceAt(now: number): number {
  if (!CAMPAIGN) return OFFER_PRICE;
  return campaignIsOpen(now) ? CAMPAIGN.launchPrice : CAMPAIGN.priceAfter;
}

/** The price after the deadline, in OFFER_CURRENCY, for the crossed-out "then" value. */
export function priceAfterCampaign(): number | null {
  return CAMPAIGN ? CAMPAIGN.priceAfter : null;
}

export function campaignEndsAtMs(): number | null {
  return CAMPAIGN ? Date.parse(CAMPAIGN.endsAt) : null;
}

export type Remaining = { days: number; hours: number; minutes: number; seconds: number };

export function remainingUntil(endsAt: number, now: number): Remaining | null {
  const diff = endsAt - now;
  if (diff <= 0) return null;
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}
