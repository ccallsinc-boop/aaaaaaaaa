import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Deliverables } from "@/components/landing/Deliverables";
import { WhyCheap } from "@/components/landing/WhyCheap";
import { FrontGames } from "@/components/landing/FrontGames";
import { BrandMarquee } from "@/components/landing/BrandMarquee";
import { Testimonials } from "@/components/landing/Testimonials";

import { Offer } from "@/components/landing/Offer";
import { WhyNow } from "@/components/landing/WhyNow";
import { ForWho } from "@/components/landing/ForWho";

import { Guarantee } from "@/components/landing/Guarantee";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { StickyCta } from "@/components/landing/StickyCta";
import { MidCta } from "@/components/landing/MidCta";
import { DiscountPopup } from "@/components/landing/DiscountPopup";
import { Reveal } from "@/components/landing/Reveal";
import { LocaleProvider, type Lang } from "@/lib/locale";
import type { MarketLang } from "@/lib/markets";
import { useMarket } from "@/lib/use-market";
import type { CheckoutProvider } from "@/lib/checkout";

/** Market language to the route language the copy is keyed by. */
const LANG_FOR_MARKET: Record<MarketLang, Lang> = {
  pt: "pt",
  es: "es",
  en: "en",
  hi: "in",
};

/**
 * `lang` pins the language for the per-language routes (/pt, /es, ...).
 * Omitting it serves the visitor's own language, resolved from their country,
 * which is what the unified route at / does.
 */
export function LandingPage({
  lang: pinned,
  checkout = "hotmart",
}: {
  lang?: Lang;
  /** "xpag" for the /xpag copy of the page; everything else sells through Hotmart. */
  checkout?: CheckoutProvider;
} = {}) {
  const market = useMarket();
  const lang = pinned ?? LANG_FOR_MARKET[market.market.lang];
  const quizVisual = lang === "pt" || lang === "es";

  return (
    <LocaleProvider lang={lang} market={market} checkout={checkout}>
      <main
        // The sticky bar is no longer mobile-only, so the bottom padding that keeps
        // it from covering the footer has to apply at every width.
        className={`${quizVisual ? "theme-quiz-landing" : ""} min-h-screen bg-background pb-24 text-foreground`}
      >
        <Nav />
        <Hero />
        <BrandMarquee />
        <Reveal>
          <WhyNow />
        </Reveal>
        <Reveal>
          <Deliverables />
        </Reveal>
        <Reveal>
          <WhyCheap />
        </Reveal>
        <Reveal>
          <MidCta index={0} />
        </Reveal>

        <Reveal>
          <FrontGames />
        </Reveal>
        <Reveal>
          <MidCta index={1} />
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
        <Reveal>
          <MidCta index={2} />
        </Reveal>
        <Reveal>
          <ForWho />
        </Reveal>
        <Reveal>
          <Offer />
        </Reveal>

        <Reveal>
          <Guarantee />
        </Reveal>
        <Reveal>
          <MidCta index={3} />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
        <Footer />
        <StickyCta />
        <DiscountPopup />
      </main>
    </LocaleProvider>
  );
}
