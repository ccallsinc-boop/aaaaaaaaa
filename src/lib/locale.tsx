import { createContext, useContext, type ReactNode } from "react";
import { FRONT_GAMES_COUNT } from "@/data/front-offer";
import { DEFAULT_CHECKOUT_URL, checkoutUrlFor } from "@/lib/checkout";
import {
  FALLBACK_RESOLVED,
  formatMoney,
  type MarketLang,
  type ResolvedMarket,
} from "@/lib/markets";

/** Language as pinned by the route. uk, es2 and in are variants, not new languages. */
export type Lang = "pt" | "en" | "uk" | "es" | "es2" | "in";

/** Route language to the language the market table speaks. */
const MARKET_LANG: Record<Lang, MarketLang> = {
  pt: "pt",
  en: "en",
  uk: "en",
  es: "es",
  es2: "es",
  in: "hi",
};

/**
 * Per-route config. Price, currency and number formatting are NOT here any more:
 * they come from the resolved market, converted live from BASE_PRICE_BRL. Keeping
 * them per route is what let the ES title say EUR 7.20 while the page charged
 * USD 3.90.
 */
const CONFIG = {
  pt: {
    lang: "pt" as Lang,
    storeUrl: DEFAULT_CHECKOUT_URL,
    home: "/pt",
    others: [] as { href: string; label: string }[],
  },
  en: {
    lang: "en" as Lang,
    storeUrl: DEFAULT_CHECKOUT_URL,
    home: "/en",
    others: [
      { href: "/", label: "PT" },
      { href: "/uk", label: "UK" },
      { href: "/es", label: "ES" },
    ],
  },
  uk: {
    lang: "uk" as Lang,
    storeUrl: DEFAULT_CHECKOUT_URL,
    home: "/uk",
    others: [
      { href: "/en", label: "EN" },
      { href: "/", label: "PT" },
      { href: "/es", label: "ES" },
    ],
  },
  es: {
    lang: "es" as Lang,
    storeUrl: DEFAULT_CHECKOUT_URL,
    home: "/es",
    others: [
      { href: "/", label: "PT" },
      { href: "/en", label: "EN" },
      { href: "/uk", label: "UK" },
    ],
  },
  in: {
    lang: "in" as Lang,
    storeUrl: DEFAULT_CHECKOUT_URL,
    home: "/in",
    others: [
      { href: "/en", label: "EN" },
      { href: "/uk", label: "UK" },
      { href: "/es", label: "ES" },
    ],
  },
  es2: {
    lang: "es2" as Lang,
    storeUrl: DEFAULT_CHECKOUT_URL,
    home: "/es2",
    others: [
      { href: "/", label: "PT" },
      { href: "/en", label: "EN" },
      { href: "/uk", label: "UK" },
    ],
  },
};

