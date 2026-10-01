import { ShieldCheck } from "lucide-react";
import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

export function Guarantee() {
  const { t } = useLocale();

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-4xl px-5">
        <div className="rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-[clamp(1.6rem,4vw,2.5rem)]">
            {t.guaranteeTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            {t.guaranteeSub}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {t.guaranteeBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border bg-background px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Cta location="guarantee">{t.ctaGuarantee}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
