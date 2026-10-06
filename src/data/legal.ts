import { COMPANY } from "@/lib/company";
import type { MarketLang } from "@/lib/markets";

/**
 * Terms, privacy and refund copy.
 *
 * The footer used to link only to #jogos, #oferta and #faq, so the site had no
 * terms, no privacy policy, no refund policy and no identifiable seller. That is
 * a standard reason for ad rejection and it leaves a chargeback with nothing to
 * point at.
 *
 * The privacy text describes what the code actually does, audited against the
 * source rather than written from a template: two Meta pixels with named events,
 * Xpag checkout, Supabase for accounts, the edge country header used to pick a
 * currency, Google Fonts, Steam cover art, one sessionStorage key and the
 * third-party file hosts the download links point to.
 */

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

/** Shown as "last updated". Bump when the text changes. */
const UPDATED = "2026-10-01";

const PT: Record<"terms" | "privacy" | "refund", LegalDoc> = {
  terms: {
    title: "Termos de uso",
    updated: UPDATED,
    intro: `Estes termos regem a compra e o uso do método digital oferecido por ${COMPANY.tradeName}. Ao concluir a compra, você declara que leu e concorda com eles.`,
    sections: [
      {
        heading: "1. O que você está comprando",
        body: [
          "Um método digital para rodar jogos de PC no celular: guia de instalação de emulador para Android e iPhone, configurações para 12 jogos e suporte, entregue por acesso online, em pagamento único.",
          "Os jogos não estão inclusos. Você usa jogos que já possui; nenhuma cópia de jogo é vendida nem distribuída.",
          "Não existe mensalidade, renovação automática nem cobrança recorrente. O acesso é concedido uma vez e permanece disponível enquanto o serviço existir.",
          "Itens adicionais oferecidos no checkout são opcionais e têm condições próprias, informadas no momento da oferta.",
        ],
      },
      {
        heading: "2. Entrega",
        body: [
          "A entrega é 100% digital. Após a confirmação do pagamento, as instruções de acesso são enviadas para o e-mail informado no checkout, normalmente em poucos minutos.",
          "É sua responsabilidade informar um e-mail válido e verificar a caixa de spam. Se o acesso não chegar, fale com o suporte e nós reenviamos.",
          "O emulador é software de terceiros, baixado da fonte oficial dele e sujeito aos termos dele. Ao clicar num link externo você sai deste site.",
        ],
      },
      {
        heading: "3. Uso pessoal",
        body: [
          "O acesso é pessoal e individual. Não é permitido revender, compartilhar credenciais, redistribuir os arquivos nem usar o conteúdo para fins comerciais.",
          "O descumprimento permite o encerramento do acesso sem reembolso.",
        ],
      },
      {
        heading: "4. Requisitos técnicos",
        body: [
          "Requer Android com processador Snapdragon 8 Gen 2 ou superior, ou iPhone 13 Pro ou mais novo. No iPhone, a instalação é feita por fora da App Store (sideload).",
          "O desempenho varia por jogo e aparelho; nos jogos mais pesados fica em torno de 720p a 30 fps. Não garantimos desempenho em qualquer aparelho.",
          "Antes de comprar, confira os requisitos. Se não funcionar no seu aparelho, a garantia de 7 dias cobre você.",
        ],
      },
      {
        heading: "5. Suporte",
        body: [
          "O suporte é feito por pessoas, nos canais indicados no rodapé, em horário comercial.",
          "O suporte cobre acesso, download e instalação. Não cobre configuração de hardware nem problemas do seu sistema operacional.",
        ],
      },
      {
        heading: "6. Pagamento e emissão",
        body: [
          `O pagamento é processado pela ${COMPANY.platform}, que é responsável pela transação, pela cobrança e pelo comprovante.`,
          "Os preços exibidos neste site são convertidos para a moeda do seu país a partir do valor em real, com cotação de mercado. A cobrança final é a apresentada na tela de pagamento, que prevalece sobre qualquer valor exibido antes.",
        ],
      },
      {
        heading: "7. Garantia e reembolso",
        body: [
          "Você tem 7 dias para pedir reembolso integral, sem necessidade de justificar. Os detalhes estão na política de reembolso.",
        ],
      },
      {
        heading: "8. Alterações",
        body: [
          "Estes termos podem ser atualizados. A data de atualização fica no topo desta página, e mudanças não retroagem sobre compras já realizadas.",
        ],
      },
      {
        heading: "9. Marcas de terceiros",
        body: [
          "Nomes de jogos, estúdios, publishers e plataformas citados neste site pertencem aos seus respectivos titulares, e são usados apenas para identificar os títulos.",
          `A menção a essas marcas não implica patrocínio, endosso ou vínculo comercial com ${COMPANY.tradeName}.`,
        ],
      },
    ],
  },

  privacy: {
    title: "Política de privacidade",
    updated: UPDATED,
    intro:
      "Esta política descreve quais dados este site coleta, por que coleta e com quem compartilha. Ela foi escrita a partir do que o código realmente faz.",
    sections: [
      {
        heading: "1. Dados que você nos dá",
        body: [
          "No checkout: nome, e-mail e os dados de pagamento. Os dados de pagamento são coletados e processados pela plataforma de pagamento, não por este site, e nós não temos acesso ao número do seu cartão.",
          "No suporte: o que você nos escrever por e-mail ou WhatsApp.",
          "Se você criar conta para acessar a área de membros: e-mail e nome, guardados no nosso banco de dados para identificar sua compra.",
        ],
      },
      {
        heading: "2. Dados coletados automaticamente",
        body: [
          "País de acesso: lido do cabeçalho que a nossa infraestrutura de borda adiciona à requisição, usado apenas para escolher o idioma e a moeda exibidos. Não guardamos o seu endereço IP para essa finalidade.",
          "Eventos de navegação, enviados ao Meta (Facebook e Instagram) pelo pixel: visualização de página, visualização do produto, cliques de ida ao checkout, rolagem de 50% e 90% da página, e permanência de 30 segundos. Nos quizzes, também início, respostas e conclusão.",
          "Uma chave em sessionStorage no seu navegador, que apenas registra que você fechou o aviso de desconto, para não mostrá-lo de novo. Ela fica no seu dispositivo e não é enviada a ninguém.",
        ],
      },
      {
        heading: "3. Por que usamos esses dados",
        body: [
          "Para entregar o produto e dar suporte.",
          "Para medir e otimizar anúncios, entendendo quais campanhas geram compra.",
          "Para mostrar preço e idioma adequados ao seu país.",
        ],
      },
      {
        heading: "4. Com quem compartilhamos",
        body: [
          `${COMPANY.platform}: processa o pagamento e emite o comprovante. Recebe os dados necessários à transação.`,
          "Meta Platforms: recebe os eventos de navegação descritos acima, associados aos identificadores de navegador que o pixel utiliza.",
          "Supabase: hospeda o banco de dados de contas e assinaturas da área de membros.",
          "Cloudflare: serve o site e informa o país da requisição.",
          "Google Fonts: as fontes são carregadas dos servidores do Google, que por isso recebem o seu IP.",
          "Akamai e Steam: as capas dos jogos são carregadas do CDN da Steam, que por isso recebe o seu IP.",
          "Serviços de hospedagem de arquivos: os links de download apontam para serviços de terceiros, que aplicam as próprias políticas quando você os acessa.",
          "Não vendemos seus dados.",
        ],
      },
      {
        heading: "5. Seus direitos",
        body: [
          "Você pode pedir acesso, correção ou exclusão dos seus dados, e pode retirar consentimento, falando com o nosso suporte.",
          "Para parar de receber os eventos do pixel, use as preferências de anúncios da sua conta no Meta ou bloqueie rastreadores no navegador.",
          "Pedidos de exclusão não apagam registros que a plataforma de pagamento precise manter por obrigação fiscal.",
        ],
      },
      {
        heading: "6. Retenção",
        body: [
          "Dados de conta e de compra ficam guardados enquanto o acesso existir, e depois pelo prazo legal aplicável a registros fiscais.",
          "Eventos de anúncio seguem a política de retenção do Meta.",
        ],
      },
      {
        heading: "7. Menores",
        body: [
          "Este site não é destinado a menores de 18 anos. Não coletamos dados de menores de forma intencional.",
        ],
      },
      {
        heading: "8. Contato",
        body: [
          "Dúvidas sobre esta política, ou pedidos relativos aos seus dados, pelos canais do rodapé.",
        ],
      },
    ],
  },

  refund: {
    title: "Política de reembolso",
    updated: UPDATED,
    intro:
      "Você tem 7 dias para pedir o dinheiro de volta, contados da confirmação do pagamento, sem precisar explicar o motivo.",
    sections: [
      {
        heading: "1. Prazo",
        body: [
          "7 dias corridos a partir da confirmação do pagamento. O prazo vale mesmo que você já tenha baixado os arquivos.",
        ],
      },
      {
        heading: "2. Como pedir",
        body: [
          `Pelo nosso suporte, nos canais do rodapé, ou diretamente na ${COMPANY.platform}, que processa a transação e executa o estorno.`,
          "Informe o e-mail usado na compra. Não pedimos justificativa.",
        ],
      },
      {
        heading: "3. Prazo do estorno",
        body: [
          `O estorno é executado pela ${COMPANY.platform} e aparece conforme o meio de pagamento usado: cartão de crédito pode levar até duas faturas, PIX e boleto costumam voltar em alguns dias úteis.`,
          "O valor devolvido é o valor pago.",
        ],
      },
      {
        heading: "4. Depois do reembolso",
        body: [
          "O acesso é encerrado quando o reembolso é concluído, e você deve apagar os arquivos baixados.",
        ],
      },
      {
        heading: "5. Fora do prazo",
        body: [
          "Pedidos após 7 dias não são cobertos por esta política. Ainda assim, fale com o suporte: se o problema for de acesso ou de entrega, nós resolvemos.",
        ],
      },
    ],
  },
};

