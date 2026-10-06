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
  const { t, marketLang } = useLocale();
  // The Spanish funnel has its own screenshots, in Spanish and of the emulator.
  // The other languages keep theirs until their own material arrives.
  const images = marketLang === "es" ? ASSETS.proofChatEs : ASSETS.proofChat;
  const twoUp = t.testimonials.length === 2;

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

        <div
          className={`mt-12 grid gap-6 sm:grid-cols-2 ${twoUp ? "mx-auto max-w-3xl" : "lg:grid-cols-3"}`}
        >
          {t.testimonials.map((item, i) => (
            <figure key={item.caption} className="flex h-full flex-col">
              <img
                src={images[i]}
                alt={item.alt}
                loading="lazy"
                className="w-full rounded-2xl border border-border shadow-soft"
              />
              {/* The screenshots differ slightly in height, so the captions are
                  pushed to the bottom to keep the row aligned. */}
              <figcaption className="mt-auto pt-3 text-center text-sm text-muted-foreground">
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
