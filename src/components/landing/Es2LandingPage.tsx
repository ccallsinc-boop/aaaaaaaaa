import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Download, FileText, Mail, ShieldCheck, Star, Sun } from "lucide-react";
import { Cta } from "@/components/landing/Cta";
import { Reveal } from "@/components/landing/Reveal";
import { useLocale } from "@/lib/locale";
import { trackMeta } from "@/lib/meta-pixel";
import cover from "@/assets/ge/cover.jpg.asset.json";
import italian from "@/assets/ge/italian.jpg.asset.json";
import euromaxxing from "@/assets/ge/euromaxxing.jpg.asset.json";
import pyramid from "@/assets/ge/pyramid.jpg.asset.json";
import rawmilk from "@/assets/ge/rawmilk.jpg.asset.json";
import peat from "@/assets/ge/peat.jpg.asset.json";
import groceries from "@/assets/ge/groceries.jpg.asset.json";
import primal from "@/assets/ge/primal.jpg.asset.json";

const STEPS: [string, string, string][] = [
  ["1", "COMPRA", "Haz clic en el botón y completa el pago seguro."],
  ["2", "DESCARGA", "Recibes el PDF y el enlace de acceso en tu correo."],
  ["3", "APLICA", "Sigues el protocolo desde el primer desayuno."],
];

const PHOTOS = [
  { src: euromaxxing.url, alt: "Rutina de estilo de vida mediterráneo" },
  { src: italian.url, alt: "Vivir como un viejo italiano" },
  { src: groceries.url, alt: "Compra semanal pro-metabólica" },
  { src: pyramid.url, alt: "Pirámide alimentaria pro-metabólica" },
];

const BENEFITS: [string, string][] = [
  ["Protocolo completo", "Qué comer en cada comida, sin contar calorías ni pesar nada."],
  ["Cero PUFA", "Lista clara de aceites y alimentos que sabotean tu metabolismo."],
  ["Tiroides primero", "Cómo subir tu temperatura y tu energía con comida real."],
  ["Carbohidratos amigos", "Fruta, miel, jugo y raíces: energía sin inflamación."],
  ["Grasas correctas", "Mantequilla, coco, lácteos y huevos usados a tu favor."],
  ["Plan semanal", "7 días de menús listos para copiar y una lista de compras."],
  ["Estilo European Maxing", "Sol, mar, vino, siesta, caminar y comer sin prisa."],
  ["Acceso de por vida", "Pagas una vez, descargas cuando quieras, actualizaciones incluidas."],
  ["Entrega inmediata", "El PDF llega a tu correo en minutos, a cualquier hora."],
];

const BONUSES: [string, string, string][] = [
  ["Bonus 1", "Guía de compras", "Marcas, cortes y productos que sí valen la pena."],
  ["Bonus 2", "Recetario simple", "20 comidas pro-metabólicas de menos de 15 minutos."],
  ["Bonus 3", "Ritual mediterráneo", "Rutina diaria de sol, movimiento y descanso."],
];

const TESTIMONIALS = [
  {
    name: "Andrés M.",
    meta: "Madrid · España",
    text: "En tres semanas mis manos dejaron de estar frías y me despierto sin necesitar café. El PDF es directo, sin relleno.",
  },
  {
    name: "Valentina R.",
    meta: "Ciudad de México",
    text: "Comía 'sano' y vivía hinchada. Cambié los aceites y sumé fruta y miel: bajé de peso comiendo más.",
  },
  {
    name: "Joaquín P.",
    meta: "Buenos Aires · Argentina",
    text: "Lo mejor es el plan de 7 días. No tuve que pensar nada, solo seguirlo. Mi digestión cambió por completo.",
  },
  {
    name: "Lucía F.",
    meta: "Bogotá · Colombia",
    text: "La parte del estilo de vida vale el precio sola. Sol en la mañana, caminar, comer sin prisa. Tutto passa.",
  },
];

const INCLUDES = [
  "E-book completo Generative Energy en PDF",
  "Protocolo pro-metabólico paso a paso",
  "Lista de alimentos sí / no (PUFA fuera)",
  "Plan de 7 días con lista de compras",
  "3 bonus: compras, recetario y ritual diario",
  "Acceso de por vida y actualizaciones gratis",
  "Garantía de 7 días o te devolvemos el dinero",
];

