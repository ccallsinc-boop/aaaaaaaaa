import { useServerFn } from "@tanstack/react-start";
import { Logo } from "@/components/landing/Logo";
import { ClipsPixel, trackClips } from "@/components/clips/ClipsPixel";
import { sendClipsEvent } from "@/components/clips/clips.functions";

export const CLIPS_PRICE = 7.29;
export const CLIPS_CHECKOUT = "https://xpag.global/pay/2Kf006h0";

const money = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
}).format(CLIPS_PRICE);

function Cta({
  children,
  location,
  variant = "solid",
  className = "",
}: {
  children: React.ReactNode;
  location: string;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const sendEvent = useServerFn(sendClipsEvent);
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold transition-transform hover:scale-[1.03]";
  const styles =
    variant === "solid"
      ? "bg-primary text-primary-foreground shadow-soft"
      : "border border-border bg-background text-foreground hover:border-primary/40";
  return (
    <a
      href={CLIPS_CHECKOUT}
      onClick={() => {
        trackClips("InitiateCheckout", {
          value: CLIPS_PRICE,
          currency: "EUR",
          content_name: "Framers Clips",
          content_type: "product",
          content_ids: ["framers-clips"],
          cta_location: `es-clips:${location}`,
        });
        sendEvent({
          data: {
            eventName: "InitiateCheckout",
            eventId: `clips-checkout-${Date.now()}`,
            eventSourceUrl: window.location.href,
            value: CLIPS_PRICE,
            currency: "EUR",
          },
        }).catch(() => {});
      }}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Sube tu vídeo",
    text: "Arrastra cualquier vídeo horizontal: MP4, MOV o WEBM de hasta 5 GB.",
  },
  {
    n: "02",
    title: "La IA encuentra los momentos",
    text: "El sistema analiza todo el vídeo y detecta automáticamente los mejores cortes.",
  },
  {
    n: "03",
    title: "Tú das el toque final",
    text: "Reencuadra, recorta, añade subtítulos y exporta en vertical hasta 4K.",
  },
];

const FEATURES = [
  {
    title: "Detección de momentos con IA",
    text: "La IA revisa tu vídeo y saca a la superficie los mejores momentos. Tú eliges los ganadores.",
  },
  {
    title: "Reencuadre pixel-perfect",
    text: "Coloca el recorte 9:16 sobre tu fuente 16:9 y usa keyframes para seguir la acción.",
  },
  {
    title: "Recorte de precisión",
    text: "Línea de tiempo con precisión de fotograma: dividir, cortar y exportar varios segmentos.",
  },
  {
    title: "Subtítulos con estilo",
    text: "Transcripción automática y control total de fuentes, tamaños, colores y animaciones.",
  },
  {
    title: "Editor multi-layout",
    text: "Plantillas listas para el formato vertical y cambio de encuadre a mitad del clip.",
  },
  {
    title: "Traducción inteligente",
    text: "Traduce la transcripción al idioma que quieras. El mismo clip, alcance global.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Con Framers Clips saqué 12 Shorts de un directo de dos horas. Antes tardaba un día entero.",
    name: "Valentina López",
    role: "Creadora de contenido",
  },
  {
    quote:
      "Convierto mis podcasts en clips listos para publicar en minutos. La IA acierta casi siempre.",
    name: "Gonzalo Orsi",
    role: "Emprendedor",
  },
  {
    quote:
      "Uso Framers Clips para todos los Shorts de mi canal. Encuentra los mejores momentos y yo solo publico.",
    name: "Matías Tessandori",
    role: "YouTuber",
  },
];

const FAQ = [
  {
    q: "¿El pago es único?",
    a: `Sí. Pagas una sola vez y obtienes acceso a la aplicación. Sin suscripción ni cobros recurrentes.`,
  },
  {
    q: "¿Necesito instalar algo?",
    a: "No. Framers Clips funciona en el navegador, desde el ordenador o el móvil.",
  },
  {
    q: "¿Qué formatos acepta?",
    a: "MP4, MOV y WEBM de hasta 5 GB por vídeo. Exportas en vertical 9:16 hasta 4K.",
  },
  {
    q: "¿Cómo recibo el acceso?",
    a: "Inmediatamente después del pago recibes el acceso por correo electrónico.",
  },
  {
    q: "¿Y si no me gusta?",
    a: "Tienes 7 días de garantía. Si no es para ti, escríbenos y te devolvemos el dinero.",
  },
];

export function ClipsPage() {
  return (
    <div className="theme-clips bg-background text-foreground">
      <ClipsPixel price={CLIPS_PRICE} />
      <main className="min-h-screen pb-24 md:pb-0">
        <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
            <a href="#top" className="flex items-center gap-2">
              <Logo variant="3d" className="h-8 w-auto" />
            </a>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#como" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Cómo funciona
              </a>
              <a href="#funciones" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Funciones
              </a>
              <a href="#precio" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Precio
              </a>
            </div>
            <Cta location="nav" className="px-5 py-2.5">
              Empezar ahora
            </Cta>
          </div>
        </nav>

        <header id="top" className="relative overflow-hidden">
          <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-12 text-center sm:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              EDICIÓN DE CLIPS CON IA
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-[clamp(2.2rem,7vw,4.4rem)]">
              Convierte vídeos largos en{" "}
              <span className="block text-primary">clips virales en minutos</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              La IA encuentra los mejores momentos de tu vídeo. Tú das el corte final.
              Acceso completo, pago único.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <Cta location="hero">Quiero mi acceso</Cta>
              <a
                href="#como"
                className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-sm font-bold transition-colors hover:border-primary/40 hover:text-primary"
              >
                Ver cómo funciona
              </a>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              Pago único · Sin suscripción · Garantía de 7 días
            </p>

            <div className="mt-12 rounded-3xl border border-border bg-card p-6 text-left shadow-soft sm:p-10">
              <div className="rounded-2xl border border-dashed border-primary/40 bg-secondary px-6 py-12 text-center">
                <p className="font-display text-xl text-foreground">Sube tu vídeo</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  MP4, MOV, WEBM · hasta 5 GB
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Clip 00:12 — 00:41", "Clip 04:03 — 04:38", "Clip 11:20 — 11:52"].map(
                  (c) => (
                    <div
                      key={c}
                      className="rounded-xl border border-border bg-secondary px-4 py-6 text-center text-xs font-semibold text-muted-foreground"
                    >
                      <span className="mb-2 block text-primary">9:16</span>
                      {c}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </header>

        <section id="como" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)]">
            De la subida al clip en 3 pasos
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-3xl border border-border bg-card p-7">
                <span className="font-display text-3xl text-primary">{s.n}</span>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="funciones" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)]">
            Todo lo que necesitas, nada de más
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            Pensado para creadores que publican todos los días.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl border border-border bg-card p-7">
                <h3 className="text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)]">
            Creadores que ya no vuelven atrás
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((tst) => (
              <figure key={tst.name} className="rounded-3xl border border-border bg-card p-7">
                <div className="text-primary" aria-hidden="true">
                  ★★★★★
                </div>
                <blockquote className="mt-3 text-sm text-foreground">
                  “{tst.quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{tst.name}</span> · {tst.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="precio" className="mx-auto max-w-3xl px-5 py-16">
          <div className="rounded-3xl border border-primary/40 bg-card p-8 text-center shadow-soft sm:p-12">
            <span className="inline-flex rounded-full bg-primary-soft px-4 py-1.5 text-xs font-bold text-primary">
              ACCESO COMPLETO
            </span>
            <p className="mt-6 font-display text-6xl text-primary">Precio especial en el checkout</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pago único. Sin suscripción ni renovaciones.
            </p>
            <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left text-sm">
              {[
                "Detección de momentos con IA",
                "Editor vertical 9:16 con keyframes",
                "Subtítulos automáticos personalizables",
                "Exportación hasta 4K sin marca de agua",
                "Traducción de transcripciones",
                "Acceso inmediato tras el pago",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Cta location="pricing" className="mt-9 w-full sm:w-auto">
              Quiero mi acceso
            </Cta>
            <p className="mt-4 text-xs text-muted-foreground">
              Garantía de 7 días · Pago seguro vía Hotmart
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)]">Preguntas frecuentes</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-border bg-card px-6 py-5"
              >
                <summary className="cursor-pointer text-sm font-bold">{item.q}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="border-t border-border px-5 py-12 text-center">
          <Logo variant="3d" className="mx-auto h-9 w-auto" />
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Framers. Todos los derechos reservados.
          </p>
        </footer>

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg text-primary">Acceso inmediato</p>
              <p className="text-[11px] text-muted-foreground">Pago único · acceso inmediato</p>
            </div>
            <Cta location="sticky" className="px-6 py-3">
              Empezar
            </Cta>
          </div>
        </div>
      </main>
    </div>
  );
}
