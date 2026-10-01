import { indicativeUsdPrice } from "@/lib/markets";

/**
 * Product structured data for the landing routes.
 *
 * Exists because each route used to inline its own JSON-LD, and the block was
 * copy-pasted: /en advertised "$8.30" in its title while declaring EUR 7.20 in
 * schema, /in advertised "$5.30" and also declared EUR 7.20, and /es declared
 * EUR 7.20 while the page charged in another currency entirely.
 *
 * The on-page price is now converted per country at request time, so a single
 * fixed price cannot be true for everyone. AggregateOffer with lowPrice is the
 * correct markup for a price that varies, and the number comes from one place.
 */
export function productSchema({
  name,
  description,
  image,
  url,
}: {
  name: string;
  description: string;
  image: string;
  url: string;
}) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: "Framers" },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: indicativeUsdPrice(),
      priceCurrency: "USD",
      offerCount: 1,
      availability: "https://schema.org/InStock",
      url,
    },
  });
}
