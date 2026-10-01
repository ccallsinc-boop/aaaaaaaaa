import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDollarSign,
  Download,
  Gamepad2,
  Gauge,
  Gift,
  Infinity as InfinityIcon,
  Monitor,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/landing/Logo";
import { CATALOG, type CatalogGame } from "@/data/catalog";
import { useMarket } from "@/lib/use-market";
import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";
import { HOTMART_CHECKOUT_URL } from "@/lib/checkout";
import { ASSETS } from "@/lib/assets";

export const ES_QUIZ_CHECKOUT = HOTMART_CHECKOUT_URL;
export const ES_QUIZ_HOTMART = HOTMART_CHECKOUT_URL;

const HOTMART_SRC = "https://static.hotmart.com/checkout/widget.min.js";
const HOTMART_CSS = "https://static.hotmart.com/css/hotmart-fb.min.css";

// The Hotmart widget binds to `.hotmart-fb` anchors when its script loads,
// so it must be (re)loaded after the checkout button exists in the DOM.
function loadHotmartWidget() {
  if (!document.querySelector(`link[href="${HOTMART_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = HOTMART_CSS;
    document.head.appendChild(link);
  }
  document.querySelectorAll(`script[src="${HOTMART_SRC}"]`).forEach((el) => el.remove());
  const script = document.createElement("script");
  script.src = HOTMART_SRC;
  script.async = true;
  document.head.appendChild(script);
}

const TOTAL_SCREENS = 10;

type Answer = { id: string; title: string; detail: string; icon: typeof Gamepad2 };
type Question = { eyebrow: string; title: string; subtitle: string; answers: Answer[] };

const QUESTIONS: Question[] = [
  {
    eyebrow: "AMERICAN SIMULACRUM Y PACK DE JUEGOS",
    title: "¿Qué tipo de juego nunca puede faltar en tu PC?",
    subtitle: "Elige la opción que más se parece a ti.",
    answers: [
      {
        id: "accion",
        title: "Acción y aventura",
        detail: "Mundos abiertos, combates e historias",
        icon: Trophy,
      },
      {
        id: "rpg",
        title: "RPG y fantasía",
        detail: "Exploración, progreso y grandes desafíos",
        icon: Sparkles,
      },
      { id: "deportes", title: "Deportes", detail: "Fútbol, lucha y competición", icon: Gamepad2 },
      { id: "carreras", title: "Carreras", detail: "Velocidad, coches y simulación", icon: Gauge },
    ],
  },
  {
    eyebrow: "Tus favoritos",
    title: "¿Qué saga te gustaría jugar primero?",
    subtitle: "Todas están dentro del mismo pack.",
    answers: [
      {
        id: "gta",
        title: "Grand Theft Auto",
        detail: "GTA III, Vice City, San Andreas, IV y V",
        icon: Trophy,
      },
      {
        id: "red-dead",
        title: "Red Dead Redemption",
        detail: "El lejano oeste en un mundo vivo",
        icon: Gamepad2,
      },
      {
        id: "assassins",
        title: "Assassin's Creed",
        detail: "La saga completa para explorar",
        icon: Sparkles,
      },
      {
        id: "resident",
        title: "Resident Evil",
        detail: "Supervivencia y terror clásico",
        icon: Zap,
      },
    ],
  },
  {
    eyebrow: "Tu equipo",
    title: "¿Cómo describirías tu PC?",
    subtitle: "Esto nos ayuda a mostrarte el beneficio más importante.",
    answers: [
      {
        id: "basico",
        title: "Básico",
        detail: "Necesito juegos ligeros y optimización",
        icon: Monitor,
      },
      {
        id: "medio",
        title: "Intermedio",
        detail: "Puedo jugar la mayoría de los títulos",
        icon: Gauge,
      },
      {
        id: "potente",
        title: "Potente",
        detail: "Quiero aprovechar gráficos al máximo",
        icon: Zap,
      },
      {
        id: "no-se",
        title: "No estoy seguro",
        detail: "Prefiero recibir ayuda para elegir",
        icon: Gamepad2,
      },
    ],
  },
  {
    eyebrow: "Tu prioridad",
    title: "¿Qué valoras más al comprar juegos?",
    subtitle: "Selecciona tu principal prioridad.",
    answers: [
      {
        id: "variedad",
        title: "Tener mucha variedad",
        detail: "Cambiar de juego cuando quiera",
        icon: Gamepad2,
      },
      {
        id: "facil",
        title: "Instalación sencilla",
        detail: "Tutorial claro, paso a paso",
        icon: Download,
      },
      {
        id: "rendimiento",
        title: "Buen rendimiento",
        detail: "Ajustes para que el PC funcione mejor",
        icon: Gauge,
      },
      {
        id: "soporte",
        title: "Soporte humano",
        detail: "Ayuda real cuando la necesite",
        icon: ShieldCheck,
      },
    ],
  },
  {
    eyebrow: "Última pregunta",
    title: "¿Cuánto sueles pagar por un solo juego?",
    subtitle: "Tu respuesta no cambia el precio de la oferta.",
    answers: [
      {
        id: "menos-10",
        title: "Menos de €10",
        detail: "Busco siempre la mejor oferta",
        icon: CircleDollarSign,
      },
      {
        id: "10-30",
        title: "Entre €10 y €30",
        detail: "Compro cuando vale la pena",
        icon: CircleDollarSign,
      },
      {
        id: "30-60",
        title: "Entre €30 y €60",
        detail: "Pago por buenos títulos",
        icon: CircleDollarSign,
      },
      {
        id: "mas-60",
        title: "Más de €60",
        detail: "Quiero jugar los lanzamientos",
        icon: CircleDollarSign,
      },
    ],
  },
];

const GAME_GROUPS: Record<string, string[]> = {
  accion: [
    "GTA: V",
    "Red Dead Redemption 2",
    "God of War: Ragnarok",
    "Spider-Man: Remastered",
    "Batman: Arkham Knight",
    "Far Cry 5",
  ],
  rpg: [
    "Elden Ring",
    "Hogwarts Legacy",
    "Dark Souls 3",
    "Fallout 4",
    "The Witcher 3: Wild Hunt",
    "Sekiro: Shadows Die Twice",
  ],
  deportes: [
    "FIFA 22",
    "Mortal Kombat 11",
    "TEKKEN 8",
    "WWE 2K24",
    "eFootball 2024",
    "Rocket League",
  ],
  carreras: [
    "Forza Horizon 5",
    "Assetto Corsa",
    "Euro Truck Simulator 2",
    "Need for Speed: Heat",
    "BeamNG Drive",
    "F1 2025",
  ],
};

const FALLBACK_GAMES = [
  "GTA: V",
  "Red Dead Redemption 2",
  "Elden Ring",
  "God of War: Ragnarok",
  "Spider-Man: Remastered",
  "Hogwarts Legacy",
];

function gamesFor(answer?: string) {
  const requested = GAME_GROUPS[answer ?? ""] ?? FALLBACK_GAMES;
  const games = requested
    .map((name) => CATALOG.find((game) => game.name.toLowerCase() === name.toLowerCase()))
    .filter((game): game is CatalogGame => Boolean(game?.img));
  if (games.length >= 4) return games;
  return FALLBACK_GAMES.map((name) => CATALOG.find((game) => game.name === name)).filter(
    (game): game is CatalogGame => Boolean(game?.img),
  );
}

const PROOFS = [
  { image: ASSETS.proof[0], alt: "Cliente jugando Forza Horizon en PC" },
  { image: ASSETS.proof[1], alt: "Cliente jugando GTA V en un portátil" },
  { image: ASSETS.proof[2], alt: "Cliente jugando EA FC en televisión" },
];

const TESTIMONIALS = [
  {
    name: "Pablo Núñez",
    place: "Buenos Aires · AR",
    text: "El acceso llegó al correo en pocos minutos. Empecé por GTA V y todo fue mucho más sencillo de lo que esperaba.",
  },
  {
    name: "Camila Torres",
    place: "Bogotá · CO",
    text: "El tutorial me guió paso a paso. Ya tengo varios juegos instalados y el soporte respondió cuando tuve una duda.",
  },
  {
    name: "Diego Martín",
    place: "Santiago · CL",
    text: "La variedad es enorme. Por el precio de una oferta pequeña recibí juegos para meses y acceso de por vida.",
  },
];

const BENEFITS = [
  {
    icon: Gamepad2,
    title: "12 juegos",
    text: "Acción, deportes, carreras, RPG, terror y mucho más.",
  },
  {
    icon: Download,
    title: "Entrega inmediata",
    text: "Recibes el acceso y el tutorial después del pago.",
  },
  {
    icon: InfinityIcon,
    title: "Acceso de por vida",
    text: "Un solo pago, sin suscripción ni mensualidades.",
  },
  {
    icon: Gauge,
    title: "Pack de optimización",
    text: "Ajustes preparados para mejorar el rendimiento.",
  },
  {
    icon: BadgeCheck,
    title: "Soporte humano",
    text: "Ayuda real para instalar y empezar a jugar.",
  },
  {
    icon: ShieldCheck,
    title: "7 días de garantía",
    text: "Puedes probar la compra con tranquilidad.",
  },
];

export function EsGameQuiz({
  checkoutUrl = ES_QUIZ_CHECKOUT,
  hotmartWidget = false,
}: {
  checkoutUrl?: string;
  hotmartWidget?: boolean;
}) {
  const resolved = useMarket();
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const results = useMemo(() => gamesFor(answers[0]), [answers]);
  // Price comes from the single BRL base converted at the live rate, same as the
  // landing. There is no allow-list of "local" currencies any more.
  const price = resolved.price;
  const currency = resolved.market.currency;

  useEffect(() => {
    trackMetaCustom("QuizView", { funnel: "es-games", screen: 1 });
  }, []);

  useEffect(() => {
    if (screen === 6)
      trackMetaCustom("QuizComplete", { funnel: "es-games", total_questions: QUESTIONS.length });
    if (screen === 9)
      trackMetaCustom("QuizOfferView", { funnel: "es-games", value: price, currency });
  }, [currency, price, screen]);

  const choose = (id: string) => {
    const question = QUESTIONS[screen];
    setAnswers((current) => ({ ...current, [screen]: id }));
    trackMetaCustom("QuizAnswer", {
      funnel: "es-games",
      step: screen + 1,
      question: question.eyebrow,
      answer: id,
    });
    if (screen === 0) trackMetaCustom("QuizStart", { funnel: "es-games" });
    window.setTimeout(() => setScreen((value) => Math.min(value + 1, TOTAL_SCREENS - 1)), 180);
  };

  const advance = (eventName: string) => {
    trackMetaCustom(eventName, { funnel: "es-games", screen: screen + 1 });
    setScreen((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setScreen((value) => Math.max(value - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    void video.play();
    setVideoPlaying(true);
    trackMetaCustom("QuizVSLPlay", { funnel: "es-games" });
  };

  const checkout = () => {
    trackMetaCustom("QuizCheckoutClick", { funnel: "es-games", value: price, currency });
    trackMeta("InitiateCheckout", {
      value: price,
      currency,
      content_name: "Pack Framers Completo",
      content_type: "product",
      content_ids: ["pacote-framers"],
      cta_location: "es-quiz:final",
      quiz_answers: Object.values(answers).join(","),
    });
  };

  return (
    <main className="theme-quiz-es min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-10">
      <header className="relative z-40 mx-auto max-w-5xl rounded-t-3xl border border-b-0 border-border bg-card px-6 pt-6 sm:px-12 sm:pt-9">
        <div className="flex items-center justify-center">
          <Logo className="h-16 sm:h-20" />
        </div>
        <div className="mt-7 pb-7 sm:mt-9">
          <div className="mb-3 flex items-end justify-between gap-4">
            <span className="text-xs font-bold uppercase sm:text-sm">
              {screen < 5 ? `Pregunta ${String(screen + 1).padStart(2, "0")}` : "Tu selección"}
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              {Math.round(((screen + 1) / TOTAL_SCREENS) * 100)}% completado
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-muted"
            aria-label={`Progreso ${screen + 1} de ${TOTAL_SCREENS}`}
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl rounded-b-3xl border border-t-0 border-border bg-card px-6 pb-8 sm:px-12 sm:pb-12">
        {screen > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={back}
            className="mb-5 rounded-full px-0 text-foreground hover:bg-transparent hover:underline"
          >
            <ArrowLeft /> Volver
          </Button>
        )}

        <AnimatePresence mode="wait">
          <motion.section
            key={screen}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
          >
            {screen < QUESTIONS.length && (
              <QuestionScreen
                question={QUESTIONS[screen]}
                selected={answers[screen]}
                onChoose={choose}
              />
            )}

            {screen === 5 && <AnalysisScreen onContinue={() => advance("QuizAnalysisComplete")} />}
            {screen === 6 && (
              <ResultScreen games={results} onContinue={() => advance("QuizGamesView")} />
            )}
            {screen === 7 && (
              <VslScreen
                videoRef={videoRef}
                playing={videoPlaying}
                onPlay={startVideo}
                onContinue={() => advance("QuizVSLComplete")}
              />
            )}
            {screen === 8 && <ProofScreen onContinue={() => advance("QuizProofView")} />}
            {screen === 9 && (
              <OfferScreen
                checkoutUrl={hotmartWidget ? ES_QUIZ_HOTMART : checkoutUrl}
                hotmartWidget={hotmartWidget}
                onCheckout={checkout}
              />
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}

function QuestionScreen({
  question,
  selected,
  onChoose,
}: {
  question: Question;
  selected?: string;
  onChoose: (id: string) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl text-left">
      <p className="text-xs font-bold uppercase text-muted-foreground">{question.eyebrow}</p>
      <h1 className="mt-3 max-w-2xl text-[clamp(2rem,7vw,3.6rem)]">{question.title}</h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">{question.subtitle}</p>
      <div className="mt-8 grid gap-3">
        {question.answers.map((answer) => {
          const Icon = answer.icon;
          return (
            <Button
              key={answer.id}
              type="button"
              variant="outline"
              onClick={() => onChoose(answer.id)}
              className={`group h-auto min-h-22 justify-start whitespace-normal rounded-xl border-2 p-5 text-left transition-all duration-200 hover:border-primary hover:bg-primary ${selected === answer.id ? "border-primary bg-primary" : "border-border bg-card"}`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-border bg-card text-foreground transition-colors group-hover:border-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-base font-bold">{answer.title}</span>
                <span className="mt-1 block text-sm font-normal text-muted-foreground">
                  {answer.detail}
                </span>
              </span>
              <span className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-border transition-colors group-hover:border-foreground">
                {selected === answer.id && (
                  <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
                )}
              </span>
            </Button>
          );
        })}
      </div>
      <p className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
        Tu respuesta solo se usa para personalizar esta experiencia.
      </p>
    </div>
  );
}

function AnalysisScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-auto max-w-2xl py-8 text-center">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground">
        <Sparkles className="h-9 w-9" />
      </span>
      <p className="mt-7 text-xs font-bold uppercase text-muted-foreground">Análisis completado</p>
      <h1 className="mt-4 text-[clamp(2rem,7vw,3.8rem)]">Encontramos el pack ideal para ti</h1>
      <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
        Tus respuestas indican que buscas variedad, facilidad y una forma más inteligente de
        descubrir nuevos juegos.
      </p>
      <div className="mx-auto mt-8 max-w-lg space-y-3 text-left">
        {[
          "Selección según tus preferencias",
          "Opciones para distintos niveles de PC",
          "Acceso organizado con tutorial incluido",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-xl border-2 border-border bg-card p-4 text-sm font-semibold"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" />
            </span>
            {item}
          </div>
        ))}
      </div>
      <Button
        size="lg"
        onClick={onContinue}
        className="mt-9 h-14 w-full rounded-full px-8 text-base font-bold sm:w-auto"
      >
        Ver mi selección <ArrowRight />
      </Button>
    </div>
  );
}

function ResultScreen({ games, onContinue }: { games: CatalogGame[]; onContinue: () => void }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase text-muted-foreground">Selección personalizada</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,7vw,3.8rem)]">
        Estos títulos encajan con tu perfil
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
        Y no tendrás que elegir solo uno: forman parte del mismo pack de 12 juegos.
      </p>
      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {games.map((game) => (
          <figure
            key={game.name}
            className="overflow-hidden rounded-xl border-2 border-border bg-card text-left shadow-soft"
          >
            <img
              src={game.img}
              alt={`Portada de ${game.name}`}
              className={`aspect-[2/3] w-full ${game.wide ? "object-contain" : "object-cover"}`}
            />
            <figcaption className="p-3 text-xs font-bold">{game.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border-2 border-primary bg-primary-soft p-5">
        <p className="font-display text-3xl text-foreground">+418 juegos</p>
        <p className="mt-1 text-sm text-muted-foreground">también incluidos en el mismo acceso</p>
      </div>
      <Button
        size="lg"
        onClick={onContinue}
        className="mt-8 h-14 w-full rounded-full px-8 text-base font-bold sm:w-auto"
      >
        Descubrir cómo funciona <ArrowRight />
      </Button>
    </div>
  );
}

function VslScreen({
  videoRef,
  playing,
  onPlay,
  onContinue,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  playing: boolean;
  onPlay: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-xs font-bold uppercase text-muted-foreground">Antes de continuar</p>
      <h1 className="mx-auto mt-4 max-w-2xl text-[clamp(2rem,7vw,3.8rem)]">
        Mira cómo recibes tu biblioteca y american simulacrum{" "}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Este video explica el acceso, la entrega y todo lo que viene incluido.
      </p>
      <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-border bg-foreground shadow-soft">
        <video
          ref={videoRef}
          src={ASSETS.vslEs}
          poster={ASSETS.vslEsPoster}
          className="aspect-video w-full"
          controls={playing}
          playsInline
          preload="metadata"
          onPlay={() => !playing && onPlay()}
        />
        {!playing && (
          <Button
            type="button"
            aria-label="Reproducir video"
            onClick={onPlay}
            className="absolute inset-0 h-full w-full rounded-none bg-foreground/40 hover:bg-foreground/50"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground">
              <Play className="h-9 w-9 fill-current" />
            </span>
          </Button>
        )}
      </div>
      <Button
        size="lg"
        onClick={onContinue}
        className="mt-8 h-14 w-full rounded-full px-8 text-base font-bold sm:w-auto"
      >
        Continuar con mi resultado <ArrowRight />
      </Button>
    </div>
  );
}

function ProofScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase text-muted-foreground">Clientes reales</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,7vw,3.8rem)]">
        Miles de jugadores ya recibieron su acceso
      </h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {PROOFS.map((proof) => (
          <img
            key={proof.image}
            src={proof.image}
            alt={proof.alt}
            className="h-72 w-full rounded-xl border-2 border-border object-cover"
          />
        ))}
      </div>
      <div className="mt-8 grid gap-3 text-left lg:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <article key={item.name} className="rounded-xl border-2 border-border bg-card p-5">
            <div className="flex gap-1 text-foreground" aria-label="5 de 5 estrellas">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed">“{item.text}”</p>
            <p className="mt-5 text-sm font-bold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.place}</p>
          </article>
        ))}
      </div>
      <Button
        size="lg"
        onClick={onContinue}
        className="mt-8 h-14 w-full rounded-full px-8 text-base font-bold sm:w-auto"
      >
        Ver todo lo que recibiré <ArrowRight />
      </Button>
    </div>
  );
}

function OfferScreen({
  checkoutUrl,
  hotmartWidget,
  onCheckout,
}: {
  checkoutUrl: string;
  hotmartWidget?: boolean;
  onCheckout: () => void;
}) {
  useEffect(() => {
    if (!hotmartWidget) return;
    // Load after the anchor is painted so the widget can bind to it.
    const id = window.setTimeout(loadHotmartWidget, 60);
    return () => window.clearTimeout(id);
  }, [hotmartWidget]);

  return (
    <div className="mx-auto max-w-4xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
        <Gift /> Oferta liberada para tu perfil
      </span>
      <h1 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,7vw,4rem)]">
        Tu biblioteca completa está lista
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Todo lo necesario para empezar hoy, en un solo acceso y sin mensualidades.
      </p>
      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-xl border-2 border-border bg-card p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </span>
            <h2 className="mt-3 text-base">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-xl rounded-2xl border-2 border-foreground bg-primary-soft p-6 shadow-soft sm:p-8">
        <p className="text-xs font-bold uppercase text-foreground">Pack Framers completo</p>
        <p className="mt-4 text-sm font-semibold text-foreground">
          Precio especial revelado en el checkout
        </p>
        <p className="mt-2 text-sm font-semibold">Pago único · acceso de por vida</p>
        <Button
          asChild
          size="lg"
          className="mt-6 h-14 w-full rounded-full bg-foreground text-base text-primary hover:bg-foreground/90"
        >
          <a
            href={checkoutUrl}
            onClick={onCheckout}
            className={hotmartWidget ? "hotmart-fb hotmart__button-checkout" : undefined}
          >
            Quiero mis 12 juegos <ArrowRight />
          </a>
        </Button>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck /> Compra segura · garantía de 7 días
        </p>
      </div>
    </div>
  );
}
