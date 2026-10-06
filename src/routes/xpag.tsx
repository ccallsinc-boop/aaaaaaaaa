import { createFileRoute, notFound } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";
import { isXpagConfigured } from "@/lib/checkout";
import { siteUrl } from "@/lib/site";

const TITLE = "Framers — Tus juegos de PC en el celular";

/**
 * The landing at /, selling through Xpag instead of Hotmart.
 *
 * Same page, same copy, same language and currency resolution: the visitor's
 * country decides both, and `?country=MX` (or CO, AR...) forces them from the ad
 * link exactly as it does on /. Only the checkout differs, so ads can split traffic
 * between the two by URL alone: /?country=MX for Hotmart, /xpag?country=MX for
 * Xpag. Buy-button events carry `checkout: "xpag"` to tell the two apart.
 *
 * Kept out of search on purpose: it duplicates /, and the copy that should rank is
 * the canonical one there.
 */
export const Route = createFileRoute("/xpag")({
  /** No checkout link, no page: a buy button that leads nowhere is worse than a 404. */
  beforeLoad: () => {
    if (!isXpagConfigured()) throw notFound();
  },
  head: () => ({
    meta: [{ title: TITLE }, { name: "robots", content: "noindex, nofollow" }],
    links: [{ rel: "canonical", href: siteUrl("/") }],
  }),
  component: XpagLanding,
});

function XpagLanding() {
  return <LandingPage checkout="xpag" />;
}
