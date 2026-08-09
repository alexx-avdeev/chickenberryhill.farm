# Photos

**Prefer `src/assets/` over this folder.** Images imported from `src/assets/`
go through Astro's pipeline: re-encoded to AVIF and WebP at several widths,
emitted with a `srcset`, and given a JPEG fallback. Files in `public/` are
served byte-for-byte, so a phone photo lands on a visitor at full size.

```astro
---
import goats from "../assets/goats.jpg";
---
<Photo image={goats} alt="…" label="Goats" aspect="1 / 1" />
```

Use `<Photo src="/images/…" />` (this folder) only for images not worth
processing.

Keep masters as JPEG, not PNG — PNG is lossless and enormous for photographs,
and Astro emits the original alongside the optimised variants.

**Crop the master to the aspect it's displayed at.** Astro resizes but never
crops, so any mismatch between the master's ratio and the frame's is paid for
on every page load: the bytes are downloaded, then thrown away by
`object-fit`. Cropping `about-lead` to its displayed 16/9 cut 20% off every
variant. Where a master is kept at a different ratio deliberately, keep the
uncropped file next to it with an `-uncropped` suffix and don't import it —
unimported files in `src/assets/` are never emitted.

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

## In place

| File                        | Used by               |
| --------------------------- | --------------------- |
| `src/assets/about-lead.jpg` | About page lead photo |

`<Photo />` checks at build time whether the file it points at actually exists
in `public/`. If it doesn't, it renders the dashed placeholder and logs a
warning during `npm run build` instead of shipping a broken image — so a `src`
can be wired up before the photo is in place.

Anything without an image renders that same placeholder well, so the layout
holds together while photos are still missing.

## Suggested sizes

| Slot                    | Aspect | Export at    |
| ----------------------- | ------ | ------------ |
| Home hero               | wide   | 2240 × 1120  |
| About lead              | 16:9   | 2240 × 1260  |
| Animal tiles            | 1:1    | 800 × 800    |
| Product cards           | 4:3    | 1200 × 900   |

Compress before committing — these ship as-is.
