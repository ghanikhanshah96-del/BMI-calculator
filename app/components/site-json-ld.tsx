"use client";

import { organizationLogo, organizationRef, SITE_NAME } from "../lib/seo";

export default function SiteJsonLd({ siteUrl }: { siteUrl: string }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: `${siteUrl}/`,
    logo: organizationLogo(siteUrl),
    description:
      "Free online BMI and wellness calculators for body mass index, calorie needs, body fat, macros, pregnancy due date, and ovulation.",
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: SITE_NAME,
    description:
      "Free health calculators: BMI, TDEE, body fat percentage, macro planner, pregnancy due date, and ovulation fertile window.",
    publisher: organizationRef(siteUrl),
    inLanguage: "en-US",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
