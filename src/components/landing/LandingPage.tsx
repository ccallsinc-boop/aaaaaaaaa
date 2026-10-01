import { useEffect } from "react";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Deliverables } from "@/components/landing/Deliverables";
import { WhyCheap } from "@/components/landing/WhyCheap";
import { FrontGames } from "@/components/landing/FrontGames";
import { BrandMarquee } from "@/components/landing/BrandMarquee";
import { Testimonials } from "@/components/landing/Testimonials";

import { Offer } from "@/components/landing/Offer";

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
import { loadHotmartWidget } from "@/lib/hotmart-widget";

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
export function LandingPage({ lang: pinned }: { lang?: Lang } = {}) {
  const market = useMarket();
  const lang = pinned ?? LANG_FOR_MARKET[market.market.lang];
  const quizVisual = lang === "pt" || lang === "es";

  // Checkout runs through Hotmart on every route, so the widget binds here once
  // the CTA anchors exist. It used to load only on /es, where the config had it
  // disabled, so the script was fetched and never used.
  useEffect(() => {
    const id = window.setTimeout(loadHotmartWidget, 60);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <LocaleProvider lang={lang} market={market}>
      <main
        className={`${quizVisual ? "theme-quiz-landing" : ""} min-h-screen bg-background pb-24 text-foreground md:pb-0`}
      >
        <Nav />
        <Hero />
        <BrandMarquee />
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
