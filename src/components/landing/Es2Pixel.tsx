import { useEffect } from "react";
import { sendEs2Event, ES2_PIXEL_ID } from "@/components/landing/es2.functions";

function fbq(...args: unknown[]) {
  (window.fbq as ((...a: unknown[]) => void) | undefined)?.(...args);
}

/** Fires an event on the ES2 pixel only. */
export function trackEs2(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  fbq("trackSingle", ES2_PIXEL_ID, eventName, params);
}

const fired = new Set<string>();

export function trackEs2Once(key: string, eventName: string, params: Record<string, unknown> = {}) {
  if (fired.has(key)) return;
  fired.add(key);
  trackEs2(eventName, params);
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

let initialized = false;

export function Es2Pixel({ price, currency }: { price: number; currency: string }) {
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

      fbq("init", ES2_PIXEL_ID);
    }

    trackEs2("PageView");
    trackEs2("ViewContent", {
      value: price,
      currency,
      content_name: "Generative Energy",
      content_type: "product",
      content_ids: ["generative-energy"],
    });

    // Conversions API mirror (server-side, deduplicado por event_id).
    const base = {
      eventSourceUrl: window.location.href,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
    };
    void sendEs2Event({
      data: { eventName: "PageView", eventId: `es2-pv-${Date.now()}`, ...base },
    });
    void sendEs2Event({
      data: {
        eventName: "ViewContent",
        eventId: `es2-vc-${Date.now()}`,
        value: price,
        currency,
        ...base,
      },
    });

    const onScroll = () => {
      const scrolled =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrolled > 0.5) trackEs2Once("scroll50", "Scroll50");
      if (scrolled > 0.9) trackEs2Once("scroll90", "Scroll90");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const timer = window.setTimeout(() => trackEs2Once("engaged", "TimeOnPage30s"), 30000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [price, currency]);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${ES2_PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
