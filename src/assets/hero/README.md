# Home hero carousel

Five morphing slides. Drop photos here named `hero-1.jpg` … `hero-5.jpg` —
they're matched to `heroSlides` in `src/data/site.ts` by filename, and any
slide whose file is missing shows the numbered placeholder instead.

**Crop each to 16:9 before adding**, the ratio the frame renders at, so no
downloaded pixels get discarded by `object-fit`. 2000x1125 is a good master
size; Astro generates the AVIF/WebP/JPEG variants from there.

Set the matching `alt` in `src/data/site.ts` — these are meaningful photos, so
leaving alt empty hides them from screen readers.
