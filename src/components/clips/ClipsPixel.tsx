import { useEffect } from "react";
import { META_PIXEL_ID_4 } from "@/lib/meta-pixel";

export const CLIPS_PIXEL_ID = "2267994180679043";
export const CLIPS_PIXEL_IDS = [CLIPS_PIXEL_ID, META_PIXEL_ID_4];

let initialized = false;

function fbq(...args: unknown[]) {
  (window.fbq as ((...a: unknown[]) => void) | undefined)?.(...args);
}

/** Fires an event on each Clips pixel (isolated from the store pixels). */
export function trackClips(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  for (const id of CLIPS_PIXEL_IDS) {
    fbq("trackSingle", id, eventName, params);
  }
}

const fired = new Set<string>();

export function trackClipsOnce(
  key: string,
  eventName: string,
  params: Record<string, unknown> = {},
) {
  if (fired.has(key)) return;
  fired.add(key);
  trackClips(eventName, params);
}

export function ClipsPixel({ price }: { price: number }) {
  useEffect(() => {
    if (!initialized) {
      initialized = true;

      /* eslint-disable */
      (function (f: any, b: Document, e: string, v: string) {
        let n: any, t: any, s: any;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e) as HTMLScriptElement;
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      /* eslint-enable */

      for (const id of CLIPS_PIXEL_IDS) {
        fbq("init", id);
      }
    }

    trackClips("PageView");
    trackClips("ViewContent", {
      value: price,
      currency: "EUR",
      content_name: "Framers Clips",
      content_type: "product",
      content_ids: ["framers-clips"],
    });

    const onScroll = () => {
      const scrolled =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrolled > 0.5) trackClipsOnce("scroll50", "Scroll50");
      if (scrolled > 0.9) trackClipsOnce("scroll90", "Scroll90");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const timer = window.setTimeout(
      () => trackClipsOnce("engaged", "TimeOnPage30s"),
      30000,
    );

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [price]);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${CLIPS_PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
