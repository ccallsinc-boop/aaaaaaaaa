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
import { CATALOG, type CatalogGame } from "@/data/catalog";
import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";
import { HOTMART_CHECKOUT_URL } from "@/lib/checkout";
import { ASSETS } from "@/lib/assets";
// Still on Lovable: the English quiz has its own VSL, not the Spanish one.
import vslAsset from "@/assets/vsl2.mp4.asset.json";
import vslPoster from "@/assets/vsl2-poster.jpg.asset.json";

export const EN_QUIZ_CHECKOUT = HOTMART_CHECKOUT_URL;

const TOTAL_SCREENS = 10;

type Answer = { id: string; title: string; detail: string; icon: typeof Gamepad2 };
type Question = { eyebrow: string; title: string; subtitle: string; answers: Answer[] };

const QUESTIONS: Question[] = [
  {
    eyebrow: "Your style",
    title: "What kind of game can never be missing from your PC?",
    subtitle: "Pick the option that sounds most like you.",
    answers: [
      {
        id: "action",
        title: "Action & adventure",
        detail: "Open worlds, combat and story",
        icon: Trophy,
      },
      {
        id: "rpg",
        title: "RPG & fantasy",
        detail: "Exploration, progression and big challenges",
        icon: Sparkles,
      },
      {
        id: "sports",
        title: "Sports & fighting",
        detail: "Football, fighting and competition",
        icon: Gamepad2,
      },
      { id: "racing", title: "Racing", detail: "Speed, cars and simulation", icon: Gauge },
    ],
  },
  {
    eyebrow: "Your favourites",
    title: "Which saga do you want to play first?",
    subtitle: "They are all inside the same pack.",
    answers: [
      {
        id: "gta",
        title: "Grand Theft Auto",
        detail: "GTA III, Vice City, San Andreas, IV and V",
        icon: Trophy,
      },
      {
        id: "red-dead",
        title: "Red Dead Redemption",
        detail: "The old west in a living world",
        icon: Gamepad2,
      },
      {
        id: "assassins",
        title: "Assassin's Creed",
        detail: "The full saga to explore",
        icon: Sparkles,
      },
      { id: "resident", title: "Resident Evil", detail: "Classic survival horror", icon: Zap },
    ],
  },
  {
    eyebrow: "Your machine",
    title: "How would you describe your PC?",
    subtitle: "This helps us show the benefit that matters most to you.",
    answers: [
      {
        id: "basic",
        title: "Basic",
        detail: "I need lighter games and optimization",
        icon: Monitor,
      },
      { id: "mid", title: "Mid-range", detail: "I run most titles fine", icon: Gauge },
      { id: "powerful", title: "Powerful", detail: "I want maxed-out graphics", icon: Zap },
      { id: "not-sure", title: "Not sure", detail: "I'd rather get help choosing", icon: Gamepad2 },
    ],
  },
  {
    eyebrow: "Your priority",
    title: "What matters most when you buy games?",
    subtitle: "Select your main priority.",
    answers: [
      {
        id: "variety",
        title: "Lots of variety",
        detail: "Switch games whenever I want",
        icon: Gamepad2,
      },
      {
        id: "easy",
        title: "Simple install",
        detail: "A clear step-by-step tutorial",
        icon: Download,
      },
      {
        id: "performance",
        title: "Good performance",
        detail: "Tweaks so my PC runs better",
        icon: Gauge,
      },
      {
        id: "support",
        title: "Human support",
        detail: "Real help whenever I need it",
        icon: ShieldCheck,
      },
    ],
  },
  {
    eyebrow: "Last question",
    title: "How much do you usually pay for a single game?",
    subtitle: "Your answer does not change the offer price.",
    answers: [
      {
        id: "under-20",
        title: "Under $20",
        detail: "I always hunt for deals",
        icon: CircleDollarSign,
      },
      {
        id: "20-40",
        title: "Between $20 and $40",
        detail: "I buy when it's worth it",
        icon: CircleDollarSign,
      },
      {
        id: "40-60",
        title: "Between $40 and $60",
        detail: "I pay for great titles",
        icon: CircleDollarSign,
      },
      {
        id: "over-60",
        title: "More than $60",
        detail: "I want to play new releases",
        icon: CircleDollarSign,
      },
    ],
  },
];

