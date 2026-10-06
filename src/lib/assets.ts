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

  /**
   * The Spanish VSL for the emulator offer. The source was a 29 MB, 60 fps
   * QuickTime file; re-encoded to 1280px H.264 at 30 fps with faststart, 8.4 MB,
   * which keeps the burned-in subtitles legible. It is 16:9 (1280x716), unlike
   * the near-square video it replaced. The poster is a frame from 0:25.
   */
  vslEs: local("vsl-es-emulador.mp4"),
  vslEsPoster: local("vsl-es-emulador-poster.jpg"),

  /** Customer photos used as visual proof. */
  proof: [local("proof-1.jpg"), local("proof-2.jpg"), local("proof-3.jpg")],

  /** Unedited WhatsApp screenshots, used as the real social proof. */
  proofChat: [local("wpp-1.jpg"), local("wpp-2.jpg"), local("wpp-3.jpg")],

  /**
   * WhatsApp screenshots from Spanish-speaking customers playing on their phones
   * with the emulator. Shown only to the Spanish funnel (landing and quiz).
   */
  proofChatEs: [local("wpp-es-1.jpg"), local("wpp-es-2.jpg")],

  /** Hero artwork. The pt source was a 1.3 MB PNG, now a 389 KB JPEG. */
  heroPt: local("destaque-gta.jpg"),
  heroDefault: local("destaque-gta-en.png"),

  logo: local("framers-logo.webp"),
} as const;

/**
 * Still served by Lovable and therefore broken on any other host.
 *
 * Everything the landing routes need has been migrated. What is left is the
 * Portuguese VSL, which still needs converting from QuickTime, and the images for
 * /clips, which is a different product.
 */
export const MISSING_ASSETS = [
  {
    file: "vsl-br.mov",
    mb: 57.3,
    note: "VSL do quiz em português. QuickTime, converter para mp4 H.264",
  },
  { file: "vsl2.mp4", mb: 6.6, note: "VSL do quiz em inglês" },
  { file: "vsl2-poster.jpg", mb: 0.06, note: "poster do quiz em inglês" },
  { file: "cover.jpg", mb: 0.02, note: "/clips, outro produto" },
  { file: "euromaxxing.jpg", mb: 0.1, note: "/clips, outro produto" },
  { file: "groceries.jpg", mb: 0.14, note: "/clips, outro produto" },
  { file: "italian.jpg", mb: 0.09, note: "/clips, outro produto" },
  { file: "peat.jpg", mb: 0.03, note: "/clips, outro produto" },
  { file: "primal.jpg", mb: 0.21, note: "/clips, outro produto" },
  { file: "pyramid.jpg", mb: 0.07, note: "/clips, outro produto" },
  { file: "rawmilk.jpg", mb: 0.08, note: "/clips, outro produto" },
] as const;
