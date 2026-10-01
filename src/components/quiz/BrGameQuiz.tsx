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
import { trackMeta, trackMetaCustom } from "@/lib/meta-pixel";
import { FRONT_CHECKOUT_URL } from "@/lib/checkout";
import { ASSETS } from "@/lib/assets";
// Still on Lovable: the Brazilian VSL has not been converted from QuickTime yet.
import vslAsset from "@/assets/vsl-br.mov.asset.json";

export const BR_QUIZ_CHECKOUT = FRONT_CHECKOUT_URL;

const TOTAL_SCREENS = 10;

type Answer = { id: string; title: string; detail: string; icon: typeof Gamepad2 };
type Question = { eyebrow: string; title: string; subtitle: string; answers: Answer[] };

const QUESTIONS: Question[] = [
  {
    eyebrow: "Seu estilo",
    title: "Que tipo de jogo nunca pode faltar no seu PC?",
    subtitle: "Escolha a opção que mais combina com você.",
    answers: [
      {
        id: "acao",
        title: "Ação e aventura",
        detail: "Mundos abertos, combate e história",
        icon: Trophy,
      },
      {
        id: "rpg",
        title: "RPG e fantasia",
        detail: "Exploração, evolução e grandes desafios",
        icon: Sparkles,
      },
      { id: "esportes", title: "Esportes", detail: "Futebol, luta e competição", icon: Gamepad2 },
      { id: "corrida", title: "Corrida", detail: "Velocidade, carros e simulação", icon: Gauge },
    ],
  },
  {
    eyebrow: "Seus favoritos",
    title: "Qual saga você quer jogar primeiro?",
    subtitle: "Todas estão dentro do mesmo pacote.",
    answers: [
      {
        id: "gta",
        title: "Grand Theft Auto",
        detail: "GTA III, Vice City, San Andreas, IV e V",
        icon: Trophy,
      },
      {
        id: "red-dead",
        title: "Red Dead Redemption",
        detail: "O velho oeste em um mundo vivo",
        icon: Gamepad2,
      },
      {
        id: "assassins",
        title: "Assassin's Creed",
        detail: "A saga completa para explorar",
        icon: Sparkles,
      },
      {
        id: "resident",
        title: "Resident Evil",
        detail: "Sobrevivência e terror clássico",
        icon: Zap,
      },
    ],
  },
  {
    eyebrow: "Sua máquina",
    title: "Como você descreveria o seu PC?",
    subtitle: "Isso ajuda a mostrar o benefício mais importante para você.",
    answers: [
      {
        id: "basico",
        title: "Básico",
        detail: "Preciso de jogos leves e otimização",
        icon: Monitor,
      },
      { id: "medio", title: "Intermediário", detail: "Rodo a maioria dos títulos", icon: Gauge },
      {
        id: "potente",
        title: "Potente",
        detail: "Quero aproveitar os gráficos no máximo",
        icon: Zap,
      },
      {
        id: "nao-sei",
        title: "Não tenho certeza",
        detail: "Prefiro receber ajuda para escolher",
        icon: Gamepad2,
      },
    ],
  },
  {
    eyebrow: "Sua prioridade",
    title: "O que você mais valoriza ao comprar jogos?",
    subtitle: "Selecione a sua principal prioridade.",
    answers: [
      {
        id: "variedade",
        title: "Ter muita variedade",
        detail: "Trocar de jogo quando quiser",
        icon: Gamepad2,
      },
      {
        id: "facil",
        title: "Instalação simples",
        detail: "Tutorial claro, passo a passo",
        icon: Download,
      },
      {
        id: "desempenho",
        title: "Bom desempenho",
        detail: "Ajustes para o PC rodar melhor",
        icon: Gauge,
      },
      {
        id: "suporte",
        title: "Suporte humano",
        detail: "Ajuda de verdade quando precisar",
        icon: ShieldCheck,
      },
    ],
  },
  {
    eyebrow: "Última pergunta",
    title: "Quanto você costuma pagar por um único jogo?",
    subtitle: "Sua resposta não muda o preço da oferta.",
    answers: [
      {
        id: "menos-50",
        title: "Menos de R$ 50",
        detail: "Busco sempre a melhor promoção",
        icon: CircleDollarSign,
      },
      {
        id: "50-150",
        title: "Entre R$ 50 e R$ 150",
        detail: "Compro quando vale a pena",
        icon: CircleDollarSign,
      },
      {
        id: "150-300",
        title: "Entre R$ 150 e R$ 300",
        detail: "Pago por bons títulos",
        icon: CircleDollarSign,
      },
      {
        id: "mais-300",
        title: "Mais de R$ 300",
        detail: "Quero jogar os lançamentos",
        icon: CircleDollarSign,
      },
    ],
  },
];

