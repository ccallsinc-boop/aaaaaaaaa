import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal/LegalPage";

const TITLE = "Termos de uso · Framers";
const DESCRIPTION =
  "Termos de uso do pacote digital Framers: o que está incluso, entrega, suporte, pagamento e garantia de 7 dias.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      // Policy pages carry no commercial intent and should not compete with the
      // landing routes in search.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return <LegalPage kind="terms" />;
}
