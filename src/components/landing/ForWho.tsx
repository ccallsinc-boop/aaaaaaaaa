import { Check, X } from "lucide-react";

import { useLocale } from "@/lib/locale";

/**
 * "Is it for you / is it not", placed right before the offer.
 *
 * The product only works on recent high-end phones and with games the buyer already
 * owns. Saying so plainly next to the price turns away the visitors who would buy,
 * fail to run it and ask for a refund within the 7 days, and reassures the ones who
 * qualify. The same requirements live in the FAQ, where most visitors never look.
 */
export function ForWho() {
  const { t } = useLocale();

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="mx-auto max-w-2xl text-center text-[clamp(1.8rem,4.5vw,3rem)]">
          {t.forWhoTitle}
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/40 bg-primary-soft p-6 sm:p-8">
            <h3 className="text-lg">{t.forWhoYesTitle}</h3>
            <ul className="mt-5 space-y-3.5">
              {t.forWhoYes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="text-lg">{t.forWhoNoTitle}</h3>
            <ul className="mt-5 space-y-3.5">
              {t.forWhoNo.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border bg-background">
                    <X className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
