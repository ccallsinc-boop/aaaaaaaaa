import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { ASSETS } from "@/lib/assets";

const PHOTOS = ASSETS.proof;
const PHOTO_ALTS = [
  "Cliente jugando Forza Horizon en PC",
  "Cliente jugando GTA V en el portátil",
  "Cliente jugando EA FC en la TV",
];

function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    void v.play();
    setPlaying(true);
  };

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-black shadow-soft">
      <video
        ref={videoRef}
        src={ASSETS.demoVideo}
        poster={ASSETS.demoPoster}
        className="aspect-[1882/932] w-full"
        controls={playing}
        playsInline
        // The poster carries the first impression, so the file itself only
        // downloads once the visitor presses play.
        preload="none"
        onClick={() => {
          if (!playing) start();
        }}
      />
      {!playing && (
        <button
          type="button"
          onClick={start}
          aria-label="Ver el producto funcionando"
          className="absolute inset-0 grid place-items-center bg-black/40 transition-colors hover:bg-black/50"
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform hover:scale-105">
            <Play className="h-9 w-9 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}

export function VslEs() {
  const { marketLang } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // The VSL audio is in Spanish, so it only renders for Spanish-speaking markets.
  if (marketLang !== "es") return null;

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    void v.play();
    setPlaying(true);
  };

  return (
    <section aria-labelledby="vsl-title">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-[clamp(1.6rem,4vw,2.4rem)]">
          <span id="vsl-title">
            Mira este video antes de <span className="text-primary">conseguir tu pack</span>
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Te explicamos en 1 minuto cómo recibes los 12 juegos hoy mismo.
        </p>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-black shadow-soft">
          <video
            ref={videoRef}
            src={ASSETS.vslEs}
            poster={ASSETS.vslEsPoster}
            // The source is 900x890, so forcing 16:9 letterboxed it badly.
            className="aspect-square w-full"
            controls={playing}
            playsInline
            preload="none"
            onClick={() => {
              if (!playing) start();
            }}
          />
          {!playing && (
            <button
              type="button"
              onClick={start}
              aria-label="Reproducir video"
              className="absolute inset-0 grid place-items-center bg-black/40 transition-colors hover:bg-black/50"
            >
              <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform hover:scale-105">
                <Play className="h-9 w-9 fill-current" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>

        <h3 className="mt-12 text-[clamp(1.3rem,3vw,1.8rem)]">
          Mira el <span className="text-primary">producto funcionando</span>
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Así se ve tu biblioteca con los 12 juegos instalados en tu PC.
        </p>
        <DemoVideo />

        <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Fotos enviadas por los clientes
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {PHOTOS.map((photo, index) => (
            <img
              key={photo}
              src={photo}
              alt={PHOTO_ALTS[index]}
              loading="lazy"
              className="h-64 w-full rounded-2xl border border-border object-cover sm:h-72"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
