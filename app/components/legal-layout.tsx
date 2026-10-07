import Link from "next/link";
import type { ReactNode } from "react";
import Breadcrumbs from "./breadcrumbs";
import { type IconComponent } from "./icons";
import PageHero from "./page-hero";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

export type LegalSection = {
  id: string;
  title: string;
  icon?: IconComponent;
  body?: ReactNode[];
  points?: string[];
  columns?: 2 | 3;
};

type LegalPage =
  | "privacy"
  | "terms"
  | "disclaimer"
  | "editorial-policy"
  | "about"
  | "contact"
  | "sitemap";

export default function LegalLayout({
  siteUrl,
  page,
  path,
  crumb,
  eyebrow,
  icon,
  title,
  intro,
  updated,
  notice,
  sections,
  cta,
}: {
  siteUrl: string;
  page: LegalPage;
  path: string;
  crumb: string;
  eyebrow: string;
  icon: IconComponent;
  title: string;
  intro: string;
  updated: string;
  notice?: ReactNode;
  sections: LegalSection[];
  cta: { title: string; text: ReactNode };
}) {
  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage={page} />
      <div className="relative isolate flex flex-1 flex-col">
        <PageHero
          image="/images/legal.jpg"
          imageAlt="Stethoscope resting on a white sheet"
          eyebrow={eyebrow}
          icon={icon}
          title={title}
          description={
            <>
              <p className="text-left">{intro}</p>
              <p className="mt-3 text-left text-sm text-slate-500">Last updated: {updated}</p>
            </>
          }
        >
          <Breadcrumbs siteUrl={siteUrl} items={[{ name: crumb, href: path }]} />
        </PageHero>

        <main className="page-main section-block relative z-10">
          <div className="doc-sections w-full">
            {notice ? (
              <aside className="doc-section border-l-4 border-l-amber-400">
                <div className="text-sm leading-6 text-slate-700">{notice}</div>
              </aside>
            ) : null}

            {sections.map(({ id, title: sectionTitle, body, points }) => (
              <section key={id} id={id} className="doc-section">
                <h2 className="doc-section-title">{sectionTitle}</h2>
                {body?.length ? (
                  <div className="doc-section-body">
                    {body.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
                {points?.length ? (
                  <ul className="doc-section-list">
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="doc-section">
              <h2 className="doc-section-title">{cta.title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-700">{cta.text}</p>
              <Link href="/contact-us" className="content-link mt-4 inline-block font-semibold">
                Contact us
              </Link>
            </section>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
