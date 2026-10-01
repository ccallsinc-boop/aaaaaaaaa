import { useEffect } from "react";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Deliverables } from "@/components/landing/Deliverables";
import { GameCatalog } from "@/components/landing/GameCatalog";
import { BrandMarquee } from "@/components/landing/BrandMarquee";
import { Testimonials } from "@/components/landing/Testimonials";
import { BonusGames } from "@/components/landing/BonusGames";

import { Offer } from "@/components/landing/Offer";

import { Guarantee } from "@/components/landing/Guarantee";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { StickyCta } from "@/components/landing/StickyCta";
import { MidCta } from "@/components/landing/MidCta";
import { DiscountPopup } from "@/components/landing/DiscountPopup";
import { Reveal } from "@/components/landing/Reveal";
import { LocaleProvider, type Lang } from "@/lib/locale";
import { loadHotmartWidget } from "@/lib/hotmart-widget";

export function LandingPage({ lang }: { lang: Lang }) {
  const quizVisual = lang === "pt" || lang === "es";

  // Hotmart widget (ES): binds to `.hotmart-fb` anchors once loaded.
  useEffect(() => {
    if (lang !== "es") return;
    const id = window.setTimeout(loadHotmartWidget, 60);
    return () => window.clearTimeout(id);
  }, [lang]);

  return (
    <LocaleProvider lang={lang}>
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
          <GameCatalog />
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
          <BonusGames />
        </Reveal>
        <Reveal>
          <MidCta index={3} />
        </Reveal>
        <Reveal>
          <Offer />
        </Reveal>

        <Reveal>
          <Guarantee />
        </Reveal>
        <Reveal>
          <MidCta index={4} />
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