const ES: Record<"terms" | "privacy" | "refund", LegalDoc> = {
  terms: {
    title: "Términos de uso",
    updated: UPDATED,
    intro: `Estos términos rigen la compra y el uso del método digital ofrecido por ${COMPANY.tradeName}. Al completar la compra, declaras que los leíste y los aceptas.`,
    sections: [
      {
        heading: "1. Qué estás comprando",
        body: [
          "Un método digital para correr juegos de PC en el celular: guía de instalación de emulador para Android y iPhone, configuraciones para 12 juegos y soporte, entregado mediante acceso en línea, en un pago único.",
          "Los juegos no están incluidos. Usas juegos que ya tienes; no se vende ni se distribuye ninguna copia de juegos.",
          "No hay mensualidad, renovación automática ni cobro recurrente. El acceso se concede una vez y permanece disponible mientras el servicio exista.",
          "Los artículos adicionales ofrecidos en el checkout son opcionales y tienen condiciones propias, informadas en el momento de la oferta.",
        ],
      },
      {
        heading: "2. Entrega",
        body: [
          "La entrega es 100% digital. Tras confirmarse el pago, las instrucciones de acceso se envían al correo indicado en el checkout, normalmente en pocos minutos.",
          "Es tu responsabilidad indicar un correo válido y revisar la carpeta de spam. Si el acceso no llega, escríbele al soporte y lo reenviamos.",
          "El emulador es software de terceros, descargado desde su fuente oficial y sujeto a sus propios términos. Al pulsar un enlace externo sales de este sitio.",
        ],
      },
      {
        heading: "3. Uso personal",
        body: [
          "El acceso es personal e individual. No se permite revender, compartir credenciales, redistribuir los archivos ni usar el contenido con fines comerciales.",
          "El incumplimiento permite cerrar el acceso sin reembolso.",
        ],
      },
      {
        heading: "4. Requisitos técnicos",
        body: [
          "Requiere Android con procesador Snapdragon 8 Gen 2 o superior, o iPhone 13 Pro o más nuevo. En iPhone, la instalación se hace fuera de la App Store (sideload).",
          "Incluimos guía de instalación y configuraciones por juego, pero no garantizamos rendimiento en cualquier equipo.",
          "El rendimiento varía según el juego y el equipo; en los juegos más pesados ronda los 720p a 30 fps. Revisa los requisitos antes de comprar. Si no funciona en tu equipo, la garantía de 7 días te cubre.",
        ],
      },
      {
        heading: "5. Soporte",
        body: [
          "El soporte lo dan personas, por los canales indicados en el pie de página, en horario laboral.",
          "El soporte cubre acceso, descarga e instalación. No cubre configuración de hardware ni problemas de tu sistema operativo.",
        ],
      },
      {
        heading: "6. Pago y facturación",
        body: [
          `El pago lo procesa ${COMPANY.platform}, responsable de la transacción, del cobro y del comprobante.`,
          "Los precios de este sitio se convierten a la moneda de tu país a partir del valor en reales, con tipo de cambio de mercado. El cobro final es el que aparece en la pantalla de pago, que prevalece sobre cualquier valor mostrado antes.",
        ],
      },
      {
        heading: "7. Garantía y reembolso",
        body: [
          "Tienes 7 días para pedir el reembolso completo, sin justificar el motivo. Los detalles están en la política de reembolso.",
        ],
      },
      {
        heading: "8. Cambios",
        body: [
          "Estos términos pueden actualizarse. La fecha de actualización está al inicio de esta página, y los cambios no se aplican retroactivamente a compras ya realizadas.",
        ],
      },
      {
        heading: "9. Marcas de terceros",
        body: [
          "Los nombres de juegos, estudios, publishers y plataformas citados en este sitio pertenecen a sus respectivos titulares, y se usan solo para identificar los títulos.",
          `Mencionarlos no implica patrocinio, respaldo ni vínculo comercial con ${COMPANY.tradeName}.`,
        ],
      },
    ],
  },

  privacy: {
    title: "Política de privacidad",
    updated: UPDATED,
    intro:
      "Esta política describe qué datos recoge este sitio, para qué y con quién los comparte. Está escrita a partir de lo que el código realmente hace.",
    sections: [
      {
        heading: "1. Datos que nos das",
        body: [
          "En el checkout: nombre, correo y los datos de pago. Los datos de pago los recoge y procesa la plataforma de pago, no este sitio, y nosotros no vemos el número de tu tarjeta.",
          "En soporte: lo que nos escribas por correo o WhatsApp.",
          "Si creas una cuenta para la zona de miembros: correo y nombre, guardados en nuestra base de datos para identificar tu compra.",
        ],
      },
      {
        heading: "2. Datos recogidos automáticamente",
        body: [
          "País de acceso: leído de la cabecera que nuestra infraestructura de borde añade a la petición, usado solo para elegir el idioma y la moneda que ves. No guardamos tu IP para esa finalidad.",
          "Eventos de navegación enviados a Meta (Facebook e Instagram) por el píxel: vista de página, vista de producto, clics hacia el checkout, desplazamiento del 50% y del 90%, y permanencia de 30 segundos. En los quizzes, también inicio, respuestas y finalización.",
          "Una clave en sessionStorage de tu navegador, que solo registra que cerraste el aviso de descuento, para no volver a mostrarlo. Queda en tu dispositivo y no se envía a nadie.",
        ],
      },
      {
        heading: "3. Para qué los usamos",
        body: [
          "Para entregar el producto y dar soporte.",
          "Para medir y optimizar los anuncios, entendiendo qué campañas generan compras.",
          "Para mostrar el precio y el idioma adecuados a tu país.",
        ],
      },
      {
        heading: "4. Con quién los compartimos",
        body: [
          `${COMPANY.platform}: procesa el pago y emite el comprobante. Recibe los datos necesarios para la transacción.`,
          "Meta Platforms: recibe los eventos de navegación descritos arriba, asociados a los identificadores de navegador que usa el píxel.",
          "Supabase: aloja la base de datos de cuentas y suscripciones de la zona de miembros.",
          "Cloudflare: sirve el sitio e informa el país de la petición.",
          "Google Fonts: las tipografías se cargan desde servidores de Google, que por eso reciben tu IP.",
          "Akamai y Steam: las portadas de los juegos se cargan del CDN de Steam, que por eso recibe tu IP.",
          "Servicios de alojamiento de archivos: los enlaces de descarga apuntan a servicios de terceros, que aplican sus propias políticas cuando los abres.",
          "No vendemos tus datos.",
        ],
      },
      {
        heading: "5. Tus derechos",
        body: [
          "Puedes pedir acceso, corrección o eliminación de tus datos, y retirar tu consentimiento, escribiendo a nuestro soporte.",
          "Para dejar de enviar los eventos del píxel, usa las preferencias de anuncios de tu cuenta de Meta o bloquea rastreadores en el navegador.",
          "Las solicitudes de eliminación no borran registros que la plataforma de pago deba conservar por obligación fiscal.",
        ],
      },
      {
        heading: "6. Conservación",
        body: [
          "Los datos de cuenta y de compra se conservan mientras exista el acceso, y después por el plazo legal aplicable a registros fiscales.",
          "Los eventos de anuncios siguen la política de conservación de Meta.",
        ],
      },
      {
        heading: "7. Menores",
        body: [
          "Este sitio no está dirigido a menores de 18 años. No recogemos datos de menores de forma intencionada.",
        ],
      },
      {
        heading: "8. Contacto",
        body: [
          "Dudas sobre esta política, o solicitudes sobre tus datos, por los canales del pie de página.",
        ],
      },
    ],
  },

  refund: {
    title: "Política de reembolso",
    updated: UPDATED,
    intro:
      "Tienes 7 días para pedir la devolución del dinero, contados desde la confirmación del pago, sin tener que explicar el motivo.",
    sections: [
      {
        heading: "1. Plazo",
        body: [
          "7 días corridos desde la confirmación del pago. El plazo vale incluso si ya descargaste los archivos.",
        ],
      },
      {
        heading: "2. Cómo pedirlo",
        body: [
          `Por nuestro soporte, en los canales del pie de página, o directamente en ${COMPANY.platform}, que procesa la transacción y ejecuta la devolución.`,
          "Indica el correo que usaste en la compra. No pedimos justificación.",
        ],
      },
      {
        heading: "3. Plazo de la devolución",
        body: [
          `La devolución la ejecuta ${COMPANY.platform} y aparece según el medio de pago usado: una tarjeta de crédito puede tardar hasta dos ciclos de facturación, y los medios locales suelen volver en pocos días hábiles.`,
          "El importe devuelto es el importe pagado.",
        ],
      },
      {
        heading: "4. Después del reembolso",
        body: [
          "El acceso se cierra cuando el reembolso se completa, y debes borrar los archivos descargados.",
        ],
      },
      {
        heading: "5. Fuera de plazo",
        body: [
          "Las solicitudes después de 7 días no están cubiertas por esta política. Aun así, escribe al soporte: si el problema es de acceso o de entrega, lo resolvemos.",
        ],
      },
    ],
  },
};

