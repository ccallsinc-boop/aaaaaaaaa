/**
 * Launch pricing window.
 *
 * The page used to promise "por tiempo limitado" with nothing behind it: no
 * deadline, no lot, no expiry anywhere in the code. Anyone who reloaded the next
 * day saw the same "limited" offer, which is the kind of claim that costs more
 * trust than it buys.
 *
 * Here the deadline is real because the code enforces it: while the window is
 * open the base price is `launchPriceBrl`, and the moment it closes the base
 * price becomes `priceAfterBrl` for everyone. The countdown is therefore a
 * statement of fact, not a decoration.
 *
 * Set CAMPAIGN to null to remove the deadline and keep the launch price running
 * indefinitely. Do NOT extend `endsAt` while leaving the price unchanged: that
 * turns it back into the fake urgency it replaced.
 */
export type Campaign = {
  /** ISO 8601 instant when launch pricing ends. */
  endsAt: string;
  /** Price in BRL while the window is open. */
  launchPriceBrl: number;
  /** Price in BRL once it closes. This must actually take effect. */
  priceAfterBrl: number;
};

export const CAMPAIGN: Campaign | null = {
  endsAt: "2026-10-31T23:59:59-03:00",
  launchPriceBrl: 17.99,
  priceAfterBrl: 27.99,
};

/** Price fallback when there is no campaign configured. */
const STANDARD_PRICE_BRL = 17.99;

export function campaignIsOpen(now: number): boolean {
  if (!CAMPAIGN) return false;
  return now < Date.parse(CAMPAIGN.endsAt);
}

/** The base price in BRL at a given instant. */
export function basePriceBrlAt(now: number): number {
  if (!CAMPAIGN) return STANDARD_PRICE_BRL;
  return campaignIsOpen(now) ? CAMPAIGN.launchPriceBrl : CAMPAIGN.priceAfterBrl;
}

/** The price the visitor will pay after the deadline, for the crossed-out "then" value. */
export function priceAfterCampaignBrl(): number | null {
  return CAMPAIGN ? CAMPAIGN.priceAfterBrl : null;
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
