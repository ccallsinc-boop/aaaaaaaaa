# Framers

Landing e funil de venda do pacote de jogos para PC. TanStack Start (React 19,
SSR) com Tailwind 4, build por Vite e deploy em Cloudflare Workers via Nitro.

## Rodar local

```bash
bun install
cp .env.example .env   # preencha os valores
bun run dev            # http://127.0.0.1:8080
```

`bun run check` roda typecheck e build, que é o mesmo que o CI executa.

## Estrutura do funil

| Rota | O que é |
|---|---|
| `/` | Landing unificada. Idioma e moeda vêm do país do visitante |
| `/pt` `/es` `/en` `/uk` `/in` | Mesma landing com idioma fixo, para os anúncios que já apontam para elas |
| `/br-quiz` `/es-quiz` `/en-quiz` | Quizzes que levam ao mesmo checkout |
| `/upsell` | Oferta pós-compra. Responde 404 até ter checkout próprio |
| `/terms` `/privacy` `/refund` | Páginas legais, servidas no idioma do visitante |
| `/biblioteca` `/auth` | Área de membros (Supabase) |
| `/store` `/clips` `/es2` | Outros produtos, não fazem parte deste funil |

## Preço e moeda

Existe **um** preço, em real, em `src/lib/campaign.ts`. Todas as outras moedas
são esse número na cotação do momento.

- O país vem do header da borda (`CF-IPCountry` na Cloudflare), sem custo e sem cota
- A cotação é buscada no servidor, com cache de 6 horas, dois provedores em
  sequência e uma tabela estática como último recurso em `src/lib/fx.server.ts`
- Para testar qualquer moeda sem VPN: `?country=MX`, `?country=CO`, etc.

A janela de lançamento em `src/lib/campaign.ts` é cumprida pelo código: enquanto
aberta o preço é um, quando fecha o servidor passa a cobrar o outro. Estender a
data sem mexer no preço transforma a contagem em mentira.

## O que precisa ser preenchido

| Arquivo | O que falta |
|---|---|
| `src/lib/company.ts` | Razão social, CNPJ, endereço, e-mail e WhatsApp de suporte. Campo vazio é omitido da página, nunca preenchido com placeholder |
| `src/lib/upsell.ts` | `UPSELL_ACCEPT_URL` com uma oferta Hotmart **própria**. Enquanto for igual à do front, `/upsell` responde 404 de propósito |
| `.env` | `VITE_SITE_URL` com o domínio real |

## Deploy

Alvo: Cloudflare Workers. O Nitro gera `.output/server/wrangler.json` no build.

### Manual

```bash
bunx wrangler login
VITE_SITE_URL=https://seu-dominio.com bun run deploy
```

`bun run deploy:dry` faz a mesma coisa sem publicar, útil para conferir o
tamanho do bundle e os bindings.

### Automático

`.github/workflows/deploy.yml` publica a cada push na branch padrão. Precisa de:

**Secrets:** `CLOUDFLARE_API_TOKEN` (template "Edit Cloudflare Workers") e
`CLOUDFLARE_ACCOUNT_ID`.

**Variables:** `VITE_SITE_URL`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY` e, opcionalmente, `WORKER_NAME`.

As variáveis `VITE_` precisam existir **no build**, não só em runtime: o Vite
embute o valor no bundle, então defini-las apenas como variável de runtime do
Worker chega tarde demais.

### Depois do primeiro deploy

1. Aponte o domínio em Workers & Pages > seu worker > Settings > Domains & Routes
2. Rebuild com `VITE_SITE_URL` no domínio final, senão canonical, og:image e
   sitemap continuam apontando para o host antigo
3. Envie `https://seu-dominio/sitemap.xml` no Search Console

## Assets

Tudo que as landings usam está em `public/media` e `public/fonts`. O que ainda
depende do CDN do Lovable está listado em `MISSING_ASSETS`, em
`src/lib/assets.ts`: os vídeos dos quizzes BR e EN e as imagens do `/clips`.
Essas rotas ficam com vídeo quebrado fora do Lovable.

Vídeo novo entra reencodado. O VSL original era um `.mov` de 55 MB que o Chrome
do Android frequentemente recusa:

```bash
ffmpeg -i entrada.mov -vf "scale=900:-2" \
  -c:v libx264 -profile:v high -preset slow -crf 27 -pix_fmt yuv420p \
  -movflags +faststart -c:a aac -b:a 112k -ac 2 saida.mp4
```

## Rastreamento

Dois pixels do Meta em `src/lib/meta-pixel.ts`. Eventos: `PageView`,
`ViewContent`, `InitiateCheckout` (com `cta_location` em cada um dos 16 pontos),
`Scroll50`, `Scroll90`, `TimeOnPage30s`, mais `OfferPopupView`, `UpsellView` e
`UpsellDecline`.

Valor e moeda em todo evento são os do visitante. Páginas legais e o upsell não
disparam `ViewContent`.
