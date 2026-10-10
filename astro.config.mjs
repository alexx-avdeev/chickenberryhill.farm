// @ts-check
import { defineConfig } from "astro/config";

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

  vite: {
    plugins: [tailwindcss()],
  },
});