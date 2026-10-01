import { Star, Quote } from "lucide-react";
import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

export function Testimonials() {
  const { t, priceLabel } = useLocale();
  const items = t.testimonials(priceLabel);

  return (
    <section id="depoimentos" className="border-t border-border py-20">
      <div className="mx-auto max-w-7xl px-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {t.testimonialsEyebrow}
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[clamp(1.8rem,4.5vw,3rem)]">
          {t.testimonialsTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          {t.testimonialsSub}
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.name}
              className="relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6"
            >
              <Quote
                className="absolute right-5 top-5 h-6 w-6 text-primary/25"
                aria-hidden="true"
              />
              <div className="flex gap-1" aria-label="5/5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                “{item.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                  {item.name.charAt(0)}
                </span>
                <span className="text-sm">
                  <span className="block font-semibold">{item.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.meta}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Cta location="testimonials">{t.ctaTestimonials}</Cta>
        </div>
      </div>
    </section>
  );
}
