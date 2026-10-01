import { siteUrl } from "@/lib/site";
import { ASSETS } from "@/lib/assets";
import { createFileRoute } from "@tanstack/react-router";

import { productSchema } from "@/lib/seo";

import { LandingPage } from "@/components/landing/LandingPage";

const TITLE = "Framers — Los 12 juegos de PC más pedidos";
const DESCRIPTION =
  "GTA V, Red Dead 2, Elden Ring, God of War Ragnarök y 8 más: 12 juegos de PC en un solo pago, entrega inmediata y garantía de 7 días.";
const URL = siteUrl("/es");
const IMAGE =
  siteUrl(ASSETS.heroDefault);

export const Route = createFileRoute("/es")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "es_ES" },
      { property: "og:image", content: IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMAGE },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "es", href: URL },
      { rel: "alternate", hrefLang: "en", href: siteUrl("/en") },
      { rel: "alternate", hrefLang: "en-GB", href: siteUrl("/uk") },
      { rel: "alternate", hrefLang: "pt-BR", href: siteUrl("/pt") },
      { rel: "alternate", hrefLang: "x-default", href: siteUrl("/en") },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: productSchema({
          name: "Framers — Los 12 juegos de PC más pedidos",
          description: DESCRIPTION,
          image: IMAGE,
          url: URL,
        }),
      },
    ],
  }),
  component: EsIndex,
});

function EsIndex() {
  return <LandingPage lang="es" />;
}