const GAME_GROUPS: Record<string, string[]> = {
  action: [
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
  sports: [
    "FIFA 22",
    "Mortal Kombat 11",
    "TEKKEN 8",
    "WWE 2K24",
    "eFootball 2024",
    "Rocket League",
  ],
  racing: [
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
  { image: ASSETS.proof[0], alt: "Customer playing Forza Horizon on PC" },
  { image: ASSETS.proof[1], alt: "Customer playing GTA V on a laptop" },
  { image: ASSETS.proof[2], alt: "Customer playing EA FC on a TV" },
];

const TESTIMONIALS = [
  {
    name: "Ryan Mitchell",
    place: "Austin · TX",
    text: "Access landed in my inbox within minutes. I started with GTA V and it was far easier than I expected.",
  },
  {
    name: "Chloe Bennett",
    place: "Manchester · UK",
    text: "The tutorial walked me through every step. I already have several games installed and support replied fast.",
  },
  {
    name: "Daniel Cooper",
    place: "Toronto · CA",
    text: "The variety is huge. For the price of one small sale I got months of games and lifetime access.",
  },
];

const BENEFITS = [
  {
    icon: Gamepad2,
    title: "12 games",
    text: "Action, sports, racing, RPG, horror and much more.",
  },
  {
    icon: Download,
    title: "Instant delivery",
    text: "You get access and the tutorial right after payment.",
  },
  {
    icon: InfinityIcon,
    title: "Lifetime access",
    text: "One-time payment, no subscription or monthly fee.",
  },
  { icon: Gauge, title: "Optimization pack", text: "Ready-made tweaks to improve performance." },
  { icon: BadgeCheck, title: "Human support", text: "Real help to install and start playing." },
  {
    icon: ShieldCheck,
    title: "7-day guarantee",
    text: "Try your purchase with complete peace of mind.",
  },
];

export function EnGameQuiz({ checkoutUrl = EN_QUIZ_CHECKOUT }: { checkoutUrl?: string }) {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const results = useMemo(() => gamesFor(answers[0]), [answers]);
  const price = 5.3;
  const currency = "USD";

  useEffect(() => {
    trackMetaCustom("QuizView", { funnel: "en-games", screen: 1 });
  }, []);

  useEffect(() => {
    if (screen === 6)
      trackMetaCustom("QuizComplete", { funnel: "en-games", total_questions: QUESTIONS.length });
    if (screen === 9)
      trackMetaCustom("QuizOfferView", { funnel: "en-games", value: price, currency });
  }, [screen]);

  const choose = (id: string) => {
    const question = QUESTIONS[screen];
    setAnswers((current) => ({ ...current, [screen]: id }));
    trackMetaCustom("QuizAnswer", {
      funnel: "en-games",
      step: screen + 1,
      question: question.eyebrow,
      answer: id,
    });
    if (screen === 0) trackMetaCustom("QuizStart", { funnel: "en-games" });
    window.setTimeout(() => setScreen((value) => Math.min(value + 1, TOTAL_SCREENS - 1)), 180);
  };

  const advance = (eventName: string) => {
    trackMetaCustom(eventName, { funnel: "en-games", screen: screen + 1 });
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
    trackMetaCustom("QuizVSLPlay", { funnel: "en-games" });
  };

  const checkout = () => {
    trackMetaCustom("QuizCheckoutClick", { funnel: "en-games", value: price, currency });
    trackMeta("InitiateCheckout", {
      value: price,
      currency,
      content_name: "Framers Complete Pack",
      content_type: "product",
      content_ids: ["pacote-framers"],
      cta_location: "en-quiz:final",
      quiz_answers: Object.values(answers).join(","),
    });
  };

  return (
    <main className="theme-quiz min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <span className="font-display text-xl text-primary">FRAMERS</span>
          <span className="text-xs font-semibold text-muted-foreground">
            {screen < 5 ? `Step ${screen + 1} of 5` : "Your selection"}
          </span>
        </div>
        <div
          className="grid grid-cols-10 gap-1 px-1 pb-1"
          aria-label={`Progress ${screen + 1} of ${TOTAL_SCREENS}`}
        >
          {Array.from({ length: TOTAL_SCREENS }).map((_, index) => (
            <span
              key={index}
              className={`h-1 rounded-full ${index <= screen ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        {screen > 0 && (
          <Button variant="ghost" size="sm" onClick={back} className="mb-5 text-muted-foreground">
            <ArrowLeft /> Back
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
            {screen === 9 && <OfferScreen checkoutUrl={checkoutUrl} onCheckout={checkout} />}
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
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {question.eyebrow}
      </p>
      <h1 className="mx-auto mt-4 max-w-2xl text-[clamp(2rem,7vw,3.6rem)]">{question.title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{question.subtitle}</p>
      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {question.answers.map((answer) => {
          const Icon = answer.icon;
          return (
            <Button
              key={answer.id}
              type="button"
              variant="outline"
              onClick={() => onChoose(answer.id)}
              className={`h-auto min-h-24 justify-start whitespace-normal rounded-xl p-5 text-left ${selected === answer.id ? "border-primary bg-primary-soft" : "bg-card"}`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon />
              </span>
              <span>
                <span className="block text-base font-bold">{answer.title}</span>
                <span className="mt-1 block text-sm font-normal text-muted-foreground">
                  {answer.detail}
                </span>
              </span>
              <ArrowRight className="ml-auto text-muted-foreground" />
            </Button>
          );
        })}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        Your answer is only used to personalize this experience.
      </p>
    </div>
  );
}

function AnalysisScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-auto max-w-2xl py-8 text-center">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
        <Sparkles className="h-9 w-9" />
      </span>
      <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Analysis complete
      </p>
      <h1 className="mt-4 text-[clamp(2rem,7vw,3.8rem)]">We found the perfect pack for you</h1>
      <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
        Your answers show you want variety, an easy setup and a smarter way to discover new games.
      </p>
      <div className="mx-auto mt-8 max-w-lg space-y-3 text-left">
        {[
          "Selection built from your preferences",
          "Options for every level of PC",
          "Organized access with a tutorial included",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm font-semibold"
          >
            <Check className="text-primary" />
            {item}
          </div>
        ))}
      </div>
      <Button size="lg" onClick={onContinue} className="mt-9 h-13 w-full rounded-xl sm:w-auto">
        See my selection <ArrowRight />
      </Button>
    </div>
  );
}

function ResultScreen({ games, onContinue }: { games: CatalogGame[]; onContinue: () => void }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Personalized selection
      </p>
      <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,7vw,3.8rem)]">
        These titles match your profile
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
        And you don't have to pick just one: they all belong to the same 12-game pack.
      </p>
      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {games.map((game) => (
          <figure
            key={game.name}
            className="overflow-hidden rounded-lg border border-border bg-card text-left shadow-soft"
          >
            <img
              src={game.img}
              alt={`${game.name} cover`}
              className={`aspect-[2/3] w-full ${game.wide ? "object-contain" : "object-cover"}`}
            />
            <figcaption className="p-3 text-xs font-bold">{game.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-primary/25 bg-primary-soft p-5">
        <p className="font-display text-3xl text-primary">+418 games</p>
        <p className="mt-1 text-sm text-muted-foreground">also included in the same access</p>
      </div>
      <Button size="lg" onClick={onContinue} className="mt-8 h-13 w-full rounded-xl sm:w-auto">
        See how it works <ArrowRight />
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
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Before you continue
      </p>
      <h1 className="mx-auto mt-4 max-w-2xl text-[clamp(2rem,7vw,3.8rem)]">
        See how you get your library
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        This video explains the access, the delivery and everything included.
      </p>
      <div className="relative mt-8 overflow-hidden rounded-xl border border-border bg-foreground shadow-soft">
        <video
          ref={videoRef}
          src={vslAsset.url}
          poster={vslPoster.url}
          className="aspect-video w-full"
          controls={playing}
          playsInline
          preload="metadata"
          onPlay={() => !playing && onPlay()}
        />
        {!playing && (
          <Button
            type="button"
            aria-label="Play video"
            onClick={onPlay}
            className="absolute inset-0 h-full w-full rounded-none bg-foreground/40 hover:bg-foreground/50"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground">
              <Play className="h-9 w-9 fill-current" />
            </span>
          </Button>
        )}
      </div>
      <Button size="lg" onClick={onContinue} className="mt-8 h-13 w-full rounded-xl sm:w-auto">
        Continue with my result <ArrowRight />
      </Button>
    </div>
  );
}

function ProofScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Real customers</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,7vw,3.8rem)]">
        Thousands of players already got access
      </h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {PROOFS.map((proof) => (
          <img
            key={proof.image}
            src={proof.image}
            alt={proof.alt}
            className="h-72 w-full rounded-lg border border-border object-cover"
          />
        ))}
      </div>
      <div className="mt-8 grid gap-3 text-left lg:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <article key={item.name} className="rounded-lg border border-border bg-card p-5">
            <div className="flex gap-1 text-primary" aria-label="5 out of 5 stars">
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
      <Button size="lg" onClick={onContinue} className="mt-8 h-13 w-full rounded-xl sm:w-auto">
        See everything I get <ArrowRight />
      </Button>
    </div>
  );
}

function OfferScreen({ checkoutUrl, onCheckout }: { checkoutUrl: string; onCheckout: () => void }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-xs font-bold text-primary">
        <Gift /> Offer unlocked for your profile
      </span>
      <h1 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,7vw,4rem)]">
        Your complete library is ready
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Everything you need to start today, in a single access and with no monthly fee.
      </p>
      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-lg border border-border bg-card p-5">
            <Icon className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-base">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-xl rounded-xl border border-primary/30 bg-card p-6 shadow-soft sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Framers complete pack
        </p>
        <p className="mt-4 text-sm font-semibold text-primary">
          Special price revealed at checkout
        </p>
        <p className="mt-2 text-sm font-semibold">One-time payment · lifetime access</p>
        <Button asChild size="lg" className="mt-6 h-14 w-full rounded-xl text-base">
          <a href={checkoutUrl} onClick={onCheckout}>
            I want my 12 games <ArrowRight />
          </a>
        </Button>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck /> Secure checkout · 7-day guarantee
        </p>
      </div>
    </div>
  );
}
