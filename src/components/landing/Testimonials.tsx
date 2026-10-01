import { Cta } from "@/components/landing/Cta";
import { ASSETS } from "@/lib/assets";
import { useLocale } from "@/lib/locale";

/**
 * Social proof, rebuilt around real WhatsApp screenshots.
 *
 * It used to be six invented text testimonials: no photo, five hardcoded stars
 * each, Brazilian names placed in Spanish-speaking cities, and one of them
 * praising a saga the offer does not include. That reads as a template and costs
 * more trust than it buys. These are unedited screenshots of actual messages,
 * both about GTA V, which is one of the twelve titles on sale.
 */
export function Testimonials() {
  const { t } = useLocale();
  const shots = [ASSETS.proofChat[0], ASSETS.proofChat[1]];

  return (
    <section id="depoimentos" className="border-t border-border py-20">
      <div className="mx-auto max-w-5xl px-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {t.testimonialsEyebrow}
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-[clamp(1.8rem,4.5vw,3rem)]">
          {t.testimonialsTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          {t.testimonialsSub}
        </p>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {t.testimonials.map((item, i) => (
            <figure key={item.caption} className="flex flex-col">
              <img
                src={shots[i]}
                alt={item.alt}
                loading="lazy"
                className="w-full rounded-2xl border border-border shadow-soft"
              />
              <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                {item.caption}
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
