interface Env {
  /**
   * GA4 measurement ID (G-XXXXXXXX). Set as a Worker secret, not in
   * wrangler.jsonc — a value there would be committed and overwritten on
   * every deploy. Absent in local `astro dev`, which is why the tag is
   * injected here rather than baked into the HTML.
   */
  GA_MEASUREMENT_ID?: string;
}
