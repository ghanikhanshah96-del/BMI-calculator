import Link from "next/link";
import { clusters, toolHref, toolLinksInCluster, type ToolId } from "../lib/tool-nav";
import { ArrowRight, BookOpen } from "./icons";

type Tone = "light" | "dark";

export type GuideLinks = Partial<Record<ToolId, { slug: string; title: string }>>;

const cardClass: Record<Tone, string> = {
  light: "spotlight group card-lift card-surface tool-card",
  dark: "spotlight spotlight-light group tool-card tool-card-dark",
};

const badgeClass: Record<Tone, string> = {
  light: "icon-badge tool-badge",
  dark: "tool-badge tool-badge-dark",
};

/**
 * Tool cards grouped by topic cluster. Each card links to its dedicated tool page.
 * `compact` lays the clusters out as three columns so the whole suite fits one screen.
 */
export default function ToolClusterGrid({
  tone = "light",
  headingLevel = "h2",
  guides,
  compact = false,
}: {
  tone?: Tone;
  headingLevel?: "h2" | "h3";
  guides?: GuideLinks;
  compact?: boolean;
}) {
  const Heading = headingLevel;
  const dark = tone === "dark";

  return (
    <div className={compact ? "grid gap-6 lg:grid-cols-3 lg:gap-5 xl:gap-6" : "space-y-8 sm:space-y-10"}>
      {clusters.map((cluster) => {
        const clusterTools = toolLinksInCluster(cluster.id);
        return (
          <section key={cluster.id} aria-labelledby={`cluster-${cluster.id}-${tone}`}>
            <div className={`max-w-2xl ${compact ? "mb-3" : "mb-4"}`}>
              <Heading
                id={`cluster-${cluster.id}-${tone}`}
                className={`font-semibold ${compact ? "text-lg" : "text-xl sm:text-2xl"} ${dark ? "text-white" : "text-slate-900"}`}
              >
                {cluster.title}
              </Heading>
              <p className={`mt-1 text-sm ${compact ? "leading-5" : "leading-6"} ${dark ? "text-emerald-50/90" : "text-slate-600"}`}>
                {cluster.description}
              </p>
            </div>
            <ul className={`grid sm:grid-cols-2 ${compact ? "gap-3 lg:grid-cols-1" : "gap-4"}`}>
              {clusterTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={toolHref(tool)}
                    data-niche={tool.id}
                    className={`${cardClass[tone]} ${compact ? "tool-card-compact" : ""}`}
                  >
                    <span className={badgeClass[tone]}>
                      <tool.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="niche-name block font-semibold">{tool.name}</span>
                      <span
                        className={`mt-0.5 block text-sm ${compact ? "leading-5" : "leading-6"} ${dark ? "text-emerald-50/90" : "text-slate-600"}`}
                      >
                        {tool.tagline}
                      </span>
                    </span>
                    <ArrowRight className={`arrow-nudge mt-1 ${dark ? "text-lime-200" : "niche-link"}`} />
                  </Link>
                </li>
              ))}
            </ul>
            {guides ? (
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {clusterTools.map((tool) => {
                  const guide = guides[tool.id];
                  if (!guide) return null;
                  return (
                    <li key={guide.slug}>
                      <Link
                        href={`/blog/${guide.slug}`}
                        data-niche={tool.id}
                        className="niche-link link-grow inline-flex items-center gap-1.5 font-medium"
                      >
                        <BookOpen className="h-4 w-4" />
                        {guide.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
