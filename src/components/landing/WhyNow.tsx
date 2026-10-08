import { Cpu, Layers, Wrench } from "lucide-react";

import { useLocale } from "@/lib/locale";

const ICONS = [Cpu, Layers, Wrench];

/**
 * Answers the doubt a visitor has before anything else: "PC games on a phone? That
 * doesn't exist." It explains the mechanism (newer phone chips plus today's
 * emulators) before the page lists what the buyer gets, so the offer reads as an
 * explained possibility rather than a too-good-to-be-true claim.
 */
export function WhyNow() {
  const { t } = useLocale();

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-5xl px-5">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {t.whyNowEyebrow}
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[clamp(1.8rem,4.5vw,3rem)]">
          {t.whyNowTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          {t.whyNowSub}
        </p>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {t.whyNowSteps.map(([title, body], i) => {
            const Icon = ICONS[i] ?? Cpu;
            return (
              <li key={title} className="rounded-2xl border border-border bg-surface p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
