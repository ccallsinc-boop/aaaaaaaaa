import { createFileRoute } from "@tanstack/react-router";
import { EnGameQuiz } from "@/components/quiz/EnGameQuiz";

const TITLE = "Find your perfect PC game pack — Framers";
const DESCRIPTION =
  "Answer five quick questions and unlock a personalized library of 424 PC games with instant access and a 7-day guarantee.";
const URL = "https://framers.lovable.app/en-quiz";

export const Route = createFileRoute("/en-quiz")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: EnQuizPage,
});

function EnQuizPage() {
  return <EnGameQuiz />;
}
