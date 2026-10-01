/**
 * Where the site's media actually lives.
 *
 * The project was built on Lovable, so every heavy asset is referenced through a
 * `*.asset.json` manifest pointing at `/__l5e/assets-v1/...`. Only Lovable serves
 * that path: on any other host those URLs are a 404. Migrating off Lovable means
 * moving each file into `public/media/` and pointing the code here instead.
 *
 * Nothing here points at Lovable any more: every path below is local. The files
 * that were never downloaded are still declared with the local path they will
 * have, so dropping the file into `public/media/` is the whole migration, with no
 * code change. Until then the components that use them hide the player instead of
 * rendering a broken one, and MISSING_ASSETS keeps the gap visible in one place.
 */

/** Served from public/media, so the path is stable and needs no bundler import. */
const local = (file: string) => `/media/${file}`;

export const ASSETS = {
  /**
   * The "product working" demo. Re-encoded from the 1882px source to 1280px
   * H.264: 9.83 MB to 1.75 MB, 82% lighter, with a poster so the card is not a
   * black rectangle before playback.
   */
  demoVideo: local("produto-funcionando.mp4"),
  demoPoster: local("produto-funcionando-poster.jpg"),

  /**
   * The Spanish VSL. The original was a 55 MB QuickTime file, which Chrome on
   * Android often refuses to decode. Re-encoded to 900px H.264 at 5.67 MB, and
   * it is nearly square (900x890), not 16:9 as the old player assumed.
   */
  vslEs: local("vsl-es.mp4"),
  vslEsPoster: local("vsl-es-poster.jpg"),

  /** Customer photos used as visual proof. */
  proof: [local("proof-1.jpg"), local("proof-2.jpg"), local("proof-3.jpg")],

  /** Unedited WhatsApp screenshots, used as the real social proof. */
  proofChat: [local("wpp-1.jpg"), local("wpp-2.jpg"), local("wpp-3.jpg")],

  /** Hero artwork. The pt source was a 1.3 MB PNG, now a 389 KB JPEG. */
  heroPt: local("destaque-gta.jpg"),
  heroDefault: local("destaque-gta-en.png"),

  logo: local("framers-logo.webp"),
} as const;

/**
 * VSLs dos quizzes, que nunca foram baixadas da Lovable.
 *
 * O caminho local já é o definitivo: basta colocar o arquivo em `public/media/`
 * com esse nome e o player volta sozinho, sem tocar em código. Enquanto o arquivo
 * não existir, as telas de VSL escondem o player e seguem com o título e o CTA,
 * porque um <video> apontando para um 404 custa mais conversão que nenhum vídeo.
 *
 * A fonte está na Lovable, nos caminhos abaixo, servidos pelo domínio de preview
 * do projeto. A de português é QuickTime de 60 MB: converter para mp4 H.264 antes
 * de subir, como foi feito com a VSL em espanhol, senão o Chrome no Android não
 * decodifica.
 *
 *   vsl-br.mov  /__l5e/assets-v1/fce8def7-d43c-42fc-9ff1-7469d46c4d83/vsl-br.mov
 *   vsl2.mp4    /__l5e/assets-v1/7e56a540-2ff3-4dae-8e3f-6395ffa13f93/vsl2.mp4
 *   vsl2-poster /__l5e/assets-v1/4f4b451f-a343-45d8-beb7-23bf7711b570/vsl2-poster.jpg
 */
export const QUIZ_VSL = {
  br: { src: local("vsl-br.mp4"), poster: local("vsl-br-poster.jpg") },
  en: { src: local("vsl2.mp4"), poster: local("vsl2-poster.jpg") },
} as const;

/**
 * Files that were never downloaded from Lovable.
 *
 * Nothing in the code points at Lovable any more, so these are not broken URLs,
 * they are absent files: the component that uses one hides it. Everything the
 * landing and the upsell need is migrated. What is left only affects the quiz
 * routes and /es2, which is a different product.
 */
export const MISSING_ASSETS = [
  {
    file: "vsl-br.mp4",
    mb: 57.3,
    note: "VSL do quiz em português (/br-quiz). Fonte é QuickTime, converter para mp4 H.264",
  },
  { file: "vsl2.mp4", mb: 6.6, note: "VSL do quiz em inglês (/en-quiz)" },
  { file: "vsl2-poster.jpg", mb: 0.06, note: "poster do quiz em inglês (/en-quiz)" },
  { file: "cover.jpg", mb: 0.02, note: "/es2, outro produto" },
  { file: "euromaxxing.jpg", mb: 0.1, note: "/es2, outro produto" },
  { file: "groceries.jpg", mb: 0.14, note: "/es2, outro produto" },
  { file: "italian.jpg", mb: 0.09, note: "/es2, outro produto" },
  { file: "peat.jpg", mb: 0.03, note: "/es2, outro produto" },
  { file: "primal.jpg", mb: 0.21, note: "/es2, outro produto" },
  { file: "pyramid.jpg", mb: 0.07, note: "/es2, outro produto" },
  { file: "rawmilk.jpg", mb: 0.08, note: "/es2, outro produto" },
] as const;
