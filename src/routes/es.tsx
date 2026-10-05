import { siteUrl } from "@/lib/site";
import { ASSETS } from "@/lib/assets";
import { createFileRoute } from "@tanstack/react-router";

import { productSchema } from "@/lib/seo";

import { LandingPage } from "@/components/landing/LandingPage";

const TITLE = "Framers — Tus juegos de PC en el celular";
const DESCRIPTION =
  "Emulador + método paso a paso para correr GTA V, Red Dead 2, Elden Ring y 9 juegos de PC más en Android y iPhone. Pago único y 7 días de garantía.";
const URL = siteUrl("/es");
const IMAGE = siteUrl(ASSETS.heroDefault);

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
          name: "Framers — Emulador de juegos de PC para celular",
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
