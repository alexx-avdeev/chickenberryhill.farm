# Self-hosted fonts

Both fonts are licensed under the SIL Open Font License 1.1
(https://openfontlicense.org), which allows self-hosting, subsetting, and
modifying them.

| File | Family | Axes kept |
| --- | --- | --- |
| `manrope-latin-wght-400-700.woff2` | Manrope, © 2019 The Manrope Project Authors | `wght` 400–700 |
| `newsreader-latin-opsz-6-72-wght-400-500.woff2` | Newsreader, © 2020 The Newsreader Project Authors | `wght` 400–500, `opsz` 6–72 |

Both are the Google Fonts "latin" subset (the same files the site used to load
from fonts.gstatic.com). The axes were then cut down to the weights the site
actually uses, with `fontTools.varLib.instancer`:

```py
instancer.instantiateVariableFont(font, {"wght": (400, 700)})               # Manrope
instancer.instantiateVariableFont(font, {"wght": (400, 500), "opsz": (6, 72)})  # Newsreader
```

They're registered in `astro.config.mjs` (`fonts`) and emitted by `<Font>` in
`BaseLayout.astro`, which adds `@font-face`, preload links and metric-matched
fallbacks. Keep the full `opsz` range on Newsreader: the large headings rely
on optical sizing to look the way they do.
