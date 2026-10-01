import { siteUrl } from "@/lib/site";
import { ASSETS } from "@/lib/assets";
import { createFileRoute } from "@tanstack/react-router";

import { productSchema } from "@/lib/seo";

import { LandingPage } from "@/components/landing/LandingPage";

const TITLE = "Framers — The 12 Most Wanted PC Games";
const DESCRIPTION =
  "GTA V, Red Dead 2, Elden Ring, God of War Ragnarök and 8 more: 12 PC games in one payment, instant delivery and a 7-day money-back guarantee.";
const URL = siteUrl("/uk");
const IMAGE =
  siteUrl(ASSETS.heroDefault);

export const Route = createFileRoute("/uk")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "en_GB" },
      { property: "og:image", content: IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMAGE },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "en-GB", href: URL },
      { rel: "alternate", hrefLang: "en", href: siteUrl("/en") },
      { rel: "alternate", hrefLang: "pt-BR", href: siteUrl("/pt") },
      { rel: "alternate", hrefLang: "es", href: siteUrl("/es") },
      { rel: "alternate", hrefLang: "x-default", href: siteUrl("/en") },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: productSchema({
          name: "Framers — The 12 Most Wanted PC Games",
          description: DESCRIPTION,
          image: IMAGE,
          url: URL,
        }),
      },
    ],
  }),
  component: UkIndex,
});

function UkIndex() {
  return <LandingPage lang="uk" />;
}
