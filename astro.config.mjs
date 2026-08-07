// @ts-check
import { defineConfig } from "astro/config";

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
});
