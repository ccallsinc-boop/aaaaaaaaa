import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { trackMeta } from "@/lib/meta-pixel";
import { useLocale } from "@/lib/locale";
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

/** sessionStorage key so a dismissed popup does not come back on reload. */
const DISMISS_KEY = "framers:discount-popup-dismissed";

export function DiscountPopup() {
  const { lang, storeUrl, price, currency, money, hotmart } = useLocale();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  // The popup anchor mounts late, so re-bind the Hotmart widget when it opens.
  useEffect(() => {
    if (!open || !hotmart) return;
    const id = window.setTimeout(loadHotmartWidget, 60);
    return () => window.clearTimeout(id);
  }, [open, hotmart]);

  useEffect(() => {
    if (shown) return;
    // Once dismissed, stay dismissed for the session instead of firing again on
    // every reload.
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === "1") {
        setShown(true);
        return;
      }
    } catch {
      /* private mode or blocked storage: just show it */
    }

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
  }, [shown]);

  const dismiss = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!open) return null;

  const copy = COPY[lang] ?? COPY.pt;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-foreground/60 p-4 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-border bg-background p-7 text-center shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label={lang === "pt" ? "Fechar" : "Cerrar"}
          onClick={dismiss}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{copy.title}</p>
        <h3 className="mt-3 text-2xl leading-tight">{copy.sub}</h3>

        <p className="mt-5 font-display text-[clamp(2.4rem,12vw,3.4rem)] leading-none text-primary">
          {money(price)}
        </p>

        <a
          href={storeUrl}
          onClick={() =>
            trackMeta("InitiateCheckout", {
              value: Number(price.toFixed(2)),
              currency,
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
