import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // The persistent build cache (restored by Vercel between deploys) can serve stale globals.css output.
    turbopackFileSystemCacheForBuild: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [45, 60, 75],
    // Fewer candidate widths keep every <img srcset> short without hurting sharpness.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [96, 256, 384],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/body-fat-calculator", destination: "/body-fat-percentage-calculator", permanent: true },
      { source: "/due-date-calculator", destination: "/pregnancy-due-date-calculator", permanent: true },
      { source: "/blog/bmi", destination: "/blog/why-bmi-is-not-accurate-for-muscular-people", permanent: true },
      { source: "/blog/body-fat", destination: "/blog/why-bmi-is-not-accurate-for-muscular-people", permanent: true },
      { source: "/blog/tdee", destination: "/blog", permanent: true },
      { source: "/blog/macro", destination: "/blog", permanent: true },
      { source: "/blog/pregnancy", destination: "/blog", permanent: true },
      { source: "/blog/ovulation", destination: "/blog", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
    ];
  },
};

export default nextConfig;
