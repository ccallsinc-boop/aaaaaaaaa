import { useEffect } from "react";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Deliverables } from "@/components/landing/Deliverables";
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
import { useMarket } from "@/lib/use-market";
import { loadHotmartWidget } from "@/lib/hotmart-widget";

export function LandingPage({ lang }: { lang: Lang }) {
  const market = useMarket();
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
