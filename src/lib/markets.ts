import {
  OFFER_CURRENCY,
  OFFER_PRICE,
  basePriceAt,
  campaignEndsAtMs,
  priceAfterCampaign,
} from "./campaign";
import { UPSELL_CURRENCY, UPSELL_PRICE } from "./upsell";

/**
 * Single source of truth for "who is visiting and in which money do we talk to them".
 *
 * The offer has exactly one price: OFFER_PRICE, in OFFER_CURRENCY (campaign.ts).
 * Every other currency is that number converted at the live rate (see
 * src/lib/fx.server.ts). There is no per-country
 * price table to keep in sync, which is what used to drift: the ES route
 * advertised EUR 7.20 in its <title>, the locale config charged USD 3.90 and the
 * geo table said EUR 3.90, all for the same visitor.
 */

/** Language a market is served in. Route languages (uk, es2, in) map onto these. */
export type MarketLang = "pt" | "es" | "en" | "hi";

export type Market = {
  /** ISO 3166-1 alpha-2, uppercase. */
  country: string;
  lang: MarketLang;
  /** ISO 4217. */
  currency: string;
  /** BCP-47 tag used only for number formatting. */
  intl: string;
};

/**
 * The rate table is keyed by BRL (how many units of X one BRL buys), so a price
 * set in another currency is first expressed in BRL and then converted to the
 * visitor's currency like everything else. For a visitor in that same currency
 * the two steps cancel out and the page shows the configured price exactly.
 *
 * Returns null when the table has no usable rate for `currency`.
 */
function toBrlFrom(amount: number, currency: string, rates: Record<string, number>): number | null {
  const rate = rates[currency];
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) return null;
  return amount / rate;
}

/**
 * Units per BRL from the static table in fx.server.ts (captured 2026-10-01), for
 * the currencies offers are priced in. Used only where no live table exists: the
 * pre-request fallback, structured data, and a live table missing the currency.
 */
const INDICATIVE_PER_BRL: Record<string, number> = { GBP: 0.139, COP: 744.0 };
const INDICATIVE_OFFER_PER_BRL = INDICATIVE_PER_BRL[OFFER_CURRENCY];

function toBrl(amount: number, currency: string, rates: Record<string, number>): number {
  return (
    toBrlFrom(amount, currency, rates) ??
    toBrlFrom(amount, currency, INDICATIVE_PER_BRL) ??
    // A currency in neither table: better a visibly wrong price than NaN.
    amount
  );
}

/**
 * Reference price of a single title, in BRL, used to build the crossed-out anchor.
 * Kept at the value the Brazilian route already used (R$20) so the anchor does not
 * change meaning in this step. Note that 424 x R$20 anchors the library at R$8.480
 * against a R$17,99 price, which renders as "99% OFF" and reads as implausible.
 * That is a positioning decision, not a conversion bug, and is left for later.
 */
export const PER_GAME_VALUE_BRL = 20;

/**
 * Currencies whose minor unit is not used in practice. Shown without decimals,
 * so a converted price reads "COP $13.284" instead of "COP $13.284,37".
 * This is formatting only: the amount itself is never rounded to a nicer number.
 */
const ZERO_DECIMAL_CURRENCIES = new Set([
  "ARS",
  "CLP",
  "COP",
  "PYG",
  "ISK",
  "JPY",
  "KRW",
  "VND",
  "IDR",
  "HUF",
]);

export const DEFAULT_MARKET: Market = {
  country: "US",
  lang: "en",
  currency: "USD",
  intl: "en-US",
};

/**
 * Countries we price and speak to explicitly. Anything missing falls back to
 * DEFAULT_MARKET (English, USD), so an unmapped country still sees a real price.
 */
