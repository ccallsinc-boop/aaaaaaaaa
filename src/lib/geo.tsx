import { useEffect, useState } from "react";

export type GeoMarket = {
  country: string;
  currency: string;
  intl: string;
  /** How many local currency units 1 USD is worth. */
  rate: number;
  /** Local price shown instead of the USD base price. */
  price: number;
  /** Local "compare at" price shown crossed out. */
  compareAt: number;
  maximumFractionDigits: number;
  /** Symbol or abbreviation shown before/after the amount. */
  symbol: string;
  /** When true, prepend the currency code to disambiguate $-based currencies. */
  showCode: boolean;
};

/** Base offer in USD. */
export const BASE_USD = 8.3;
export const BASE_COMPARE_USD = 12;

const MARKETS: Record<string, GeoMarket> = {
  AR: {
    country: "AR",
    currency: "ARS",
    intl: "es-AR",
    rate: 1450,
    price: 6590,
    compareAt: 9990,
    maximumFractionDigits: 0,
    symbol: "$",
    showCode: true,
  },
  CL: {
    country: "CL",
    currency: "CLP",
    intl: "es-CL",
    rate: 950,
    price: 4290,
    compareAt: 6590,
    maximumFractionDigits: 0,
    symbol: "$",
    showCode: true,
  },
  CO: {
    country: "CO",
    currency: "COP",
    intl: "es-CO",
    rate: 4000,
    price: 14.217,
    compareAt: 27900,
    maximumFractionDigits: 0,
    symbol: "$",
    showCode: true,
  },
  ES: {
    country: "ES",
    currency: "EUR",
    intl: "es-ES",
    rate: 0.86,
    price: 3.9,
    compareAt: 5.9,
    maximumFractionDigits: 2,
    symbol: "€",
    showCode: false,
  },
  PE: {
    country: "PE",
    currency: "PEN",
    intl: "es-PE",
    rate: 3.6,
    price: 16.9,
    compareAt: 24.9,
    maximumFractionDigits: 2,
    symbol: "S/",
    showCode: false,
  },
};

export const DEFAULT_MARKET: GeoMarket = {
  country: "US",
  currency: "USD",
  intl: "en-US",
  rate: 1,
  price: BASE_USD,
  compareAt: BASE_COMPARE_USD,
  maximumFractionDigits: 2,
  symbol: "$",
  showCode: false,
};

const TIMEZONE_COUNTRY: Record<string, string> = {
  "America/Argentina/Buenos_Aires": "AR",
  "America/Argentina/Cordoba": "AR",
  "America/Argentina/Mendoza": "AR",
  "America/Argentina/Salta": "AR",
  "America/Argentina/Tucuman": "AR",
  "America/Buenos_Aires": "AR",
  "America/Santiago": "CL",
  "Pacific/Easter": "CL",
  "America/Punta_Arenas": "CL",
  "America/Bogota": "CO",
  "America/Lima": "PE",
  "Europe/Madrid": "ES",
  "Atlantic/Canary": "ES",
  "Africa/Ceuta": "ES",
};

function marketFor(code?: string | null): GeoMarket | null {
  if (!code) return null;
  return MARKETS[code.toUpperCase()] ?? null;
}

function guessFromBrowser(): GeoMarket | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const forced = marketFor(params.get("country") ?? params.get("geo"));
  if (forced) return forced;

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const byTz = marketFor(TIMEZONE_COUNTRY[tz]);
    if (byTz) return byTz;
  } catch {
    /* ignore */
  }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const region = tag?.split("-")[1];
    const byLang = marketFor(region);
    if (byLang) return byLang;
  }

  return null;
}

/**
 * Detects the visitor's country (Argentina, Chile, Colombia, Spain, Peru)
 * and returns the offer priced in their own currency.
 */
export function useGeoMarket(): GeoMarket {
  const [market, setMarket] = useState<GeoMarket>(DEFAULT_MARKET);

  useEffect(() => {
    const guess = guessFromBrowser();
    if (guess) setMarket(guess);

    let cancelled = false;
    const controller = new AbortController();

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const byIp = marketFor(data.country_code ?? data.country);
        if (byIp) setMarket(byIp);
      })
      .catch(() => {
        /* keep the browser guess */
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return market;
}

export function formatGeoMoney(value: number, market: GeoMarket) {
  const amount = value.toLocaleString(market.intl, {
    maximumFractionDigits: market.maximumFractionDigits,
    minimumFractionDigits: market.maximumFractionDigits === 0 ? 0 : 2,
  });
  const prefix = market.showCode ? `${market.currency} ` : "";
  return `${prefix}${market.symbol}${amount}`;
}
