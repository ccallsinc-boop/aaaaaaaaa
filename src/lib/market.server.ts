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

/** Plain headers that carry a bare country code, in order of preference. */
const COUNTRY_HEADERS = [
  "cf-ipcountry", // Cloudflare
  "x-vercel-ip-country", // Vercel
  "x-nf-client-connection-country", // Netlify, when present
  "x-country", // Netlify / generic
  "fastly-client-country", // Fastly
  "x-geo-country", // injected by an edge function, if one is used
];

/**
 * Netlify sends geo as `x-nf-geo`, a base64 JSON blob rather than a bare code:
 * {"city":"...","country":{"code":"BR","name":"Brazil"},...}
 *
 * Decoded defensively: a malformed or truncated value must fall through to the
 * default market, never throw during SSR.
 */
function countryFromNetlifyGeo(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const json =
      typeof atob === "function" ? atob(raw) : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { country?: { code?: unknown } };
    const code = parsed?.country?.code;
    return typeof code === "string" && code.trim() ? code.trim().toUpperCase() : null;
  } catch {
    return null;
  }
}

/** Values an edge sends when it genuinely does not know. */
const UNKNOWN_COUNTRY = new Set(["", "XX", "T1", "ZZ"]);

export { COUNTRY_HEADERS, countryFromNetlifyGeo };

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
      country = countryFromNetlifyGeo(getRequestHeader("x-nf-geo"));
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
    return buildResolvedMarket(country, fx.rates, fx.source, Date.now());
  },
);
