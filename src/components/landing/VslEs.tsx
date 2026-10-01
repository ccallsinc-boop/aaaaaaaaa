import { useRef, useState } from "react";
import { Play } from "lucide-react";
import vslAsset from "@/assets/vsl-es2.mov.asset.json";
import demoAsset from "@/assets/produto-funcionando.mp4.asset.json";
import proof1 from "@/assets/proof-1.jpg.asset.json";
import proof2 from "@/assets/proof-2.jpg.asset.json";
import proof3 from "@/assets/proof-3.jpg.asset.json";
import { useLocale } from "@/lib/locale";

const PHOTOS = [proof1, proof2, proof3];
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
        src={demoAsset.url}
        className="aspect-[1882/932] w-full"
        controls={playing}
        playsInline
        preload="metadata"
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
  const { lang } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // ES-only VSL section
  if (lang !== "es") return null;

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
          Te explicamos en 1 minuto cómo recibes los 424 juegos hoy mismo.
        </p>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-black shadow-soft">
          <video
            ref={videoRef}
            src={vslAsset.url}
            className="aspect-video w-full"
            controls={playing}
            playsInline
            preload="metadata"
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
          Así se ve la biblioteca con los 424 juegos al instante en tu PC.
        </p>
        <DemoVideo />

        <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Fotos enviadas por los clientes
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {PHOTOS.map((photo, index) => (
            <img
              key={photo.url}
              src={photo.url}
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
