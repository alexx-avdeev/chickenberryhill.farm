/**
 * Single source of truth for site copy and content.
 *
 * TODO(axel): `email` and `instagram` are placeholders — swap in the real
 * addresses. Every "order" / "reserve" button on the site is a mailto: built
 * from `email`, so getting it right matters.
 */

export const site = {
  name: "ChickenBerry Hill Farm",
  shortName: "ChickenBerry Hill",
  location: "Hartsville, Tennessee",
  region: "Middle Tennessee",
  email: "hello@chickenberryhill.farm",
  instagram: "https://instagram.com/chickenberryhill",
  instagramHandle: "@chickenberryhill",
  description:
    "A small family farm in Hartsville, Tennessee raising goats, sheep, rabbits, geese, chicken, and quail — selling pasture chicken, lamb, and quail eggs to our neighbors.",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Products", href: "/products/" },
  { label: "Contact", href: "/contact/" },
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
