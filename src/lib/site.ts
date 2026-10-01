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

/**
 * Usado quando VITE_SITE_URL não foi definida.
 *
 * Era o domínio da Lovable, o que é o pior valor possível depois da migração:
 * aponta canonical, og:image e sitemap para um domínio que serve a versão antiga
 * do site, então o Google aprende o endereço errado e os previews sociais carregam
 * do host que estamos abandonando. O endereço do Netlify é onde o site está de
 * fato, então erra para o lado certo. Mesmo assim é um fallback, não o alvo:
 * defina VITE_SITE_URL com o domínio final.
 */
const FALLBACK_ORIGIN = "https://durcle.netlify.app";

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

/** True while nenhum domínio foi configurado e o fallback está no ar. */
export const SITE_ORIGIN_IS_FALLBACK = SITE_ORIGIN === FALLBACK_ORIGIN;

// Avisa no log do build e do servidor. Sem isto a falta de VITE_SITE_URL é
// invisível: o site sobe, funciona, e anuncia o domínio errado em todas as tags.
if (SITE_ORIGIN_IS_FALLBACK && typeof window === "undefined") {
  console.warn(
    `[site] VITE_SITE_URL não definida: canonical, og:image e sitemap vão usar ${FALLBACK_ORIGIN}. ` +
      "Defina a variável no contexto de produção e rode um novo build.",
  );
}

/**
 * Absolute URL for a path. `siteUrl("/es")` gives "https://seu-dominio/es",
 * and `siteUrl("/")` keeps the trailing slash that canonical tags expect.
 */
export function siteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