const EN: Record<"terms" | "privacy" | "refund", LegalDoc> = {
  terms: {
    title: "Terms of use",
    updated: UPDATED,
    intro: `These terms govern the purchase and use of the digital method offered by ${COMPANY.tradeName}. By completing your purchase, you confirm that you have read and accept them.`,
    sections: [
      {
        heading: "1. What you are buying",
        body: [
          "A digital method to run PC games on a phone: an emulator installation guide for Android and iPhone, settings for 12 games and support, delivered as online access, for a one-time payment.",
          "Games are not included. You use games you already own; no copy of any game is sold or distributed.",
          "There is no subscription, auto-renewal or recurring charge. Access is granted once and stays available for as long as the service exists.",
          "Add-ons offered at checkout are optional and carry their own terms, shown at the time of the offer.",
        ],
      },
      {
        heading: "2. Delivery",
        body: [
          "Delivery is fully digital. Once payment is confirmed, access instructions are sent to the email you entered at checkout, usually within minutes.",
          "Entering a valid email and checking your spam folder is on you. If access does not arrive, contact support and we will resend it.",
          "The emulator is third-party software, downloaded from its official source and subject to its own terms. Clicking an external link takes you off this site.",
        ],
      },
      {
        heading: "3. Personal use",
        body: [
          "Access is personal and individual. Reselling, sharing credentials, redistributing the files or using the content commercially is not permitted.",
          "Breaching this allows us to close the access without a refund.",
        ],
      },
      {
        heading: "4. Technical requirements",
        body: [
          "Requires Android with a Snapdragon 8 Gen 2 or newer, or an iPhone 13 Pro or newer. On iPhone, installation happens outside the App Store (sideloading).",
          "Performance varies by game and device; on the heaviest games it is around 720p at 30 fps. We do not guarantee performance on any given device.",
          "Check the requirements before buying. If it does not run on your device, the 7-day guarantee covers you.",
        ],
      },
      {
        heading: "5. Support",
        body: [
          "Support is handled by people, through the channels listed in the footer, during business hours.",
          "Support covers access, download and installation. It does not cover hardware configuration or problems with your operating system.",
        ],
      },
      {
        heading: "6. Payment and invoicing",
        body: [
          `Payment is processed by ${COMPANY.platform}, which is responsible for the transaction, the charge and the receipt.`,
          "Prices on this site are converted into your country's currency from the Brazilian real amount, at market rates. The final charge is the one shown on the payment screen, which prevails over any amount displayed earlier.",
        ],
      },
      {
        heading: "7. Guarantee and refund",
        body: [
          "You have 7 days to request a full refund, with no need to give a reason. Details are in the refund policy.",
        ],
      },
      {
        heading: "8. Changes",
        body: [
          "These terms may be updated. The update date is at the top of this page, and changes do not apply retroactively to purchases already made.",
        ],
      },
      {
        heading: "9. Third-party trademarks",
        body: [
          "Game, studio, publisher and platform names on this site belong to their respective owners and are used only to identify the titles.",
          `Mentioning them implies no sponsorship, endorsement or commercial relationship with ${COMPANY.tradeName}.`,
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy policy",
    updated: UPDATED,
    intro:
      "This policy describes what data this site collects, why, and who it is shared with. It was written from what the code actually does.",
    sections: [
      {
        heading: "1. Data you give us",
        body: [
          "At checkout: name, email and payment details. Payment details are collected and processed by the payment platform, not by this site, and we never see your card number.",
          "In support: whatever you write to us by email or WhatsApp.",
          "If you create an account for the members area: email and name, stored in our database to identify your purchase.",
        ],
      },
      {
        heading: "2. Data collected automatically",
        body: [
          "Country of access: read from the header our edge infrastructure adds to the request, used only to choose the language and currency you see. We do not store your IP address for this.",
          "Browsing events sent to Meta (Facebook and Instagram) by the pixel: page view, product view, clicks through to checkout, 50% and 90% scroll depth, and 30 seconds on page. In the quizzes, also start, answers and completion.",
          "One sessionStorage key in your browser, recording only that you dismissed the discount notice so it is not shown again. It stays on your device and is sent to nobody.",
        ],
      },
      {
        heading: "3. Why we use it",
        body: [
          "To deliver the product and provide support.",
          "To measure and optimise advertising, by understanding which campaigns lead to purchases.",
          "To show the price and language that match your country.",
        ],
      },
      {
        heading: "4. Who we share it with",
        body: [
          `${COMPANY.platform}: processes payment and issues the receipt. Receives the data needed for the transaction.`,
          "Meta Platforms: receives the browsing events described above, tied to the browser identifiers the pixel uses.",
          "Supabase: hosts the accounts and subscriptions database for the members area.",
          "Cloudflare: serves the site and reports the country of the request.",
          "Google Fonts: typefaces load from Google's servers, which therefore receive your IP.",
          "Akamai and Steam: game cover art loads from Steam's CDN, which therefore receives your IP.",
          "File hosting services: download links point to third-party services, which apply their own policies when you open them.",
          "We do not sell your data.",
        ],
      },
      {
        heading: "5. Your rights",
        body: [
          "You can request access to, correction of or deletion of your data, and withdraw consent, by contacting our support.",
          "To stop the pixel events, use the ad preferences in your Meta account or block trackers in your browser.",
          "Deletion requests do not erase records the payment platform must keep for tax purposes.",
        ],
      },
      {
        heading: "6. Retention",
        body: [
          "Account and purchase data is kept for as long as the access exists, then for the statutory period applicable to tax records.",
          "Advertising events follow Meta's own retention policy.",
        ],
      },
      {
        heading: "7. Minors",
        body: [
          "This site is not intended for anyone under 18. We do not knowingly collect data from minors.",
        ],
      },
      {
        heading: "8. Contact",
        body: [
          "Questions about this policy, or requests about your data, through the channels in the footer.",
        ],
      },
    ],
  },

  refund: {
    title: "Refund policy",
    updated: UPDATED,
    intro:
      "You have 7 days to ask for your money back, counted from payment confirmation, with no need to explain why.",
    sections: [
      {
        heading: "1. Window",
        body: [
          "7 calendar days from payment confirmation. The window applies even if you already downloaded the files.",
        ],
      },
      {
        heading: "2. How to request it",
        body: [
          `Through our support, via the channels in the footer, or directly with ${COMPANY.platform}, which processes the transaction and issues the refund.`,
          "Give us the email you used for the purchase. We do not ask for a reason.",
        ],
      },
      {
        heading: "3. How long it takes",
        body: [
          `The refund is issued by ${COMPANY.platform} and appears according to your payment method: a credit card can take up to two billing cycles, and local methods usually return within a few business days.`,
          "The amount refunded is the amount paid.",
        ],
      },
      {
        heading: "4. After the refund",
        body: [
          "Access is closed once the refund completes, and you must delete the downloaded files.",
        ],
      },
      {
        heading: "5. Outside the window",
        body: [
          "Requests after 7 days are not covered by this policy. Even so, contact support: if the problem is access or delivery, we will fix it.",
        ],
      },
    ],
  },
};

const BY_LANG: Record<MarketLang, typeof PT> = {
  pt: PT,
  es: ES,
  en: EN,
  // No Hindi translation yet; English is the closest usable text.
  hi: EN,
};

export type LegalKind = "terms" | "privacy" | "refund";

export function legalDoc(kind: LegalKind, lang: MarketLang): LegalDoc {
  return BY_LANG[lang][kind];
}

/** Footer labels, kept next to the documents so they cannot drift apart. */
export const LEGAL_LINKS: Record<MarketLang, { label: string; href: string }[]> = {
  pt: [
    { label: "Termos de uso", href: "/terms" },
    { label: "Privacidade", href: "/privacy" },
    { label: "Reembolso", href: "/refund" },
  ],
  es: [
    { label: "Términos de uso", href: "/terms" },
    { label: "Privacidad", href: "/privacy" },
    { label: "Reembolso", href: "/refund" },
  ],
  en: [
    { label: "Terms of use", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Refunds", href: "/refund" },
  ],
  hi: [
    { label: "Terms of use", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Refunds", href: "/refund" },
  ],
};
