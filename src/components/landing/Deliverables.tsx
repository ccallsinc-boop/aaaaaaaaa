import {
  Gamepad2,
  Zap,
  Infinity as InfinityIcon,
  RefreshCw,
  Download,
  Wrench,
  Headphones,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Cta } from "@/components/landing/Cta";
import { useLocale } from "@/lib/locale";
import proof1 from "@/assets/proof-1.jpg.asset.json";
import proof2 from "@/assets/proof-2.jpg.asset.json";
import proof3 from "@/assets/proof-3.jpg.asset.json";

const PHOTOS = [proof1, proof2, proof3];

const PHOTO_COPY = {
  pt: {
    title: "Fotos enviadas pelos clientes",
    alts: [
      "Cliente jogando Forza Horizon no PC",
      "Cliente jogando GTA V no notebook",
      "Cliente jogando EA FC na TV",
    ],
  },
  en: {
    title: "Photos sent by our customers",
    alts: [
      "Customer playing Forza Horizon on PC",
      "Customer playing GTA V on a laptop",
      "Customer playing EA FC on TV",
    ],
  },
  es: {
    title: "Fotos enviadas por los clientes",
    alts: [
      "Cliente jugando Forza Horizon en PC",
      "Cliente jugando GTA V en el portátil",
      "Cliente jugando EA FC en la TV",
    ],
  },
  hi: {
    title: "ग्राहकों द्वारा भेजी गई तस्वीरें",
    alts: [
      "ग्राहक PC पर Forza Horizon खेलते हुए",
      "ग्राहक लैपटॉप पर GTA V खेलते हुए",
      "ग्राहक TV पर EA FC खेलते हुए",
    ],
  },
} as const;

const ICONS = [
  Gamepad2,
  Zap,
  InfinityIcon,
  RefreshCw,
  Download,
  Wrench,
  Headphones,
  ShieldCheck,
  Wallet,
];

export function Deliverables() {
  const { t, money, pricePerGame, lang } = useLocale();
  const items = t.deliverables(money(Math.max(pricePerGame, 0.01)));
  const photoCopy =
    PHOTO_COPY[
      lang === "uk" ? "en" : lang === "es2" ? "es" : lang === "in" ? "hi" : lang
    ];

  return (
    <section id="como-funciona" className="border-t border-border py-20">
      <div className="mx-auto max-w-7xl px-5">
        <h2 className="mx-auto max-w-2xl text-center text-[clamp(1.8rem,4.5vw,3rem)]">
          {t.deliverablesTitleA}
          <br />
          {t.deliverablesTitleB}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          {t.deliverablesSub}
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, desc], i) => {
            const Icon = ICONS[i] ?? Gamepad2;
            return (
              <div
                key={title}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Cta location="deliverables">{t.ctaDeliverables}</Cta>
        </div>

        {lang !== "es" && (
          <>
            <p className="mt-12 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {photoCopy.title}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {PHOTOS.map((photo, i) => (
                <img
                  key={photo.url}
                  src={photo.url}
                  alt={photoCopy.alts[i]}
                  loading="lazy"
                  className="h-64 w-full rounded-2xl border border-border object-cover sm:h-72"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
