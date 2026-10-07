export type Crumb = { name: string; href: string };

/** Home is prepended automatically. The trail is structured data only, with no visible breadcrumb. */
export default function Breadcrumbs({ items, siteUrl }: { items: Crumb[]; siteUrl: string }) {
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.href}`,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
