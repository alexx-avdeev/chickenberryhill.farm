/**
 * schema.org JSON-LD, built only from facts already in `site.ts`.
 *
 * Every page carries the WebSite and the farm entity. They are linked by
 * `@id`, so search engines see one business across the whole site rather
 * than a new one per page. The homepage swaps the plain Organization for the
 * fuller LocalBusiness version of the *same* `@id`. LocalBusiness is a
 * subtype of Organization, so that's a refinement, not a second entity.
 *
 * Why LocalBusiness and not a more specific type: schema.org has no Farm
 * type, and the nearby ones don't fit. FoodEstablishment means restaurants,
 * cafés and bakeries, and Store/GroceryStore implies a shop with opening
 * hours. `additionalType` points at Wikidata's "farm" (Q131596) to say what
 * kind of business this is without misusing a type.
 *
 * Deliberately left out until there are real values for them: street
 * address, postal code, phone, opening hours, geo coordinates, prices,
 * ratings, and a raster logo. Search engines prefer missing fields over
 * wrong ones.
 */

import { site, products, navLinks } from "./site";

export type JsonLdNode = Record<string, unknown>;

const origin = "https://chickenberryhill.farm";
export const ids = {
  website: `${origin}/#website`,
  organization: `${origin}/#organization`,
} as const;

const abs = (path: string) => new URL(path, origin).toString();

/** Sitewide: the website itself. */
export const websiteNode: JsonLdNode = {
  "@type": "WebSite",
  "@id": ids.website,
  url: abs("/"),
  name: site.name,
  alternateName: site.shortName,
  inLanguage: "en-US",
  publisher: { "@id": ids.organization },
};

/** Sitewide: the farm as an organization (minimal, every page). */
export const organizationNode: JsonLdNode = {
  "@type": "Organization",
  "@id": ids.organization,
  name: site.name,
  alternateName: site.shortName,
  url: abs("/"),
  email: site.email,
  sameAs: [site.instagram],
};

/** Homepage: the same entity, described as a local business. */
export function localBusinessNode(imageUrl?: string): JsonLdNode {
  return {
    "@type": "LocalBusiness",
    "@id": ids.organization,
    additionalType: "https://www.wikidata.org/wiki/Q131596",
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: abs("/"),
    email: site.email,
    sameAs: [site.instagram],
    ...(imageUrl ? { image: imageUrl } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hartsville",
      addressRegion: "TN",
      addressCountry: "US",
    },
    hasOfferCatalog: { "@id": abs("/products/#catalog") },
  };
}

/**
 * Products page: what's for sale, as an OfferCatalog of Offers offered by
 * the farm.
 *
 * Plain Offers, with no nested Product, on purpose. There are no prices in
 * the code ("Inquire for pricing"), and Google's Product rich results
 * *require* a price, a review, or a rating. A Product without them shows up
 * as an error in Search Console. An Offer with a name and description is
 * valid schema.org and avoids that.
 */
export function offerCatalogNode(imageUrls: Record<string, string | undefined>): JsonLdNode {
  return {
    "@type": "OfferCatalog",
    "@id": abs("/products/#catalog"),
    name: `${site.name} products`,
    url: abs("/products/"),
    numberOfItems: products.length,
    itemListElement: products.map((product) => ({
      "@type": "Offer",
      name: product.name,
      description: product.description,
      url: abs("/products/"),
      ...(imageUrls[product.slug] ? { image: imageUrls[product.slug] } : {}),
      offeredBy: { "@id": ids.organization },
    })),
  };
}

/** Inner pages: Home → this page. The label comes from the nav. */
export function breadcrumbNode(pathname: string): JsonLdNode | null {
  const page = navLinks.find((link) => link.href === pathname);
  if (!page || page.href === "/") return null;
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      { "@type": "ListItem", position: 2, name: page.label, item: abs(page.href) },
    ],
  };
}
