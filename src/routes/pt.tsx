import { siteUrl } from "@/lib/site";
import { ASSETS } from "@/lib/assets";
import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";

const TITLE = "Framers — Jogos de PC no seu celular";
const DESCRIPTION =
  "Emulador + método passo a passo para rodar GTA V, Red Dead 2, Elden Ring e mais 9 jogos de PC no Android e no iPhone. Pagamento único e 7 dias de garantia.";
const URL = siteUrl("/pt");
const IMAGE = siteUrl(ASSETS.heroPt);

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
      { rel: "alternate", hrefLang: "es", href: siteUrl("/es") },
      { rel: "alternate", hrefLang: "en", href: siteUrl("/en") },
      { rel: "alternate", hrefLang: "en-GB", href: siteUrl("/uk") },
      { rel: "alternate", hrefLang: "x-default", href: siteUrl("/en") },
    ],
  }),
  component: PortugueseLanding,
});

function PortugueseLanding() {
  return <LandingPage lang="pt" />;
}