const COPY = {
  pt: {
    nav: [
      { label: "Biblioteca", href: "#jogos" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Oferta", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    navCta: "Quero meu acesso",
    heroBadge: (d: number) => `Os 12 mais pedidos · ${d}% OFF`,
    heroTitleA: "Nunca foi tão barato ter",
    heroTitleB: (n: number) => `${n} jogos`,
    heroSub: (price: string) =>
      `GTA V, Red Dead 2, Elden Ring, God of War Ragnarök, Hogwarts Legacy e mais 7 por ${price}. Pagamento único, entrega imediata e acesso vitalício.`,
    heroCta: "Quero garantir meu acesso",
    heroSecondary: "Ver a biblioteca",
    heroCompare: (full: string, save: string) => (
      <>
        <span className="line-through">{full}</span> comprando separado · economia de{" "}
        <span className="font-semibold text-foreground">{save}</span>
      </>
    ),
    heroAlt: (n: number) => `Prévia da biblioteca com ${n} jogos para PC`,
    heroMore: (n: number) => `+ ${n} títulos liberados na mesma compra`,
    stats: (price: string) =>
      [
        [price, "Pagamento único"],
        ["Imediato", "Acesso após o pagamento"],
        ["7 dias", "Garantia total"],
      ] as [string, string][],
    deliverablesTitleA: "Tudo que você precisa",
    deliverablesTitleB: "para jogar hoje mesmo",
    deliverablesSub:
      "Uma compra simples, sem assinatura, sem burocracia e com suporte de gente de verdade.",
    deliverables: (perGame: string) =>
      [
        ["Os 12 jogos liberados", "Todos de uma vez, sem escolher pacote nem pagar por título."],
        ["Entrega imediata", "Pagou, o acesso cai no seu e-mail em minutos."],
        ["Acesso vitalício", "Paga uma vez e continua com tudo, sem mensalidade."],
        ["Download direto", "Links organizados, rápidos e sem enrolação."],
        ["Pack de otimização", "Configurações prontas para rodar melhor em PC fraco."],
        ["Suporte humano", "Time no WhatsApp para ajudar na instalação."],
        ["Garantia de 7 dias", "Não gostou? Devolvemos 100% do valor."],
        [`Menos de ${perGame} por jogo`, "O preço de um jogo compra os 12."],
      ] as [string, string][],
    catalogEyebrow: "O que vem dentro",
    catalogTitle: (n: number) => `${n} jogos. Um preço só.`,
    catalogSub:
      "Os títulos mais pedidos, com capa oficial e download direto. Nada de lista inflada.",
    coverAlt: (name: string) => `Capa de ${name}`,
    offerEyebrow: (n: number) => `Pacote Framers Completo · ${n} jogos`,
    offerCompare: "Comprando separado:",
    offerToday: "Hoje, pagamento único de",
    offerPerGame: (n: number, price: string) => (
      <>
        {n} jogos · menos de <span className="font-semibold text-foreground">{price}</span> por jogo
      </>
    ),
    offerNote: "Pagamento único via PIX ou cartão · risco zero com 7 dias de garantia.",
    includes: (n: number) => [
      `Todos os ${n} jogos liberados de uma vez`,
      "Acesso vitalício: paga uma vez e é seu para sempre",
      "Tutorial de instalação em vídeo passo a passo",
      "Pack de otimização para PC fraco",
      "Suporte humano no WhatsApp",
      "Garantia de 7 dias ou dinheiro de volta",
    ],
    guaranteeTitle: "Satisfação garantida e risco zero",
    guaranteeSub: "7 dias para pedir reembolso integral, sem perguntas. O risco é todo nosso.",
    guaranteeBadges: [
      "Compra 100% segura",
      "7 dias de garantia",
      "Reembolso garantido",
      "Suporte humano",
    ],
    brandsTitle: "Estúdios e publishers presentes na biblioteca",
    testimonialsEyebrow: "Quem já comprou",
    testimonialsTitle: "Mais de 4.000 gamers já jogando",
    testimonialsSub:
      "Depoimentos reais de clientes que receberam o acesso e já estão com a biblioteca instalada.",
    testimonials: (price: string) => [
      {
        name: "Lucas Andrade",
        meta: "Belo Horizonte · MG",
        text: `Achei que era golpe por ${price}, mas o acesso chegou no e-mail em menos de 5 minutos. Já baixei GTA V e o RDR2 rodando liso.`,
      },
      {
        name: "Rafael Souza",
        meta: "Curitiba · PR",
        text: "O pack de otimização salvou meu PC velho. Rodei Elden Ring numa máquina que eu já tinha desistido. Suporte respondeu no WhatsApp em minutos.",
      },
      {
        name: "Pedro Henrique",
        meta: "São Paulo · SP",
        text: "Comprei desconfiado e já indiquei pra três amigos. Só o Red Dead 2 já pagou o valor muitas vezes.",
      },
      {
        name: "Camila Ribeiro",
        meta: "Recife · PE",
        text: "Instalação simples, tutorial em vídeo explicando tudo. Nunca tinha instalado jogo no PC e consegui sozinha.",
      },
      {
        name: "Diego Martins",
        meta: "Porto Alegre · RS",
        text: "Toda semana entram jogos novos e não pago nada a mais. Melhor compra que fiz no ano.",
      },
      {
        name: "Bruno Ferreira",
        meta: "Salvador · BA",
        text: "Pedi ajuda porque travou no download e me responderam na hora. Atendimento de gente de verdade, não robô.",
      },
    ],
    faqTitle: "Perguntas frequentes",

    faq: (price: string, n: number) => [
      {
        q: `É ${price} por todos os jogos?`,
        a: `Sim. Pagamento único de ${price} pelos ${n} jogos. Sem mensalidade e sem cobrança por título.`,
      },
      {
        q: "Quando recebo o acesso?",
        a: "Na hora. Assim que o pagamento é confirmado, o acesso chega por e-mail, normalmente em poucos minutos.",
      },
      {
        q: "Funciona no meu PC?",
        a: "Sim, os jogos são para PC (Windows) e vão com tutorial de instalação e pack de otimização para máquinas mais fracas.",
      },
      {
        q: "E se eu não gostar?",
        a: "Você tem 7 dias para pedir reembolso integral, sem perguntas. O risco é todo nosso.",
      },
    ],
    footerLinks: [
      { label: "Biblioteca", href: "#jogos" },
      { label: "Oferta", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    footerSub: (n: number, price: string) =>
      `${n} jogos para PC por ${price}, em pagamento único, com entrega digital imediata.`,
    footerLinksTitle: "Links rápidos",
    footerReady: "Pronto para jogar?",
    footerCta: (price: string) => `Garantir acesso por ${price}`,
    rights: "Todos os direitos reservados.",
    stickySub: (n: number) => `${n} jogos · pagamento único`,
    stickyCta: "Quero acesso",
    ctaVsl: "Quero ver o pack agora",
    ctaCatalog: "Quero esses jogos",
    ctaTestimonials: "Jogar como eles",
    ctaGuarantee: "Testar sem risco",
    ctaDeliverables: "Quero começar a jogar agora",
    ctaBrands: "Ver oferta completa",
    ctaFaq: "Ainda tem dúvidas? Garantir meu acesso",
    midCtas: [
      ["Pronto para começar a jogar hoje?", "Quero começar a jogar agora"],
      ["Escolheu seus favoritos? Leve todos de uma vez.", "Quero esses jogos"],
      ["Junte-se a mais de 4.000 gamers que já estão jogando", "Jogar como eles"],
      ["Teste sem risco, com 7 dias de garantia total", "Testar sem risco"],
    ] as [string, string][],
  },
  en: {
    nav: [
      { label: "Library", href: "#jogos" },
      { label: "How it works", href: "#como-funciona" },
      { label: "Offer", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    navCta: "Get instant access",
    heroBadge: (d: number) => `Full library · ${d}% OFF`,
    heroTitleA: "It has never been cheaper to own",
    heroTitleB: (n: number) => `${n} games`,
    heroSub: (price: string) =>
      `GTA V, Red Dead 2, Elden Ring, God of War Ragnarök, Hogwarts Legacy and 7 more for ${price}. One-time payment, instant delivery and lifetime access.`,
    heroCta: "Get my access now",
    heroSecondary: "Browse the library",
    heroCompare: (full: string, save: string) => (
      <>
        <span className="line-through">{full}</span> buying one by one · you save{" "}
        <span className="font-semibold text-foreground">{save}</span>
      </>
    ),
    heroAlt: (n: number) => `Preview of the library with ${n} PC games`,
    heroMore: (n: number) => `+ ${n} more titles included in the same purchase`,
    stats: (price: string) =>
      [
        [price, "One-time payment"],
        ["Instant", "Access after payment"],
        ["7 days", "Money-back guarantee"],
      ] as [string, string][],
    deliverablesTitleA: "Everything you need",
    deliverablesTitleB: "to start playing today",
    deliverablesSub:
      "A simple purchase, with no subscription, no bureaucracy, and real human support.",
    deliverables: (perGame: string) =>
      [
        ["All 12 games unlocked", "Every title at once, with no bundles to pick."],
        ["Instant delivery", "Once you pay, access lands in your inbox in minutes."],
        ["Lifetime access", "Pay once and keep everything. No monthly fees."],
        ["Direct download", "Organized, fast links with zero hassle."],
        ["Optimization pack", "Ready-made settings to run better on low-end PCs."],
        ["Human support", "A real team to help you with the installation."],
        ["7-day guarantee", "Not happy? We refund 100% of your money."],
        [`Less than ${perGame} per game`, "The price of one game buys all 12."],
      ] as [string, string][],
    catalogEyebrow: "What's inside",
    catalogTitle: (n: number) => `${n} games. One single price.`,
    catalogSub:
      "The titles people actually ask for, with official art and direct downloads. No padded list.",
    coverAlt: (name: string) => `${name} cover art`,
    offerEyebrow: (n: number) => `Complete Framers Pack · ${n} games`,
    offerCompare: "Buying separately:",
    offerToday: "Today, one-time payment of",
    offerPerGame: (n: number, price: string) => (
      <>
        {n} games · less than <span className="font-semibold text-foreground">{price}</span> per
        game
      </>
    ),
    offerNote: "One-time payment by card · zero risk with a 7-day guarantee.",
    includes: (n: number) => [
      `All ${n} games unlocked at once`,
      "Lifetime access: pay once and it is yours forever",
      "Step-by-step video installation tutorial",
      "Optimization pack for low-end PCs",
      "Human support over WhatsApp",
      "7-day money-back guarantee",
    ],
    guaranteeTitle: "Satisfaction guaranteed, zero risk",
    guaranteeSub: "7 days to request a full refund, no questions asked. The risk is all ours.",
    guaranteeBadges: [
      "100% secure checkout",
      "7-day guarantee",
      "Refund guaranteed",
      "Human support",
    ],
    brandsTitle: "Studios and publishers featured in the library",
    testimonialsEyebrow: "Verified buyers",
    testimonialsTitle: "Over 4,000 gamers already playing",
    testimonialsSub:
      "Real feedback from customers who got their access and already have the library installed.",
    testimonials: (price: string) => [
      {
        name: "Lucas Andrade",
        meta: "Manchester · UK",
        text: `I thought it was too good to be true for ${price}, but the access hit my inbox in under 5 minutes. GTA V and RDR2 running smooth already.`,
      },
      {
        name: "Ryan Mitchell",
        meta: "Austin · TX",
        text: "The optimization pack saved my old PC. Elden Ring runs on a machine I had already given up on. Support replied on WhatsApp within minutes.",
      },
      {
        name: "Peter Nowak",
        meta: "Chicago · IL",
        text: "Bought it sceptical and already told three friends. Red Dead 2 alone was worth more than the whole price.",
      },
      {
        name: "Camila Ribeiro",
        meta: "Lisbon · PT",
        text: "Simple install, with a video tutorial explaining everything. I had never installed a PC game before and managed on my own.",
      },
      {
        name: "Daniel Hughes",
        meta: "Leeds · UK",
        text: "Twelve games I actually wanted, for the price of a coffee. Installed in one afternoon.",
      },
      {
        name: "Bruno Ferreira",
        meta: "Miami · FL",
        text: "My download got stuck and they answered right away. Real people helping, not a bot.",
      },
    ],
    faqTitle: "Frequently asked questions",

    faq: (price: string, n: number) => [
      {
        q: `Is it ${price} for all the games?`,
        a: `Yes. A single ${price} payment for all ${n} games. No subscription and no per-title fees.`,
      },
      {
        q: "When do I get access?",
        a: "Right away. As soon as the payment is confirmed, access arrives by email, usually within minutes.",
      },
      {
        q: "Will it work on my PC?",
        a: "Yes, the games are for PC (Windows) and come with an installation tutorial and an optimization pack for weaker machines.",
      },
      {
        q: "What if I don't like it?",
        a: "You have 7 days to request a full refund, no questions asked. The risk is all ours.",
      },
    ],
    footerLinks: [
      { label: "Library", href: "#jogos" },
      { label: "Offer", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    footerSub: (n: number, price: string) =>
      `${n} PC games for ${price}, one-time payment, with instant digital delivery.`,
    footerLinksTitle: "Quick links",
    footerReady: "Ready to play?",
    footerCta: (price: string) => `Get access for ${price}`,
    rights: "All rights reserved.",
    stickySub: (n: number) => `${n} games · one-time payment`,
    stickyCta: "Get access",
    ctaVsl: "See the pack now",
    ctaCatalog: "I want these games",
    ctaTestimonials: "Join gamers already playing",
    ctaGuarantee: "Try risk-free",
    ctaDeliverables: "Start playing now",
    ctaBrands: "See full offer",
    ctaFaq: "Still have questions? Get access",
    midCtas: [
      ["Ready to start playing today?", "Start playing now"],
      ["Found your favorites? Take them all at once.", "I want these games"],
      ["Join over 4,000 gamers already playing", "Join gamers already playing"],
      ["Try it risk-free, with a 7-day full guarantee", "Try risk-free"],
    ] as [string, string][],
  },
};

const ES = {
  nav: [
    { label: "Biblioteca", href: "#jogos" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Oferta", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ],
  navCta: "Quiero mi acceso",
  heroBadge: (d: number) => `Los 12 más pedidos · ${d}% OFF`,
  heroTitleA: "Nunca fue tan barato tener",
  heroTitleB: (n: number) => `${n} juegos`,
  heroSub: (price: string) =>
    `GTA V, Red Dead 2, Elden Ring, God of War Ragnarök, Hogwarts Legacy y 7 más por ${price}. Pago único, entrega inmediata y acceso de por vida.`,
  heroCta: "Quiero asegurar mi acceso",
  heroSecondary: "Ver la biblioteca",
  heroCompare: (full: string, save: string) => (
    <>
      <span className="line-through">{full}</span> comprando por separado · ahorras{" "}
      <span className="font-semibold text-foreground">{save}</span>
    </>
  ),
  heroAlt: (n: number) => `Vista previa de la biblioteca con ${n} juegos de PC`,
  heroMore: (n: number) => `+ ${n} títulos incluidos en la misma compra`,
  stats: (price: string) =>
    [
      [price, "Pago único"],
      ["Inmediato", "Acceso tras el pago"],
      ["7 días", "Garantía total"],
    ] as [string, string][],
  deliverablesTitleA: "Todo lo que necesitas",
  deliverablesTitleB: "para jugar hoy mismo",
  deliverablesSub:
    "Una compra simple, sin suscripción, sin burocracia y con soporte de personas reales.",
  deliverables: (perGame: string) =>
    [
      ["Los 12 juegos desbloqueados", "Todos de una vez, sin elegir paquete ni pagar por título."],
      ["Entrega inmediata", "Pagas y el acceso llega a tu correo en minutos."],
      ["Acceso de por vida", "Pagas una vez y lo conservas todo, sin mensualidades."],
      ["Descarga directa", "Enlaces organizados, rápidos y sin complicaciones."],
      ["Pack de optimización", "Ajustes listos para rendir mejor en PC de gama baja."],
      ["Soporte humano", "Un equipo real para ayudarte con la instalación."],
      ["Garantía de 7 días", "¿No te gustó? Te devolvemos el 100% del dinero."],
      [`Menos de ${perGame} por juego`, "El precio de un juego compra los 12."],
    ] as [string, string][],
  catalogEyebrow: "Lo que incluye",
  catalogTitle: (n: number) => `${n} juegos. Un solo precio.`,
  catalogSub: "Los títulos más pedidos, con portada oficial y descarga directa. Sin lista inflada.",
  coverAlt: (name: string) => `Portada de ${name}`,
  offerEyebrow: (n: number) => `Pack Framers Completo · ${n} juegos`,
  offerCompare: "Comprando por separado:",
  offerToday: "Hoy, pago único de",
  offerPerGame: (n: number, price: string) => (
    <>
      {n} juegos · menos de <span className="font-semibold text-foreground">{price}</span> por juego
    </>
  ),
  offerNote: "Pago único con tarjeta · riesgo cero con 7 días de garantía.",
  includes: (n: number) => [
    `Los ${n} juegos desbloqueados de una vez`,
    "Acceso de por vida: pagas una vez y es tuyo para siempre",
    "Tutorial de instalación en video paso a paso",
    "Pack de optimización para PC de gama baja",
    "Soporte humano por WhatsApp",
    "Garantía de 7 días o te devolvemos el dinero",
  ],
  guaranteeTitle: "Satisfacción garantizada y riesgo cero",
  guaranteeSub:
    "7 días para pedir el reembolso completo, sin preguntas. El riesgo es todo nuestro.",
  guaranteeBadges: [
    "Compra 100% segura",
    "7 días de garantía",
    "Reembolso garantizado",
    "Soporte humano",
  ],
  brandsTitle: "Estudios y publishers presentes en la biblioteca",
  testimonialsEyebrow: "Quienes ya compraron",
  testimonialsTitle: "Más de 4.000 gamers ya jugando",
  testimonialsSub:
    "Opiniones reales de clientes que recibieron el acceso y ya tienen la biblioteca instalada.",
  testimonials: (price: string) => [
    {
      name: "Lucas Andrade",
      meta: "Madrid · ES",
      text: `Pensé que era demasiado bueno por ${price}, pero el acceso llegó a mi correo en menos de 5 minutos. Ya tengo GTA V y RDR2 corriendo perfectos.`,
    },
    {
      name: "Mateo Rivas",
      meta: "Ciudad de México · MX",
      text: "El pack de optimización salvó mi PC vieja. Elden Ring corre en una máquina que ya había dado por perdida. El soporte respondió en minutos.",
    },
    {
      name: "Pablo Núñez",
      meta: "Buenos Aires · AR",
      text: "Compré desconfiado y ya se lo recomendé a tres amigos. Solo Red Dead 2 vale mucho más que el precio entero.",
    },
    {
      name: "Camila Ribeiro",
      meta: "Bogotá · CO",
      text: "Instalación simple, con tutorial en video explicando todo. Nunca había instalado un juego en PC y lo logré sola.",
    },
    {
      name: "Diego Martín",
      meta: "Santiago · CL",
      text: "Cada semana entran juegos nuevos y no pago nada extra. La mejor compra del año.",
    },
    {
      name: "Bruno Ferreira",
      meta: "Lima · PE",
      text: "Se me trabó una descarga y me respondieron al instante. Personas reales ayudando, no un bot.",
    },
  ],
  faqTitle: "Preguntas frecuentes",
  faq: (price: string, n: number) => [
    {
      q: `¿Son ${price} por todos los juegos?`,
      a: `Sí. Un único pago de ${price} por los ${n} juegos. Sin mensualidad ni cobro por título.`,
    },
    {
      q: "¿Cuándo recibo el acceso?",
      a: "Al instante. En cuanto se confirma el pago, el acceso llega por correo, normalmente en pocos minutos.",
    },
    {
      q: "¿Funciona en mi PC?",
      a: "Sí, los juegos son para PC (Windows) e incluyen tutorial de instalación y pack de optimización para máquinas más débiles.",
    },
    {
      q: "¿Y si no me gusta?",
      a: "Tienes 7 días para pedir el reembolso completo, sin preguntas. El riesgo es todo nuestro.",
    },
  ],
  footerLinks: [
    { label: "Biblioteca", href: "#jogos" },
    { label: "Oferta", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ],
  footerSub: (n: number, price: string) =>
    `${n} juegos de PC por ${price}, en pago único, con entrega digital inmediata.`,
  footerLinksTitle: "Enlaces rápidos",
  footerReady: "¿Listo para jugar?",
  footerCta: (price: string) => `Conseguir acceso por ${price}`,
  rights: "Todos los derechos reservados.",
  stickySub: (n: number) => `${n} juegos · pago único`,
  stickyCta: "Quiero acceso",
  ctaVsl: "Ver el pack ahora",
  ctaCatalog: "Quiero estos juegos",
  ctaTestimonials: "Unirme a los que ya juegan",
  ctaGuarantee: "Probar sin riesgo",
  ctaDeliverables: "Quiero empezar a jugar ahora",
  ctaBrands: "Ver oferta completa",
  ctaFaq: "¿Todavía tienes dudas? Conseguir acceso",
  midCtas: [
    ["¿Listo para empezar a jugar hoy?", "Quiero empezar a jugar ahora"],
    ["¿Ya elegiste tus favoritos? Llévatelos todos de una vez.", "Quiero estos juegos"],
    ["Únete a más de 4.000 gamers que ya están jugando", "Unirme a los que ya juegan"],
    ["Pruébalo sin riesgo, con 7 días de garantía total", "Probar sin riesgo"],
  ] as [string, string][],
};

const HI = {
  nav: [
    { label: "लाइब्रेरी", href: "#jogos" },
    { label: "कैसे काम करता है", href: "#como-funciona" },
    { label: "ऑफर", href: "#oferta" },
    { label: "सवाल-जवाब", href: "#faq" },
  ],
  navCta: "अभी एक्सेस लें",
  heroBadge: (d: number) => `पूरी लाइब्रेरी · ${d}% छूट`,
  heroTitleA: "इतने कम में पहले कभी नहीं मिले",
  heroTitleB: (n: number) => `${n} गेम्स`,
  heroSub: (price: string) =>
    `GTA V, Red Dead 2, Elden Ring, God of War Ragnarök, Hogwarts Legacy और 7 और सिर्फ ${price} में। एक बार भुगतान, तुरंत डिलीवरी और लाइफटाइम एक्सेस।`,
  heroCta: "मुझे अभी एक्सेस चाहिए",
  heroSecondary: "लाइब्रेरी देखें",
  heroCompare: (full: string, save: string) => (
    <>
      <span className="line-through">{full}</span> अलग-अलग खरीदने पर · आपकी बचत{" "}
      <span className="font-semibold text-foreground">{save}</span>
    </>
  ),
  heroAlt: (n: number) => `${n} PC गेम्स वाली लाइब्रेरी की झलक`,
  heroMore: (n: number) => `+ ${n} और टाइटल इसी खरीद में शामिल`,
  stats: (price: string) =>
    [
      [price, "एक बार भुगतान"],
      ["तुरंत", "भुगतान के बाद एक्सेस"],
      ["7 दिन", "पूरी गारंटी"],
    ] as [string, string][],
  deliverablesTitleA: "आपको जो कुछ चाहिए",
  deliverablesTitleB: "आज ही खेलना शुरू करने के लिए",
  deliverablesSub: "एक आसान खरीद, कोई सब्सक्रिप्शन नहीं, कोई झंझट नहीं, और असली लोगों का सपोर्ट।",
  deliverables: (perGame: string) =>
    [
      ["पूरी लाइब्रेरी", "सारे टाइटल एक साथ अनलॉक, कोई पैकेज चुनने की जरूरत नहीं।"],
      ["तुरंत डिलीवरी", "भुगतान के कुछ ही मिनटों में एक्सेस आपके ईमेल पर।"],
      ["लाइफटाइम एक्सेस", "एक बार भुगतान करें, हमेशा के लिए आपका। कोई मासिक शुल्क नहीं।"],
      ["हर हफ्ते नए गेम्स", "लाइब्रेरी बढ़ती रहती है और आपको दोबारा पैसे नहीं देने पड़ते।"],
      ["सीधा डाउनलोड", "व्यवस्थित और तेज़ लिंक, बिना किसी झंझट के।"],
      ["ऑप्टिमाइज़ेशन पैक", "कम पावर वाले PC पर भी बेहतर परफॉर्मेंस के लिए तैयार सेटिंग्स।"],
      ["असली सपोर्ट", "इंस्टॉलेशन में मदद के लिए असली टीम मौजूद।"],
      ["7 दिन की गारंटी", "पसंद नहीं आया? 100% पैसा वापस।"],
      [`हर गेम ${perGame} से भी कम में`, "एक गेम की कीमत में पूरी लाइब्रेरी।"],
    ] as [string, string][],
  catalogEyebrow: "इसमें क्या मिलता है",
  catalogTitle: (n: number) => `${n} गेम्स। सिर्फ एक कीमत।`,
  catalogSub: "सबसे ज़्यादा मांगे जाने वाले टाइटल, ऑफिशियल कवर और सीधा डाउनलोड।",
  coverAlt: (name: string) => `${name} का कवर`,
  offerEyebrow: (n: number) => `Framers कम्प्लीट पैक · ${n} गेम्स`,
  offerCompare: "अलग-अलग खरीदने पर:",
  offerToday: "आज, एक बार का भुगतान",
  offerPerGame: (n: number, price: string) => (
    <>
      {n} गेम्स · हर गेम <span className="font-semibold text-foreground">{price}</span> से भी कम में
    </>
  ),
  offerNote: "कार्ड से एक बार भुगतान · 7 दिन की गारंटी के साथ ज़ीरो रिस्क।",
  includes: (n: number) => [
    `सभी ${n} गेम्स एक साथ अनलॉक`,
    "लाइफटाइम एक्सेस: एक बार भुगतान, हमेशा के लिए आपका",
    "हर हफ्ते नए टाइटल, बिना किसी अतिरिक्त खर्च के",
    "स्टेप-बाय-स्टेप वीडियो इंस्टॉलेशन गाइड",
    "कम पावर वाले PC के लिए ऑप्टिमाइज़ेशन पैक",
    "WhatsApp पर असली इंसानी सपोर्ट",
    "7 दिन की मनी-बैक गारंटी",
  ],
  guaranteeTitle: "संतुष्टि की गारंटी, ज़ीरो रिस्क",
  guaranteeSub: "पूरा रिफंड मांगने के लिए 7 दिन, कोई सवाल नहीं। पूरा जोखिम हमारा है।",
  guaranteeBadges: ["100% सुरक्षित खरीद", "7 दिन की गारंटी", "रिफंड की गारंटी", "असली सपोर्ट"],
  brandsTitle: "लाइब्रेरी में मौजूद स्टूडियो और पब्लिशर",
  testimonialsEyebrow: "जिन्होंने पहले ही खरीदा",
  testimonialsTitle: "4,000+ गेमर्स पहले से खेल रहे हैं",
  testimonialsSub:
    "असली ग्राहकों के अनुभव जिन्हें एक्सेस मिल चुका है और लाइब्रेरी इंस्टॉल हो चुकी है।",
  testimonials: (price: string) => [
    {
      name: "Rahul Sharma",
      meta: "Mumbai · MH",
      text: `${price} में यकीन नहीं हो रहा था, लेकिन 5 मिनट में ईमेल पर एक्सेस आ गया। GTA V और RDR2 दोनों स्मूद चल रहे हैं।`,
    },
    {
      name: "Ankit Verma",
      meta: "Delhi · DL",
      text: "ऑप्टिमाइज़ेशन पैक ने मेरे पुराने लैपटॉप को बचा लिया। Elden Ring उस मशीन पर चला जिसे मैं छोड़ चुका था।",
    },
    {
      name: "Priya Nair",
      meta: "Bengaluru · KA",
      text: "शक के साथ खरीदा था, अब तीन दोस्तों को बता चुकी हूँ। अकेला Red Dead 2 ही पूरी कीमत वसूल कर देता है।",
    },
    {
      name: "Arjun Patel",
      meta: "Ahmedabad · GJ",
      text: "इंस्टॉल करना आसान था, वीडियो गाइड में सब समझाया गया है। मैंने पहली बार खुद PC गेम इंस्टॉल किया।",
    },
    {
      name: "Sneha Iyer",
      meta: "Chennai · TN",
      text: "हर हफ्ते नए गेम्स आते हैं और एक रुपया भी अतिरिक्त नहीं देना पड़ता। साल की सबसे अच्छी खरीद।",
    },
    {
      name: "Vikram Singh",
      meta: "Jaipur · RJ",
      text: "डाउनलोड अटक गया था तो तुरंत जवाब मिला। असली इंसान मदद करते हैं, कोई बॉट नहीं।",
    },
  ],
  faqTitle: "अक्सर पूछे जाने वाले सवाल",
  faq: (price: string, n: number) => [
    {
      q: `क्या सारे गेम्स ${price} में मिलते हैं?`,
      a: `हाँ। ${n} गेम्स वाली पूरी लाइब्रेरी के लिए सिर्फ एक बार ${price} का भुगतान। कोई मासिक शुल्क नहीं, हर गेम का अलग चार्ज नहीं।`,
    },
    {
      q: "एक्सेस कब मिलेगा?",
      a: "तुरंत। भुगतान कन्फर्म होते ही एक्सेस ईमेल पर आ जाता है, आमतौर पर कुछ ही मिनटों में।",
    },
    {
      q: "क्या यह मेरे PC पर चलेगा?",
      a: "हाँ, ये गेम्स PC (Windows) के लिए हैं और इनके साथ इंस्टॉलेशन गाइड व कमज़ोर मशीनों के लिए ऑप्टिमाइज़ेशन पैक आता है।",
    },
    {
      q: "क्या नए गेम्स के लिए दोबारा पैसे देने होंगे?",
      a: "नहीं। हर हफ्ते नए टाइटल जुड़ते हैं और जिन्होंने पहले खरीदा है उनके लिए वे मुफ्त अनलॉक रहते हैं।",
    },
    {
      q: "अगर पसंद न आए तो?",
      a: "आपके पास पूरा रिफंड मांगने के लिए 7 दिन हैं, बिना किसी सवाल के। पूरा जोखिम हमारा है।",
    },
  ],
  footerLinks: [
    { label: "लाइब्रेरी", href: "#jogos" },
    { label: "ऑफर", href: "#oferta" },
    { label: "सवाल-जवाब", href: "#faq" },
  ],
  footerSub: (n: number, price: string) =>
    `${n} PC गेम्स सिर्फ ${price} में, एक बार भुगतान और तुरंत डिजिटल डिलीवरी।`,
  footerLinksTitle: "तेज़ लिंक",
  footerReady: "खेलने के लिए तैयार हैं?",
  footerCta: (price: string) => `${price} में एक्सेस पाएं`,
  rights: "सर्वाधिकार सुरक्षित।",
  stickySub: (n: number) => `${n} गेम्स · एक बार भुगतान`,
  stickyCta: "एक्सेस चाहिए",
  ctaVsl: "अभी पैक देखें",
  ctaCatalog: "मुझे ये गेम्स चाहिए",
  ctaTestimonials: "उनके साथ खेलना शुरू करें",
  ctaGuarantee: "बिना जोखिम आज़माएं",
  ctaDeliverables: "अभी खेलना शुरू करें",
  ctaBrands: "पूरा ऑफर देखें",
  ctaFaq: "अभी भी सवाल हैं? एक्सेस लें",
  midCtas: [
    ["आज ही खेलना शुरू करने के लिए तैयार?", "अभी खेलना शुरू करें"],
    ["अपने फेवरेट चुन लिए? सब एक साथ ले लें।", "मुझे ये गेम्स चाहिए"],
    ["4,000+ गेमर्स से जुड़ें जो पहले से खेल रहे हैं", "उनके साथ खेलना शुरू करें"],
    ["बिना जोखिम आज़माएं, 7 दिन की पूरी गारंटी", "बिना जोखिम आज़माएं"],
  ] as [string, string][],
};

const COPY_BY_LANG = { ...COPY, uk: COPY.en, es: ES, es2: ES, in: HI };

/**
 * Whether the offer price is printed on the page.
 *
 * This used to be `const hidePrice = true` with no way to turn it off, so the
 * price appeared nowhere on the site: the hero hid its anchor, the sticky bar hid
 * its amount, the offer block showed "click below to see your price" and the
 * popup that was supposed to reveal it computed the number and never rendered it.
 * Every price slot received the string "un precio simbólico" instead, which is
 * why the FAQ read "¿Son un precio simbólico por todos los juegos?".
 *
 * Flip to false to go back to hiding it.
 */
export const SHOW_PRICE = true;

export function buildLocale(lang: Lang, resolved: ResolvedMarket = FALLBACK_RESOLVED) {
  const cfg = CONFIG[lang];
  const { market, price } = resolved;

  const money = (value: number) => formatMoney(value, market);
  const fullValue = FRONT_GAMES_COUNT * resolved.perGameValue;
  const hidePrice = !SHOW_PRICE;

  /**
   * What gets interpolated wherever copy says "for <price>". With the price shown
   * this is the real converted amount, which is what the copy was written for.
   */
  const priceLabel = SHOW_PRICE
    ? money(price)
    : lang === "in"
      ? "एक प्रतीकात्मक कीमत"
      : lang === "es" || lang === "es2"
        ? "un precio simbólico"
        : lang === "pt"
          ? "um preço simbólico"
          : "a symbolic price";

  return {
    ...cfg,
    // Every route checks out through Hotmart, so the widget binds everywhere.
    hotmart: true,
    storeUrl: checkoutUrlFor(market.currency, cfg.storeUrl),

    // Market, live from the request.
    market,
    marketLang: MARKET_LANG[lang],
    country: resolved.country,
    currency: market.currency,
    intl: market.intl,
    rate: resolved.rate,
    fxSource: resolved.fxSource,

    money,
    price,
    hidePrice,
    priceLabel,
    totalGames: FRONT_GAMES_COUNT,
    fullValue,
    pricePerGame: price / FRONT_GAMES_COUNT,
    discount: Math.min(99, Math.round((1 - price / fullValue) * 100)),
    t: COPY_BY_LANG[lang],
  };
}

export type Locale = ReturnType<typeof buildLocale>;

const LocaleContext = createContext<Locale>(buildLocale("pt"));

export function LocaleProvider({
  lang,
  market,
  children,
}: {
  lang: Lang;
  /** Resolved server-side. Omitted only in contexts with no request. */
  market?: ResolvedMarket;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={buildLocale(lang, market)}>{children}</LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
