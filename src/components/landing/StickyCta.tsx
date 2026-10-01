import { trackMeta } from "@/lib/meta-pixel";
import { useLocale } from "@/lib/locale";
import { LaunchWindow } from "@/components/landing/LaunchWindow";

export function StickyCta() {
  const { money, price, hidePrice, currency, totalGames, storeUrl, t, lang } = useLocale();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-3">
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
            });
          }}
          className={`rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft`}
        >
          {t.stickyCta}
        </a>
      </div>
    </div>
  );
}
