import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  eventName: z.string().min(1),
  eventId: z.string().min(1),
  eventSourceUrl: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
});

export const sendMetaEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const accounts = [
      {
        pixelId: process.env["META_PIXEL_ID"],
        token: process.env["META_CAPI_ACCESS_TOKEN"],
      },
      {
        pixelId: process.env["META_PIXEL_ID_2"],
        token: process.env["META_CAPI_ACCESS_TOKEN_2"],
      },
      {
        pixelId: process.env["META_PIXEL_ID_3"],
        token: process.env["META_CAPI_ACCESS_TOKEN_3"],
      },
    ].filter((a): a is { pixelId: string; token: string } =>
      Boolean(a.pixelId && a.token),
    );
    if (accounts.length === 0)
      return { ok: false as const, error: "missing_config" };

    const payload = {
      data: [
        {
          event_name: data.eventName,
          event_id: data.eventId,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: data.eventSourceUrl,
          user_data: {
            fbp: data.fbp,
            fbc: data.fbc,
          },
          custom_data:
            data.value !== undefined
              ? { value: data.value, currency: data.currency ?? "BRL" }
              : undefined,
        },
      ],
    };

    const results = await Promise.all(
      accounts.map(async ({ pixelId, token }) => {
        const res = await fetch(
          `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        return res.ok;
      }),
    );

    if (!results.some(Boolean)) {
      return { ok: false as const, error: "meta_failed" };
    }
    return { ok: true as const };
  });
