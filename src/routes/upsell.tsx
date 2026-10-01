import { createFileRoute, notFound } from "@tanstack/react-router";

import { LocaleProvider } from "@/lib/locale";
import { UpsellPage } from "@/components/upsell/UpsellPage";
import { useMarket } from "@/lib/use-market";
import { isUpsellConfigured } from "@/lib/upsell";
import type { Lang } from "@/lib/locale";
import type { MarketLang } from "@/lib/markets";

const TITLE = "Libere a biblioteca completa · Framers";

/** Market language to the route language the copy is keyed by. */
const LANG_FOR_MARKET: Record<MarketLang, Lang> = {
  pt: "pt",
  es: "es",
  en: "en",
  hi: "in",
};

export const Route = createFileRoute("/upsell")({
  /**
   * Answers 404 until the Hotmart one-click URL is filled in. A live upsell page
   * whose button goes nowhere is worse than no page: it burns the one moment the
   * buyer is most willing to say yes.
   */
  beforeLoad: () => {
    if (!isUpsellConfigured()) throw notFound();
  },
  head: () => ({
    meta: [
      { title: TITLE },
      // Post-purchase page: it must never be indexed or reachable from search.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: UpsellIndex,
});

function UpsellIndex() {
  const market = useMarket();
  return (
    <LocaleProvider lang={LANG_FOR_MARKET[market.market.lang]} market={market}>
      <UpsellPage />
    </LocaleProvider>
  );
}
