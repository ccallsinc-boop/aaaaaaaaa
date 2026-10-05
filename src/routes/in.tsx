import { siteUrl } from "@/lib/site";
import { ASSETS } from "@/lib/assets";
import { createFileRoute } from "@tanstack/react-router";

import { productSchema } from "@/lib/seo";

import { LandingPage } from "@/components/landing/LandingPage";

const TITLE = "Framers — आपके PC गेम्स आपके फ़ोन पर";
const DESCRIPTION =
  "एमुलेटर + स्टेप बाय स्टेप तरीका, जिससे GTA V, Red Dead 2, Elden Ring और 9 और PC गेम्स Android और iPhone पर चलें। एक बार भुगतान और 7 दिन की गारंटी।";
const URL = siteUrl("/in");
const IMAGE = siteUrl(ASSETS.heroDefault);

export const Route = createFileRoute("/in")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "hi_IN" },
      { property: "og:image", content: IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMAGE },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "hi", href: URL },
      { rel: "alternate", hrefLang: "es", href: siteUrl("/es") },
      { rel: "alternate", hrefLang: "en", href: siteUrl("/en") },
      { rel: "alternate", hrefLang: "en-GB", href: siteUrl("/uk") },
      { rel: "alternate", hrefLang: "pt-BR", href: siteUrl("/pt") },
      { rel: "alternate", hrefLang: "x-default", href: siteUrl("/en") },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: productSchema({
          name: "Framers — PC Game Emulator for Phones",
          description: DESCRIPTION,
          image: IMAGE,
          url: URL,
        }),
      },
    ],
  }),
  component: InIndex,
});

function InIndex() {
  return <LandingPage lang="in" />;
}
