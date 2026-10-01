import { motion } from "framer-motion";

import { FRONT_GAMES } from "@/data/front-offer";
import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

/**
 * The twelve titles the front offer sells.
 *
 * Replaces the old 424-entry catalog with search, genre filters and A-Z sorting.
 * That grid hurt the offer: sorted alphabetically it opened on Angry Birds and Bad
 * Piggies while GTA and Elden Ring sat pages below, and 46% of its entries had no
 * cover. Here every card is a title the ads actually promise, with real art.
 */
export function FrontGames() {
  const { t } = useLocale();

  return (
    <section id="jogos" className="border-t border-border bg-surface py-20">
      <div className="mx-auto max-w-7xl px-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {t.catalogEyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl text-[clamp(1.8rem,4.5vw,3rem)]">
          {t.catalogTitle(FRONT_GAMES.length)}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{t.catalogSub}</p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {FRONT_GAMES.map((game, i) => (
            <motion.article
              key={game.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
            >
              <div className="grid aspect-[2/3] place-items-center bg-primary-soft">
                <img
                  src={game.img}
                  alt={t.coverAlt(game.name)}
                  loading={i < 6 ? "eager" : "lazy"}
                  className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
                    game.wide ? "object-contain" : "object-cover"
                  }`}
                />
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-semibold" title={game.name}>
                  {game.name}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Cta location="catalog">{t.ctaCatalog}</Cta>
        </div>
      </div>
    </section>
  );
}
