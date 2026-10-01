/**
 * Resolves "which market is this visitor in, and what is the price in their money"
 * once per request, on the server, so the converted price is already in the SSR HTML.
 *
 * Country detection reads the edge header the host puts on the request. On
 * Cloudflare that is CF-IPCountry, which is free, instant and does not count
 * against any quota. The old client-side ipapi.co call is gone.
 */

import { createServerFn } from "@tanstack/react-start";

import { buildResolvedMarket, type ResolvedMarket } from "./markets";

/** Headers set by the common edge hosts, in order of preference. */
const COUNTRY_HEADERS = [
  "cf-ipcountry", // Cloudflare
  "x-vercel-ip-country", // Vercel
  "x-nf-client-connection-country", // Netlify
  "fastly-client-country", // Fastly
  "x-geo-country",
];

/** Values an edge sends when it genuinely does not know. */
const UNKNOWN_COUNTRY = new Set(["", "XX", "T1", "ZZ"]);

export const resolveMarket = createServerFn({ method: "GET" }).handler(
  async (): Promise<ResolvedMarket> => {
    const [{ getRequestHeader, getRequestUrl }, { getFxRates }] = await Promise.all([
      import("@tanstack/react-start/server"),
      import("./fx.server"),
    ]);

    let country: string | null = null;

    // ?country=MX forces a market. Needed to QA every currency without a VPN.
    try {
      const forced = getRequestUrl().searchParams.get("country");
      if (forced) country = forced.trim().toUpperCase();
    } catch {
      /* no request URL in this context */
    }

    if (!country) {
      for (const header of COUNTRY_HEADERS) {
        const value = getRequestHeader(header);
        if (value && !UNKNOWN_COUNTRY.has(value.trim().toUpperCase())) {
          country = value.trim().toUpperCase();
          break;
        }
      }
    }

    const fx = await getFxRates();
    return buildResolvedMarket(country, fx.rates, fx.source);
  },
);
