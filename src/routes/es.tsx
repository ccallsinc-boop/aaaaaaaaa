import { createFileRoute } from "@tanstack/react-router";

import { productSchema } from "@/lib/seo";

import { LandingPage } from "@/components/landing/LandingPage";

const TITLE = "Framers — Pack de 424 juegos de PC";
const DESCRIPTION =
  "GTA, FIFA, Call of Duty, Elden Ring, Resident Evil y cientos más: 424 juegos de PC en un solo pago, entrega inmediata y garantía de 7 días.";
const URL = "https://framers.lovable.app/es";
const IMAGE =
  "https://framers.lovable.app/__l5e/assets-v1/5ad32c30-9e9f-4863-a319-5d990406ff51/destaque-gta-en.png";

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
      { rel: "alternate", hrefLang: "en", href: "https://framers.lovable.app/en" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://framers.lovable.app/uk" },
      { rel: "alternate", hrefLang: "pt-BR", href: "https://framers.lovable.app/pt" },
      { rel: "alternate", hrefLang: "x-default", href: "https://framers.lovable.app/en" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: productSchema({
          name: "Framers — Pack de 424 juegos de PC",
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
