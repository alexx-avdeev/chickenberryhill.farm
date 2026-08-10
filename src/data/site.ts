/**
 * Single source of truth for site copy and content.
 *
 * Every "order" / "reserve" button on the site is a mailto: built from
 * `email`, so it has to stay a real, monitored address.
 */

export const site = {
  name: "ChickenBerry Hill Farm",
  shortName: "ChickenBerry Hill",
  location: "Hartsville, Tennessee",
  region: "Middle Tennessee",
  email: "contact@chickenberryhill.farm",
  instagram: "https://www.instagram.com/chickenberry_hill_farm",
  instagramHandle: "@chickenberry_hill_farm",
  description:
    "A small family farm in Hartsville, Tennessee raising goats, sheep, rabbits, geese, chicken, and quail — selling pasture chicken, lamb, and quail eggs to our neighbors.",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Products", href: "/products/" },
  { label: "Contact", href: "/contact/" },
] as const;

/**
 * The home hero carousel — five morphing slides, matching the design.
 *
 * `file` is looked for in `src/assets/hero/`. Any slide whose file isn't there
 * yet renders the numbered placeholder well instead, so the carousel works
 * while the photos are still being gathered.
 *
 * Masters are pre-cropped to 16/9 — the ratio the frame renders at — so none
 * of what's downloaded is thrown away by `object-fit`. Re-crop from the
 * originals rather than changing the frame; see `src/assets/hero/README.md`.
 */
export const heroSlides = [
  {
    file: "hero-1.jpg",
    alt: "A nanny goat and her kid standing close together in a winter pasture as the sun burns through morning fog.",
  },
  {
    file: "hero-2.jpg",
    alt: "The herd and flock grazing across an open green pasture, with a wooded hillside and heavy grey clouds behind.",
  },
  {
    file: "hero-3.jpg",
    alt: "Mist settling over a mown pasture at dawn, a broad maple standing alone at the edge of the field.",
  },
  {
    file: "hero-4.jpg",
    alt: "Four young goats grazing in a spring pasture beside a tree in white blossom.",
  },
  {
    file: "hero-5.jpg",
    alt: "Sheep and goats spread across the pasture under a dark overcast sky, with a line of summer trees behind.",
  },
] as const;

/** The animals on the hill, shown on the home page. */
export const animals = [
  { name: "Goats", image: null },
  { name: "Sheep", image: null },
  { name: "Rabbits", image: null },
  { name: "Geese", image: null },
  { name: "Chicken", image: null },
  { name: "Quail", image: null },
] as const;

export type Product = {
  slug: string;
  name: string;
  /** Short blurb for the home page card. */
  teaser: string;
  /** Longer blurb for the products page card. */
  description: string;
  price: string;
  teaserPrice: string;
  tag: string;
  /** Which accent the availability pill uses. */
  tagTone: "green" | "berry";
  image: string | null;
};

export const products: Product[] = [
  {
    slug: "pasture-chicken",
    name: "Pasture Chicken",
    teaser: "Whole birds raised on open pasture — clean, tender, and honest.",
    description:
      "Whole birds raised on open pasture and clean feed. Tender, flavorful, and nothing you can’t pronounce. Sold fresh in batches.",
    price: "Inquire for pricing",
    teaserPrice: "Seasonal · inquire for pricing",
    tag: "Seasonal",
    tagTone: "green",
    image: null,
  },
  {
    slug: "lamb",
    name: "Lamb",
    teaser: "Grass-fed lamb from our own flock. Whole, half, and cuts.",
    description:
      "Grass-fed lamb from our own flock. Available whole, half, or by the cut. Reserve early — batches are limited.",
    price: "Inquire for pricing",
    teaserPrice: "Seasonal · inquire for pricing",
    tag: "Seasonal",
    tagTone: "green",
    image: null,
  },
  {
    slug: "quail-eggs",
    name: "Quail Eggs",
    teaser: "Delicate, speckled quail eggs collected fresh each morning.",
    description:
      "Delicate, speckled eggs gathered fresh each morning. Beautiful on the plate and rich in flavor. Sold by the dozen.",
    price: "By the dozen",
    teaserPrice: "By the dozen · in stock",
    tag: "In stock",
    tagTone: "berry",
    image: null,
  },
];

/** The three "how we farm" pillars on the About page. */
export const values = [
  {
    num: "1",
    title: "Raised on pasture",
    body: "Open ground, fresh air, and room to roam. Our animals live the way they were meant to.",
  },
  {
    num: "2",
    title: "Known by name",
    body: "This is a small farm on purpose. We tend every animal ourselves, every single day.",
  },
  {
    num: "3",
    title: "Sold to neighbors",
    body: "No middlemen, no mystery. Honest food handed straight from our family to yours.",
  },
] as const;

/**
 * Build a mailto: link. Subject and body are pre-filled so an order email
 * arrives with something useful in it.
 */
export function mailto(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which mail clients render literally.
  return `mailto:${site.email}?${params.toString().replace(/\+/g, "%20")}`;
}

export const orderMailto = mailto(
  "Order from ChickenBerry Hill Farm",
  "Hi! I'd like to order:\n\n- What: \n- How much: \n- When you'd need it: \n\nThanks!",
);

export function reserveMailto(productName: string): string {
  return mailto(
    `Reserving ${productName}`,
    `Hi! I'd like to reserve ${productName}.\n\n- How much: \n- When you'd need it: \n\nThanks!`,
  );
}
