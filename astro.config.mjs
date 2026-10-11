// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Fully static build. The output in dist/ is served straight from Cloudflare
// Workers Static Assets — see wrangler.jsonc.
export default defineConfig({
  // Canonical origin. The apex is canonical and www redirects to it, so this
  // is what every <link rel="canonical"> and og:url resolves against. Flip it
  // here (and flip the redirect rule) if www should be canonical instead.
  site: "https://chickenberryhill.farm",

  build: {
    format: "directory",
  },

  // Emits sitemap-index.xml + sitemap-0.xml into dist/, with absolute URLs
  // built from `site` above. The 404 page is not a real destination, so keep
  // it out.
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
    }),
  ],

  // Self-hosted fonts (see src/assets/fonts/README.md). Astro copies them to
  // /_astro/fonts/ (cached as immutable by worker/index.ts), writes the
  // @font-face rules, and generates metric-matched fallbacks so the swap from
  // the fallback font to the web font doesn't shift the layout.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      fallbacks: ["system-ui", "-apple-system", "sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/manrope-latin-wght-400-700.woff2"],
            weight: "400 700",
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      fallbacks: ["Georgia", "serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/newsreader-latin-opsz-6-72-wght-400-500.woff2"],
            weight: "400 500",
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});