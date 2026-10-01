import { createFileRoute } from "@tanstack/react-router";
import { EsGameQuiz } from "@/components/quiz/EsGameQuiz";

const TITLE = "Descubre tu pack ideal de juegos — Framers";
const DESCRIPTION = "Responde cinco preguntas y descubre tu pack con los 12 juegos de PC más pedidos, acceso inmediato y garantía de 7 días.";

export const Route = createFileRoute("/es-quiz2")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EsQuiz2Page,
});

function EsQuiz2Page() {
  return <EsGameQuiz />;
}
