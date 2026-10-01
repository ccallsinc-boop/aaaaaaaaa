import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";
import { productSchema } from "@/lib/seo";

const TITLE = "Framers — Os 12 jogos de PC mais pedidos";
const DESCRIPTION =
  "GTA V, Red Dead 2, Elden Ring, God of War Ragnarök e mais 8: 12 jogos de PC em pagamento único, entrega imediata e 7 dias de garantia.";
const URL = "https://framers.lovable.app/";
const IMAGE =
  "https://framers.lovable.app/__l5e/assets-v1/0a1ff5c3-b68c-4f76-8466-e4237ecb49b0/destaque-gta.png";

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
      { rel: "alternate", hrefLang: "pt-BR", href: "https://framers.lovable.app/pt" },
      { rel: "alternate", hrefLang: "es", href: "https://framers.lovable.app/es" },
      { rel: "alternate", hrefLang: "en", href: "https://framers.lovable.app/en" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://framers.lovable.app/uk" },
      { rel: "alternate", hrefLang: "x-default", href: URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: productSchema({
          name: "Framers — 12 jogos de PC",
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
