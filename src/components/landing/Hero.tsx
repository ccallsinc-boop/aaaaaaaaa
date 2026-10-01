import { motion } from "framer-motion";
import { CATALOG } from "@/data/catalog";
import { Cta } from "@/components/landing/Cta";
import { Logo } from "@/components/landing/Logo";
import { VslEs } from "@/components/landing/VslEs";
import { useLocale } from "@/lib/locale";
import destaquePt from "@/assets/banners/destaque-gta.png.asset.json";
import destaqueEn from "@/assets/banners/destaque-gta-en.png.asset.json";

const FEATURED = [
  "GTA: V",
  "Red Dead Redemption 2",
  "Elden Ring",
  "God of War: Ragnarok",
  "Spider-Man: Remastered",
  "Hogwarts Legacy",
]
  .map((name) => CATALOG.find((g) => g.name === name))
  .filter((g): g is NonNullable<typeof g> => !!g);

const ITEM = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
} as const;

export function Hero() {
  const { t, money, price, priceLabel, hidePrice, fullValue, discount, totalGames, lang } =
    useLocale();
  const destaque = lang === "pt" ? destaquePt : destaqueEn;

  return (
    <header id="topo" className="bg-blue-gradient relative overflow-hidden">
      <motion.div
        className="relative mx-auto max-w-6xl px-5 pb-16 pt-10 text-center sm:pt-14"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
        }}
      >
        {lang !== "es" && (
          <motion.div variants={ITEM}>
            <Logo
              variant="3d"
              className={`mx-auto mb-6 w-auto ${lang === "pt" ? "h-16 sm:h-20" : "h-10 sm:h-12"}`}
            />
          </motion.div>
        )}
        <motion.span
          variants={ITEM}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-primary"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          {t.heroBadge(discount)}
        </motion.span>

        <motion.h1
          variants={ITEM}
          className="mx-auto mt-6 max-w-4xl text-[clamp(2.2rem,7vw,4.5rem)]"
        >
          {t.heroTitleA}{" "}
          <span className="block text-primary">{t.heroTitleB(totalGames)}</span>
        </motion.h1>

        <motion.p
          variants={ITEM}
          className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          {t.heroSub(priceLabel)}
        </motion.p>

        <motion.div
          variants={ITEM}
          className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center"
        >
          <Cta location="hero">{t.heroCta}</Cta>
          <a
            href="#jogos"
            className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary"
          >
            {t.heroSecondary}
          </a>
        </motion.div>

        {!hidePrice && (
          <motion.p variants={ITEM} className="mt-5 text-xs text-muted-foreground">
            {t.heroCompare(money(fullValue), money(fullValue - price))}
          </motion.p>
        )}

        {lang === "es" ? (
          <motion.div variants={ITEM} className="mt-12">
            <VslEs />
          </motion.div>
        ) : (
          <motion.img
            variants={ITEM}
            src={destaque.url}
            alt={t.heroAlt(totalGames)}
            className="mt-12 w-full rounded-3xl border border-border object-cover shadow-soft"
            loading="eager"
          />
        )}

        <motion.div
          variants={ITEM}
          className="mt-6 rounded-3xl border border-border bg-surface p-4 sm:p-6"
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
        </motion.div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {t.stats(priceLabel).map(([title, sub]) => (
            <motion.div
              key={title}
              variants={ITEM}
              className="rounded-2xl border border-border bg-background p-6 transition-shadow duration-300 hover:shadow-soft"
            >
              <dt className="font-display text-2xl text-primary">{title}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{sub}</dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>

    </header>
  );
}
