import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Globe, Loader2, ShieldCheck, Zap } from "lucide-react";

import { Logo } from "@/components/landing/Logo";
import { STORE_CHECKOUT, STORE_PRICE } from "@/components/store/StorePage";
import { fetchProductByHandle } from "@/lib/shopify";
import { trackMeta } from "@/lib/meta-pixel";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => {
    const name = params.handle
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const title = `${name} — PC game for $7.00 | Framers Store`;
    const description = `Buy ${name} for PC for just $7.00. Instant digital delivery by email, worldwide access and a 7-day guarantee.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

const money = (value: number, currency = "USD") =>
  value.toLocaleString("en-US", { style: "currency", currency });

function ProductPage() {
  const { handle } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 5 * 60 * 1000,
  });

  const image = data?.images.edges[0]?.node;
  const amount = Number(data?.priceRange.minVariantPrice.amount) || STORE_PRICE;
  const currency = data?.priceRange.minVariantPrice.currencyCode || "USD";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
          <a href="/store" className="flex items-center gap-2">
            <Logo variant="3d" className="h-8 w-auto" />
          </a>
          <a
            href="/store"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All games
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-5 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
            Loading game...
          </div>
        ) : isError || !data ? (
          <div className="py-24 text-center">
            <p className="text-sm text-muted-foreground">This game is not available.</p>
            <a
              href="/store"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              Browse all games
            </a>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-border bg-primary-soft">
              {image ? (
                <img
                  src={image.url}
                  alt={image.altText ?? `${data.title} cover art`}
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[2/3] place-items-center px-6 text-center text-lg font-bold text-primary">
                  {data.title}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Framers Store · PC game
              </p>
              <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] leading-tight">{data.title}</h1>
              <p className="mt-5 whitespace-pre-line text-base text-muted-foreground">
                {data.description}
              </p>

              <a
                href={STORE_CHECKOUT}
                onClick={() =>
                  trackMeta("InitiateCheckout", {
                    value: amount,
                    currency,
                    content_name: data.title,
                    content_type: "product",
                    cta_location: "product-page",
                  })
                }
                className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
              >
                Buy now
              </a>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  [Zap, "Instant delivery"],
                  [Globe, "Worldwide"],
                  [Download, "Direct download"],
                  [ShieldCheck, "7-day guarantee"],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof Zap;
                  return (
                    <div
                      key={label as string}
                      className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold"
                    >
                      <I className="h-4 w-4 text-primary" aria-hidden="true" />
                      {label as string}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
