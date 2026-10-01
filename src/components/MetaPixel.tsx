import { useEffect } from "react";
import { META_PIXEL_IDS, trackMeta, trackMetaOnce } from "@/lib/meta-pixel";
import { useMarket } from "@/lib/use-market";

let initialized = false;

export function MetaPixel({
  /**
   * Post-purchase pages load the pixel but must not report a product view: the
   * visitor already bought, and counting them as a front-offer view poisons both
   * the conversion rate and the value optimisation.
   */
  viewContent = true,
}: { viewContent?: boolean } = {}) {
  const { price, market } = useMarket();

  useEffect(() => {
    // Guards against React StrictMode / remounts firing PageView twice.
    if (initialized) return;
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

    for (const id of META_PIXEL_IDS) {
      (window.fbq as ((...a: unknown[]) => void) | undefined)?.("init", id);
    }

    trackMeta("PageView");
    // This used to report a fixed 37.99 BRL on every locale, so Meta optimised the
    // Spanish and English traffic against a price nobody was ever charged.
    if (viewContent) {
      trackMeta("ViewContent", {
        value: Number(price.toFixed(2)),
        currency: market.currency,
        content_name: "Framers Full Pack",
        content_type: "product",
        content_ids: ["pacote-framers"],
      });
    }

    // Engagement signals help Meta's algorithm find buyers → lower CPA.
    const onScroll = () => {
      const scrolled =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrolled > 0.5) trackMetaOnce("scroll50", "Scroll50");
      if (scrolled > 0.9) trackMetaOnce("scroll90", "Scroll90");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const timer = window.setTimeout(() => trackMetaOnce("engaged", "TimeOnPage30s"), 30000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
    // Deps stay empty on purpose: the pixel must init exactly once, and the
    // `initialized` guard would otherwise skip re-registering the scroll listeners
    // after a cleanup. price/currency come from the root loader and are already
    // final on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${1817580416258631}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
