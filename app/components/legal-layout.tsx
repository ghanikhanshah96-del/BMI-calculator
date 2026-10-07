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
              <p>{intro}</p>
              <p className="mt-3 text-sm text-slate-500">Last updated: {updated}</p>
            </>
          }
        >
          <Breadcrumbs siteUrl={siteUrl} items={[{ name: crumb, href: path }]} />
        </PageHero>

        <main className="page-main section-block relative z-10">
          <article className="content-readable w-full">
            {notice ? (
              <div className="mb-8 border-l-4 border-amber-400 pl-4 text-sm leading-6 text-slate-700">{notice}</div>
            ) : null}

            <div className="divide-y divide-slate-200">
              {sections.map(({ id, title: sectionTitle, body, points }) => (
                <section key={id} id={id} className="scroll-mt-28 py-8 first:pt-0 last:pb-0">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{sectionTitle}</h2>
                  {body?.length ? (
                    <div className="mt-3 space-y-3 text-base leading-7 text-slate-700">
                      {body.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}
                  {points?.length ? (
                    <ul className="mt-4 grid list-disc gap-x-10 gap-y-2 pl-5 text-base leading-7 text-slate-700 marker:text-emerald-700 sm:grid-cols-2 lg:grid-cols-3">
                      {points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-xl font-semibold text-slate-900">{cta.title}</h2>
              <p className="mt-2 text-base leading-7 text-slate-700">{cta.text}</p>
              <Link href="/contact-us" className="content-link mt-4 inline-block font-semibold">
                Contact us
              </Link>
            </div>
          </article>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
