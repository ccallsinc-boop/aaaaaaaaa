import { createFileRoute } from "@tanstack/react-router";

import { siteUrl } from "@/lib/site";

/**
 * Served as a route rather than a static file so the Sitemap line follows the
 * configured domain. As a file in public/ it hardcoded the Lovable origin, which
 * would point crawlers at the old host after the move.
 */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "User-agent: *",
          "Allow: /",
          "",
          // Post-purchase and policy pages carry their own noindex, but keeping
          // the upsell out of crawl budget costs nothing.
          "Disallow: /upsell",
          "",
          `Sitemap: ${siteUrl("/sitemap.xml")}`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
