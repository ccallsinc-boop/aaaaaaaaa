import { createFileRoute } from "@tanstack/react-router";

/**
 * Diagnostic endpoint for country detection.
 *
 * Country drives both the language and the currency, and every host exposes it
 * through a different header: CF-IPCountry on Cloudflare, x-nf-geo on Netlify,
 * x-vercel-ip-country on Vercel. If none of them arrives, every visitor silently
 * falls back to USD, which looks like working software and is not.
 *
 * Hit /api/geo right after a deploy to see what the host actually sent.
 */
export const Route = createFileRoute("/api/geo")({
  server: {
    handlers: {
      GET: async () => {
        const { getRequestHeader } = await import("@tanstack/react-start/server");
        const { getFxRates } = await import("@/lib/fx.server");
        const { buildResolvedMarket } = await import("@/lib/markets");
        const { COUNTRY_HEADERS, countryFromNetlifyGeo } = await import("@/lib/market.server");

        const seen: Record<string, string | null> = {};
        for (const header of COUNTRY_HEADERS) {
          seen[header] = getRequestHeader(header) ?? null;
        }
        const nfGeoRaw = getRequestHeader("x-nf-geo") ?? null;
        const nfGeo = countryFromNetlifyGeo(nfGeoRaw ?? undefined);

        const detected =
          nfGeo ?? Object.values(seen).find((value) => value && value.trim()) ?? null;

        const fx = await getFxRates();
        const resolved = buildResolvedMarket(detected ?? null, fx.rates, fx.source);

        return new Response(
          JSON.stringify(
            {
              detectedCountry: detected,
              resolvedTo: {
                country: resolved.market.country,
                lang: resolved.market.lang,
                currency: resolved.market.currency,
                price: Number(resolved.price.toFixed(2)),
              },
              usingFallbackMarket: detected === null,
              headers: {
                ...seen,
                "x-nf-geo": nfGeoRaw ? "(present)" : null,
                "x-nf-geo-decoded": nfGeo,
              },
              fxSource: fx.source,
            },
            null,
            2,
          ),
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "no-store",
              "X-Robots-Tag": "noindex",
            },
          },
        );
      },
    },
  },
});
