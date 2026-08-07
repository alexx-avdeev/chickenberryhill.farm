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

First deploy needs `npx wrangler login`. To attach the domain, add
`chickenberryhill.farm` as a custom domain on the Worker in the Cloudflare
dashboard, or add a `routes` entry to `wrangler.jsonc`.

If the site ever needs server-side behaviour (a real contact form endpoint,
redirects with logic), add [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
and point `main` at the generated Worker entry.

## Before launch

- [ ] Set the real address in `site.email` (`src/data/site.ts`) — every order
      and reserve button is a `mailto:` built from it.
- [ ] Set the real `site.instagram` URL and handle.
- [ ] Add photos to `public/images/` and wire them up.
- [ ] Add an OG share image and reference it from `BaseLayout.astro`.
