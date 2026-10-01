import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShieldCheck, Zap, Globe, Download, Loader2 } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { trackMeta } from "@/lib/meta-pixel";
import { fetchAllProducts, type ShopifyProduct } from "@/lib/shopify";

export const STORE_PRICE = 7;
export const STORE_CHECKOUT =
  "https://xpag.global/pay/2Kf006h0";

const money = (value: number, currency = "USD") =>
  value.toLocaleString("en-US", { style: "currency", currency });

const PAGE = 24;

function buy(name: string, price: number, currency: string) {
  trackMeta("InitiateCheckout", {
    value: price,
    currency,
    content_name: name,
    content_type: "product",
    cta_location: "store",
  });
}

export function StorePage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("az");
  const [limit, setLimit] = useState(PAGE);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["shopify-products"],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000,
  });

  const products: ShopifyProduct[] = data ?? [];

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...products.filter((p) => !term || p.node.title.toLowerCase().includes(term))].sort(
      (a, b) =>
        sort === "az"
          ? a.node.title.localeCompare(b.node.title)
          : b.node.title.localeCompare(a.node.title),
    );
  }, [products, query, sort]);

  const visible = filtered.slice(0, limit);
  const count = products.length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
          <a href="/store" className="flex items-center gap-2">
            <Logo variant="3d" className="h-8 w-auto" />
          </a>
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            Every game · worldwide delivery
          </span>
          <a
            href="#games"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
          >
            Browse games
          </a>
        </div>
      </nav>

      <header className="border-b border-border py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Framers Store · PC games
          </p>
          <h1 className="mt-4 text-[clamp(2rem,6vw,3.6rem)] leading-tight">
            Any PC game you want
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground">
            Pick a title, pay once and get your download link by email in minutes.
            One flat price for every game, delivered anywhere in the world.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
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
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold"
                >
                  <I className="h-4 w-4 text-primary" aria-hidden="true" />
                  {label as string}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <section id="games" className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)]">
              {count > 0 ? `${count} games` : "Our games"}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setLimit(PAGE);
                  }}
                  placeholder="Search games..."
                  className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/50"
                />
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold outline-none"
              >
                <option value="az">Name A-Z</option>
                <option value="za">Name Z-A</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
              Loading games...
            </div>
          ) : isError ? (
            <p className="py-24 text-center text-sm text-muted-foreground">
              We couldn't load the catalog right now. Please refresh the page.
            </p>
          ) : filtered.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">No products found</p>
          ) : (
            <>
              <p className="mt-4 text-sm text-muted-foreground">
                {filtered.length} titles found
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {visible.map(({ node }) => {
                  const image = node.images.edges[0]?.node;
                  const amount = Number(node.priceRange.minVariantPrice.amount) || STORE_PRICE;
                  const currency = node.priceRange.minVariantPrice.currencyCode || "USD";
                  return (
                    <article
                      key={node.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
                    >
                      <a href={`/product/${node.handle}`} className="block">
                        <div className="grid aspect-[2/3] place-items-center bg-primary-soft">
                          {image ? (
                            <img
                              src={image.url}
                              alt={image.altText ?? `${node.title} cover art`}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <span className="px-3 text-center text-sm font-bold text-primary">
                              {node.title}
                            </span>
                          )}
                        </div>
                      </a>
                      <div className="flex flex-1 flex-col p-3">
                        <a
                          href={`/product/${node.handle}`}
                          className="truncate text-sm font-semibold hover:text-primary"
                          title={node.title}
                        >
                          {node.title}
                        </a>
                        <a
                          href={STORE_CHECKOUT}
                          onClick={() => buy(node.title, amount, currency)}
                          className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
                        >
                          Buy now
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>

              {limit < filtered.length ? (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setLimit((value) => value + 60)}
                    className="rounded-full border border-border bg-background px-7 py-3 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Show more games
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 text-center">
          <Logo variant="3d" className="h-8 w-auto" />
          <p className="text-sm text-muted-foreground">
            PC games, instant digital delivery worldwide.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Framers. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
