import { createContext, useContext, type ReactNode } from "react";
import { FRONT_GAMES_COUNT } from "@/data/front-offer";
import {
  DEFAULT_CHECKOUT_URL,
  XPAG_CHECKOUT_URL,
  checkoutUrlFor,
  type CheckoutProvider,
} from "@/lib/checkout";
import { ANCHOR_CONSOLE_FROM, ANCHOR_GAMING_PC_FROM, basePriceAt } from "@/lib/campaign";
import {
  FALLBACK_RESOLVED,
  formatMoney,
  withCurrencyCode,
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
 * they come from the resolved market, converted live from OFFER_PRICE. Keeping
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
    heroBadge: (d: number) => (d > 0 ? `Preço de lançamento · -${d}%` : "Android e iPhone"),
    heroTitleA: "Seus jogos de PC,",
    heroTitleB: () => "agora no celular.",
    heroSub: (price: string) =>
      `Emulador + método passo a passo para rodar GTA V, Red Dead 2, Elden Ring, God of War Ragnarök e mais 8 no Android e no iPhone. Configuração pronta para cada jogo e suporte humano, por ${price} em pagamento único.`,
    heroCta: "Quero jogar no celular",
    heroSecondary: "Ver os 12 jogos",
    heroCompare: (full: string, save: string) => (
      <>
        Depois do lançamento, <span className="line-through">{full}</span>. Comprando hoje, você
        economiza <span className="font-semibold text-foreground">{save}</span>.
      </>
    ),
    valueAnchor: (console: string, pc: string, price: string) => (
      <>
        Um console novo custa{" "}
        <span className="font-semibold text-foreground">mais de {console}</span>. Um PC gamer,{" "}
        <span className="font-semibold text-foreground">mais de {pc}</span>. Aqui você joga no
        celular por <span className="font-semibold text-foreground">{price}</span>, uma vez.
      </>
    ),
    heroAlt: (n: number) => `${n} jogos de PC rodando no celular com o emulador`,
    heroMore: (n: number) => `+ ${n} jogos com configuração pronta`,
    // UpsellPage reuses heroTrust[1] and heroTrust[2]: keep those two as they are.
    heroTrust: ["Android e iPhone", "Acesso em minutos", "7 dias de garantia"],
    stats: (price: string) =>
      [
        [price, "Uma vez. Nunca mais."],
        ["12 jogos", "Com configuração pronta"],
        ["7 dias", "Não rodou, devolvemos"],
      ] as [string, string][],

    whyCheapTitle: "Por que tão barato?",
    whyCheapSub: "É a pergunta certa. Aqui vai a resposta direta.",
    whyCheap: [
      [
        "O emulador é gratuito",
        "A tecnologia que roda jogo de PC no celular é aberta e gratuita. Você não paga por ela: paga pelo atalho de não passar dias testando versão, driver e configuração.",
      ],
      [
        "Você paga uma vez",
        "Sem assinatura, sem renovação e sem cobrança escondida. O método é seu, e as configurações dos 12 jogos vêm junto.",
      ],
      [
        "Você usa os seus jogos",
        "Não vendemos jogo. Você roda os que já tem, como os da sua conta Steam, e por isso o preço é o de um método, não o de 12 jogos.",
      ],
    ] as [string, string][],

    deliverablesTitleA: "Tudo que você precisa",
    deliverablesTitleB: "para jogar no celular hoje",
    deliverablesSub:
      "Do download do emulador ao primeiro jogo aberto, com gente de verdade do outro lado.",
    deliverables: () =>
      [
        [
          "Emulador para Android e iPhone",
          "Instalação passo a passo nos dois sistemas, incluindo o iPhone, que instala por fora da App Store.",
        ],
        ["Acesso em minutos", "Pagou, o método chega no seu e-mail."],
        ["Acesso vitalício", "Paga uma vez, sem mensalidade."],
        [
          "Configuração por jogo",
          "Ajustes prontos para cada um dos 12 jogos, para não perder tempo testando.",
        ],
        [
          "Seus jogos no celular",
          "Como levar os jogos que você já tem, inclusive os da Steam, para dentro do emulador.",
        ],
        [
          "Controle e desempenho",
          "Como ligar um controle Bluetooth e equilibrar gráfico e FPS no seu aparelho.",
        ],
        ["Suporte humano", "Time real no WhatsApp para destravar qualquer etapa."],
        ["Garantia de 7 dias", "Não rodou no seu celular? Devolvemos 100% do valor."],
      ] as [string, string][],

    catalogEyebrow: "Jogos que você roda no celular",
    catalogTitle: (n: number) => `Os ${n} mais pedidos, com configuração pronta.`,
    catalogSub:
      "Cada um tem ajustes próprios no método. O desempenho depende do jogo e do aparelho: nos mais pesados, espere algo em torno de 720p a 30 fps.",
    coverAlt: (name: string) => `Capa de ${name}`,

    offerEyebrow: (n: number) => `Método Framers · emulador + ${n} jogos configurados`,
    offerCompare: "Depois do lançamento:",
    offerToday: "Hoje, pagamento único de",
    offerSpec: (n: number) => `Android e iPhone · ${n} jogos com configuração pronta`,
    fxNote: "Valor aproximado na sua moeda. O checkout confirma o valor final.",
    offerNote:
      "Requer Android com Snapdragon 8 Gen 2 ou superior, ou iPhone 13 Pro ou mais novo. Os jogos não estão inclusos: você usa os seus.",
    includes: (n: number) => [
      "Emulador com instalação passo a passo para Android e iPhone",
      `Configuração pronta para os ${n} jogos`,
      "Como importar os seus jogos, inclusive da Steam",
      "Guia de controle e desempenho",
      "Suporte humano no WhatsApp",
      "Garantia de 7 dias ou dinheiro de volta",
    ],

    guaranteeTitle: "O risco é todo nosso",
    guaranteeSub:
      "Instale e teste no seu celular durante 7 dias. Se não rodar ou você não gostar, por qualquer motivo, devolvemos tudo, sem precisar justificar.",
    guaranteeBadges: [
      "Compra 100% segura",
      "7 dias de garantia",
      "Reembolso sem perguntas",
      "Suporte humano",
    ],

    brandsTitle: "Jogos de estúdios como",

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
        q: `É ${price} mesmo, sem pegadinha?`,
        a: `Sim. Pagamento único de ${price} pelo emulador, o método e a configuração dos ${n} jogos. Sem mensalidade e sem renovação automática. Fora do Reino Unido, o valor é convertido para a sua moeda pela cotação do dia, e o checkout da Hotmart mostra o valor final antes de você pagar.`,
      },
      {
        q: "Os jogos estão inclusos?",
        a: "Não. Você recebe o emulador, o método e as configurações. Os jogos são os seus: você usa os que já tem, como os da sua conta Steam, e o método mostra como levar cada um para o celular.",
      },
      {
        q: "Vai rodar no meu celular?",
        a: "No Android, precisa de um processador Snapdragon 8 Gen 2 ou superior. No iPhone, de um iPhone 13 Pro ou mais novo. Em aparelho intermediário não roda, e preferimos que você saiba antes de comprar. Se mesmo assim não rodar no seu, os 7 dias de garantia cobrem você.",
      },
      {
        q: "Como fica o desempenho?",
        a: "Depende do jogo e do aparelho. Nos mais pesados, espere algo em torno de 720p a 30 fps: dá para jogar, mas não é um PC gamer. Os mais leves rodam bem melhor.",
      },
      {
        q: "Funciona no iPhone mesmo?",
        a: "Funciona, mas a instalação é diferente: o emulador não está na App Store, então é instalado por fora (sideload), sem desbloquear o aparelho. O método mostra o passo a passo e o suporte acompanha você.",
      },
      {
        q: "Quando eu recebo o acesso?",
        a: "Na hora. Assim que o pagamento é confirmado, o acesso chega no seu e-mail, normalmente em poucos minutos. Se não chegar, o suporte reenvia.",
      },
      {
        q: "E se eu não gostar?",
        a: "Você tem 7 dias para pedir reembolso integral, sem precisar explicar o motivo. O risco é todo nosso.",
      },
    ],

    footerLinks: [
      { label: "Os 12 jogos", href: "#jogos" },
      { label: "Oferta", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    footerSub: (n: number, price: string) =>
      `Emulador e método para rodar ${n} jogos de PC no celular, por ${price} em pagamento único.`,
    footerLinksTitle: "Links rápidos",
    footerReady: "Pronto para jogar no celular?",
    footerCta: (price: string) => `Garantir acesso por ${price}`,
    rights: "Todos os direitos reservados.",
    legalTitle: "Legal e suporte",
    legalWhatsapp: "Suporte no WhatsApp",
    trademarkNotice:
      "Nomes de jogos, estúdios e plataformas citados pertencem aos seus titulares e são usados apenas para identificar os jogos compatíveis. Os jogos não estão inclusos na compra. A menção não implica patrocínio nem vínculo comercial.",

    countdownTitle: "O preço de lançamento acaba em",
    countdownDays: "dias",
    countdownHours: "horas",
    countdownMinutes: "min",
    countdownSeconds: "seg",
    countdownThen: (price: string) => `Depois dessa data o método passa a custar ${price}.`,
    countdownCompact: (clock: string) => `Lançamento acaba em ${clock}`,

    stickySub: (n: number) => `Emulador + ${n} jogos configurados`,
    stickyCta: "Quero acesso",

    popupEyebrow: "Espera, antes de sair",
    popupTitle: "Você ia embora sem ver o preço",
    popupSub: (n: number) => `Emulador, método e configuração para os ${n} jogos. Pagamento único.`,
    popupBullets: ["Android e iPhone", "7 dias de garantia", "Sem mensalidade"],
    popupCta: "Quero esse preço",
    popupNote: (price: string) => `Depois do prazo, o mesmo método custa ${price}.`,
    popupDismiss: "Agora não",

    ctaVsl: "Ver o método",
    ctaCatalog: "Quero jogar esses no celular",
    ctaTestimonials: "Quero jogar hoje também",
    ctaGuarantee: "Testar sem risco por 7 dias",
    ctaDeliverables: "Quero jogar no celular hoje",
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
      ["Seu GTA V no celular ainda hoje à noite", "Quero começar agora"],
      ["Já viu seus favoritos? Os 12 vêm configurados.", "Quero esses 12 no celular"],
      ["Pagamento único. Sem mensalidade, sem renovação.", "Quero meu acesso"],
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
    heroBadge: (d: number) => (d > 0 ? `Launch price · -${d}%` : "Android and iPhone"),
    heroTitleA: "Your PC games,",
    heroTitleB: () => "now on your phone.",
    heroSub: (price: string) =>
      `An emulator plus a step-by-step method to run GTA V, Red Dead 2, Elden Ring, God of War Ragnarök and 8 more on Android and iPhone. Ready-made settings for every game and human support, for ${price} in one payment.`,
    heroCta: "I want to play on my phone",
    heroSecondary: "See the 12 games",
    heroCompare: (full: string, save: string) => (
      <>
        After launch it is <span className="line-through">{full}</span>. Buy today and you save{" "}
        <span className="font-semibold text-foreground">{save}</span>.
      </>
    ),
    valueAnchor: (console: string, pc: string, price: string) => (
      <>
        A new console costs{" "}
        <span className="font-semibold text-foreground">more than {console}</span>. A gaming PC,{" "}
        <span className="font-semibold text-foreground">more than {pc}</span>. Here you play on your
        phone for <span className="font-semibold text-foreground">{price}</span>, once.
      </>
    ),
    heroAlt: (n: number) => `${n} PC games running on a phone with the emulator`,
    heroMore: (n: number) => `+ ${n} games with ready-made settings`,
    heroTrust: ["Android and iPhone", "Access in minutes", "7-day guarantee"],
    stats: (price: string) =>
      [
        [price, "Once. Never again."],
        ["12 games", "With ready-made settings"],
        ["7 days", "Won't run, we refund"],
      ] as [string, string][],

    whyCheapTitle: "Why so cheap?",
    whyCheapSub: "It is the right question. Here is the straight answer.",
    whyCheap: [
      [
        "The emulator is free",
        "The technology that runs PC games on a phone is open and free. You are not paying for it: you are paying for the shortcut of not spending days testing versions, drivers and settings.",
      ],
      [
        "You pay once",
        "No subscription, no renewal and no hidden charges. The method is yours, and the settings for the 12 games come with it.",
      ],
      [
        "You use your own games",
        "We do not sell games. You run the ones you already own, such as your Steam library, which is why this is priced as a method, not as 12 games.",
      ],
    ] as [string, string][],

    deliverablesTitleA: "Everything you need",
    deliverablesTitleB: "to play on your phone today",
    deliverablesSub:
      "From downloading the emulator to opening your first game, with real people on the other side.",
    deliverables: () =>
      [
        [
          "Emulator for Android and iPhone",
          "Step-by-step setup on both, including iPhone, which installs outside the App Store.",
        ],
        ["Access in minutes", "You pay and the method reaches your inbox."],
        ["Lifetime access", "Pay once, no monthly fee."],
        [
          "Settings for every game",
          "Ready-made tweaks for each of the 12 games, so you do not waste time testing.",
        ],
        [
          "Your games on your phone",
          "How to bring the games you already own, including Steam, into the emulator.",
        ],
        [
          "Controller and performance",
          "How to pair a Bluetooth controller and balance graphics and FPS on your device.",
        ],
        ["Human support", "A real team on WhatsApp to get you past any step."],
        ["7-day guarantee", "Won't run on your phone? We refund 100%."],
      ] as [string, string][],

    catalogEyebrow: "Games you can run on your phone",
    catalogTitle: (n: number) => `The ${n} most requested, with ready-made settings.`,
    catalogSub:
      "Each one has its own settings in the method. Performance depends on the game and the device: on the heaviest, expect around 720p at 30 fps.",
    coverAlt: (name: string) => `${name} cover art`,

    offerEyebrow: (n: number) => `Framers Method · emulator + ${n} games set up`,
    offerCompare: "After launch:",
    offerToday: "Today, one payment of",
    offerSpec: (n: number) => `Android and iPhone · ${n} games with ready-made settings`,
    fxNote: "Approximate amount in your currency. Checkout confirms the final amount.",
    offerNote:
      "Requires Android with a Snapdragon 8 Gen 2 or newer, or an iPhone 13 Pro or newer. Games are not included: you use your own.",
    includes: (n: number) => [
      "Emulator with step-by-step setup for Android and iPhone",
      `Ready-made settings for the ${n} games`,
      "How to import your own games, including from Steam",
      "Controller and performance guide",
      "Human support on WhatsApp",
      "7-day money-back guarantee",
    ],

    guaranteeTitle: "The risk is entirely ours",
    guaranteeSub:
      "Install it and test it on your phone for 7 days. If it will not run or you do not like it, for any reason, we refund everything, no justification needed.",
    guaranteeBadges: [
      "100% secure checkout",
      "7-day guarantee",
      "No-questions refund",
      "Human support",
    ],

    brandsTitle: "Games from studios such as",

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
        q: `Is it really ${price}, no catch?`,
        a: `Yes. One payment of ${price} for the emulator, the method and the settings for the ${n} games. No subscription and no auto-renewal. Outside the UK the amount is converted to your currency at today's rate, and the Hotmart checkout shows the final amount before you pay.`,
      },
      {
        q: "Are the games included?",
        a: "No. You get the emulator, the method and the settings. The games are yours: you use the ones you already own, such as your Steam library, and the method shows how to bring each one to your phone.",
      },
      {
        q: "Will it run on my phone?",
        a: "On Android you need a Snapdragon 8 Gen 2 or newer. On iPhone, an iPhone 13 Pro or newer. It will not run on mid-range phones, and we would rather you knew before buying. If it still will not run on yours, the 7-day guarantee covers you.",
      },
      {
        q: "What is performance like?",
        a: "It depends on the game and the device. On the heaviest, expect around 720p at 30 fps: playable, but not a gaming PC. Lighter games run much better.",
      },
      {
        q: "Does it really work on iPhone?",
        a: "It does, but installation is different: the emulator is not on the App Store, so it is installed outside it (sideloading), with no jailbreak. The method walks you through it and support is there with you.",
      },
      {
        q: "When do I get access?",
        a: "Right away. As soon as payment is confirmed, access reaches your inbox, usually within minutes. If it does not arrive, support resends it.",
      },
      {
        q: "What if I don't like it?",
        a: "You have 7 days to request a full refund, with no need to explain why. The risk is entirely ours.",
      },
    ],

    footerLinks: [
      { label: "The 12 games", href: "#jogos" },
      { label: "Offer", href: "#oferta" },
      { label: "FAQ", href: "#faq" },
    ],
    footerSub: (n: number, price: string) =>
      `An emulator and method to run ${n} PC games on your phone, for ${price} in one payment.`,
    footerLinksTitle: "Quick links",
    footerReady: "Ready to play on your phone?",
    footerCta: (price: string) => `Get access for ${price}`,
    rights: "All rights reserved.",
    legalTitle: "Legal and support",
    legalWhatsapp: "WhatsApp support",
    trademarkNotice:
      "Game, studio and platform names shown here belong to their respective owners and are used only to identify compatible games. Games are not included in the purchase. Mentioning them implies no sponsorship or commercial relationship.",

    countdownTitle: "Launch price ends in",
    countdownDays: "days",
    countdownHours: "hours",
    countdownMinutes: "min",
    countdownSeconds: "sec",
    countdownThen: (price: string) => `After that date the method goes to ${price}.`,
    countdownCompact: (clock: string) => `Launch ends in ${clock}`,

    stickySub: (n: number) => `Emulator + ${n} games set up`,
    stickyCta: "Get access",

    popupEyebrow: "Wait, before you go",
    popupTitle: "You were about to leave without seeing the price",
    popupSub: (n: number) => `Emulator, method and settings for the ${n} games. One payment.`,
    popupBullets: ["Android and iPhone", "7-day guarantee", "No subscription"],
    popupCta: "I want this price",
    popupNote: (price: string) => `After the deadline, the same method costs ${price}.`,
    popupDismiss: "Not now",

    ctaVsl: "See the method",
    ctaCatalog: "I want these on my phone",
    ctaTestimonials: "I want to play today too",
    ctaGuarantee: "Try it risk-free for 7 days",
    ctaDeliverables: "I want to play on my phone today",
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
      ["Your GTA V on your phone, tonight", "I want to start now"],
      ["Spotted your favourites? All 12 come set up.", "I want these 12 on my phone"],
      ["One payment. No subscription, no renewal.", "Get my access"],
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
  heroBadge: (d: number) => (d > 0 ? `Precio de lanzamiento · -${d}%` : "Android y iPhone"),
  heroTitleA: "Tus juegos de PC,",
  heroTitleB: () => "ahora en el celular.",
  heroSub: (price: string) =>
    `Emulador + método paso a paso para correr GTA V, Red Dead 2, Elden Ring, God of War Ragnarök y 8 más en Android y iPhone. Configuración lista para cada juego y soporte humano, por ${price} en pago único.`,
  heroCta: "Quiero jugar en el celular",
  heroSecondary: "Ver los 12 juegos",
  heroCompare: (full: string, save: string) => (
    <>
      Después del lanzamiento, <span className="line-through">{full}</span>. Comprando hoy te
      ahorras <span className="font-semibold text-foreground">{save}</span>.
    </>
  ),
  valueAnchor: (console: string, pc: string, price: string) => (
    <>
      Una consola nueva cuesta{" "}
      <span className="font-semibold text-foreground">más de {console}</span>. Una PC gamer,{" "}
      <span className="font-semibold text-foreground">más de {pc}</span>. Aquí juegas en el celular
      por <span className="font-semibold text-foreground">{price}</span>, una sola vez.
    </>
  ),
  heroAlt: (n: number) => `${n} juegos de PC corriendo en el celular con el emulador`,
  heroMore: (n: number) => `+ ${n} juegos con configuración lista`,
  heroTrust: ["Android y iPhone", "Acceso en minutos", "7 días de garantía"],
  stats: (price: string) =>
    [
      [price, "Una vez. Nunca más."],
      ["12 juegos", "Con configuración lista"],
      ["7 días", "No corrió, te devolvemos"],
    ] as [string, string][],

  whyCheapTitle: "¿Por qué tan barato?",
  whyCheapSub: "Es la pregunta correcta. Aquí va la respuesta directa.",
  whyCheap: [
    [
      "El emulador es gratuito",
      "La tecnología que corre juegos de PC en el celular es abierta y gratuita. No pagas por ella: pagas por el atajo de no pasar días probando versiones, drivers y configuraciones.",
    ],
    [
      "Pagas una sola vez",
      "Sin suscripción, sin renovación y sin cargos ocultos. El método es tuyo, y las configuraciones de los 12 juegos vienen incluidas.",
    ],
    [
      "Usas tus propios juegos",
      "No vendemos juegos. Corres los que ya tienes, como los de tu cuenta de Steam, y por eso el precio es el de un método, no el de 12 juegos.",
    ],
  ] as [string, string][],

  deliverablesTitleA: "Todo lo que necesitas",
  deliverablesTitleB: "para jugar en el celular hoy",
  deliverablesSub:
    "De la descarga del emulador al primer juego abierto, con personas reales del otro lado.",
  deliverables: () =>
    [
      [
        "Emulador para Android y iPhone",
        "Instalación paso a paso en los dos, incluido el iPhone, que se instala fuera de la App Store.",
      ],
      ["Acceso en minutos", "Pagas y el método llega a tu correo."],
      ["Acceso de por vida", "Pagas una vez, sin mensualidades."],
      [
        "Configuración por juego",
        "Ajustes listos para cada uno de los 12 juegos, para no perder tiempo probando.",
      ],
      [
        "Tus juegos en el celular",
        "Cómo llevar los juegos que ya tienes, incluidos los de Steam, al emulador.",
      ],
      [
        "Control y rendimiento",
        "Cómo conectar un control Bluetooth y equilibrar gráficos y FPS en tu equipo.",
      ],
      ["Soporte humano", "Un equipo real en WhatsApp para destrabar cualquier paso."],
      ["Garantía de 7 días", "¿No corrió en tu celular? Te devolvemos el 100%."],
    ] as [string, string][],

  catalogEyebrow: "Juegos que corres en el celular",
  catalogTitle: (n: number) => `Los ${n} más pedidos, con configuración lista.`,
  catalogSub:
    "Cada uno tiene ajustes propios en el método. El rendimiento depende del juego y del equipo: en los más pesados, espera algo cerca de 720p a 30 fps.",
  coverAlt: (name: string) => `Portada de ${name}`,

  offerEyebrow: (n: number) => `Método Framers · emulador + ${n} juegos configurados`,
  offerCompare: "Después del lanzamiento:",
  offerToday: "Hoy, pago único de",
  offerSpec: (n: number) => `Android y iPhone · ${n} juegos con configuración lista`,
  fxNote: "Monto aproximado en tu moneda. El checkout confirma el valor final.",
  offerNote:
    "Requiere Android con Snapdragon 8 Gen 2 o superior, o iPhone 13 Pro o más nuevo. Los juegos no están incluidos: usas los tuyos.",
  includes: (n: number) => [
    "Emulador con instalación paso a paso para Android y iPhone",
    `Configuración lista para los ${n} juegos`,
    "Cómo importar tus propios juegos, incluso desde Steam",
    "Guía de control y rendimiento",
    "Soporte humano por WhatsApp",
    "Garantía de 7 días o te devolvemos el dinero",
  ],

  guaranteeTitle: "El riesgo es todo nuestro",
  guaranteeSub:
    "Instálalo y pruébalo en tu celular durante 7 días. Si no corre o no te gusta, por el motivo que sea, te devolvemos todo, sin justificar nada.",
  guaranteeBadges: [
    "Compra 100% segura",
    "7 días de garantía",
    "Reembolso sin preguntas",
    "Soporte humano",
  ],

  brandsTitle: "Juegos de estudios como",

  testimonialsEyebrow: "Mensajes reales de clientes",
  testimonialsTitle: "Instaló, abrió y jugó",
  testimonialsSub:
    "Capturas de nuestro WhatsApp, sin editar. Es el tipo de mensaje que llega después de la compra.",
  // Order matches ASSETS.proofChatEs.
  testimonials: [
    {
      alt: "Cliente mostrando GTA V corriendo en el celular, diciendo que el acceso le llegó al instante y que ya lleva horas jugando",
      caption: "Le llegó el acceso al instante y ya lleva horas jugando GTA V en el celular.",
    },
    {
      alt: "Cliente mostrando GTA V corriendo en su iPhone, diciendo que instaló el emulador y funcionó a la primera",
      caption: "Instaló el emulador en su iPhone y funcionó a la primera.",
    },
  ],

  faqTitle: "Preguntas frecuentes",
  faq: (price: string, n: number) => [
    {
      q: `¿De verdad son ${price}, sin trampa?`,
      a: `Sí. Un único pago de ${price} por el emulador, el método y la configuración de los ${n} juegos. Sin mensualidad y sin renovación automática. Fuera del Reino Unido, el valor se convierte a tu moneda al cambio del día, y el checkout de Hotmart muestra el monto final antes de pagar.`,
    },
    {
      q: "¿Los juegos están incluidos?",
      a: "No. Recibes el emulador, el método y las configuraciones. Los juegos son tuyos: usas los que ya tienes, como los de tu cuenta de Steam, y el método muestra cómo llevar cada uno al celular.",
    },
    {
      q: "¿Funcionará en mi celular?",
      a: "En Android necesitas un procesador Snapdragon 8 Gen 2 o superior. En iPhone, un iPhone 13 Pro o más nuevo. En equipos de gama media no corre, y preferimos que lo sepas antes de comprar. Si aun así no corre en el tuyo, los 7 días de garantía te cubren.",
    },
    {
      q: "¿Cómo es el rendimiento?",
      a: "Depende del juego y del equipo. En los más pesados, espera algo cerca de 720p a 30 fps: se puede jugar, pero no es una PC gamer. Los más livianos corren mucho mejor.",
    },
    {
      q: "¿De verdad funciona en iPhone?",
      a: "Funciona, pero la instalación es distinta: el emulador no está en la App Store, así que se instala por fuera (sideload), sin hacer jailbreak. El método te muestra el paso a paso y el soporte te acompaña.",
    },
    {
      q: "¿Cuándo recibo el acceso?",
      a: "Al instante. En cuanto se confirma el pago, el acceso llega a tu correo, normalmente en pocos minutos. Si no llega, el soporte te lo reenvía.",
    },
    {
      q: "¿Y si no me gusta?",
      a: "Tienes 7 días para pedir el reembolso completo, sin explicar el motivo. El riesgo es todo nuestro.",
    },
  ],

  footerLinks: [
    { label: "Los 12 juegos", href: "#jogos" },
    { label: "Oferta", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ],
  footerSub: (n: number, price: string) =>
    `Emulador y método para correr ${n} juegos de PC en el celular, por ${price} en pago único.`,
  footerLinksTitle: "Enlaces rápidos",
  footerReady: "¿Listo para jugar en el celular?",
  footerCta: (price: string) => `Conseguir acceso por ${price}`,
  rights: "Todos los derechos reservados.",
  legalTitle: "Legal y soporte",
  legalWhatsapp: "Soporte por WhatsApp",
  trademarkNotice:
    "Los nombres de juegos, estudios y plataformas citados pertenecen a sus titulares y se usan solo para identificar los juegos compatibles. Los juegos no están incluidos en la compra. Mencionarlos no implica patrocinio ni vínculo comercial.",

  countdownTitle: "El precio de lanzamiento termina en",
  countdownDays: "días",
  countdownHours: "horas",
  countdownMinutes: "min",
  countdownSeconds: "seg",
  countdownThen: (price: string) => `Después de esa fecha el método pasa a costar ${price}.`,
  countdownCompact: (clock: string) => `Lanzamiento termina en ${clock}`,

  stickySub: (n: number) => `Emulador + ${n} juegos configurados`,
  stickyCta: "Quiero acceso",

  popupEyebrow: "Espera, antes de irte",
  popupTitle: "Te ibas sin ver el precio",
  popupSub: (n: number) => `Emulador, método y configuración para los ${n} juegos. Pago único.`,
  popupBullets: ["Android y iPhone", "7 días de garantía", "Sin mensualidad"],
  popupCta: "Quiero ese precio",
  popupNote: (price: string) => `Pasado el plazo, el mismo método cuesta ${price}.`,
  popupDismiss: "Ahora no",

  ctaVsl: "Ver el método",
  ctaCatalog: "Quiero jugarlos en el celular",
  ctaTestimonials: "Yo también quiero jugar hoy",
  ctaGuarantee: "Probar sin riesgo 7 días",
  ctaDeliverables: "Quiero jugar en el celular hoy",
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
    ["Tu GTA V en el celular, esta misma noche", "Quiero empezar ahora"],
    ["¿Ya viste tus favoritos? Los 12 vienen configurados.", "Quiero estos 12 en el celular"],
    ["Pago único. Sin mensualidad, sin renovación.", "Quiero mi acceso"],
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
  heroBadge: (d: number) => (d > 0 ? `लॉन्च कीमत · -${d}%` : "Android और iPhone"),
  heroTitleA: "आपके PC गेम्स,",
  heroTitleB: () => "अब आपके फ़ोन पर।",
  heroSub: (price: string) =>
    `एमुलेटर + स्टेप बाय स्टेप तरीका, जिससे GTA V, Red Dead 2, Elden Ring, God of War Ragnarök और 8 और गेम्स Android और iPhone पर चलें। हर गेम के लिए तैयार सेटिंग्स और इंसानी सपोर्ट, सिर्फ ${price} में, एक बार भुगतान।`,
  heroCta: "मुझे फ़ोन पर खेलना है",
  heroSecondary: "12 गेम्स देखें",
  heroCompare: (full: string, save: string) => (
    <>
      लॉन्च के बाद <span className="line-through">{full}</span>। आज खरीदें और{" "}
      <span className="font-semibold text-foreground">{save}</span> बचाएं।
    </>
  ),
  valueAnchor: (console: string, pc: string, price: string) => (
    <>
      नया कंसोल <span className="font-semibold text-foreground">{console} से ज़्यादा</span> का आता
      है। गेमिंग PC, <span className="font-semibold text-foreground">{pc} से ज़्यादा</span> का। यहाँ
      आप फ़ोन पर सिर्फ <span className="font-semibold text-foreground">{price}</span> में खेलते हैं,
      एक बार।
    </>
  ),
  heroAlt: (n: number) => `एमुलेटर से फ़ोन पर चलते ${n} PC गेम्स`,
  heroMore: (n: number) => `+ ${n} गेम्स तैयार सेटिंग्स के साथ`,
  heroTrust: ["Android और iPhone", "मिनटों में एक्सेस", "7 दिन की गारंटी"],
  stats: (price: string) =>
    [
      [price, "एक बार। बस।"],
      ["12 गेम्स", "तैयार सेटिंग्स के साथ"],
      ["7 दिन", "न चले तो रिफंड"],
    ] as [string, string][],

  whyCheapTitle: "इतना सस्ता क्यों?",
  whyCheapSub: "यही सही सवाल है। यह रहा सीधा जवाब।",
  whyCheap: [
    [
      "एमुलेटर मुफ़्त है",
      "फ़ोन पर PC गेम्स चलाने वाली तकनीक ओपन और मुफ़्त है। आप उसके पैसे नहीं देते: आप उस शॉर्टकट के पैसे देते हैं जिससे वर्ज़न, ड्राइवर और सेटिंग्स टेस्ट करने में दिन नहीं लगते।",
    ],
    [
      "आप एक बार भुगतान करते हैं",
      "कोई सब्सक्रिप्शन नहीं, कोई रिन्यूअल नहीं और कोई छिपा चार्ज नहीं। तरीका आपका है, और 12 गेम्स की सेटिंग्स साथ आती हैं।",
    ],
    [
      "आप अपने गेम्स इस्तेमाल करते हैं",
      "हम गेम्स नहीं बेचते। आप वही गेम्स चलाते हैं जो आपके पास पहले से हैं, जैसे आपकी Steam लाइब्रेरी, इसलिए कीमत एक तरीके की है, 12 गेम्स की नहीं।",
    ],
  ] as [string, string][],

  deliverablesTitleA: "वह सब जो चाहिए",
  deliverablesTitleB: "आज ही फ़ोन पर खेलने के लिए",
  deliverablesSub: "एमुलेटर डाउनलोड से पहला गेम खोलने तक, असली लोगों के सपोर्ट के साथ।",
  deliverables: () =>
    [
      [
        "Android और iPhone के लिए एमुलेटर",
        "दोनों पर स्टेप बाय स्टेप इंस्टॉलेशन, iPhone पर भी, जहाँ यह App Store के बाहर से इंस्टॉल होता है।",
      ],
      ["मिनटों में एक्सेस", "भुगतान के बाद तरीका आपके ईमेल पर।"],
      ["लाइफटाइम एक्सेस", "एक बार भुगतान, कोई मंथली नहीं।"],
      [
        "हर गेम की सेटिंग्स",
        "12 में से हर गेम के लिए तैयार सेटिंग्स, ताकि टेस्टिंग में समय न जाए।",
      ],
      ["आपके गेम्स फ़ोन पर", "आपके पास पहले से मौजूद गेम्स, Steam वाले भी, एमुलेटर में कैसे लाएं।"],
      [
        "कंट्रोलर और परफ़ॉर्मेंस",
        "Bluetooth कंट्रोलर कैसे जोड़ें और ग्राफ़िक्स व FPS का संतुलन कैसे बनाएं।",
      ],
      ["इंसानी सपोर्ट", "किसी भी स्टेप पर मदद के लिए WhatsApp पर असली टीम।"],
      ["7 दिन की गारंटी", "आपके फ़ोन पर नहीं चला? पूरा पैसा वापस।"],
    ] as [string, string][],

  catalogEyebrow: "गेम्स जो आप फ़ोन पर चला सकते हैं",
  catalogTitle: (n: number) => `सबसे ज़्यादा मांगे जाने वाले ${n}, तैयार सेटिंग्स के साथ।`,
  catalogSub:
    "हर गेम की तरीके में अपनी सेटिंग्स हैं। परफ़ॉर्मेंस गेम और डिवाइस पर निर्भर है: सबसे भारी गेम्स में लगभग 720p पर 30 fps की उम्मीद रखें।",
  coverAlt: (name: string) => `${name} का कवर`,

  offerEyebrow: (n: number) => `Framers तरीका · एमुलेटर + ${n} गेम्स सेट`,
  offerCompare: "लॉन्च के बाद:",
  offerToday: "आज, एक बार भुगतान",
  offerSpec: (n: number) => `Android और iPhone · ${n} गेम्स तैयार सेटिंग्स के साथ`,
  fxNote: "आपकी मुद्रा में अनुमानित राशि। चेकआउट अंतिम राशि की पुष्टि करता है।",
  offerNote:
    "Snapdragon 8 Gen 2 या उससे नया Android, या iPhone 13 Pro या उससे नया चाहिए। गेम्स शामिल नहीं हैं: आप अपने गेम्स इस्तेमाल करते हैं।",
  includes: (n: number) => [
    "Android और iPhone के लिए स्टेप बाय स्टेप इंस्टॉलेशन के साथ एमुलेटर",
    `${n} गेम्स के लिए तैयार सेटिंग्स`,
    "अपने गेम्स कैसे इम्पोर्ट करें, Steam से भी",
    "कंट्रोलर और परफ़ॉर्मेंस गाइड",
    "WhatsApp पर इंसानी सपोर्ट",
    "7 दिन की मनी बैक गारंटी",
  ],

  guaranteeTitle: "पूरा जोखिम हमारा है",
  guaranteeSub:
    "इंस्टॉल कीजिए और 7 दिन तक अपने फ़ोन पर आज़माइए। न चले या पसंद न आए, किसी भी वजह से, तो पूरा पैसा वापस, कोई सफ़ाई नहीं देनी।",
  guaranteeBadges: ["100% सुरक्षित खरीद", "7 दिन की गारंटी", "बिना सवाल रिफंड", "इंसानी सपोर्ट"],

  brandsTitle: "इन जैसे स्टूडियो के गेम्स",

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
      q: `क्या सच में सिर्फ ${price}?`,
      a: `हाँ। एमुलेटर, तरीके और ${n} गेम्स की सेटिंग्स के लिए एक बार ${price} का भुगतान। कोई मंथली नहीं और ऑटो रिन्यूअल नहीं। राशि आज की दर से आपकी मुद्रा में बदली जाती है, और Hotmart चेकआउट भुगतान से पहले अंतिम राशि दिखाता है।`,
    },
    {
      q: "क्या गेम्स शामिल हैं?",
      a: "नहीं। आपको एमुलेटर, तरीका और सेटिंग्स मिलती हैं। गेम्स आपके अपने हैं: आप वही इस्तेमाल करते हैं जो आपके पास हैं, जैसे आपकी Steam लाइब्रेरी, और तरीका दिखाता है कि हर गेम फ़ोन पर कैसे लाएं।",
    },
    {
      q: "क्या मेरे फ़ोन पर चलेगा?",
      a: "Android पर Snapdragon 8 Gen 2 या उससे नया प्रोसेसर चाहिए। iPhone पर iPhone 13 Pro या उससे नया। मिड-रेंज फ़ोन पर नहीं चलता, और हम चाहते हैं कि आपको खरीदने से पहले पता हो। फिर भी आपके फ़ोन पर न चले, तो 7 दिन की गारंटी है।",
    },
    {
      q: "परफ़ॉर्मेंस कैसी है?",
      a: "गेम और डिवाइस पर निर्भर है। सबसे भारी गेम्स में लगभग 720p पर 30 fps: खेलने लायक, लेकिन गेमिंग PC जैसा नहीं। हल्के गेम्स काफ़ी बेहतर चलते हैं।",
    },
    {
      q: "क्या यह सच में iPhone पर चलता है?",
      a: "चलता है, लेकिन इंस्टॉलेशन अलग है: एमुलेटर App Store पर नहीं है, इसलिए यह बाहर से (साइडलोड) इंस्टॉल होता है, बिना जेलब्रेक के। तरीका स्टेप बाय स्टेप दिखाता है और सपोर्ट साथ रहता है।",
    },
    {
      q: "एक्सेस कब मिलेगा?",
      a: "तुरंत। भुगतान कन्फर्म होते ही एक्सेस ईमेल पर आ जाता है, आमतौर पर कुछ ही मिनटों में।",
    },
    {
      q: "पसंद न आए तो?",
      a: "7 दिन के भीतर बिना वजह बताए पूरा रिफंड मांग सकते हैं। पूरा जोखिम हमारा है।",
    },
  ],

  footerLinks: [
    { label: "12 गेम्स", href: "#jogos" },
    { label: "ऑफर", href: "#oferta" },
    { label: "FAQ", href: "#faq" },
  ],
  footerSub: (n: number, price: string) =>
    `फ़ोन पर ${n} PC गेम्स चलाने के लिए एमुलेटर और तरीका, सिर्फ ${price} में, एक बार भुगतान।`,
  footerLinksTitle: "क्विक लिंक",
  footerReady: "फ़ोन पर खेलने के लिए तैयार?",
  footerCta: (price: string) => `${price} में एक्सेस लें`,
  rights: "सर्वाधिकार सुरक्षित।",
  legalTitle: "लीगल और सपोर्ट",
  legalWhatsapp: "WhatsApp सपोर्ट",
  trademarkNotice:
    "यहाँ दिए गेम, स्टूडियो और प्लेटफ़ॉर्म के नाम उनके मालिकों के हैं और सिर्फ़ संगत गेम्स पहचानने के लिए इस्तेमाल किए गए हैं। गेम्स खरीद में शामिल नहीं हैं। इनका ज़िक्र किसी प्रायोजन या व्यापारिक संबंध का संकेत नहीं है।",

  countdownTitle: "लॉन्च कीमत खत्म होने में",
  countdownDays: "दिन",
  countdownHours: "घंटे",
  countdownMinutes: "मिनट",
  countdownSeconds: "सेकंड",
  countdownThen: (price: string) => `इस तारीख के बाद तरीके की कीमत ${price} हो जाएगी।`,
  countdownCompact: (clock: string) => `लॉन्च खत्म: ${clock}`,

  stickySub: (n: number) => `एमुलेटर + ${n} गेम्स सेट`,
  stickyCta: "एक्सेस चाहिए",

  popupEyebrow: "रुकिए, जाने से पहले",
  popupTitle: "आप कीमत देखे बिना जा रहे थे",
  popupSub: (n: number) => `${n} गेम्स के लिए एमुलेटर, तरीका और सेटिंग्स। एक बार भुगतान।`,
  popupBullets: ["Android और iPhone", "7 दिन की गारंटी", "कोई मंथली नहीं"],
  popupCta: "मुझे यही कीमत चाहिए",
  popupNote: (price: string) => `समय खत्म होने के बाद वही तरीका ${price} का होगा।`,
  popupDismiss: "अभी नहीं",

  ctaVsl: "तरीका देखें",
  ctaCatalog: "मुझे ये फ़ोन पर चाहिए",
  ctaTestimonials: "मुझे भी आज खेलना है",
  ctaGuarantee: "7 दिन बिना जोखिम आज़माएं",
  ctaDeliverables: "आज फ़ोन पर खेलना शुरू करें",
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
    ["आपका GTA V आज रात आपके फ़ोन पर", "अभी शुरू करें"],
    ["फेवरेट देख लिए? सभी 12 सेट होकर आते हैं।", "मुझे ये 12 फ़ोन पर चाहिए"],
    ["एक बार भुगतान। कोई मंथली नहीं, कोई रिन्यूअल नहीं।", "मुझे एक्सेस चाहिए"],
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

