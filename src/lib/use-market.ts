import { useLoaderData } from "@tanstack/react-router";

import { FALLBACK_RESOLVED, type ResolvedMarket } from "@/lib/markets";

/**
 * The market resolved by the root route loader (country + live rate).
 *
 * Falls back to a static USD market rather than throwing, so a route rendered
 * outside the root loader still shows a price instead of a blank.
 */
export function useMarket(): ResolvedMarket {
  const data = useLoaderData({ from: "__root__", structuralSharing: false }) as
    ResolvedMarket | undefined;
  return data ?? FALLBACK_RESOLVED;
}
