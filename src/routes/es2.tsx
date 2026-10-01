import { createFileRoute } from "@tanstack/react-router";

import { Es2LandingPage } from "@/components/landing/Es2LandingPage";
import { Es2Pixel } from "@/components/landing/Es2Pixel";
import { LocaleProvider } from "@/lib/locale";

const TITLE = "Generative Energy — Guía pro-metabólica en PDF por $5.30";
const DESCRIPTION =
  "E-book digital con el protocolo pro-metabólico inspirado en Ray Peat y el estilo de vida europeo: tiroides, carbohidratos fáciles, grasas correctas y cero PUFA. Entrega inmediata y garantía de 7 días.";
const URL = "https://framers.lovable.app/es2";

export const Route = createFileRoute("/es2")({
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
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Generative Energy — E-book pro-metabólico",
          description: DESCRIPTION,
          brand: { "@type": "Brand", name: "Generative Energy" },
          offers: {
            "@type": "Offer",
            price: "8.30",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: URL,
          },
        }),
      },
    ],
  }),
  component: Es2Index,
});

function Es2Index() {
  return (
    <LocaleProvider lang="es2">
      <Es2Pixel price={5.3} />
      <Es2LandingPage />
    </LocaleProvider>
  );
}
