/**
 * Thin entry in front of the static assets.
 *
 * Its only job is the www → apex redirect. That can't be expressed in a
 * `_redirects` file (Workers Static Assets matches paths only — domain-level
 * redirects are unsupported) and doing it here keeps it in version control
 * rather than as a hand-made dashboard rule.
 *
 * `run_worker_first` is on in wrangler.jsonc, so this runs for every request
 * and hands anything that isn't a redirect to the asset layer.
 */

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

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
