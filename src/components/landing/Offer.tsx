import { Check } from "lucide-react";
import { Cta } from "@/components/landing/Cta";
import { LaunchWindow } from "@/components/landing/LaunchWindow";
import { useLocale } from "@/lib/locale";
import { OFFER_CURRENCY } from "@/lib/campaign";

export function Offer() {
  const { t, money, price, hidePrice, fullValue, hasAnchor, discount, totalGames, currency } =
    useLocale();

  return (
    <section id="oferta" className="border-t border-border py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid gap-10 rounded-3xl border border-border bg-surface p-7 shadow-soft sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {t.offerEyebrow(totalGames)}
            </p>
            {hidePrice ? (
              <p className="mt-6 max-w-md text-base text-muted-foreground">
                Toda la biblioteca en un solo pago, con acceso de por vida y entrega inmediata. Haz
                clic abajo para ver tu precio con descuento.
              </p>
            ) : (
              <>
                {hasAnchor && (
                  <p className="mt-6 text-sm text-muted-foreground">
                    {t.offerCompare} <span className="line-through">{money(fullValue)}</span>
                  </p>
                )}
                <p className={`${hasAnchor ? "mt-1" : "mt-6"} text-sm text-muted-foreground`}>
                  {t.offerToday}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="font-display text-[clamp(2.6rem,8vw,4.2rem)] text-primary">
                    {money(price)}
                  </span>
                  {hasAnchor && (
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                      -{discount}%
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t.offerSpec(totalGames)}</p>
                {/* The offer is priced in OFFER_CURRENCY; anywhere else the number
                    above is a live conversion, and Hotmart's own rate decides the
                    final charge. */}
                {currency !== OFFER_CURRENCY && (
                  <p className="mt-1 text-xs text-muted-foreground">{t.fxNote}</p>
                )}
              </>
            )}

            <div className="mt-7">
              <LaunchWindow />
            </div>

            <Cta className="mt-7 w-full sm:w-auto" location="offer">
              {t.heroCta}
            </Cta>

            <p className="mt-4 text-xs text-muted-foreground">{t.offerNote}</p>
          </div>

          <ul className="space-y-3.5">
            {t.includes(totalGames).map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