export function buildLocale(
  lang: Lang,
  resolved: ResolvedMarket = FALLBACK_RESOLVED,
  checkout: CheckoutProvider = "hotmart",
) {
  const cfg = CONFIG[lang];
  const { market, price } = resolved;

  const money = (value: number) => formatMoney(value, market);
  const hidePrice = !SHOW_PRICE;

  /**
   * The hardware anchor (see ANCHOR_* in campaign.ts), in the visitor's currency.
   * `price` is the offer price already converted, so scaling it by the anchor's
   * ratio to the base price applies the exact same conversion. Rounded down to two
   * significant digits and shown without cents: "more than R$ 1.700" reads as a
   * reference, "more than R$ 1.798,62" reads as a quote, and rounding down keeps
   * "more than" true.
   */
  const base = basePriceAt(resolved.now);
  const fromBase = (amount: number) => (base > 0 ? (price * amount) / base : 0);
  const floorRound = (value: number) => {
    if (!(value > 0)) return 0;
    const step = 10 ** Math.max(0, Math.floor(Math.log10(value)) - 1);
    return Math.floor(value / step) * step;
  };
  const moneyWhole = (value: number) => {
    try {
      return withCurrencyCode(
        value.toLocaleString(market.intl, {
          style: "currency",
          currency: market.currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
        market.currency,
      );
    } catch {
      return `${market.currency} ${Math.round(value)}`;
    }
  };

  /**
   * The crossed-out price, and the discount derived from it.
   *
   * It used to be the twelve games bought one by one (12 x R$20 = R$240, "93%
   * OFF"). The front now sells an emulator and a method, not the games, so that
   * anchor became a claim about something the buyer is not getting. The anchor is
   * now the price after the launch window, which campaign.ts enforces: a real
   * number the buyer will actually face. Once the window closes the two prices
   * meet, `hasAnchor` turns false and every strike-through disappears with it.
   */
  const anchor =
    resolved.priceAfter != null && resolved.priceAfter > price ? resolved.priceAfter : null;
  const fullValue = anchor ?? price;

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
    // Every buy button reads this one value. The /xpag copy of the landing swaps
    // the checkout here and nowhere else.
    storeUrl:
      checkout === "xpag" ? XPAG_CHECKOUT_URL : checkoutUrlFor(market.currency, cfg.storeUrl),
    checkout,

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
    upsellPrice: resolved.upsellPrice,

    money,
    price,
    hidePrice,
    priceLabel,
    totalGames: FRONT_GAMES_COUNT,
    fullValue,
    hasAnchor: anchor != null,
    consoleFrom: moneyWhole(floorRound(fromBase(ANCHOR_CONSOLE_FROM))),
    gamingPcFrom: moneyWhole(floorRound(fromBase(ANCHOR_GAMING_PC_FROM))),
    pricePerGame: price / FRONT_GAMES_COUNT,
    discount: anchor ? Math.round((1 - price / anchor) * 100) : 0,
    t: COPY_BY_LANG[lang],
  };
}

export type Locale = ReturnType<typeof buildLocale>;

const LocaleContext = createContext<Locale>(buildLocale("pt"));

export function LocaleProvider({
  lang,
  market,
  checkout = "hotmart",
  children,
}: {
  lang: Lang;
  /** Resolved server-side. Omitted only in contexts with no request. */
  market?: ResolvedMarket;
  /** Which checkout the buy buttons lead to. Hotmart unless the route says otherwise. */
  checkout?: CheckoutProvider;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={buildLocale(lang, market, checkout)}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
