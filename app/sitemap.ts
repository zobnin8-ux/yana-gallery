import type { MetadataRoute } from "next";

import { artworksRepository } from "@/lib/repositories/artworks-repository";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/gallery", "/about", "/contact"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));
  const artworkRoutes = (await artworksRepository.list()).map((artwork) => ({
    url: `${siteUrl}/artworks/${artwork.slug}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...artworkRoutes];
}
