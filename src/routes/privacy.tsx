import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal/LegalPage";

const TITLE = "Política de privacidade · Framers";
const DESCRIPTION = "Quais dados o site Framers coleta, para que usa e com quem compartilha.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      // Policy pages carry no commercial intent and should not compete with the
      // landing routes in search.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}
