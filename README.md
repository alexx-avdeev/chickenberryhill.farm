# chickenberryhill.farm

Marketing site for ChickenBerry Hill Farm — Hartsville, Tennessee.

Static [Astro](https://astro.build) site, deployed to Cloudflare as an
assets-only Worker.

## Develop

```bash
npm install
npm run dev
```

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server on http://localhost:4321                 |
| `npm run build`   | Static build into `dist/`                           |
| `npm run preview` | Builds, then serves `dist/` through `wrangler dev`  |
| `npm run check`   | Astro + TypeScript diagnostics                      |
| `npm run deploy`  | Builds and `wrangler deploy`                        |

## Structure

```
src/
  data/site.ts        content: products, animals, values, contact details
  layouts/            BaseLayout — head, fonts, nav, footer
  components/         Nav, Footer, Logo, Photo, InstagramIcon
  pages/              index, about, products, contact, 404
  styles/global.css   design tokens + shared classes
public/images/        farm photos (see the README in there)
```

Copy lives in `src/data/site.ts` wherever it repeats across pages; one-off
prose stays in the page that uses it.

### Design tokens

The palette is oklch, defined once as custom properties at the top of
`src/styles/global.css` — `--berry` (the terracotta used for primary buttons
and the logo), `--green` (links and eyebrows), `--ink*` (text), and the surface
and border tokens. Change a colour there and it moves everywhere.

Type is Newsreader (display) and Manrope (UI), loaded from Google Fonts in
`BaseLayout.astro`.

## Deploy

Fully static — `dist/` is served by Cloudflare Workers Static Assets, with no
Worker script in front of it (`wrangler.jsonc` has no `main`).

```bash
npm run deploy
```

First deploy needs `npx wrangler login`.

### Domains

`wrangler.jsonc` attaches both hostnames to the Worker as custom domains, so
Cloudflare creates and manages their DNS records on deploy. The zone must
already be on the same Cloudflare account.

| Host                        | Role                          |
| --------------------------- | ----------------------------- |
| `chickenberryhill.farm`     | canonical — serves the site   |
| `www.chickenberryhill.farm` | redirects to the apex         |

The apex is canonical: `site` in `astro.config.mjs` sets it, and every
`<link rel="canonical">` and `og:url` points there. So even before the
redirect exists, www serves the site while pointing search engines at the
apex — it just serves duplicate content.

The www → apex redirect is handled in code, by `worker/index.ts` — no
dashboard setup needed. It 301s any `www.` host to the apex over https,
preserving path and query, and passes everything else to the asset layer.

This is why the project has a Worker script at all. A `_redirects` file would
be the obvious home for it, but Workers Static Assets [does not support
domain-level redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)
— it matches paths only. Note the `run_worker_first: true` in
`wrangler.jsonc`: without it the asset layer answers matching paths directly
and the script never runs, so the redirect would silently do nothing.

To make www canonical instead, flip `site` in `astro.config.mjs` and invert
the hostname check in `worker/index.ts`.

### Testing the redirect locally

`wrangler dev` takes the request host from the first configured route, so a
`Host:` header on curl is ignored. Pass `--host` instead:

```bash
npx wrangler dev --host www.chickenberryhill.farm
```

Then `curl -I http://localhost:8787/products/` should return a 301 to
`https://chickenberryhill.farm/products/`. Run only one `wrangler dev` at a
time — two instances contend over the same local state and the second dies
with a SQLite lock error.

If the site ever needs server-side behaviour (a real contact form endpoint,
redirects with logic), add [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
and point `main` at the generated Worker entry.

## Before launch

- [ ] Confirm `contact@chickenberryhill.farm` actually receives mail — every
      order and reserve button is a `mailto:` built from `site.email`.
- [ ] Add photos to `public/images/` and wire them up.
- [ ] Add an OG share image and reference it from `BaseLayout.astro`.
