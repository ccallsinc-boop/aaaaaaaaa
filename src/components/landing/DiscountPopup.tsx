import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { trackMeta } from "@/lib/meta-pixel";
import { useLocale } from "@/lib/locale";
import { useGeoMarket, formatGeoMoney } from "@/lib/geo";
import { loadHotmartWidget, HOTMART_WIDGET_CLASSES } from "@/lib/hotmart-widget";

const COPY: Record<string, { title: string; sub: string; cta: string; note: string }> = {
  pt: {
    title: "Desconto exclusivo por tempo limitado",
    sub: "Garanta a biblioteca completa hoje",
    cta: "Quero meu desconto agora",
    note: "Pagamento único · Acesso imediato · Garantia de 7 dias",
  },
  es: {
    title: "Descuento exclusivo por tiempo limitado",
    sub: "Llévate la biblioteca completa hoy",
    cta: "Quiero mi descuento ahora",
    note: "Pago único · Acceso inmediato · Garantía de 7 días",
  },
  in: {
    title: "सीमित समय का विशेष डिस्काउंट",
    sub: "पूरी लाइब्रेरी आज ही पाएं",
    cta: "मुझे अभी डिस्काउंट चाहिए",
    note: "एक बार भुगतान · तुरंत एक्सेस · 7 दिन की गारंटी",
  },
};

export function DiscountPopup() {
  const { lang, storeUrl, price, currency, money, hidePrice, hotmart } = useLocale();
  const market = useGeoMarket();
  const geo = lang === "es" && market.currency !== "USD";
  const shownPrice = geo ? market.price : price;
  const shownCompare = geo ? market.compareAt : 12;
  const shownCurrency = geo ? market.currency : currency;
  const fmt = (v: number) => (geo ? formatGeoMoney(v, market) : money(v));
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  // The popup anchor mounts late, so re-bind the Hotmart widget when it opens.
  useEffect(() => {
    if (!open || !hotmart) return;
    const id = window.setTimeout(loadHotmartWidget, 60);
    return () => window.clearTimeout(id);
  }, [open, hotmart]);

  useEffect(() => {
    if (!hidePrice || shown) return;

    const show = () => {
      setOpen(true);
      setShown(true);
    };

    const timer = window.setTimeout(show, 12000);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [hidePrice, shown]);

  if (!hidePrice || !open) return null;

  const copy = COPY[lang] ?? COPY.pt;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-foreground/60 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-border bg-background p-7 text-center shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label={lang === "pt" ? "Fechar" : "Cerrar"}
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{copy.title}</p>
        <h3 className="mt-3 text-2xl leading-tight">{copy.sub}</h3>


        <a
          href={storeUrl}
          onClick={() =>
            trackMeta("InitiateCheckout", {
              value: shownPrice,
              currency: shownCurrency,
              cta_location: `${lang}:discount-popup`,
            })
          }
          className={`${hotmart ? HOTMART_WIDGET_CLASSES + " " : ""}mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]`}
        >
          {copy.cta}
        </a>

        <p className="mt-3 text-[11px] text-muted-foreground">{copy.note}</p>
      </div>
    </div>
  );
}
