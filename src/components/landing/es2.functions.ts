import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ES2_PIXEL_ID = "3930296663778621";

const schema = z.object({
  eventName: z.string().min(1),
  eventId: z.string().min(1),
  eventSourceUrl: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
});

export const sendEs2Event = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const token = process.env["META_CAPI_ACCESS_TOKEN_ES2"];
    if (!token) return { ok: false as const, error: "missing_config" };

    const payload = {
      data: [
        {
          event_name: data.eventName,
          event_id: data.eventId,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: data.eventSourceUrl,
          user_data: { fbp: data.fbp, fbc: data.fbc },
          custom_data:
            data.value !== undefined
              ? { value: data.value, currency: data.currency ?? "USD" }
              : undefined,
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${ES2_PIXEL_ID}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    return res.ok
      ? { ok: true as const }
      : { ok: false as const, error: "meta_failed" };
  });
