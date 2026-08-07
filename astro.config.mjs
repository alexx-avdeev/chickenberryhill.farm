// @ts-check
import { defineConfig } from "astro/config";

// Fully static build. The output in dist/ is served straight from Cloudflare
// Workers Static Assets — see wrangler.jsonc.
export default defineConfig({
  site: "https://chickenberryhill.farm",
  build: {
    format: "directory",
  },
});
