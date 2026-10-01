import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";
import { useLocale } from "@/lib/locale";
import { LaunchWindow } from "@/components/landing/LaunchWindow";
import {
  loadHotmartWidget,
  HOTMART_WIDGET_CLASSES,
  hotmartWidgetLoaded,
} from "@/lib/hotmart-widget";

/** sessionStorage key so a dismissed popup does not come back on reload. */
const DISMISS_KEY = "framers:discount-popup-dismissed";

/** How long before the popup offers itself to someone who has not left yet. */
const TIMER_MS = 25000;

/**
 * Exit-intent and dwell-time offer.
 *
 * The old version computed the price and the compare-at value and then rendered
 * neither, so the one block whose job was to reveal the price showed no number at
 * all. It now carries the whole offer: price, the anchor, the countdown that
 * actually governs the price, the guarantee, and what the pack costs once the
 * window closes.
 */
export function DiscountPopup() {
  const { t, storeUrl, price, currency, money, fullValue, priceAfter, totalGames, lang, hotmart } =
    useLocale();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  // The popup anchor mounts late, so re-bind the Hotmart widget when it opens.
  useEffect(() => {
    if (!open || !hotmart) return;
    const id = window.setTimeout(loadHotmartWidget, 60);
    return () => window.clearTimeout(id);
  }, [open, hotmart]);

  useEffect(() => {
    if (shown) return;
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === "1") {
        setShown(true);
        return;
      }
    } catch {
      /* private mode or blocked storage: just show it */
    }

    const show = (trigger: string) => {
      setOpen(true);
      setShown(true);
      trackMetaCustom("OfferPopupView", { trigger, lang });
    };

    const timer = window.setTimeout(() => show("dwell"), TIMER_MS);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show("exit-intent");
    };
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [shown, lang]);

  const dismiss = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-foreground/70 p-4 backdrop-blur-sm"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label={t.popupTitle}
    >
      <div
        className="relative my-auto w-full max-w-md rounded-3xl border border-border bg-background p-7 text-center shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label={t.popupDismiss}
          onClick={dismiss}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {t.popupEyebrow}
        </p>
        <h3 className="mt-3 text-2xl leading-tight">{t.popupTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t.popupSub(totalGames)}</p>

        <p className="mt-5 text-sm text-muted-foreground line-through">{money(fullValue)}</p>
        <p className="font-display text-[clamp(2.6rem,13vw,3.6rem)] leading-none text-primary">
          {money(price)}
        </p>

        <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
          {t.popupBullets.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <LaunchWindow showThen={false} />
        </div>

        <a
          href={storeUrl}
          onClick={(event) => {
            if (hotmart && hotmartWidgetLoaded()) event.preventDefault();
            trackMeta("InitiateCheckout", {
              value: Number(price.toFixed(2)),
              currency,
              content_name: "Framers Full Pack",
              content_type: "product",
              content_ids: ["pacote-framers"],
              cta_location: `${lang}:discount-popup`,
            });
          }}
          className={`${hotmart ? HOTMART_WIDGET_CLASSES + " " : ""}mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]`}
        >
          {t.popupCta}
        </a>

        {priceAfter ? (
          <p className="mt-3 text-[11px] text-muted-foreground">{t.popupNote(money(priceAfter))}</p>
        ) : null}

        <button
          type="button"
          onClick={dismiss}
          className="mt-4 text-[11px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {t.popupDismiss}
        </button>
      </div>
    </div>
  );
}
