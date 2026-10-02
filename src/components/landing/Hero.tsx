import { Check } from "lucide-react";
import { FRONT_GAMES } from "@/data/front-offer";
import { Cta } from "@/components/landing/Cta";
import { Logo } from "@/components/landing/Logo";
import { VslEs } from "@/components/landing/VslEs";
import { useLocale } from "@/lib/locale";
import { ASSETS } from "@/lib/assets";

/** First six of the front offer, as a teaser. The grid below shows all twelve. */
const FEATURED = FRONT_GAMES.slice(0, 6);

/**
 * The stagger the hero used to get from framer-motion's `staggerChildren`.
 *
 * It is a plain CSS delay now, so the first screen no longer waits for the bundle
 * to become visible. Each call returns the style for the next element in order.
 */
function stagger(index: number) {
  return { "--rise-delay": `${(0.05 + index * 0.09).toFixed(2)}s` } as React.CSSProperties;
}

export function Hero() {
  const {
    t,
    money,
    price,
    priceLabel,
    hidePrice,
    fullValue,
    discount,
    totalGames,
    lang,
    marketLang,
  } = useLocale();
  const destaque = lang === "pt" ? ASSETS.heroPt : ASSETS.heroDefault;

  return (
    <header id="topo" className="bg-blue-gradient relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-10 text-center sm:pt-14">
        {marketLang !== "es" && (
          <div className="rise" style={stagger(0)}>
            <Logo
              variant="3d"
              className={`mx-auto mb-6 w-auto ${lang === "pt" ? "h-16 sm:h-20" : "h-10 sm:h-12"}`}
            />
          </div>
        )}
        <span
          className="rise inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-primary"
          style={stagger(1)}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          {t.heroBadge(discount)}
        </span>

        <h1
          className="rise mx-auto mt-6 max-w-4xl text-[clamp(2.2rem,7vw,4.5rem)]"
          style={stagger(2)}
        >
          {t.heroTitleA} <span className="block text-primary">{t.heroTitleB()}</span>
        </h1>

        <p
          className="rise mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
          style={stagger(3)}
        >
          {t.heroSub(priceLabel)}
        </p>

        {/*
          The hero used to carry no checkout button, on the argument that the first
          screen should send people into the offer and let the decision happen
          further down. That holds for a considered purchase. This is a R$17,99
          impulse buy, and the visitor arrives from an ad that already named the
          offer and the price: a share of them are ready on arrival, and the page
          was making all of them scroll to find a way to pay. The primary action is
          now in the first screen, with the tour kept beside it for everyone who is
          not ready yet.
        */}
        <div
          className="rise mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center"
          style={stagger(4)}
        >
          <Cta location="hero">{t.heroCta}</Cta>
          <a
            href="#jogos"
            className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary"
          >
            {t.heroSecondary}
          </a>
        </div>

        {!hidePrice && (
          <p className="rise mt-5 text-xs text-muted-foreground" style={stagger(5)}>
            {t.heroCompare(money(fullValue), money(fullValue - price))}
          </p>
        )}

        <ul
          className="rise mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground"
          style={stagger(6)}
        >
          {t.heroTrust.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        {marketLang === "es" ? (
          <div className="rise mt-12" style={stagger(7)}>
            <VslEs />
          </div>
        ) : (
          /*
            Both hero assets are 4:3 (1600x1182 and 1920x1440). Declaring the ratio
            reserves the space before the image arrives, so the trust badges and the
            cover grid below it stop being pushed down mid-read. It is the one image
            on the page large enough for that shift to move a thumb off a button.
          */
          <img
            src={destaque}
            alt={t.heroAlt(totalGames)}
            width={1600}
            height={1200}
            className="rise mt-12 aspect-[4/3] w-full rounded-3xl border border-border object-cover shadow-soft"
            loading="eager"
            style={stagger(7)}
          />
        )}

        <div
          className="rise mt-6 rounded-3xl border border-border bg-surface p-4 sm:p-6"
          style={stagger(8)}
        >
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {FEATURED.map((game) => (
              <img
                key={game.name}
                src={game.img}
                alt={game.name}
                loading="lazy"
                className="aspect-[2/3] w-full rounded-xl border border-border object-cover transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.04]"
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {t.heroMore(totalGames - FEATURED.length)}
          </p>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {t.stats(priceLabel).map(([title, sub], i) => (
            <div
              key={title}
              className="rise rounded-2xl border border-border bg-background p-6 transition-shadow duration-300 hover:shadow-soft"
              style={stagger(9 + i)}
            >
              <dt className="font-display text-2xl text-primary">{title}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{sub}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
