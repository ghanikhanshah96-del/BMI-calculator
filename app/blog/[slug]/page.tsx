import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "../../components/page-hero";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { getSiteUrl } from "../../lib/site-url";
import { blogPosts, getAllSlugs, getPostBySlug } from "../posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Article not found" };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [`${siteUrl}${post.image}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: "FitnessCalculatorPro.com",
    },
    publisher: {
      "@type": "Organization",
      name: "FitnessCalculatorPro.com",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="bg-mesh flex min-h-screen flex-col text-slate-900">
      <SiteHeader activePage="blog" />
      <PageHero
        image={post.image}
        imageAlt={post.imageAlt}
        eyebrow={post.toolLabel}
        icon={BookOpen}
        title={post.title}
        description={
          <>
            <p>{post.excerpt}</p>
            <p className="mt-3 text-sm text-emerald-100">
              <time dateTime={post.publishedAt}>Published {post.publishedAt}</time>
              {" · "}
              <time dateTime={post.updatedAt}>Updated {post.updatedAt}</time>
            </p>
          </>
        }
      >
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-emerald-100">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="link-grow text-emerald-50 hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="link-grow text-emerald-50 hover:text-white">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-emerald-100">{post.toolLabel}</li>
          </ol>
        </nav>
      </PageHero>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <article className="mx-auto max-w-3xl">
          <div className="prose-links space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl text-slate-900 sm:text-[1.75rem]">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mt-3 text-base leading-7 text-slate-700 sm:text-[1.0625rem] sm:leading-8">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="relative isolate mt-12 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-600 p-8 text-white shadow-xl shadow-emerald-900/20 sm:p-10">
            <div className="absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_65%)]" />
            <div className="absolute -bottom-20 left-10 -z-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(190,242,100,0.25),transparent_65%)]" />
            <h2 className="text-2xl text-white sm:text-[1.75rem]">Try the {post.toolLabel}</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-emerald-50 sm:text-base">
              Open the free calculator on the home page and get an instant educational estimate.
            </p>
            <Link
              href={post.toolHref}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Open {post.toolLabel}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <aside className="mx-auto mt-16 max-w-5xl">
            <h2 className="text-2xl text-slate-900">Related guides</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="spotlight group card-lift flex h-full flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5"
                  >
                    <div className="relative aspect-16/10 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                        {item.toolLabel}
                      </span>
                      <span className="mt-1.5 text-sm font-semibold leading-snug text-slate-800 group-hover:text-emerald-800">
                        {item.title}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </div>
  );
}