const GAME_GROUPS: Record<string, string[]> = {
  acao: [
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
  esportes: [
    "FIFA 22",
    "Mortal Kombat 11",
    "TEKKEN 8",
    "WWE 2K24",
    "eFootball 2024",
    "Rocket League",
  ],
  corrida: [
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
  { image: ASSETS.proof[0], alt: "Cliente jogando Forza Horizon no PC" },
  { image: ASSETS.proof[1], alt: "Cliente jogando GTA V em um notebook" },
  { image: ASSETS.proof[2], alt: "Cliente jogando EA FC na TV" },
];

const TESTIMONIALS = [
  {
    name: "Lucas Almeida",
    place: "São Paulo · SP",
    text: "O acesso chegou no e-mail em poucos minutos. Comecei pelo GTA V e foi muito mais simples do que eu esperava.",
  },
  {
    name: "Mariana Costa",
    place: "Belo Horizonte · MG",
    text: "O tutorial me guiou passo a passo. Já tenho vários jogos instalados e o suporte respondeu quando tive dúvida.",
  },
  {
    name: "Rafael Souza",
    place: "Curitiba · PR",
    text: "A variedade é enorme. Pelo preço de uma promoção pequena recebi jogos para meses e acesso vitalício.",
  },
];

const BENEFITS = [
  {
    icon: Gamepad2,
    title: "12 jogos",
    text: "Ação, esportes, corrida, RPG, terror e muito mais.",
  },
  {
    icon: Download,
    title: "Entrega imediata",
    text: "Você recebe o acesso e o tutorial após o pagamento.",
  },
  {
    icon: InfinityIcon,
    title: "Acesso vitalício",
    text: "Pagamento único, sem assinatura nem mensalidade.",
  },
  {
    icon: Gauge,
    title: "Pacote de otimização",
    text: "Ajustes prontos para melhorar o desempenho.",
  },
  {
    icon: BadgeCheck,
    title: "Suporte humano",
    text: "Ajuda de verdade para instalar e começar a jogar.",
  },
  {
    icon: ShieldCheck,
    title: "7 dias de garantia",
    text: "Você pode testar a compra com tranquilidade.",
  },
];

export function BrGameQuiz({ checkoutUrl = BR_QUIZ_CHECKOUT }: { checkoutUrl?: string }) {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const results = useMemo(() => gamesFor(answers[0]), [answers]);
  const price = 43.99;
  const currency = "BRL";

  useEffect(() => {
    trackMetaCustom("QuizView", { funnel: "br-games", screen: 1 });
  }, []);

  useEffect(() => {
    if (screen === 6)
      trackMetaCustom("QuizComplete", { funnel: "br-games", total_questions: QUESTIONS.length });
    if (screen === 9)
      trackMetaCustom("QuizOfferView", { funnel: "br-games", value: price, currency });
  }, [screen]);

  const choose = (id: string) => {
    const question = QUESTIONS[screen];
    setAnswers((current) => ({ ...current, [screen]: id }));
    trackMetaCustom("QuizAnswer", {
      funnel: "br-games",
      step: screen + 1,
      question: question.eyebrow,
      answer: id,
    });
    if (screen === 0) trackMetaCustom("QuizStart", { funnel: "br-games" });
    window.setTimeout(() => setScreen((value) => Math.min(value + 1, TOTAL_SCREENS - 1)), 180);
  };

  const advance = (eventName: string) => {
    trackMetaCustom(eventName, { funnel: "br-games", screen: screen + 1 });
    setScreen((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setScreen((value) => Math.max(value - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkout = () => {
    trackMetaCustom("QuizCheckoutClick", { funnel: "br-games", value: price, currency });
    trackMeta("InitiateCheckout", {
      value: price,
      currency,
      content_name: "Pacote Framers Completo",
      content_type: "product",
      content_ids: ["pacote-framers"],
      cta_location: "br-quiz:final",
      quiz_answers: Object.values(answers).join(","),
    });
  };

  return (
    <main className="theme-quiz-br min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-10">
      <header className="relative z-40 mx-auto max-w-5xl rounded-t-3xl border border-b-0 border-border bg-card px-6 pt-6 sm:px-12 sm:pt-9">
        <div className="flex items-center justify-center">
          <Logo className="h-16 sm:h-20" />
        </div>
        <div className="mt-7 pb-7 sm:mt-9">
          <div className="mb-3 flex items-end justify-between gap-4">
            <span className="text-xs font-bold uppercase sm:text-sm">
              {screen < 5 ? `Pergunta ${String(screen + 1).padStart(2, "0")}` : "Sua seleção"}
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              {Math.round(((screen + 1) / TOTAL_SCREENS) * 100)}% concluído
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-muted"
            aria-label={`Progresso ${screen + 1} de ${TOTAL_SCREENS}`}
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
            <ArrowLeft /> Voltar
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
            {screen === 7 && <VslScreen onContinue={() => advance("QuizVSLComplete")} />}
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
        Sua resposta é usada apenas para personalizar esta experiência.
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
      <p className="mt-7 text-xs font-bold uppercase text-muted-foreground">Análise concluída</p>
      <h1 className="mt-4 text-[clamp(2rem,7vw,3.8rem)]">Encontramos o pacote ideal para você</h1>
      <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
        Suas respostas mostram que você busca variedade, facilidade e um jeito mais inteligente de
        descobrir novos jogos.
      </p>
      <div className="mx-auto mt-8 max-w-lg space-y-3 text-left">
        {[
          "Seleção feita a partir das suas preferências",
          "Opções para diferentes níveis de PC",
          "Acesso organizado com tutorial incluído",
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
        Ver minha seleção <ArrowRight />
      </Button>
    </div>
  );
}

function ResultScreen({ games, onContinue }: { games: CatalogGame[]; onContinue: () => void }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase text-muted-foreground">Seleção personalizada</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,7vw,3.8rem)]">
        Estes títulos combinam com o seu perfil
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
        E você não precisa escolher só um: todos fazem parte do mesmo pacote de 12 jogos.
      </p>
      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {games.map((game) => (
          <figure
            key={game.name}
            className="overflow-hidden rounded-xl border-2 border-border bg-card text-left shadow-soft"
          >
            <img
              src={game.img}
              alt={`Capa de ${game.name}`}
              className={`aspect-[2/3] w-full ${game.wide ? "object-contain" : "object-cover"}`}
            />
            <figcaption className="p-3 text-xs font-bold">{game.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border-2 border-primary bg-primary-soft p-5">
        <p className="font-display text-3xl text-foreground">+418 jogos</p>
        <p className="mt-1 text-sm text-muted-foreground">também incluídos no mesmo acesso</p>
      </div>
      <Button
        size="lg"
        onClick={onContinue}
        className="mt-8 h-14 w-full rounded-full px-8 text-base font-bold sm:w-auto"
      >
        Descobrir como funciona <ArrowRight />
      </Button>
    </div>
  );
}

function VslScreen({ onContinue }: { onContinue: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    trackMetaCustom("QuizVSLPlay", { funnel: "br-games" });
    v.muted = false;
    void v.play();
    setPlaying(true);
  };

  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-xs font-bold uppercase text-muted-foreground">Antes de continuar</p>
      <h1 className="mx-auto mt-4 max-w-2xl text-[clamp(2rem,7vw,3.8rem)]">
        Veja como você recebe sua biblioteca
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Acesso imediato, entrega completa e tudo o que está incluído.
      </p>
      <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-border bg-black shadow-soft">
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
            aria-label="Reproduzir vídeo"
            className="absolute inset-0 grid place-items-center bg-black/40 transition-colors hover:bg-black/50"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform hover:scale-105">
              <Play className="h-9 w-9 fill-current" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <Button
        size="lg"
        onClick={onContinue}
        className="mt-8 h-14 w-full rounded-full px-8 text-base font-bold sm:w-auto"
      >
        Continuar com meu resultado <ArrowRight />
      </Button>
    </div>
  );
}

function ProofScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase text-muted-foreground">Clientes reais</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(2rem,7vw,3.8rem)]">
        Milhares de jogadores já receberam o acesso
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
            <div className="flex gap-1 text-foreground" aria-label="5 de 5 estrelas">
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
        Ver tudo o que vou receber <ArrowRight />
      </Button>
    </div>
  );
}

function OfferScreen({ checkoutUrl, onCheckout }: { checkoutUrl: string; onCheckout: () => void }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
        <Gift /> Oferta liberada para o seu perfil
      </span>
      <h1 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,7vw,4rem)]">
        Sua biblioteca completa está pronta
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Tudo o que você precisa para começar hoje, em um único acesso e sem mensalidade.
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
        <p className="text-xs font-bold uppercase text-foreground">Pacote Framers completo</p>
        <p className="mt-4 text-sm font-semibold text-foreground">
          Preço especial revelado no checkout
        </p>
        <p className="mt-2 text-sm font-semibold">Pagamento único · acesso vitalício</p>
        <Button
          asChild
          size="lg"
          className="mt-6 h-14 w-full rounded-full bg-foreground text-base text-primary hover:bg-foreground/90"
        >
          <a href={checkoutUrl} onClick={onCheckout}>
            Quero meus 12 jogos <ArrowRight />
          </a>
        </Button>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck /> Compra segura · garantia de 7 dias
        </p>
      </div>
    </div>
  );
}
