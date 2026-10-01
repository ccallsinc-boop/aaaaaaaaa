// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      /**
       * The Lovable preset binds the dev server to `::` on 8080. Any host without
       * IPv6 (most CI images and plenty of containers) dies on startup with
       * EAFNOSUPPORT before serving a single request. Binding to IPv4 works
       * everywhere, including inside Lovable.
       *
       * Override with VITE_DEV_HOST / VITE_DEV_PORT when a specific bind is needed.
       */
      host: process.env["VITE_DEV_HOST"] ?? "127.0.0.1",
      port: Number(process.env["VITE_DEV_PORT"] ?? 8080),
      strictPort: false,
    },
  },
});
