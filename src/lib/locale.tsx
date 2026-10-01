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
      { label: "Os 12 jogos", href: "#jogos" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Oferta", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    heroBadge: (d: number) => `Preço de lançamento · ${d}% OFF`,
    heroTitleA: "12 jogos que custam uma fortuna.",
    heroTitleB: () => "Hoje, o preço de um lanche.",
    heroSub: (price: string) =>
      `GTA V, Red Dead 2, Elden Ring, God of War Ragnarök, Hogwarts Legacy e mais 7. Tudo liberado de uma vez por ${price}, pagamento único, sem mensalidade e com acesso vitalício.`,
    heroCta: "Quero os 12 jogos agora",
    heroSecondary: "Ver os 12 jogos",
    heroCompare: (full: string, save: string) => (
      <>
        Comprando separado dá <span className="line-through">{full}</span>. Você economiza{" "}
        <span className="font-semibold text-foreground">{save}</span> hoje.
      </>
    ),
    heroAlt: (n: number) => `Prévia da biblioteca com ${n} jogos de PC`,
    heroMore: (n: number) => `+ ${n} títulos liberados na mesma compra`,
    heroTrust: ["Pagamento único", "Acesso em minutos", "7 dias de garantia"],
    stats: (price: string) =>
      [
        [price, "Uma vez. Nunca mais."],
        ["Em minutos", "O acesso cai no seu e-mail"],
        ["7 dias", "Não gostou, devolvemos"],
      ] as [string, string][],

    whyCheapTitle: "Por que tão barato?",
    whyCheapSub: "É a pergunta certa, e ninguém responde. Aqui vai a resposta direta.",
    whyCheap: [
      [
        "Você paga o arquivo, não a caixa",
        "Não existe disco, frete, loja física nem prateleira. Entrega digital tem custo perto de zero, e o preço reflete isso.",
      ],
      [
        "É preço de lançamento",
        "Estamos começando, e preferimos volume agora a margem agora. Por isso a data abaixo existe e o preço realmente sobe nela.",
      ],
      [
        "Um pacote, não 12 compras",
        "Vender os 12 de uma vez custa o mesmo que vender um. Essa economia volta para você em vez de virar margem.",
      ],
    ] as [string, string][],

    deliverablesTitleA: "Tudo que você precisa",
    deliverablesTitleB: "para jogar ainda hoje",
    deliverablesSub:
      "Compra simples, sem assinatura, sem burocracia e com gente de verdade do outro lado.",
    deliverables: (perGame: string) =>
      [
        ["Os 12 jogos liberados", "Todos de uma vez, sem escolher pacote nem pagar por título."],
        ["Entrega imediata", "Pagou, o acesso chega no seu e-mail em minutos."],
        ["Acesso vitalício", "Paga uma vez e é seu para sempre, sem mensalidade."],
        ["Download direto", "Links organizados, rápidos e sem complicação."],
        ["Pack de otimização", "Ajustes prontos para rodar melhor em PC fraco."],
        ["Suporte humano", "Time real no WhatsApp para te ajudar na instalação."],
        ["Garantia de 7 dias", "Não gostou? Devolvemos 100% do valor."],
        [`Menos de ${perGame} por jogo`, "O preço de um jogo compra os 12."],
      ] as [string, string][],

    catalogEyebrow: "O que vem dentro",
    catalogTitle: (n: number) => `Os ${n} jogos. Um preço só.`,
    catalogSub:
      "Os títulos mais pedidos, com capa oficial e download direto. Nada de lista inflada com joguinho de navegador para inchar o número.",
    coverAlt: (name: string) => `Capa de ${name}`,

    offerEyebrow: (n: number) => `Pacote Framers · ${n} jogos`,
    offerCompare: "Comprando separado:",
    offerToday: "Hoje, pagamento único de",
    offerPerGame: (n: number, price: string) => (
      <>
        {n} jogos · menos de <span className="font-semibold text-foreground">{price}</span> por jogo
      </>
    ),
    offerNote: "Pagamento único no cartão · risco zero com 7 dias de garantia.",
    includes: (n: number) => [
      `Os ${n} jogos liberados de uma vez`,
      "Acesso vitalício: paga uma vez e é seu para sempre",
      "Tutorial de instalação em vídeo passo a passo",
      "Pack de otimização para PC fraco",
      "Suporte humano no WhatsApp",
      "Garantia de 7 dias ou dinheiro de volta",
    ],

    guaranteeTitle: "O risco é todo nosso",
    guaranteeSub:
      "Instale, jogue, teste nos seus 7 dias. Se não gostar, por qualquer motivo, devolvemos tudo. Você não precisa justificar nada e continua com o tutorial e o pack de otimização.",
    guaranteeBadges: [
      "Compra 100% segura",
      "7 dias de garantia",
      "Reembolso sem perguntas",
      "Suporte humano",
    ],

    brandsTitle: "Estúdios e publishers presentes na biblioteca",

    testimonialsEyebrow: "Mensagens reais de clientes",
    testimonialsTitle: "Instalou, abriu e jogou",
    testimonialsSub:
      "Prints do nosso WhatsApp, sem edição. É o tipo de mensagem que chega depois da compra.",
    testimonials: [
      {
        alt: "Cliente mostrando GTA V aberto no notebook, dizendo que instalou em minutos",
        caption: "Instalou em minutos e já estava jogando GTA V.",
      },
      {
        alt: "Cliente mostrando GTA V rodando no monitor, dizendo que vale a pena",
        caption: "GTA V do pacote rodando redondo no PC dele.",
      },
      {
        alt: "Cliente mostrando GTA V pausado no monitor, dizendo que parou o jogo para mandar a mensagem",
        caption: "Pausou o GTA V só para agradecer.",
      },
    ],

    faqTitle: "Perguntas frequentes",
    faq: (price: string, n: number) => [
      {
        q: `É ${price} pelos ${n} jogos mesmo, sem pegadinha?`,
        a: `Sim. Pagamento único de ${price} pelos ${n} jogos. Sem mensalidade, sem cobrança por título e sem renovação automática. O preço que você vê é o que o checkout cobra.`,
      },
      {
        q: "Quando eu recebo o acesso?",
        a: "Na hora. Assim que o pagamento é confirmado, o acesso chega no seu e-mail, normalmente em poucos minutos. Se não chegar, o suporte reenvia.",
      },
      {
        q: "Vai rodar no meu PC?",
        a: "Os jogos são para PC com Windows. Cada título tem seus requisitos, e vai junto um pack de otimização feito para máquinas mais fracas. Se não rodar na sua, os 7 dias de garantia cobrem você.",
      },
      {
        q: "Nunca instalei jogo no PC. Consigo?",
        a: "Consegue. Vai um tutorial em vídeo passo a passo e, se travar em qualquer etapa, tem gente de verdade no WhatsApp para destravar com você.",
      },
      {
        q: "E se eu não gostar?",
        a: "Você tem 7 dias para pedir reembolso integral, sem precisar explicar o motivo. O risco é todo nosso.",
      },
      {
        q: "O preço vai subir mesmo?",
        a: "Vai. O contador desta página marca o fim do preço de lançamento, e na data ele sobe para todo mundo. Quem comprou antes não paga a diferença.",
      },
    ],

    footerLinks: [
      { label: "Os 12 jogos", href: "#jogos" },
      { label: "Oferta", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    footerSub: (n: number, price: string) =>
      `${n} jogos de PC por ${price}, em pagamento único, com entrega digital imediata.`,
    footerLinksTitle: "Links rápidos",
    footerReady: "Pronto para jogar?",
    footerCta: (price: string) => `Garantir acesso por ${price}`,
    rights: "Todos os direitos reservados.",
    legalTitle: "Legal e suporte",
    legalWhatsapp: "Suporte no WhatsApp",
    trademarkNotice:
      "Nomes de jogos, estúdios e plataformas citados pertencem aos seus titulares e são usados apenas para identificar os títulos. A menção não implica patrocínio nem vínculo comercial.",

    countdownTitle: "O preço de lançamento acaba em",
    countdownDays: "dias",
    countdownHours: "horas",
    countdownMinutes: "min",
    countdownSeconds: "seg",
    countdownThen: (price: string) => `Depois dessa data o pacote passa a custar ${price}.`,
    countdownCompact: (clock: string) => `Lançamento acaba em ${clock}`,

    stickySub: (n: number) => `${n} jogos · pagamento único`,
    stickyCta: "Quero acesso",

    popupEyebrow: "Espera, antes de sair",
    popupTitle: "Você ia embora sem ver o preço",
    popupSub: (n: number) => `Os ${n} jogos, pagamento único, acesso vitalício.`,
    popupBullets: ["Acesso em minutos", "7 dias de garantia", "Sem mensalidade"],
    popupCta: "Quero esse preço",
    popupNote: (price: string) => `Depois do prazo, o mesmo pacote custa ${price}.`,
    popupDismiss: "Agora não",

    ctaVsl: "Ver o pacote agora",
    ctaCatalog: "Quero esses 12 jogos",
    ctaTestimonials: "Quero jogar hoje também",
    ctaGuarantee: "Testar sem risco por 7 dias",
    ctaDeliverables: "Quero começar a jogar agora",
    ctaBrands: "Ver a oferta completa",
    ctaFaq: "Ficou alguma dúvida? Garantir meu acesso",
    ctaWhyCheap: "Entendi, quero garantir o meu",

    upsellEyebrow: "Compra confirmada",
    upsellTitle: "Espera, não feche esta página",
    upsellSub: (rest: number, total: number) =>
      `Seus 12 jogos já estão a caminho do seu e-mail. Antes de você sair, tem uma coisa que só aparece aqui: liberar os outros ${rest} jogos da biblioteca e ficar com os ${total}.`,
    upsellOfferTitle: (rest: number) => `Mais ${rest} jogos, agora`,
    upsellBullets: (rest: number) => [
      `Os ${rest} títulos restantes liberados na mesma conta`,
      "Mesmo acesso, mesmo login, nada para instalar de novo",
      "Pagamento único, sem mensalidade",
      "A mesma garantia de 7 dias vale para este upgrade",
    ],
    upsellPriceLabel: "Só nesta página",
    upsellCompareFront: (frontPerGame: string, n: number) =>
      `Você acabou de pagar ${frontPerGame} por jogo nos 12. Aqui, os outros ${n} saem por uma fração disso.`,
    upsellAccept: "Sim, quero a biblioteca completa",
    upsellDecline: "Não, obrigado. Fico só com os 12 jogos",
    upsellWarning:
      "Esta oferta existe apenas nesta página. Se fechar agora, os outros jogos voltam a custar o preço cheio.",
    upsellFootnote: "Checkout seguro. Seus 12 jogos já estão garantidos de qualquer forma.",
    upsellHighlightsTitle: "Alguns dos que entram",

    midCtas: [
      ["Dá para jogar GTA V ainda hoje à noite", "Quero começar a jogar agora"],
      ["Já viu seus favoritos? Leve os 12 de uma vez.", "Quero esses 12 jogos"],
      ["O preço sobe na data do contador. Antes dela, é esse.", "Garantir o preço de lançamento"],
      ["Teste sem risco, com 7 dias de garantia total", "Testar sem risco"],
    ] as [string, string][],
  },
  en: {
    nav: [
      { label: "The 12 games", href: "#jogos" },
      { label: "How it works", href: "#como-funciona" },
      { label: "Offer", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    heroBadge: (d: number) => `Launch price · ${d}% OFF`,
    heroTitleA: "12 games that cost a fortune.",
    heroTitleB: () => "Today, the price of lunch.",
    heroSub: (price: string) =>
      `GTA V, Red Dead 2, Elden Ring, God of War Ragnarök, Hogwarts Legacy and 7 more. All unlocked at once for ${price}, one payment, no subscription, yours for life.`,
    heroCta: "Get the 12 games now",
    heroSecondary: "See the 12 games",
    heroCompare: (full: string, save: string) => (
      <>
        Bought separately that is <span className="line-through">{full}</span>. You save{" "}
        <span className="font-semibold text-foreground">{save}</span> today.
      </>
    ),
    heroAlt: (n: number) => `Preview of the library with ${n} PC games`,
    heroMore: (n: number) => `+ ${n} more titles in the same purchase`,
    heroTrust: ["One-time payment", "Access in minutes", "7-day guarantee"],
    stats: (price: string) =>
      [
        [price, "Once. Never again."],
        ["In minutes", "Access lands in your inbox"],
        ["7 days", "Don't like it, we refund"],
      ] as [string, string][],

    whyCheapTitle: "Why so cheap?",
    whyCheapSub: "It is the right question, and nobody answers it. Here is the straight answer.",
    whyCheap: [
      [
        "You pay for the file, not the box",
        "No disc, no shipping, no shop, no shelf. Digital delivery costs close to nothing, and the price reflects that.",
      ],
      [
        "It is launch pricing",
        "We are starting out and we would rather have volume now than margin now. That is why the date below exists and the price really does go up on it.",
      ],
      [
        "One pack, not 12 purchases",
        "Selling all 12 at once costs us the same as selling one. That saving goes to you instead of becoming margin.",
      ],
    ] as [string, string][],

    deliverablesTitleA: "Everything you need",
    deliverablesTitleB: "to play today",
    deliverablesSub:
      "A simple purchase, with no subscription, no bureaucracy, and real people on the other side.",
    deliverables: (perGame: string) =>
      [
        ["All 12 games unlocked", "Every title at once, with no bundles to pick."],
        ["Instant delivery", "You pay and access reaches your inbox in minutes."],
        ["Lifetime access", "Pay once and it is yours forever, no monthly fee."],
        ["Direct download", "Organised, fast links with no hassle."],
        ["Optimisation pack", "Ready-made tweaks to run better on a weaker PC."],
        ["Human support", "A real team on WhatsApp to help you install."],
        ["7-day guarantee", "Not for you? We refund 100%."],
        [`Less than ${perGame} per game`, "The price of one game buys all 12."],
      ] as [string, string][],

    catalogEyebrow: "What's inside",
    catalogTitle: (n: number) => `The ${n} games. One single price.`,
    catalogSub:
      "The titles people actually ask for, with official art and direct downloads. No padded list of browser games to inflate the number.",
    coverAlt: (name: string) => `${name} cover art`,

    offerEyebrow: (n: number) => `Framers Pack · ${n} games`,
    offerCompare: "Bought separately:",
    offerToday: "Today, one payment of",
    offerPerGame: (n: number, price: string) => (
      <>
        {n} games · less than <span className="font-semibold text-foreground">{price}</span> per
        game
      </>
    ),
    offerNote: "One-time card payment · zero risk with a 7-day guarantee.",
    includes: (n: number) => [
      `All ${n} games unlocked at once`,
      "Lifetime access: pay once and it is yours forever",
      "Step-by-step video installation tutorial",
      "Optimisation pack for weaker PCs",
      "Human support on WhatsApp",
      "7-day money-back guarantee",
    ],

    guaranteeTitle: "The risk is entirely ours",
    guaranteeSub:
      "Install it, play it, test it across your 7 days. If you do not like it, for any reason, we refund everything. You do not have to justify anything and you keep the tutorial and the optimisation pack.",
    guaranteeBadges: [
      "100% secure checkout",
      "7-day guarantee",
      "No-questions refund",
      "Human support",
    ],

    brandsTitle: "Studios and publishers in the library",

    testimonialsEyebrow: "Real customer messages",
    testimonialsTitle: "Installed it, opened it, played it",
    testimonialsSub:
      "Unedited screenshots from our WhatsApp. This is the kind of message that arrives after a purchase.",
    testimonials: [
      {
        alt: "Customer showing GTA V open on a laptop, saying it installed in minutes",
        caption: "Installed in minutes and was already playing GTA V.",
      },
      {
        alt: "Customer showing GTA V running on a monitor, saying it is worth it",
        caption: "GTA V from the pack running smoothly on their PC.",
      },
      {
        alt: "Customer showing GTA V paused on a monitor, saying they stopped the game to send the message",
        caption: "Paused GTA V just to say thanks.",
      },
    ],

    faqTitle: "Frequently asked questions",
    faq: (price: string, n: number) => [
      {
        q: `Is it really ${price} for all ${n} games, no catch?`,
        a: `Yes. One payment of ${price} for the ${n} games. No subscription, no per-title charge and no auto-renewal. The price you see is what checkout charges.`,
      },
      {
        q: "When do I get access?",
        a: "Right away. As soon as payment is confirmed, access reaches your inbox, usually within minutes. If it does not arrive, support resends it.",
      },
      {
        q: "Will it run on my PC?",
        a: "The games are for Windows PC. Each title has its own requirements, and an optimisation pack built for weaker machines is included. If it will not run on yours, the 7-day guarantee covers you.",
      },
      {
        q: "I have never installed a PC game. Can I do it?",
        a: "You can. A step-by-step video tutorial is included, and if you get stuck at any point there are real people on WhatsApp to unstick it with you.",
      },
      {
        q: "What if I don't like it?",
        a: "You have 7 days to request a full refund, with no need to explain why. The risk is entirely ours.",
      },
      {
        q: "Is the price really going up?",
        a: "It is. The counter on this page marks the end of launch pricing, and on that date it goes up for everyone. Anyone who bought before does not pay the difference.",
      },
    ],

    footerLinks: [
      { label: "The 12 games", href: "#jogos" },
      { label: "Offer", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    footerSub: (n: number, price: string) =>
      `${n} PC games for ${price}, one-time payment, instant digital delivery.`,
    footerLinksTitle: "Quick links",
    footerReady: "Ready to play?",
    footerCta: (price: string) => `Get access for ${price}`,
    rights: "All rights reserved.",
    legalTitle: "Legal and support",
    legalWhatsapp: "WhatsApp support",
    trademarkNotice:
      "Game, studio and platform names shown here belong to their respective owners and are used only to identify the titles. Mentioning them implies no sponsorship or commercial relationship.",

    countdownTitle: "Launch price ends in",
    countdownDays: "days",
    countdownHours: "hours",
    countdownMinutes: "min",
    countdownSeconds: "sec",
    countdownThen: (price: string) => `After that date the pack goes to ${price}.`,
    countdownCompact: (clock: string) => `Launch ends in ${clock}`,

    stickySub: (n: number) => `${n} games · one-time payment`,
    stickyCta: "Get access",

    popupEyebrow: "Wait, before you go",
    popupTitle: "You were about to leave without seeing the price",
    popupSub: (n: number) => `All ${n} games, one payment, yours for life.`,
    popupBullets: ["Access in minutes", "7-day guarantee", "No subscription"],
    popupCta: "I want this price",
    popupNote: (price: string) => `After the deadline, the same pack costs ${price}.`,
    popupDismiss: "Not now",

    ctaVsl: "See the pack now",
    ctaCatalog: "I want these 12 games",
    ctaTestimonials: "I want to play today too",
    ctaGuarantee: "Try it risk-free for 7 days",
    ctaDeliverables: "I want to start playing now",
    ctaBrands: "See the full offer",
    ctaFaq: "Still unsure? Get my access",
    ctaWhyCheap: "Got it, I want mine",

    upsellEyebrow: "Purchase confirmed",
    upsellTitle: "Wait, do not close this page",
    upsellSub: (rest: number, total: number) =>
      `Your 12 games are already on their way to your inbox. Before you go, there is one thing that only appears here: unlocking the other ${rest} games in the library and keeping all ${total}.`,
    upsellOfferTitle: (rest: number) => `${rest} more games, right now`,
    upsellBullets: (rest: number) => [
      `The remaining ${rest} titles unlocked on the same account`,
      "Same access, same login, nothing to install again",
      "One-time payment, no subscription",
      "The same 7-day guarantee covers this upgrade",
    ],
    upsellPriceLabel: "On this page only",
    upsellCompareFront: (frontPerGame: string, n: number) =>
      `You just paid ${frontPerGame} per game for the 12. Here, the other ${n} cost a fraction of that.`,
    upsellAccept: "Yes, I want the full library",
    upsellDecline: "No thanks. I will keep just the 12 games",
    upsellWarning:
      "This offer exists on this page only. Close it now and the other games go back to full price.",
    upsellFootnote: "Secure checkout. Your 12 games are already yours either way.",
    upsellHighlightsTitle: "A few of the titles you unlock",

    midCtas: [
      ["You could be playing GTA V tonight", "I want to start playing now"],
      ["Spotted your favourites? Take all 12 at once.", "I want these 12 games"],
      [
        "The price goes up on the counter's date. Until then, it is this.",
        "Lock in the launch price",
      ],
      ["Try it risk-free, with a 7-day full guarantee", "Try risk-free"],
    ] as [string, string][],
  },
};
const ES = {
  nav: [
    { label: "Los 12 juegos", href: "#jogos" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Oferta", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ],
  heroBadge: (d: number) => `Precio de lanzamiento · ${d}% OFF`,
  heroTitleA: "12 juegos que cuestan una fortuna.",
  heroTitleB: () => "Hoy, lo que cuesta un almuerzo.",
  heroSub: (price: string) =>
    `GTA V, Red Dead 2, Elden Ring, God of War Ragnarök, Hogwarts Legacy y 7 más. Todo desbloqueado de una vez por ${price}, pago único, sin mensualidad y con acceso de por vida.`,
  heroCta: "Quiero los 12 juegos ahora",
  heroSecondary: "Ver los 12 juegos",
  heroCompare: (full: string, save: string) => (
    <>
      Comprando por separado son <span className="line-through">{full}</span>. Hoy te ahorras{" "}
      <span className="font-semibold text-foreground">{save}</span>.
    </>
  ),
  heroAlt: (n: number) => `Vista previa de la biblioteca con ${n} juegos de PC`,
  heroMore: (n: number) => `+ ${n} títulos incluidos en la misma compra`,
  heroTrust: ["Pago único", "Acceso en minutos", "7 días de garantía"],
  stats: (price: string) =>
    [
      [price, "Una vez. Nunca más."],
      ["En minutos", "El acceso llega a tu correo"],
      ["7 días", "No te gustó, te devolvemos"],
    ] as [string, string][],

  whyCheapTitle: "¿Por qué tan barato?",
  whyCheapSub: "Es la pregunta correcta, y nadie la responde. Aquí va la respuesta directa.",
  whyCheap: [
    [
      "Pagas el archivo, no la caja",
      "No hay disco, ni envío, ni tienda, ni estante. La entrega digital cuesta casi nada, y el precio lo refleja.",
    ],
    [
      "Es precio de lanzamiento",
      "Estamos empezando y preferimos volumen ahora a margen ahora. Por eso la fecha de abajo existe y el precio sube de verdad en ella.",
    ],
    [
      "Un pack, no 12 compras",
      "Vender los 12 de una vez nos cuesta lo mismo que vender uno. Ese ahorro va para ti en lugar de volverse margen.",
    ],
  ] as [string, string][],

  deliverablesTitleA: "Todo lo que necesitas",
  deliverablesTitleB: "para jugar hoy mismo",
  deliverablesSub:
    "Una compra simple, sin suscripción, sin burocracia y con personas reales del otro lado.",
  deliverables: (perGame: string) =>
    [
      ["Los 12 juegos desbloqueados", "Todos de una vez, sin elegir paquete ni pagar por título."],
      ["Entrega inmediata", "Pagas y el acceso llega a tu correo en minutos."],
      ["Acceso de por vida", "Pagas una vez y es tuyo para siempre, sin mensualidades."],
      ["Descarga directa", "Enlaces organizados, rápidos y sin complicaciones."],
      ["Pack de optimización", "Ajustes listos para rendir mejor en PC de gama baja."],
      ["Soporte humano", "Un equipo real en WhatsApp para ayudarte con la instalación."],
      ["Garantía de 7 días", "¿No te gustó? Te devolvemos el 100% del dinero."],
      [`Menos de ${perGame} por juego`, "El precio de un juego compra los 12."],
    ] as [string, string][],

  catalogEyebrow: "Lo que incluye",
  catalogTitle: (n: number) => `Los ${n} juegos. Un solo precio.`,
  catalogSub:
    "Los títulos más pedidos, con portada oficial y descarga directa. Sin lista inflada con juegos de navegador para abultar el número.",
  coverAlt: (name: string) => `Portada de ${name}`,

  offerEyebrow: (n: number) => `Pack Framers · ${n} juegos`,
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

  guaranteeTitle: "El riesgo es todo nuestro",
  guaranteeSub:
    "Instala, juega y pruébalo durante tus 7 días. Si no te gusta, por el motivo que sea, te devolvemos todo. No tienes que justificar nada y te quedas con el tutorial y el pack de optimización.",
  guaranteeBadges: [
    "Compra 100% segura",
    "7 días de garantía",
    "Reembolso sin preguntas",
    "Soporte humano",
  ],

  brandsTitle: "Estudios y publishers presentes en la biblioteca",

  testimonialsEyebrow: "Mensajes reales de clientes",
  testimonialsTitle: "Instaló, abrió y jugó",
  testimonialsSub:
    "Capturas de nuestro WhatsApp, sin editar. Es el tipo de mensaje que llega después de la compra.",
  testimonials: [
    {
      alt: "Cliente mostrando GTA V abierto en el portátil, diciendo que lo instaló en minutos",
      caption: "Instaló en minutos y ya estaba jugando GTA V.",
    },
    {
      alt: "Cliente mostrando GTA V corriendo en el monitor, diciendo que vale la pena",
      caption: "GTA V del pack corriendo perfecto en su PC.",
    },
    {
      alt: "Cliente mostrando GTA V en pausa, diciendo que paró el juego para mandar el mensaje",
      caption: "Pausó el GTA V solo para agradecer.",
    },
  ],

  faqTitle: "Preguntas frecuentes",
  faq: (price: string, n: number) => [
    {
      q: `¿De verdad son ${price} por los ${n} juegos, sin trampa?`,
      a: `Sí. Un único pago de ${price} por los ${n} juegos. Sin mensualidad, sin cobro por título y sin renovación automática. El precio que ves es el que cobra el checkout.`,
    },
    {
      q: "¿Cuándo recibo el acceso?",
      a: "Al instante. En cuanto se confirma el pago, el acceso llega a tu correo, normalmente en pocos minutos. Si no llega, el soporte te lo reenvía.",
    },
    {
      q: "¿Funcionará en mi PC?",
      a: "Los juegos son para PC con Windows. Cada título tiene sus requisitos, y va incluido un pack de optimización pensado para máquinas más débiles. Si no corre en la tuya, los 7 días de garantía te cubren.",
    },
    {
      q: "Nunca instalé un juego en PC. ¿Podré?",
      a: "Podrás. Va un tutorial en video paso a paso y, si te trabas en cualquier punto, hay personas reales en WhatsApp para destrabarlo contigo.",
    },
    {
      q: "¿Y si no me gusta?",
      a: "Tienes 7 días para pedir el reembolso completo, sin explicar el motivo. El riesgo es todo nuestro.",
    },
    {
      q: "¿De verdad va a subir el precio?",
      a: "Sí. El contador de esta página marca el fin del precio de lanzamiento, y en esa fecha sube para todos. Quien compró antes no paga la diferencia.",
    },
  ],

  footerLinks: [
    { label: "Los 12 juegos", href: "#jogos" },
    { label: "Oferta", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ],
  footerSub: (n: number, price: string) =>
    `${n} juegos de PC por ${price}, en pago único, con entrega digital inmediata.`,
  footerLinksTitle: "Enlaces rápidos",
  footerReady: "¿Listo para jugar?",
  footerCta: (price: string) => `Conseguir acceso por ${price}`,
  rights: "Todos los derechos reservados.",
  legalTitle: "Legal y soporte",
  legalWhatsapp: "Soporte por WhatsApp",
  trademarkNotice:
    "Los nombres de juegos, estudios y plataformas citados pertenecen a sus titulares y se usan solo para identificar los títulos. Mencionarlos no implica patrocinio ni vínculo comercial.",

  countdownTitle: "El precio de lanzamiento termina en",
  countdownDays: "días",
  countdownHours: "horas",
  countdownMinutes: "min",
  countdownSeconds: "seg",
  countdownThen: (price: string) => `Después de esa fecha el pack pasa a costar ${price}.`,
  countdownCompact: (clock: string) => `Lanzamiento termina en ${clock}`,

  stickySub: (n: number) => `${n} juegos · pago único`,
  stickyCta: "Quiero acceso",

  popupEyebrow: "Espera, antes de irte",
  popupTitle: "Te ibas sin ver el precio",
  popupSub: (n: number) => `Los ${n} juegos, pago único, acceso de por vida.`,
  popupBullets: ["Acceso en minutos", "7 días de garantía", "Sin mensualidad"],
  popupCta: "Quiero ese precio",
  popupNote: (price: string) => `Pasado el plazo, el mismo pack cuesta ${price}.`,
  popupDismiss: "Ahora no",

  ctaVsl: "Ver el pack ahora",
  ctaCatalog: "Quiero estos 12 juegos",
  ctaTestimonials: "Yo también quiero jugar hoy",
  ctaGuarantee: "Probar sin riesgo 7 días",
  ctaDeliverables: "Quiero empezar a jugar ahora",
  ctaBrands: "Ver la oferta completa",
  ctaFaq: "¿Te quedó alguna duda? Conseguir mi acceso",
  ctaWhyCheap: "Entendido, quiero el mío",

  upsellEyebrow: "Compra confirmada",
  upsellTitle: "Espera, no cierres esta página",
  upsellSub: (rest: number, total: number) =>
    `Tus 12 juegos ya van camino a tu correo. Antes de salir, hay algo que solo aparece aquí: desbloquear los otros ${rest} juegos de la biblioteca y quedarte con los ${total}.`,
  upsellOfferTitle: (rest: number) => `${rest} juegos más, ahora`,
  upsellBullets: (rest: number) => [
    `Los ${rest} títulos restantes desbloqueados en la misma cuenta`,
    "Mismo acceso, mismo login, nada que instalar de nuevo",
    "Pago único, sin mensualidad",
    "La misma garantía de 7 días cubre esta mejora",
  ],
  upsellPriceLabel: "Solo en esta página",
  upsellCompareFront: (frontPerGame: string, n: number) =>
    `Acabas de pagar ${frontPerGame} por juego por los 12. Aquí, los otros ${n} salen por una fracción de eso.`,
  upsellAccept: "Sí, quiero la biblioteca completa",
  upsellDecline: "No, gracias. Me quedo solo con los 12 juegos",
  upsellWarning:
    "Esta oferta existe únicamente en esta página. Si la cierras ahora, los demás juegos vuelven a costar el precio completo.",
  upsellFootnote: "Checkout seguro. Tus 12 juegos ya están garantizados igual.",
  upsellHighlightsTitle: "Algunos de los que entran",

  midCtas: [
    ["Esta noche ya podrías estar jugando GTA V", "Quiero empezar a jugar ahora"],
    ["¿Ya viste tus favoritos? Llévate los 12 de una vez.", "Quiero estos 12 juegos"],
    [
      "El precio sube en la fecha del contador. Hasta ahí, es este.",
      "Asegurar el precio de lanzamiento",
    ],
    ["Pruébalo sin riesgo, con 7 días de garantía total", "Probar sin riesgo"],
  ] as [string, string][],
};
const HI = {
  nav: [
    { label: "12 गेम्स", href: "#jogos" },
    { label: "कैसे काम करता है", href: "#como-funciona" },
    { label: "ऑफर", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ],
  heroBadge: (d: number) => `लॉन्च कीमत · ${d}% OFF`,
  heroTitleA: "12 गेम्स जिनकी कीमत बहुत ज़्यादा है।",
  heroTitleB: () => "आज, एक लंच जितनी।",
  heroSub: (price: string) =>
    `GTA V, Red Dead 2, Elden Ring, God of War Ragnarök, Hogwarts Legacy और 7 और। सब एक साथ सिर्फ ${price} में, एक बार भुगतान, कोई मंथली नहीं, लाइफटाइम एक्सेस।`,
  heroCta: "मुझे अभी 12 गेम्स चाहिए",
  heroSecondary: "12 गेम्स देखें",
  heroCompare: (full: string, save: string) => (
    <>
      अलग-अलग खरीदने पर <span className="line-through">{full}</span>। आज आप{" "}
      <span className="font-semibold text-foreground">{save}</span> बचाते हैं।
    </>
  ),
  heroAlt: (n: number) => `${n} PC गेम्स की लाइब्रेरी का प्रीव्यू`,
  heroMore: (n: number) => `+ ${n} और टाइटल इसी खरीद में शामिल`,
  heroTrust: ["एक बार भुगतान", "मिनटों में एक्सेस", "7 दिन की गारंटी"],
  stats: (price: string) =>
    [
      [price, "एक बार। बस।"],
      ["मिनटों में", "एक्सेस आपके ईमेल पर"],
      ["7 दिन", "पसंद न आए तो रिफंड"],
    ] as [string, string][],

  whyCheapTitle: "इतना सस्ता क्यों?",
  whyCheapSub: "यही सही सवाल है, और कोई जवाब नहीं देता। यह रहा सीधा जवाब।",
  whyCheap: [
    [
      "आप फ़ाइल के पैसे देते हैं, डिब्बे के नहीं",
      "कोई डिस्क नहीं, शिपिंग नहीं, दुकान नहीं। डिजिटल डिलीवरी की लागत न के बराबर है, और कीमत वही दिखाती है।",
    ],
    [
      "यह लॉन्च कीमत है",
      "हम शुरुआत कर रहे हैं और अभी मार्जिन से ज़्यादा वॉल्यूम चाहते हैं। इसीलिए नीचे की तारीख मौजूद है और उस दिन कीमत सच में बढ़ती है।",
    ],
    ["एक पैक, 12 खरीद नहीं", "12 एक साथ बेचने की लागत एक बेचने जितनी ही है। वह बचत आपको जाती है।"],
  ] as [string, string][],

  deliverablesTitleA: "वह सब जो चाहिए",
  deliverablesTitleB: "आज ही खेलने के लिए",
  deliverablesSub: "एक आसान खरीद, कोई सब्सक्रिप्शन नहीं, कोई झंझट नहीं, और असली लोगों का सपोर्ट।",
  deliverables: (perGame: string) =>
    [
      ["12 गेम्स अनलॉक", "सब एक साथ, कोई पैकेज चुनने की ज़रूरत नहीं।"],
      ["तुरंत डिलीवरी", "भुगतान के मिनटों में एक्सेस ईमेल पर।"],
      ["लाइफटाइम एक्सेस", "एक बार भुगतान, हमेशा के लिए आपका।"],
      ["डायरेक्ट डाउनलोड", "व्यवस्थित और तेज़ लिंक।"],
      ["ऑप्टिमाइज़ेशन पैक", "कम पावर वाले PC पर बेहतर चलाने के लिए।"],
      ["इंसानी सपोर्ट", "इंस्टॉल में मदद के लिए WhatsApp पर असली टीम।"],
      ["7 दिन की गारंटी", "पसंद न आए? पूरा पैसा वापस।"],
      [`${perGame} से कम प्रति गेम`, "एक गेम की कीमत में 12।"],
    ] as [string, string][],

  catalogEyebrow: "इसमें क्या मिलता है",
  catalogTitle: (n: number) => `${n} गेम्स। सिर्फ एक कीमत।`,
  catalogSub: "सबसे ज़्यादा मांगे जाने वाले टाइटल, ऑफिशियल कवर और सीधा डाउनलोड।",
  coverAlt: (name: string) => `${name} का कवर`,

  offerEyebrow: (n: number) => `Framers पैक · ${n} गेम्स`,
  offerCompare: "अलग-अलग खरीदने पर:",
  offerToday: "आज, एक बार भुगतान",
  offerPerGame: (n: number, price: string) => (
    <>
      {n} गेम्स · <span className="font-semibold text-foreground">{price}</span> से कम प्रति गेम
    </>
  ),
  offerNote: "कार्ड से एक बार भुगतान · 7 दिन की गारंटी के साथ शून्य जोखिम।",
  includes: (n: number) => [
    `${n} गेम्स एक साथ अनलॉक`,
    "लाइफटाइम एक्सेस: एक बार भुगतान, हमेशा के लिए आपका",
    "स्टेप बाय स्टेप वीडियो इंस्टॉलेशन ट्यूटोरियल",
    "कम पावर वाले PC के लिए ऑप्टिमाइज़ेशन पैक",
    "WhatsApp पर इंसानी सपोर्ट",
    "7 दिन की मनी बैक गारंटी",
  ],

  guaranteeTitle: "पूरा जोखिम हमारा है",
  guaranteeSub:
    "इंस्टॉल कीजिए, खेलिए, 7 दिन तक आज़माइए। पसंद न आए, किसी भी वजह से, तो पूरा पैसा वापस। कोई सफ़ाई नहीं देनी, और ट्यूटोरियल तथा ऑप्टिमाइज़ेशन पैक आपके पास रहते हैं।",
  guaranteeBadges: ["100% सुरक्षित खरीद", "7 दिन की गारंटी", "बिना सवाल रिफंड", "इंसानी सपोर्ट"],

  brandsTitle: "लाइब्रेरी में मौजूद स्टूडियो और पब्लिशर",

  testimonialsEyebrow: "ग्राहकों के असली मैसेज",
  testimonialsTitle: "इंस्टॉल किया, खोला, खेला",
  testimonialsSub: "हमारे WhatsApp के बिना एडिट किए स्क्रीनशॉट।",
  testimonials: [
    {
      alt: "ग्राहक लैपटॉप पर GTA V दिखाते हुए, मिनटों में इंस्टॉल होने की बात",
      caption: "मिनटों में इंस्टॉल हुआ और GTA V खेलना शुरू।",
    },
    {
      alt: "ग्राहक मॉनिटर पर GTA V चलते हुए दिखाते हुए",
      caption: "पैक का GTA V उनके PC पर बिल्कुल सही चल रहा है।",
    },
    {
      alt: "ग्राहक GTA V पॉज़ करके मैसेज भेजते हुए",
      caption: "धन्यवाद कहने के लिए GTA V पॉज़ कर दिया।",
    },
  ],

  faqTitle: "अक्सर पूछे जाने वाले सवाल",
  faq: (price: string, n: number) => [
    {
      q: `क्या सच में ${n} गेम्स सिर्फ ${price} में?`,
      a: `हाँ। ${n} गेम्स के लिए एक बार ${price} का भुगतान। कोई मंथली नहीं, प्रति टाइटल चार्ज नहीं और ऑटो रिन्यूअल नहीं।`,
    },
    {
      q: "एक्सेस कब मिलेगा?",
      a: "तुरंत। भुगतान कन्फर्म होते ही एक्सेस ईमेल पर आ जाता है, आमतौर पर कुछ ही मिनटों में।",
    },
    {
      q: "क्या मेरे PC पर चलेगा?",
      a: "गेम्स Windows PC के लिए हैं। हर टाइटल की अपनी ज़रूरतें हैं, और कम पावर वाली मशीनों के लिए ऑप्टिमाइज़ेशन पैक साथ आता है।",
    },
    {
      q: "मैंने कभी PC पर गेम इंस्टॉल नहीं किया। कर पाऊंगा?",
      a: "कर पाएंगे। स्टेप बाय स्टेप वीडियो ट्यूटोरियल मिलता है और WhatsApp पर असली लोग मदद के लिए हैं।",
    },
    {
      q: "पसंद न आए तो?",
      a: "7 दिन के भीतर बिना वजह बताए पूरा रिफंड मांग सकते हैं। पूरा जोखिम हमारा है।",
    },
    {
      q: "क्या कीमत सच में बढ़ेगी?",
      a: "हाँ। इस पेज का काउंटर लॉन्च कीमत का अंत दिखाता है, और उस तारीख को यह सबके लिए बढ़ जाती है।",
    },
  ],

  footerLinks: [
    { label: "12 गेम्स", href: "#jogos" },
    { label: "ऑफर", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ],
  footerSub: (n: number, price: string) =>
    `${n} PC गेम्स सिर्फ ${price} में, एक बार भुगतान, तुरंत डिलीवरी।`,
  footerLinksTitle: "क्विक लिंक",
  footerReady: "खेलने के लिए तैयार?",
  footerCta: (price: string) => `${price} में एक्सेस लें`,
  rights: "सर्वाधिकार सुरक्षित।",
  legalTitle: "लीगल और सपोर्ट",
  legalWhatsapp: "WhatsApp सपोर्ट",
  trademarkNotice:
    "यहाँ दिए गेम, स्टूडियो और प्लेटफ़ॉर्म के नाम उनके मालिकों के हैं और सिर्फ़ टाइटल पहचानने के लिए इस्तेमाल किए गए हैं। इनका ज़िक्र किसी प्रायोजन या व्यापारिक संबंध का संकेत नहीं है।",

  countdownTitle: "लॉन्च कीमत खत्म होने में",
  countdownDays: "दिन",
  countdownHours: "घंटे",
  countdownMinutes: "मिनट",
  countdownSeconds: "सेकंड",
  countdownThen: (price: string) => `इस तारीख के बाद पैक की कीमत ${price} हो जाएगी।`,
  countdownCompact: (clock: string) => `लॉन्च खत्म: ${clock}`,

  stickySub: (n: number) => `${n} गेम्स · एक बार भुगतान`,
  stickyCta: "एक्सेस चाहिए",

  popupEyebrow: "रुकिए, जाने से पहले",
  popupTitle: "आप कीमत देखे बिना जा रहे थे",
  popupSub: (n: number) => `${n} गेम्स, एक बार भुगतान, लाइफटाइम एक्सेस।`,
  popupBullets: ["मिनटों में एक्सेस", "7 दिन की गारंटी", "कोई मंथली नहीं"],
  popupCta: "मुझे यही कीमत चाहिए",
  popupNote: (price: string) => `समय खत्म होने के बाद वही पैक ${price} का होगा।`,
  popupDismiss: "अभी नहीं",

  ctaVsl: "अभी पैक देखें",
  ctaCatalog: "मुझे ये 12 गेम्स चाहिए",
  ctaTestimonials: "मुझे भी आज खेलना है",
  ctaGuarantee: "7 दिन बिना जोखिम आज़माएं",
  ctaDeliverables: "अभी खेलना शुरू करें",
  ctaBrands: "पूरा ऑफर देखें",
  ctaFaq: "कोई सवाल बाकी है? एक्सेस लें",
  ctaWhyCheap: "समझ गया, मुझे चाहिए",

  upsellEyebrow: "खरीद कन्फर्म",
  upsellTitle: "रुकिए, यह पेज बंद न करें",
  upsellSub: (rest: number, total: number) =>
    `आपके 12 गेम्स ईमेल पर आ रहे हैं। जाने से पहले, सिर्फ यहाँ दिखने वाली एक चीज़: बाकी ${rest} गेम्स अनलॉक करके पूरे ${total} पा लीजिए।`,
  upsellOfferTitle: (rest: number) => `${rest} और गेम्स, अभी`,
  upsellBullets: (rest: number) => [
    `बाकी ${rest} टाइटल उसी अकाउंट में अनलॉक`,
    "वही एक्सेस, वही लॉगिन, दोबारा कुछ इंस्टॉल नहीं",
    "एक बार भुगतान, कोई मंथली नहीं",
    "वही 7 दिन की गारंटी इस अपग्रेड पर भी",
  ],
  upsellPriceLabel: "सिर्फ इस पेज पर",
  upsellCompareFront: (frontPerGame: string, n: number) =>
    `आपने अभी 12 गेम्स के लिए ${frontPerGame} प्रति गेम दिए। यहाँ बाकी ${n} उसके एक अंश में।`,
  upsellAccept: "हाँ, मुझे पूरी लाइब्रेरी चाहिए",
  upsellDecline: "नहीं, धन्यवाद। मैं सिर्फ 12 गेम्स रखूंगा",
  upsellWarning:
    "यह ऑफर सिर्फ इसी पेज पर है। अभी बंद किया तो बाकी गेम्स फिर पूरी कीमत के हो जाएंगे।",
  upsellFootnote: "सुरक्षित चेकआउट। आपके 12 गेम्स वैसे भी आपके हैं।",
  upsellHighlightsTitle: "कुछ टाइटल जो इसमें आते हैं",

  midCtas: [
    ["आज रात आप GTA V खेल सकते हैं", "अभी खेलना शुरू करें"],
    ["फेवरेट देख लिए? 12 एक साथ ले लें।", "मुझे ये 12 गेम्स चाहिए"],
    ["काउंटर की तारीख पर कीमत बढ़ती है। तब तक यही है।", "लॉन्च कीमत पक्की करें"],
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
    storeUrl: checkoutUrlFor(market.currency, cfg.storeUrl),

    // Market, live from the request.
    market,
    marketLang: MARKET_LANG[lang],
    country: resolved.country,
    currency: market.currency,
    intl: market.intl,
    rate: resolved.rate,
    fxSource: resolved.fxSource,

    // Launch window. serverNow comes from the request so the countdown cannot be
    // shifted by changing the device clock.
    serverNow: resolved.now,
    campaignEndsAt: resolved.campaignEndsAt,
    priceAfter: resolved.priceAfter,

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
