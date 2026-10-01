import { createFileRoute } from "@tanstack/react-router";
import { EsGameQuiz } from "@/components/quiz/EsGameQuiz";

const TITLE = "Descubre tu pack ideal de juegos — Framers";
const DESCRIPTION = "Responde cinco preguntas y descubre una biblioteca personalizada con 424 juegos de PC, acceso inmediato y garantía de 7 días.";
const URL = "https://framers.lovable.app/es-quiz";

export const Route = createFileRoute("/es-quiz")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "es_ES" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: EsQuizPage,
});

function EsQuizPage() {
  return <EsGameQuiz />;
}