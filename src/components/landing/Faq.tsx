import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

export function Faq() {
  const { t, priceLabel, totalGames } = useLocale();
  const items = t.faq(priceLabel, totalGames);

  return (
    <section id="faq" className="border-t border-border py-20">
      <div className="mx-auto max-w-3xl px-5">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
          FAQ
        </p>
        <h2 className="mt-3 text-center text-[clamp(1.8rem,4.5vw,3rem)]">
          {t.faqTitle}
        </h2>

        <Accordion type="single" collapsible className="mt-10">
          {items.map((item, i) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left text-base font-semibold">
                <span className="mr-4 font-display text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{item.q}</span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <Cta location="faq">{t.ctaFaq}</Cta>
        </div>
      </div>
    </section>
  );
}
