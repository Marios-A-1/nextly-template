const fallbackSiteUrl = "https://artofthepossible.vercel.app";

function normalizeSiteUrl(value: string | undefined): string {
  const candidate = value?.trim() || fallbackSiteUrl;

  try {
    const url = new URL(candidate);
    return url.origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function toAbsoluteSiteUrl(path = ""): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}
