# Home hero carousel

Five morphing slides. Drop photos here named `hero-1.jpg` … `hero-5.jpg` —
they're matched to `heroSlides` in `src/data/site.ts` by filename, and any
slide whose file is missing shows the numbered placeholder instead. Slide
order is filename order; rename to reorder.

Set the matching `alt` in `src/data/site.ts` — these are meaningful photos, so
leaving alt empty hides them from screen readers.

## Sizing

Same recipe as the About lead photo: masters are **2000x1125** JPEG, i.e.
pre-cropped to 16:9 — the ratio the frame renders at — so `object-fit` never
discards pixels that were downloaded. Crop to 16:9 *before* saving rather than
relying on the frame to do it.

Originals live outside the repo (`~/Desktop/cbhf photos/`). Re-crop from those
rather than upscaling these.

Only slide 1 is fetched with the page; each following slide is fetched just
before it's needed, so a short visit never pays for all five.
