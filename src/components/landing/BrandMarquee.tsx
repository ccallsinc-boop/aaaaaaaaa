import { motion } from "framer-motion";
import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";

import rockstar from "@/assets/brands/rockstargames.svg";
import ubisoft from "@/assets/brands/ubisoft.svg";
import ea from "@/assets/brands/ea.svg";
import activision from "@/assets/brands/activision.svg";
import squareenix from "@/assets/brands/squareenix.svg";
import konami from "@/assets/brands/konami.svg";
import twok from "@/assets/brands/2k.svg";
import sega from "@/assets/brands/sega.svg";
import epicgames from "@/assets/brands/epicgames.svg";
import playstation from "@/assets/brands/playstation.svg";
import steam from "@/assets/brands/steam.svg";

const BRANDS = [
  { name: "Rockstar Games", src: rockstar },
  { name: "Ubisoft", src: ubisoft },
  { name: "Electronic Arts", src: ea },
  { name: "Activision", src: activision },
  { name: "Square Enix", src: squareenix },
  { name: "Konami", src: konami },
  { name: "2K Games", src: twok },
  { name: "SEGA", src: sega },
  { name: "Epic Games", src: epicgames },
  { name: "PlayStation", src: playstation },
  { name: "Steam", src: steam },
];

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...BRANDS, ...BRANDS];
  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {items.map((brand, i) => (
          <img
            key={`${brand.name}-${i}`}
            src={brand.src}
            alt={`Logo ${brand.name}`}
            loading="lazy"
            className="h-7 w-auto shrink-0 opacity-45 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-9"
          />
        ))}
      </motion.div>
    </div>
  );
}

export function BrandMarquee() {
  const { t } = useLocale();

  return (
    <section className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t.brandsTitle}
        </p>
      </div>
      <div className="relative mt-8 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Row />
        <div className="mt-5">
          <Row reverse />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-5 text-center">
        <Cta location="brands">{t.ctaBrands}</Cta>
      </div>
    </section>
  );
}
