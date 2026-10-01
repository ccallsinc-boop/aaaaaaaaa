import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { CATALOG } from "@/data/catalog";
import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

const BONUSES: { name: string; value: number }[] = [
  { name: "GTA: V", value: 59.99 },
  { name: "Red Dead Redemption 2", value: 59.99 },
  { name: "Elden Ring", value: 49.99 },
  { name: "God of War: Ragnarok", value: 59.99 },
  { name: "Spider-Man: Remastered", value: 49.99 },
  { name: "Hogwarts Legacy", value: 59.99 },
];

const GAMES = BONUSES.map((b) => ({
  ...b,
  game: CATALOG.find((g) => g.name === b.name),
})).filter((b) => !!b.game?.img);

const TOTAL = BONUSES.reduce((sum, b) => sum + b.value, 0);

export function BonusGames() {
  const { lang, money, priceLabel, t } = useLocale();

  // ES / IN bonus section
  if (lang !== "es" && lang !== "es2" && lang !== "in") return null;
  const hi = lang === "in";

  const format = (value: number) => money(value);

  return (
    <section className="border-t border-border bg-surface py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Gift className="h-3.5 w-3.5" aria-hidden="true" />
            {hi ? "शामिल बोनस" : "Bonus incluidos"}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(1.8rem,4.5vw,3rem)]">
            {hi ? "सबसे मशहूर गेम्स मिलते हैं " : "Los juegos más famosos van de "}
            <span className="text-primary">{hi ? "मुफ्त बोनस में" : "BONUS GRATIS"}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {hi
              ? "अलग-अलग खरीदने पर ये 6 टाइटल पड़ते हैं "
              : "Por separado, estos 6 títulos cuestan "}
            <span className="font-semibold text-foreground line-through">{format(TOTAL)}</span>
            {hi ? ". आज पैक खरीदने पर सिर्फ " : ". Comprando el pack hoy por "}
            <span className="font-semibold text-primary">{priceLabel}</span>
            {hi
              ? " में ये सब बिना एक भी रुपया अतिरिक्त दिए शामिल मिलते हैं।"
              : ", los recibes incluidos sin pagar nada más."}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {GAMES.map((bonus, i) => (
            <motion.article
              key={bonus.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
            >
              <div className="grid aspect-[2/3] place-items-center bg-primary-soft">
                <img
                  src={bonus.game!.img}
                  alt={
                    hi
                      ? `${bonus.name} का कवर — Framers पैक में मुफ्त बोनस`
                      : `Portada de ${bonus.name} — bonus gratis en el pack Framers`
                  }
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-semibold" title={bonus.name}>
                  {bonus.name}
                </h3>
                <p className="mt-0.5 text-xs">
                  <span className="text-muted-foreground line-through">{format(bonus.value)}</span>{" "}
                  <span className="font-bold text-primary">{hi ? "मुफ्त" : "GRATIS"}</span>
                </p>
              </div>
              <span className="absolute right-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                {hi ? "बोनस" : "Bonus"}
              </span>
            </motion.article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {hi ? "बोनस का कुल मूल्य: " : "Valor total de los bonus: "}
          <span className="font-semibold text-foreground line-through">{format(TOTAL)}</span>{" "}
          {hi ? " · आज, एक प्रतीकात्मक कीमत में।" : " · Hoy, por un precio simbólico."}
        </p>

        <div className="mt-6 text-center">
          <Cta location="bonus">{t.ctaBonus}</Cta>
        </div>
      </div>
    </section>
  );
}
