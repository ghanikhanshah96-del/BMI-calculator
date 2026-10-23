const FALLBACK_SITE_URL = "https://fitnesscalculatorpro.com";

/**
 * Resolve the public origin for canonical metadata, sitemap, and JSON-LD.
 * Deployment URLs must never become canonical when the public URL is missing.
 */
export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return FALLBACK_SITE_URL;
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      return FALLBACK_SITE_URL;
    }
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "fitnesscalculatorpro.com" ||
      hostname === "www.fitnesscalculatorpro.com" ||
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" ||
      hostname === "vercel.app" || hostname.endsWith(".vercel.app")
    ) return FALLBACK_SITE_URL;
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
