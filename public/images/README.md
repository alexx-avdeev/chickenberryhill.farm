# Photos

Drop farm photos in this folder, then point at them from `src/data/site.ts`.

Files here are served from the site root, so `public/images/goats.jpg` is
referenced as `/images/goats.jpg`:

```ts
export const animals = [
  { name: "Goats", image: "/images/goats.jpg" },
  ...
];
```

The two full-bleed photos (the home hero and the About lead) are set directly
on the page — `src/pages/index.astro` and `src/pages/about.astro`. Add a `src`
and an `alt` to their `<Photo />` tags.

Anything without an image renders a dashed placeholder well, so the layout
holds together while photos are still missing.

## Suggested sizes

| Slot                    | Aspect | Export at    |
| ----------------------- | ------ | ------------ |
| Home hero               | wide   | 2240 × 1120  |
| About lead              | 16:9   | 2240 × 1260  |
| Animal tiles            | 1:1    | 800 × 800    |
| Product cards           | 4:3    | 1200 × 900   |

Compress before committing — these ship as-is.
