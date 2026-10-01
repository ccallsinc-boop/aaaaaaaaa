import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal/LegalPage";

const TITLE = "Política de reembolso · Framers";
const DESCRIPTION =
  "Garantia de 7 dias no pacote Framers: prazo, como pedir e como o estorno é processado.";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      // Policy pages carry no commercial intent and should not compete with the
      // landing routes in search.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return <LegalPage kind="refund" />;
}
