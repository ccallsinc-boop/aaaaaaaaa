/**
 * The site's public origin, used by canonical tags, hreflang alternates,
 * og:image, structured data, the sitemap and robots.txt.
 *
 * It used to be the literal string "https://framers.lovable.app" repeated in 44
 * places across the route files. Moving off Lovable means every one of those is
 * wrong, and getting it wrong is expensive: Google learns the old origin, the
 * canonicals point at a domain you no longer control, and social previews break.
 *
 * Set VITE_SITE_URL at build time to the real domain. It is a VITE_ variable
 * because these tags are rendered during the build, so a runtime value would
 * arrive too late.
 */
const FALLBACK_ORIGIN = "https://framers.lovable.app";

function resolveOrigin(): string {
  const configured =
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SITE_URL"]) ||
    (typeof process !== "undefined" && process.env?.["SITE_URL"]);

  const raw = typeof configured === "string" ? configured.trim() : "";
  if (!raw) return FALLBACK_ORIGIN;

  // Tolerates a value pasted with or without protocol and with a trailing slash.
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export const SITE_ORIGIN = resolveOrigin();

/** True while the site is still advertising the Lovable origin. */
export const SITE_ORIGIN_IS_FALLBACK = SITE_ORIGIN === FALLBACK_ORIGIN;

/**
 * Absolute URL for a path. `siteUrl("/es")` gives "https://seu-dominio/es",
 * and `siteUrl("/")` keeps the trailing slash that canonical tags expect.
 */
export function siteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
