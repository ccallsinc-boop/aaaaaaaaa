import { siteUrl } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { BrGameQuiz } from "@/components/quiz/BrGameQuiz";

const TITLE = "Descubra seu pacote ideal de jogos — Framers";
const DESCRIPTION =
  "Responda cinco perguntas e descubra seu pacote com os 12 jogos de PC mais pedidos, acesso imediato e 7 dias de garantia.";
const URL = siteUrl("/br-quiz");

export const Route = createFileRoute("/br-quiz")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: BrQuizPage,
});

function BrQuizPage() {
  return <BrGameQuiz />;
}