const MARKETS: Market[] = [
  // Portuguese
  { country: "BR", lang: "pt", currency: "BRL", intl: "pt-BR" },
  { country: "PT", lang: "pt", currency: "EUR", intl: "pt-PT" },

  // Spanish — Latin America
  { country: "MX", lang: "es", currency: "MXN", intl: "es-MX" },
  { country: "AR", lang: "es", currency: "ARS", intl: "es-AR" },
  { country: "CO", lang: "es", currency: "COP", intl: "es-CO" },
  { country: "CL", lang: "es", currency: "CLP", intl: "es-CL" },
  { country: "PE", lang: "es", currency: "PEN", intl: "es-PE" },
  { country: "UY", lang: "es", currency: "UYU", intl: "es-UY" },
  { country: "PY", lang: "es", currency: "PYG", intl: "es-PY" },
  { country: "BO", lang: "es", currency: "BOB", intl: "es-BO" },
  { country: "EC", lang: "es", currency: "USD", intl: "es-EC" },
  { country: "VE", lang: "es", currency: "USD", intl: "es-VE" },
  { country: "CR", lang: "es", currency: "CRC", intl: "es-CR" },
  { country: "PA", lang: "es", currency: "USD", intl: "es-PA" },
  { country: "GT", lang: "es", currency: "GTQ", intl: "es-GT" },
  { country: "HN", lang: "es", currency: "HNL", intl: "es-HN" },
  { country: "SV", lang: "es", currency: "USD", intl: "es-SV" },
  { country: "NI", lang: "es", currency: "NIO", intl: "es-NI" },
  { country: "DO", lang: "es", currency: "DOP", intl: "es-DO" },
  { country: "CU", lang: "es", currency: "USD", intl: "es-CU" },
  { country: "PR", lang: "es", currency: "USD", intl: "es-PR" },

  // Spanish — Europe
  { country: "ES", lang: "es", currency: "EUR", intl: "es-ES" },

  // English
  { country: "US", lang: "en", currency: "USD", intl: "en-US" },
  { country: "GB", lang: "en", currency: "GBP", intl: "en-GB" },
  { country: "IE", lang: "en", currency: "EUR", intl: "en-IE" },
  { country: "CA", lang: "en", currency: "CAD", intl: "en-CA" },
  { country: "AU", lang: "en", currency: "AUD", intl: "en-AU" },
  { country: "NZ", lang: "en", currency: "NZD", intl: "en-NZ" },
  { country: "ZA", lang: "en", currency: "ZAR", intl: "en-ZA" },

  // Hindi
  { country: "IN", lang: "hi", currency: "INR", intl: "en-IN" },
];

const BY_COUNTRY = new Map(MARKETS.map((m) => [m.country, m]));

/** Every currency we may need a rate for. Used to validate an FX payload. */
export const REQUIRED_CURRENCIES = [...new Set(MARKETS.map((m) => m.currency))];

export function marketForCountry(code?: string | null): Market {
  if (!code) return DEFAULT_MARKET;
  return BY_COUNTRY.get(code.trim().toUpperCase()) ?? DEFAULT_MARKET;
}

/**
 * The market to use when the language is pinned by the route (/es, /pt, ...) but
 * the visitor's country has a different currency. Keeps the detected currency and
 * only overrides the language, so a Mexican on /es still sees pesos.
 */
export function marketForLang(lang: MarketLang, detected: Market): Market {
  if (detected.lang === lang) return detected;
  const fallback = MARKETS.find((m) => m.lang === lang) ?? DEFAULT_MARKET;
  return { ...detected, lang, intl: detected.intl || fallback.intl };
}

export function fractionDigitsFor(currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase()) ? 0 : 2;
}

/**
 * Converts the base BRL price with a live rate and formats it for the market.
 * `rate` is how many units of `market.currency` one BRL buys.
 */
export function convert(amountBrl: number, rate: number): number {
  return amountBrl * rate;
}

/**
 * Appends the ISO code to a formatted price: "$130.40" becomes "$130.40 MXN".
 *
 * Mexico, Colombia, Argentina, Chile and others write their peso with "$", so a
 * bare "$130.40" read as US dollars, and visitors took the price for a dollar
 * amount. The code removes the doubt. Every currency gets it for consistency,
 * except BRL: "R$" is unambiguous to the Brazilian audience the page speaks to.
 */
export function withCurrencyCode(formatted: string, currency: string): string {
  const code = currency.toUpperCase();
  if (code === "BRL" || formatted.includes(code)) return formatted;
  return `${formatted} ${code}`;
}