const FAQ = [
  {
    q: "¿Qué recibo exactamente?",
    a: "Un e-book en PDF con el protocolo completo, más los bonus. Todo llega por correo con un enlace de acceso permanente.",
  },
  {
    q: "¿Cuánto tarda la entrega?",
    a: "Es automática. En pocos minutos después del pago recibes el correo con tu descarga, sea la hora que sea.",
  },
  {
    q: "¿Necesito comprar suplementos caros?",
    a: "No. Todo el protocolo se hace con comida de supermercado: fruta, lácteos, huevos, carne, miel, raíces y buenas grasas.",
  },
  {
    q: "¿Sirve si soy principiante?",
    a: "Sí. Está escrito en lenguaje simple, con menús listos para copiar desde el primer día.",
  },
  {
    q: "¿Y si no me gusta?",
    a: "Tienes 7 días para pedir el reembolso completo, sin preguntas.",
  },
];

export function Es2LandingPage() {
  const { storeUrl, price, currency } = useLocale();

  return (
    <main className="theme-ge min-h-screen bg-background pb-24 text-foreground md:pb-0">
      <header id="topo" className="px-5 pb-16 pt-10 sm:pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <img
            src={peat.url}
            alt="Ray Peat"
            className="mx-auto h-20 w-20 rounded-full border border-border object-cover shadow-soft sm:h-24 sm:w-24"
          />
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
            <Sun className="h-3.5 w-3.5" aria-hidden="true" /> E-book digital · acceso inmediato
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.35rem)] leading-tight">
            Recupera tu energía con la dieta <span className="text-primary">pro-metabólica.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Las ideas de Ray Peat — tiroides, carbohidratos de fácil digestión, grasas saturadas y cero PUFA —
            unidas al estilo de vida europeo: sol, mar, comida real y calma. Todo en un solo protocolo.
          </p>

          <div className="mx-auto mt-8 max-w-sm overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-soft">
            <img
              src={cover.url}
              alt="Portada del e-book Generative Energy"
              className="w-full rounded-2xl object-cover"
              loading="eager"
            />
          </div>

          <Cta className="mt-7 uppercase" location="es2-hero">
            Quiero mi e-book ahora
          </Cta>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase text-muted-foreground sm:gap-5">
            <span>+4 mil lectores</span>
            <span className="h-4 w-px bg-border" />
            <span>Entrega inmediata</span>
            <span className="h-4 w-px bg-border" />
            <span>Garantía de 7 días</span>
          </div>
        </div>
      </header>

      <section className="border-t border-border px-5 py-14">
        <div className="mx-auto max-w-5xl text-center">
          <FileText className="mx-auto h-7 w-7" aria-hidden="true" />
          <p className="mx-auto mt-3 max-w-3xl text-base font-bold leading-relaxed">
            Envío automático, sin importar la hora de la compra. Recibes el PDF por correo electrónico y tienes
            soporte para cualquier duda del protocolo.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map(([number, title, description], index) => {
              const Icon = index === 0 ? Check : index === 1 ? Download : Mail;
              return (
                <div key={number}>
                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-full border-2 border-foreground text-lg font-bold">
                    {number}
                  </span>
                  <Icon className="mx-auto mt-4 h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="mt-2 text-xl">{title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Reveal>
        <section className="border-t border-border px-5 py-16 text-center">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase text-primary">La vida que el protocolo construye</p>
            <h2 className="mt-3 text-[clamp(1.8rem,4.5vw,3rem)]">
              Comer como europeo, vivir sin prisa, tener energía todo el día
            </h2>
            <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {PHOTOS.map((photo) => (
                <img
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[3/4] w-full rounded-xl object-cover shadow-soft"
                  loading="lazy"
                />
              ))}
            </div>
            <p className="mt-5 text-sm font-bold text-muted-foreground">
              Sol, fruta, lácteos, buena carne y siesta: el método completo dentro del e-book.
            </p>
            <Cta className="mt-7 uppercase" location="es2-lifestyle">
              Quiero el protocolo completo
            </Cta>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-border px-5 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-bold uppercase text-primary">Qué hay dentro</p>
            <h2 className="mt-3 text-center text-[clamp(1.8rem,4.5vw,3rem)]">
              Todo lo que necesitas para empezar hoy
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-border bg-surface p-6 text-left">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-border px-5 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-bold uppercase text-primary">Bonus incluidos</p>
            <h2 className="mt-3 text-center text-[clamp(1.8rem,4.5vw,3rem)]">
              Tres extras que vienen con tu compra
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {BONUSES.map(([tag, title, text], i) => (
                <div key={title} className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <img
                    src={[groceries.url, rawmilk.url, primal.url][i]}
                    alt={title}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase text-primary">
                      {tag}
                    </span>
                    <h3 className="mt-3 text-lg">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-9 text-center">
              <Cta className="uppercase" location="es2-bonus">
                Quiero el e-book y los bonus
              </Cta>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-border px-5 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-bold uppercase text-primary">Quien ya lo aplica</p>
            <h2 className="mt-3 text-center text-[clamp(1.8rem,4.5vw,3rem)]">
              Más energía en las primeras semanas
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {TESTIMONIALS.map((item) => (
                <div key={item.name} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">{item.text}</p>
                  <p className="mt-4 text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.meta}</p>
                </div>
              ))}
            </div>
            <div className="mt-9 flex justify-center">
              <img
                src={peat.url}
                alt="Inspiración pro-metabólica"
                className="h-40 w-40 rounded-full object-cover shadow-soft"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="oferta" className="border-t border-border px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 rounded-3xl border border-border bg-surface p-7 shadow-soft sm:p-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Generative Energy · E-book + 3 bonus
                </p>
                <p className="mt-6 text-sm text-muted-foreground">
                  Todo el protocolo en un solo pago, con acceso de por vida y
                  entrega inmediata. Haz clic abajo para ver tu precio con
                  descuento.
                </p>
                <Cta className="mt-7 w-full uppercase sm:w-auto" location="es2-offer">
                  Descargar mi e-book ahora
                </Cta>
                <p className="mt-4 text-xs text-muted-foreground">
                  Pago único con tarjeta · riesgo cero con 7 días de garantía.
                </p>
              </div>

              <ul className="space-y-3.5">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-t border-border px-5 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-[clamp(1.8rem,4.5vw,2.6rem)]">Satisfacción garantizada, riesgo cero</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Tienes 7 días para leer el e-book, probar el protocolo y pedir el reembolso completo si no es para ti.
              Sin preguntas.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs font-bold uppercase text-muted-foreground">
              {["Compra 100% segura", "7 días de garantía", "Reembolso garantizado", "Soporte por correo"].map(
                (badge) => (
                  <span key={badge} className="rounded-full border border-border px-4 py-2">
                    {badge}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="faq" className="border-t border-border px-5 py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">FAQ</p>
            <h2 className="mt-3 text-center text-[clamp(1.8rem,4.5vw,3rem)]">Preguntas frecuentes</h2>
            <Accordion type="single" collapsible className="mt-10">
              {FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left text-base font-semibold">
                    <span className="mr-4 font-display text-sm text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-10 text-center">
              <Cta className="uppercase" location="es2-faq">
                Quiero empezar hoy
              </Cta>
            </div>
          </div>
        </section>
      </Reveal>

      <footer className="border-t border-border bg-surface px-5 py-14">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl">
              Generative <span className="text-primary">Energy</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Guía digital de alimentación pro-metabólica y estilo de vida mediterráneo. Entrega inmediata en PDF.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">Enlaces</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#oferta" className="transition-colors hover:text-foreground">
                  Oferta
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-foreground">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold">¿Listo para empezar?</p>
            <Cta className="mt-4 uppercase" location="es2-footer">
              Descargar mi e-book ahora
            </Cta>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-5xl text-xs text-muted-foreground">
          Contenido educativo. No sustituye consulta médica ni tratamiento profesional.
        </p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">E-book + 3 bonus</p>
            <p className="text-[11px] text-muted-foreground">PDF · acceso inmediato</p>
          </div>
          <a
            href={storeUrl}
            onClick={() =>
              trackMeta("InitiateCheckout", {
                value: price,
                currency,
                content_name: "Generative Energy",
                cta_location: "es2:sticky",
              })
            }
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Comprar
          </a>
        </div>
      </div>
    </main>
  );
}
