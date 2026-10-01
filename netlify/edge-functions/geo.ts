/**
 * Injeta o país do visitante na requisição antes da SSR.
 *
 * A função de SSR do Netlify nem sempre recebe `x-nf-geo`: dependendo de como o
 * request chega na função (redirect declarativo, rota interna do Nitro), o header
 * de geo não é repassado, e aí todo visitante cai no mercado padrão em dólar. O
 * `?country=XX` continuava funcionando porque é lido da URL, não do header, que é
 * exatamente o sintoma de "manual funciona, automático não".
 *
 * Numa Edge Function o país não depende de header nenhum: vem do `context.geo`,
 * que o Netlify sempre preenche. Aqui ele é gravado em `x-geo-country`, que o
 * `src/lib/market.server.ts` já lê na sua lista de headers.
 *
 * Sem tipos do @netlify/edge-functions de propósito: o pacote não é dependência
 * do projeto e este arquivo é compilado pelo Deno do Netlify, não pelo nosso
 * bundle. O tipo mínimo abaixo é só o que este arquivo usa.
 */

type GeoContext = {
  geo?: { country?: { code?: string } };
  next: (request?: Request) => Promise<Response>;
};

export default async function injectGeo(request: Request, context: GeoContext): Promise<Response> {
  const code = context.geo?.country?.code?.trim();

  // Sem país conhecido não há nada a acrescentar: segue o fluxo normal e a SSR
  // usa o mercado padrão, como já fazia.
  if (!code) return context.next();

  try {
    const headers = new Headers(request.headers);
    headers.set("x-geo-country", code.toUpperCase());
    return await context.next(new Request(request, { headers }));
  } catch {
    // Se este runtime não aceitar uma requisição modificada, o site continua de
    // pé com o mercado padrão. Uma Edge Function que lança erro derruba a página
    // inteira, e preço errado é melhor que página branca.
    return context.next();
  }
}

export const config = {
  path: "/*",
  excludedPath: ["/media/*", "/fonts/*", "/assets/*", "/_build/*", "/favicon.ico"],
};