export function formatMoney(amount: number, market: Market): string {
  const digits = fractionDigitsFor(market.currency);
  try {
    return withCurrencyCode(
      amount.toLocaleString(market.intl, {
        style: "currency",
        currency: market.currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }),
      market.currency,
    );
  } catch {
    // An unknown currency code must never blank out the price.
    return `${market.currency} ${amount.toFixed(digits)}`;
  }
}

export type ResolvedMarket = {
  market: Market;
  /** How many units of market.currency one BRL buys. */
  rate: number;
  /** Converted offer price, unrounded. */
  price: number;
  /** Converted per-title reference price, for the crossed-out anchor. */
  perGameValue: number;
  /** Which provider the rate came from, so a fallback is visible in logs. */
  fxSource: string;
  /** Detected country, or null when the host sent no header. */
  country: string | null;
  /** Server clock at resolve time, so the countdown cannot be faked by the client. */
  now: number;
  /** When launch pricing ends, or null when no campaign is configured. */
  campaignEndsAt: number | null;
  /** Converted price once the launch window closes, for the "then" value. */
  priceAfter: number | null;
  /** Converted upsell price (UPSELL_PRICE in UPSELL_CURRENCY). */
  upsellPrice: number;
};

/**
 * Builds the resolved market from a country and a rate table. Pure, so it is
 * safe in the browser bundle and testable without a request.
 */
export function buildResolvedMarket(
  country: string | null,
  rates: Record<string, number>,
  fxSource: string,
  now: number = Date.now(),
): ResolvedMarket {
  const market = marketForCountry(country);
  const rate = rates[market.currency];
  const baseBrl = toBrl(basePriceAt(now), OFFER_CURRENCY, rates);
  const after = priceAfterCampaign();
  const afterBrl = after == null ? null : toBrl(after, OFFER_CURRENCY, rates);
  const upsellBrl = toBrl(UPSELL_PRICE, UPSELL_CURRENCY, rates);
  const endsAt = campaignEndsAtMs();

  // An unmapped or broken rate must never put NaN on screen.
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
    const usd = rates[DEFAULT_MARKET.currency];
    const safeUsd = typeof usd === "number" && Number.isFinite(usd) && usd > 0 ? usd : 1;
    return {
      market: DEFAULT_MARKET,
      rate: safeUsd,
      price: convert(baseBrl, safeUsd),
      perGameValue: convert(PER_GAME_VALUE_BRL, safeUsd),
      fxSource,
      country: country ?? null,
      now,
      campaignEndsAt: endsAt,
      priceAfter: afterBrl == null ? null : convert(afterBrl, safeUsd),
      upsellPrice: convert(upsellBrl, safeUsd),
    };
  }

  return {
    market,
    rate,
    price: convert(baseBrl, rate),
    perGameValue: convert(PER_GAME_VALUE_BRL, rate),
    fxSource,
    country: country ?? null,
    now,
    campaignEndsAt: endsAt,
    priceAfter: afterBrl == null ? null : convert(afterBrl, rate),
    upsellPrice: convert(upsellBrl, rate),
  };
}

/** Used before the server value arrives, and in any non-request context. */
export const FALLBACK_RESOLVED: ResolvedMarket = {
  market: DEFAULT_MARKET,
  rate: 0.186,
  price: (OFFER_PRICE / INDICATIVE_OFFER_PER_BRL) * 0.186,
  perGameValue: PER_GAME_VALUE_BRL * 0.186,
  fxSource: "static",
  country: null,
  now: 0,
  campaignEndsAt: null,
  priceAfter: null,
  upsellPrice: (UPSELL_PRICE / INDICATIVE_PER_BRL[UPSELL_CURRENCY]) * 0.186,
};

/**
 * Indicative BRL->USD rate used ONLY for structured data, which has to be a
 * static number at build time while the on-page price is live per country.
 * Refresh it when it drifts far enough to look wrong in a search result.
 */
export const INDICATIVE_USD_RATE = 0.186;

/** Lowest price we advertise in structured data, in USD. */
export function indicativeUsdPrice(): string {
  return ((OFFER_PRICE / INDICATIVE_OFFER_PER_BRL) * INDICATIVE_USD_RATE).toFixed(2);
}
