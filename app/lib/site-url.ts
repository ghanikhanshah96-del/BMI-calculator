const FALLBACK_SITE_URL = "http://localhost:3000";

/**
 * Resolve a valid absolute site URL for metadata, sitemap, and JSON-LD.
 * Handles empty Vercel env vars and prefers VERCEL_URL when available.
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    FALLBACK_SITE_URL,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    try {
      const url = new URL(value.includes("://") ? value : `https://${value}`);
      return url.origin;
    } catch {
      // try next candidate
    }
  }

  return FALLBACK_SITE_URL;
}
