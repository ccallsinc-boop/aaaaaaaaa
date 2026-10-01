/**
 * Where the site's media actually lives.
 *
 * The project was built on Lovable, so every heavy asset is referenced through a
 * `*.asset.json` manifest pointing at `/__l5e/assets-v1/...`. Only Lovable serves
 * that path: on any other host those URLs are a 404. Migrating off Lovable means
 * moving each file into `public/media/` and pointing the code here instead.
 *
 * Assets already migrated get a local path. The rest keep the Lovable URL so the
 * site still renders there while the move finishes, and MISSING_ASSETS lists what
 * is left, so the gap is visible in one place instead of spread across manifests.
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
} as const;

/**
 * Still served by Lovable and therefore broken on any other host.
 *
 * The two VSLs are the urgent ones: they are QuickTime (`video/quicktime`), which
 * Chrome on Android often refuses to decode, and they weigh 55 MB and 57 MB for
 * roughly a minute of video. Re-encode them to H.264 MP4 before moving them, which
 * fixes the playback bug and the weight in the same step.
 */
export const MISSING_ASSETS = [
  { file: "vsl-es2.mov", mb: 55.6, note: "VSL do /es. QuickTime, trocar por mp4 H.264" },
  { file: "vsl-br.mov", mb: 57.3, note: "VSL do /pt. QuickTime, trocar por mp4 H.264" },
  { file: "vsl2.mp4", mb: 6.6, note: "VSL alternativa" },
  { file: "vsl2-poster.jpg", mb: 0.06, note: "poster da VSL alternativa" },
  { file: "proof-1.jpg", mb: 0.12, note: "foto de cliente" },
  { file: "proof-2.jpg", mb: 0.1, note: "foto de cliente" },
  { file: "proof-3.jpg", mb: 0.1, note: "foto de cliente" },
  { file: "destaque-gta.png", mb: 1.3, note: "imagem do hero, versão pt" },
  { file: "destaque-gta-en.png", mb: 0.16, note: "imagem do hero, demais idiomas" },
  { file: "framers-logo-new.png", mb: 0.07, note: "logo" },
  { file: "DINNextW1G-Regular.woff", mb: 0.07, note: "fonte, referenciada em styles.css" },
  { file: "DINNextW1G-Bold.woff", mb: 0.06, note: "fonte, referenciada em styles.css" },
  { file: "WiseSans-Heavy.woff2", mb: 0.05, note: "fonte, referenciada em styles.css" },
  { file: "TW-Averta-Regular.woff2", mb: 0.08, note: "fonte, referenciada em styles.css" },
  { file: "TW-Averta-Semibold.woff2", mb: 0.07, note: "fonte, referenciada em styles.css" },
  { file: "cover.jpg", mb: 0.02, note: "/clips, outro produto" },
  { file: "euromaxxing.jpg", mb: 0.1, note: "/clips, outro produto" },
  { file: "groceries.jpg", mb: 0.14, note: "/clips, outro produto" },
  { file: "italian.jpg", mb: 0.09, note: "/clips, outro produto" },
  { file: "peat.jpg", mb: 0.03, note: "/clips, outro produto" },
  { file: "primal.jpg", mb: 0.21, note: "/clips, outro produto" },
  { file: "pyramid.jpg", mb: 0.07, note: "/clips, outro produto" },
  { file: "rawmilk.jpg", mb: 0.08, note: "/clips, outro produto" },
] as const;
