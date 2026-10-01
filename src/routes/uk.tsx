import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";

const TITLE = "Framers — 424 PC Games Bundle for £3.90";
const DESCRIPTION =
  "GTA, FIFA, Call of Duty, Elden Ring, Resident Evil and hundreds more: 424 PC games for £3.90. One-time payment, instant delivery and a 7-day money-back guarantee.";
const URL = "https://framers.lovable.app/uk";
const IMAGE =
  "https://framers.lovable.app/__l5e/assets-v1/5ad32c30-9e9f-4863-a319-5d990406ff51/destaque-gta-en.png";

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
      { rel: "alternate", hrefLang: "en", href: "https://framers.lovable.app/en" },
      { rel: "alternate", hrefLang: "pt-BR", href: "https://framers.lovable.app/pt" },
      { rel: "alternate", hrefLang: "es", href: "https://framers.lovable.app/es" },
      { rel: "alternate", hrefLang: "x-default", href: "https://framers.lovable.app/en" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Framers — 424 PC Games Bundle",
          description: DESCRIPTION,
          image: IMAGE,
          brand: { "@type": "Brand", name: "Framers" },
          offers: {
            "@type": "Offer",
            price: "3.90",
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
            url: URL,
          },
        }),
      },
    ],
  }),
  component: UkIndex,
});

function UkIndex() {
  return <LandingPage lang="uk" />;
}
