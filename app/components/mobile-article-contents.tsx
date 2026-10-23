import DocNav from "./doc-nav";
import type { SectionLink } from "./section-nav";

/** Keep the image and article within reach on small screens. */
export default function MobileArticleContents({ items }: { items: readonly SectionLink[] }) {
  if (!items.length) return null;
  return (
    <details className="mb-6 rounded-2xl bg-white p-4 ring-1 ring-emerald-100 lg:hidden">
      <summary className="cursor-pointer font-semibold text-emerald-800">In this article</summary>
      <DocNav items={items} title="Article sections" className="mt-4 shadow-none ring-0" />
    </details>
  );
}
