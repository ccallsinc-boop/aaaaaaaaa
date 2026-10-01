import { trackMeta } from "@/lib/meta-pixel";
import { useLocale } from "@/lib/locale";
import { HOTMART_WIDGET_CLASSES } from "@/lib/hotmart-widget";

type Props = {
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
  location?: string;
};

export function Cta({
  children,
  variant = "solid",
  className = "",
  location = "page",
}: Props) {
  const { storeUrl, price, currency, lang, hotmart } = useLocale();
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold transition-transform hover:scale-[1.03]";
  const styles =
    variant === "solid"
      ? "bg-primary text-primary-foreground shadow-soft"
      : "border border-border bg-background text-foreground hover:border-primary/40";

  return (
    <a
      href={storeUrl}
      onClick={() =>
        trackMeta("InitiateCheckout", {
          value: price,
          currency,
          content_name: "Pacote Framers Completo",
          content_type: "product",
          content_ids: ["pacote-framers"],
          cta_location: `${lang}:${location}`,
        })
      }
      className={`${hotmart ? HOTMART_WIDGET_CLASSES + " " : ""}${base} ${styles} ${className}`}
    >
      {children}
    </a>
  );
}
