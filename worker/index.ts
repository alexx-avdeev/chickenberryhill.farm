/**
 * Thin entry in front of the static assets.
 *
 * Two jobs:
 *
 *   1. www → apex redirect. That can't be expressed in a `_redirects` file
 *      (Workers Static Assets matches paths only — domain-level redirects are
 *      unsupported) and doing it here keeps it in version control rather than
 *      as a hand-made dashboard rule.
 *   2. Inject the Google tag into HTML when `GA_MEASUREMENT_ID` is set. The
 *      site is built statically, so a Worker variable is invisible at build
 *      time — it has to be written into the response.
 *
 * `run_worker_first` is on in wrangler.jsonc, so this runs for every request
 * and hands anything that isn't a redirect to the asset layer.
 */

/** GA4 measurement IDs only. Anything else is refused so it can't break HTML. */
const MEASUREMENT_ID = /^G-[A-Z0-9]+$/i;

function googleTag(id: string): string {
  const src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  // JSON.stringify quotes and escapes the id. The regex above already limits
  // it to G- plus letters and digits; this is the second lock on the attribute.
  const configId = JSON.stringify(id);
  return (
    `<script async src="${src}"></script>` +
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${configId});</script>`
  );
}

function withGoogleTag(response: Response, id: string): Response {
  return new HTMLRewriter()
    .on("head", {
      element(element) {
        element.append(googleTag(id), { html: true });
      },
    })
    .transform(response);
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
    const id = env.GA_MEASUREMENT_ID?.trim();
    const type = response.headers.get("content-type") ?? "";
    if (!id || !MEASUREMENT_ID.test(id) || !type.includes("text/html") || !response.body) {
      return response;
    }

    return withGoogleTag(response, id);
  },
} satisfies ExportedHandler<Env>;
