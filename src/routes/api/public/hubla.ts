import { createFileRoute } from "@tanstack/react-router";

type Json = Record<string, unknown>;

function deepFind(value: unknown, keys: string[], depth = 0): string | null {
  if (depth > 6 || value == null) return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = deepFind(item, keys, depth + 1);
      if (found) return found;
    }
    return null;
  }
  if (typeof value === "object") {
    const obj = value as Json;
    for (const key of keys) {
      const direct = obj[key];
      if (typeof direct === "string" && direct.trim()) return direct.trim();
    }
    for (const nested of Object.values(obj)) {
      const found = deepFind(nested, keys, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

const DEACTIVATE = [
  "canceled",
  "cancelled",
  "refund",
  "chargeback",
  "expired",
  "removed",
  "delet",
  "failed",
  "overdue",
  "unpaid",
  "inactive",
  "suspend",
];

const ACTIVATE = [
  "paid",
  "succeeded",
  "approved",
  "created",
  "added",
  "activated",
  "active",
  "completed",
  "renewed",
  "new_sale",
  "newsale",
  "purchase",
];

function resolveStatus(eventType: string): "active" | "canceled" | null {
  const t = eventType.toLowerCase();
  if (DEACTIVATE.some((k) => t.includes(k))) return "canceled";
  if (ACTIVATE.some((k) => t.includes(k))) return "active";
  return null;
}

export const Route = createFileRoute("/api/public/hubla")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["HUBLA_WEBHOOK_TOKEN"] ?? "";
        const url = new URL(request.url);
        const provided =
          request.headers.get("x-hubla-token") ??
          request.headers.get("x-hubla-signature") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          url.searchParams.get("token") ??
          "";

        if (!expected || provided !== expected) {
          return new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        let payload: Json;
        try {
          payload = (await request.json()) as Json;
        } catch {
          return new Response(JSON.stringify({ error: "invalid json" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const eventType =
          deepFind(payload, ["type", "event", "eventType", "event_type"]) ?? "";
        const email = deepFind(payload, ["email", "userEmail", "buyerEmail"]);
        const name = deepFind(payload, ["firstName", "name", "fullName"]);
        const plan = deepFind(payload, ["productName", "groupName", "offerName", "planName"]);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        await supabaseAdmin.from("hubla_events").insert({
          event_type: eventType || null,
          email,
          payload: payload as never,
        });

        const status = resolveStatus(eventType);

        if (!email || !status) {
          return new Response(
            JSON.stringify({ ok: true, ignored: true, event: eventType, email }),
            { headers: { "content-type": "application/json" } },
          );
        }

        const normalized = email.toLowerCase();
        const { data: existing } = await supabaseAdmin
          .from("subscribers")
          .select("id")
          .ilike("email", normalized)
          .maybeSingle();

        if (existing) {
          await supabaseAdmin
            .from("subscribers")
            .update({
              status,
              ...(name ? { name } : {}),
              ...(plan ? { plan } : {}),
              ended_at: status === "canceled" ? new Date().toISOString() : null,
            })
            .eq("id", existing.id);
        } else {
          await supabaseAdmin.from("subscribers").insert({
            email: normalized,
            name,
            plan,
            status,
            ended_at: status === "canceled" ? new Date().toISOString() : null,
          });
        }

        return new Response(JSON.stringify({ ok: true, email: normalized, status }), {
          headers: { "content-type": "application/json" },
        });
      },
      GET: async () =>
        new Response(JSON.stringify({ ok: true, endpoint: "hubla-webhook" }), {
          headers: { "content-type": "application/json" },
        }),
    },
  },
});
