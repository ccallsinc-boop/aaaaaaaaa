import { useEffect } from "react";
import { Check, ShieldCheck, Zap } from "lucide-react";

import { Logo } from "@/components/landing/Logo";
import { UPSELL_GAMES_COUNT, UPSELL_HIGHLIGHTS, TOTAL_LIBRARY_COUNT } from "@/data/upsell-offer";
import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";
import { formatMoney } from "@/lib/markets";
import { useLocale } from "@/lib/locale";
import { UPSELL_ACCEPT_URL, upsellDeclineHref, upsellSharesFrontCheckout } from "@/lib/upsell";

/**
 * One-click upsell, shown right after the front purchase.
 *
 * Deliberately stripped: no nav, no footer links, no second offer. A post-purchase
 * page has exactly one job, and every extra link is an exit. The decline is still
 * plainly visible, because hiding it is what turns a refusal into a chargeback.
 *
 * Price is converted from its own base (UPSELL_PRICE in UPSELL_CURRENCY) with the
 * market already resolved for this request, so a Mexican buyer does not jump from pesos to dollars halfway
 * through the funnel.
 */
export function UpsellPage() {
  const { t, market, lang, pricePerGame, upsellPrice } = useLocale();

  const price = upsellPrice;
  const money = (value: number) => formatMoney(value, market);
  // Anchored against what the buyer just paid per game, which is concrete and
  // verifiable. The previous anchor multiplied 412 titles by a reference price and
  // produced a crossed-out figure in the tens of thousands, which reads as fake.

  useEffect(() => {
    if (import.meta.env.DEV && upsellSharesFrontCheckout()) {
      console.warn(
        "[upsell] The accept button points at the front offer's checkout, so it bills " +
          "the front price instead of the upgrade. Create a separate Xpag offer " +
          "and update UPSELL_ACCEPT_URL in src/lib/upsell.ts.",
      );
    }
  }, []);

  useEffect(() => {
    trackMetaCustom("UpsellView", {
      value: Number(price.toFixed(2)),
      currency: market.currency,
      lang,
    });
    // Fires once on mount; price and currency are final from the server.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // Same theme class the landing uses: jumping from the green page to an
    // unstyled blue one mid-funnel breaks trust at the worst possible moment.
    <main className="theme-quiz-landing min-h-screen bg-background pb-16 text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-5 py-5">
          <Logo variant="3d" className="h-10 w-auto" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5">
        <section className="pt-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-primary-soft px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            {t.upsellEyebrow}
          </p>
          <h1 className="mx-auto mt-6 max-w-2xl text-[clamp(1.9rem,6vw,3.2rem)] leading-tight">
            {t.upsellTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            {t.upsellSub(UPSELL_GAMES_COUNT, TOTAL_LIBRARY_COUNT)}
          </p>
        </section>

        <section className="mt-12 rounded-3xl border border-border bg-surface p-7 shadow-soft sm:p-10">
          <h2 className="text-center text-[clamp(1.5rem,4vw,2.2rem)]">
            {t.upsellOfferTitle(UPSELL_GAMES_COUNT)}
          </h2>

          <ul className="mx-auto mt-7 max-w-md space-y-3.5">
            {t.upsellBullets(UPSELL_GAMES_COUNT).map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {t.upsellPriceLabel}
            </p>
            <p className="mt-1 font-display text-[clamp(2.8rem,14vw,4rem)] leading-none text-primary">
              {money(price)}
            </p>
            {/* No per-game figure here on purpose. Spread over 412 titles it
                renders as EUR 0.01 or USD 0.02, which reads as junk rather than as
                value. The comparison below carries the same point using a number
                the buyer just paid. */}
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              {t.upsellCompareFront(money(Math.max(pricePerGame, 0.01)), UPSELL_GAMES_COUNT)}
            </p>
          </div>

          <a
            href={UPSELL_ACCEPT_URL}
            onClick={() => {
              trackMeta("InitiateCheckout", {
                value: Number(price.toFixed(2)),
                currency: market.currency,
                content_name: "Framers Full Library Upgrade",
                content_type: "product",
                content_ids: ["upsell-biblioteca-completa"],
                cta_location: `${lang}:upsell-accept`,
              });
            }}
            className={`mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]`}
          >
            {t.upsellAccept}
          </a>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">{t.upsellFootnote}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {t.heroTrust[1]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {t.heroTrust[2]}
            </span>
          </div>
        </section>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs text-muted-foreground">
          {t.upsellWarning}
        </p>

        <section className="mt-14">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t.upsellHighlightsTitle}
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {UPSELL_HIGHLIGHTS.map((game) => (
              <img
                key={game.name}
                src={game.img}
                alt={t.coverAlt(game.name)}
                loading="lazy"
                className={`aspect-[2/3] w-full rounded-xl border border-border ${
                  game.wide ? "object-contain" : "object-cover"
                }`}
              />
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <a
            href={upsellDeclineHref()}
            onClick={() =>
              trackMetaCustom("UpsellDecline", {
                value: Number(price.toFixed(2)),
                currency: market.currency,
                lang,
              })
            }
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {t.upsellDecline}
          </a>
        </div>
      </div>
    </main>
  );
}
