import type { Metadata } from "next";

export const SITE_NAME = "FitnessCalculatorPro.com";

export const defaultOgImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "FitnessCalculatorPro.com free fitness and health calculators",
};

export function organizationLogo(siteUrl: string) {
  return { "@type": "ImageObject", url: `${siteUrl}/logo.png`, width: 256, height: 256 };
}

export function organizationRef(siteUrl: string) {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: `${siteUrl}/`,
    logo: organizationLogo(siteUrl),
  };
}

export function websiteRef(siteUrl: string) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    url: `${siteUrl}/`,
  };
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  image?: { url: string; alt: string; width?: number; height?: number };
  type?: "website" | "article";
  keywords?: string[];
  article?: { publishedTime: string; modifiedTime: string; section?: string };
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image = defaultOgImage,
  type = "website",
  keywords,
  article,
}: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  // Next.js resolves "/" to the bare origin; the home page renders its own slash-terminated tags.
  const isHome = path === "/";
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(isHome ? {} : { alternates: { canonical: path } }),
    openGraph: {
      title: fullTitle,
      description,
      ...(isHome ? {} : { url: path }),
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [image],
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            section: article.section,
            authors: [SITE_NAME],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
