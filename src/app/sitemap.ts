import type { MetadataRoute } from "next";
import { getServiceSlugs } from "@/content/localized";
import { toAbsoluteSiteUrl } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/about",
    "/epemvaseis",
    "/results",
    ...getServiceSlugs().map((slug) => `/epemvaseis/${slug}`),
  ].map((path) => ({ url: toAbsoluteSiteUrl(path) }));
}
