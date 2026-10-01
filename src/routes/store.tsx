import { createFileRoute } from "@tanstack/react-router";

import { StorePage } from "@/components/store/StorePage";

const TITLE = "Framers Store — Any PC game for $7.00 USD";
const DESCRIPTION =
  "Buy GTA, FIFA, Call of Duty, Elden Ring, Resident Evil and hundreds more PC games for $7.00 each. Instant digital delivery worldwide with a 7-day guarantee.";
const URL = "https://framers.lovable.app/store";
const IMAGE =
  "https://framers.lovable.app/__l5e/assets-v1/5ad32c30-9e9f-4863-a319-5d990406ff51/destaque-gta-en.png";

export const Route = createFileRoute("/store")({
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
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Framers PC Game",
          description: DESCRIPTION,
          image: IMAGE,
          brand: { "@type": "Brand", name: "Framers" },
          offers: {
            "@type": "Offer",
            price: "7.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: URL,
          },
        }),
      },
    ],
  }),
  component: StorePage,
});
