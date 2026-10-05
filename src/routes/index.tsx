import { siteUrl } from "@/lib/site";
import { ASSETS } from "@/lib/assets";
import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";
import { productSchema } from "@/lib/seo";

const TITLE = "Framers — Jogos de PC no seu celular";
const DESCRIPTION =
  "Emulador + método passo a passo para rodar GTA V, Red Dead 2, Elden Ring e mais 9 jogos de PC no Android e no iPhone. Pagamento único e 7 dias de garantia.";
const URL = siteUrl("/");
const IMAGE = siteUrl(ASSETS.heroPt);

/**
 * The unified landing.
 *
 * Serves the visitor's own language and currency, resolved from the country on
 * the request, so one URL covers Brazil, Spanish-speaking markets and English.
 * The per-language routes (/pt, /es, /en, /uk, /in) stay as they are, because
 * live ads point at them, and they only pin the language: the currency is
 * resolved per country everywhere.
 *
 * This slot used to render the Brazilian quiz, which now lives at its own
 * /br-quiz route.
 */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { property: "og:image", content: IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMAGE },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "pt-BR", href: siteUrl("/pt") },
      { rel: "alternate", hrefLang: "es", href: siteUrl("/es") },
      { rel: "alternate", hrefLang: "en", href: siteUrl("/en") },
      { rel: "alternate", hrefLang: "en-GB", href: siteUrl("/uk") },
      { rel: "alternate", hrefLang: "x-default", href: URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: productSchema({
          name: "Framers — Emulador de jogos de PC para celular",
          description: DESCRIPTION,
          image: IMAGE,
          url: URL,
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <LandingPage />;
}
