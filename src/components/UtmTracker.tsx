import { useEffect } from "react";
import { recordTouch } from "@/lib/tracker.functions";
import {
  decorateCheckoutUrl,
  readTouch,
  saveTouch,
  touchFromSearch,
  type Touch,
} from "@/lib/tracker-utm";

/** One click per page load, even when StrictMode or a remount runs the effect twice. */
let captured = false;

/**
 * Remembers the ad click that brought the visitor and hands its UTMs to the
 * checkout. Renders nothing.
 *
 * Buy buttons are plain links spread over every landing and quiz, so instead of
 * touching each one, a single capture-phase listener rewrites the link being
 * clicked just before the browser follows it. Links to other hosts are left alone.
 */
export function UtmTracker() {
  useEffect(() => {
    const fresh = captured ? null : touchFromSearch(window.location.search, Date.now());
    captured = true;
    if (fresh) {
      saveTouch(fresh);
      void recordTouch({
        data: { id: fresh.id, ...fresh.params, landing_path: window.location.pathname },
      }).catch((error: unknown) => console.warn("[tracker] touch not recorded", error));
    }

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const touch: Touch | null = readTouch(Date.now());
      if (!touch) return;
      const decorated = decorateCheckoutUrl(anchor.href, touch);
      if (decorated) anchor.href = decorated;
    };

    // auxclick covers the middle button, which opens the checkout in a new tab.
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  return null;
}
