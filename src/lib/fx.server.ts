/**
 * Live BRL exchange rates, fetched on the server and cached per isolate.
 *
 * Why server-side: the previous implementation called ipapi.co from the browser
 * on every page view (free tier, 1000 requests/day, no key), so the price
 * arrived after hydration and stopped working under real ad traffic. Fetching
 * here puts the converted price in the SSR HTML and costs one request per cache
 * window for the whole site.
 *
 * This module is server-only. Importing it from a component or a *.functions.ts
 * file would ship it to the browser bundle.
 */

import { REQUIRED_CURRENCIES } from "./markets";

export type FxRates = {
  /** Always "BRL". Rates say how many units of X one BRL buys. */
  base: "BRL";
  rates: Record<string, number>;
  /** Epoch ms when these rates were obtained. */
  fetchedAt: number;
  source: "er-api" | "exchangerate.host" | "fallback";
};

/**
 * Last-resort rates so the page always renders a price. Refresh these when they
 * drift badly; they are only used when every provider is unreachable.
 * Captured 2026-10-01, 1 BRL =
 */
const FALLBACK_RATES: Record<string, number> = {
  BRL: 1,
  USD: 0.186,
  EUR: 0.16,
  GBP: 0.139,
  MXN: 3.42,
  ARS: 269.7,
  COP: 744.0,
  CLP: 176.7,
  PEN: 0.669,
  UYU: 7.44,
  PYG: 1395.0,
  BOB: 1.285,
  CRC: 94.4,
  GTQ: 1.428,
  HNL: 4.65,
  NIO: 6.84,
  DOP: 11.37,
  CAD: 0.26,
  AUD: 0.281,
  NZD: 0.311,
  ZAR: 3.2,
  INR: 16.5,
};

/** How long a successful fetch is reused. */
const TTL_MS = 6 * 60 * 60 * 1000;
/** How long to wait before giving up on a failed fetch and retrying. */
const ERROR_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 4000;

let cache: FxRates | undefined;
let inFlight: Promise<FxRates> | undefined;

function isFresh(entry: FxRates): boolean {
  const ttl = entry.source === "fallback" ? ERROR_TTL_MS : TTL_MS;
  return Date.now() - entry.fetchedAt < ttl;
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Keeps only finite, positive numbers, so a provider sending nulls cannot poison the cache. */
function sanitize(raw: unknown): Record<string, number> {
  if (raw == null || typeof raw !== "object") return {};
  const out: Record<string, number> = {};
  for (const [code, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      out[code.toUpperCase()] = value;
    }
  }
  return out;
}

/** A payload is only usable if it covers every currency a mapped country needs. */
function covers(rates: Record<string, number>): boolean {
  return REQUIRED_CURRENCIES.every((code) => code === "BRL" || rates[code] != null);
}

const PROVIDERS: { source: FxRates["source"]; load: () => Promise<Record<string, number>> }[] = [
  {
    source: "er-api",
    load: async () => {
      const data = (await fetchJson("https://open.er-api.com/v6/latest/BRL")) as {
        result?: string;
        rates?: unknown;
      };
      if (data.result && data.result !== "success") throw new Error("er-api: non-success result");
      return sanitize(data.rates);
    },
  },
  {
    source: "exchangerate.host",
    load: async () => {
      const data = (await fetchJson("https://api.exchangerate.host/latest?base=BRL")) as {
        rates?: unknown;
      };
      return sanitize(data.rates);
    },
  },
];

async function load(): Promise<FxRates> {
  for (const provider of PROVIDERS) {
    try {
      const rates = await provider.load();
      if (!covers(rates)) {
        console.warn(`[fx] ${provider.source} is missing currencies, trying the next provider`);
        continue;
      }
      return {
        base: "BRL",
        rates: { ...rates, BRL: 1 },
        fetchedAt: Date.now(),
        source: provider.source,
      };
    } catch (error) {
      console.warn(`[fx] ${provider.source} failed:`, error);
    }
  }

  console.error("[fx] every provider failed, serving fallback rates");
  return { base: "BRL", rates: FALLBACK_RATES, fetchedAt: Date.now(), source: "fallback" };
}

/**
 * Returns rates, from cache when fresh. Never throws and never returns empty:
 * the worst case is the static fallback table above.
 */
export async function getFxRates(): Promise<FxRates> {
  if (cache && isFresh(cache)) return cache;
  // Collapses a thundering herd on cold start into a single upstream request.
  if (!inFlight) {
    inFlight = load()
      .then((next) => {
        cache = next;
        return next;
      })
      .finally(() => {
        inFlight = undefined;
      });
  }
  return inFlight;
}

/** Exposed for tests and for the fallback path in the loader. */
export { FALLBACK_RATES };
