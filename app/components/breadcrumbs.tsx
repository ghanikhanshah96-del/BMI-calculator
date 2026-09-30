import { ChevronRight } from "./icons";
import Link from "next/link";

export type Crumb = { name: string; href: string };

/** Home is prepended automatically; the last crumb is the current page (rendered as text). */
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

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-emerald-100">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-medium text-white">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.href} className="link-grow text-emerald-50 hover:text-white">
                  {crumb.name}
                </Link>
              )}
              {isLast ? null : <ChevronRight className="h-3.5 w-3.5 text-emerald-200/70" />}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
