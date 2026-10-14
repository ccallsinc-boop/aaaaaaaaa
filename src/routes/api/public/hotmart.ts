import { createFileRoute } from "@tanstack/react-router";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Hotmart sales webhook (version 2.0) for the tracker behind /painel.
 *
 * Configure in Hotmart > Ferramentas > Webhook with this URL. Hotmart sends its
 * hottok in the X-HOTMART-HOTTOK header; set the same value in HOTMART_HOTTOK.
 */
export const Route = createFileRoute("/api/public/hotmart")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["HOTMART_HOTTOK"] ?? "";
        const provided = request.headers.get("x-hotmart-hottok") ?? "";
        const { timingSafeEqual, createHash } = await import("node:crypto");
        const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
        if (!expected || !timingSafeEqual(digest(provided), digest(expected))) {
          return json({ error: "unauthorized" }, 401);
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json({ error: "invalid json" }, 400);
        }

        const { normalizeHotmart, recordSale } = await import("@/lib/tracker-sales.server");
        const normalized = normalizeHotmart(payload);
        if (!normalized.ok) {
          // 200 so Hotmart does not retry an event that will never fit.
          return json({ ok: true, ignored: normalized.reason });
        }

        const result = await recordSale(payload, normalized.sale);
        if (!result.ok) {
          console.error("[tracker] hotmart sale not recorded:", result.reason);
          // 500 makes Hotmart retry, which is what a database hiccup needs.
          return json({ error: result.reason }, 500);
        }
        return json(result);
      },
      GET: async () => json({ ok: true, endpoint: "hotmart-webhook" }),
    },
  },
});
