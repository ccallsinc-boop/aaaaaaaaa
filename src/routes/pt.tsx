import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";

const TITLE = "Framers — Pacote com 424 jogos de PC";
const DESCRIPTION =
  "GTA, FIFA, Call of Duty, Elden Ring, Resident Evil e centenas de outros jogos de PC em um único pacote, com entrega imediata e garantia de 7 dias.";
const URL = "https://framers.lovable.app/pt";
const IMAGE =
  "https://framers.lovable.app/__l5e/assets-v1/0a1ff5c3-b68c-4f76-8466-e4237ecb49b0/destaque-gta.png";

export const Route = createFileRoute("/pt")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMAGE },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "pt-BR", href: URL },
      { rel: "alternate", hrefLang: "es", href: "https://framers.lovable.app/es" },
      { rel: "alternate", hrefLang: "en", href: "https://framers.lovable.app/en" },
      { rel: "alternate", hrefLang: "en-GB", href: "https://framers.lovable.app/uk" },
      { rel: "alternate", hrefLang: "x-default", href: "https://framers.lovable.app/en" },
    ],
  }),
  component: PortugueseLanding,
});

function PortugueseLanding() {
  return <LandingPage lang="pt" />;
}