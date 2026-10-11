/**
 * Thin entry in front of the static assets.
 *
 * It has two jobs:
 *
 * 1. The www → apex redirect. That can't go in a `_redirects` file (Workers
 *    Static Assets matches paths only and doesn't support domain-level
 *    redirects), and doing it here keeps it in version control rather than
 *    in a hand-made dashboard rule.
 * 2. Browser caching. `run_worker_first` is on in wrangler.jsonc, so every
 *    asset response passes through this script. Cloudflare's docs say
 *    `_headers` rules are not applied to responses from Worker code in that
 *    setup, so cache headers are set here instead.
 *
 * Anything that isn't a redirect is handed to the asset layer.
 */

/** Long-lived, never-revalidated caching, for content-hashed files only. */
const IMMUTABLE = "public, max-age=31536000, immutable";
/**
 * Stable URLs whose bytes can change in place (share card, favicon): cache
 * for a day, then revalidate with the ETag.
 */
const SHORT = "public, max-age=86400, must-revalidate";

function cacheControlFor(pathname: string): string | null {
  // Astro writes every processed asset (CSS, JS, optimised images) to
  // /_astro/ with a content hash in its filename, so a changed file always
  // gets a new URL.
  if (pathname.startsWith("/_astro/")) return IMMUTABLE;
  if (pathname.startsWith("/og/") || pathname === "/favicon.svg") return SHORT;
  // Everything else, HTML included, keeps the platform default
  // (`public, max-age=0, must-revalidate`), so a deploy is visible at once.
  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      // Force https so this is a single hop to the canonical URL rather than
      // redirecting to http and relying on a second redirect to upgrade it.
      url.protocol = "https:";
      // 301: permanent, and preserves the path and query already on `url`.
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);

    const cacheControl = cacheControlFor(url.pathname);
    // Only touch successful (and not-modified) responses; a 404 for a
    // mistyped /_astro/ URL must not be cached for a year.
    if (!cacheControl || (response.status !== 200 && response.status !== 304)) {
      return response;
    }

    // Asset responses can have immutable headers; copy before editing.
    const cached = new Response(response.body, response);
    cached.headers.set("Cache-Control", cacheControl);
    return cached;
  },
} satisfies ExportedHandler<Env>;
