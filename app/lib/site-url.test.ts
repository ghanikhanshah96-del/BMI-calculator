import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "./site-url";
import { pageMetadata } from "./seo";

afterEach(() => vi.unstubAllEnvs());

describe("public canonical origin", () => {
  it("uses the public domain when Vercel is set but the public URL is empty", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "bmi-build-example.vercel.app");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "bmi-project.vercel.app");
    expect(getSiteUrl()).toBe("https://fitnesscalculatorpro.com");
  });

  it.each([
    "http://www.fitnesscalculatorpro.com/path/",
    "http://fitnesscalculatorpro.com",
    "https://bmi-build-example.vercel.app",
    "http://localhost:3100",
    "file:///tmp/test",
    "https://user:password@example.com",
    "https://[invalid",
  ])("does not publish an alternate canonical origin from %s", (value) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
    expect(getSiteUrl()).toBe("https://fitnesscalculatorpro.com");
  });

  it.each(["/contact-us", "/sitemap-page"])("gives %s its own absolute canonical", (path) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "bmi-build-example.vercel.app");
    const metadata = pageMetadata({ title: "Page", description: "Description", path });
    expect(metadata.alternates?.canonical).toBe(`https://fitnesscalculatorpro.com${path}`);
    expect(metadata.openGraph?.url).toBe(`https://fitnesscalculatorpro.com${path}`);
  });
});
