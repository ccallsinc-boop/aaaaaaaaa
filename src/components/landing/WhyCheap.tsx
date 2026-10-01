import { PackageOpen, TrendingUp, Layers } from "lucide-react";

import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

const ICONS = [PackageOpen, TrendingUp, Layers];

/**
 * Answers the objection the page never addressed: why is it this cheap?
 *
 * A very low price on recognisable titles creates doubt before it creates
 * desire, and the old page leaned on the low number without ever explaining the
 * mechanism behind it. Leaving the question unanswered hands it to the visitor
 * to answer for themselves, which they do in the worst way.
 */
export function WhyCheap() {
  const { t } = useLocale();

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="mx-auto max-w-2xl text-center text-[clamp(1.8rem,4.5vw,3rem)]">
          {t.whyCheapTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          {t.whyCheapSub}
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.whyCheap.map(([title, body], i) => {
            const Icon = ICONS[i] ?? PackageOpen;
            return (
              <div key={title} className="rounded-2xl border border-border bg-surface p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Cta location="why-cheap">{t.ctaWhyCheap}</Cta>
        </div>
      </div>
    </section>
  );
}
