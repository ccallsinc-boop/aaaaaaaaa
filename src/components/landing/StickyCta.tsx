import { trackMeta } from "@/lib/meta-pixel";
import { useLocale } from "@/lib/locale";
import { LaunchWindow } from "@/components/landing/LaunchWindow";

/**
 * Always-visible price and buy button.
 *
 * It used to be `md:hidden`, so desktop had no persistent way to buy: once the
 * visitor scrolled past a section's button, the next one was a screen away, and the
 * offer block is two thirds down the page. A bar that converts on a phone converts
 * on a laptop for the same reason — the decision rarely happens next to a button.
 */
export function StickyCta() {
  const { money, price, hidePrice, currency, totalGames, storeUrl, t, lang, checkout } =
    useLocale();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div>
          {!hidePrice && <p className="font-display text-lg text-primary">{money(price)}</p>}
          <p className="text-[11px] text-muted-foreground">{t.stickySub(totalGames)}</p>
          <LaunchWindow compact />
        </div>
        <a
          href={storeUrl}
          onClick={() => {
            trackMeta("InitiateCheckout", {
              value: Number(price.toFixed(2)),
              currency,
              cta_location: `${lang}:sticky`,
              checkout,
            });
          }}
          className={`shrink-0 whitespace-nowrap rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-soft`}
        >
          {t.stickyCta}
        </a>
      </div>
    </div>
  );
}
