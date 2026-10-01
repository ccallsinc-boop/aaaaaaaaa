import { siteUrl } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { ClipsPage } from "@/components/clips/ClipsPage";

const TITLE = "Framers Clips — Vídeos largos en clips virales por €2,99";
const DESCRIPTION =
  "Convierte vídeos largos en Shorts y Reels con IA: detección de momentos, reencuadre 9:16, subtítulos y export 4K. Acceso completo por €2,99, pago único.";
const URL = siteUrl("/clips");

export const Route = createFileRoute("/clips")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "es_ES" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Framers Clips",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          description: DESCRIPTION,
          url: URL,
          offers: {
            "@type": "Offer",
            price: "7.29",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: URL,
          },
        }),
      },
    ],
  }),
  component: ClipsRoute,
});

function ClipsRoute() {
  return <ClipsPage />;
}
