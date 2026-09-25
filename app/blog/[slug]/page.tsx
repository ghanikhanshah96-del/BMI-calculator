import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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
      name: "BMI Wellness Pro",
    },
    publisher: {
      "@type": "Organization",
      name: "BMI Wellness Pro",
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
    <div className="min-h-screen bg-[var(--background)] text-slate-900">
      <SiteHeader activePage="blog" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="text-emerald-700 hover:text-emerald-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="text-emerald-700 hover:text-emerald-900">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-700">{post.toolLabel}</li>
          </ol>
        </nav>

        <article className="mx-auto max-w-4xl">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {post.toolLabel}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-3 text-lg leading-8 text-slate-600">{post.excerpt}</p>
            <p className="mt-3 text-sm text-slate-500">
              <time dateTime={post.publishedAt}>Published {post.publishedAt}</time>
              {" · "}
              <time dateTime={post.updatedAt}>Updated {post.updatedAt}</time>
            </p>
          </header>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          <div className="prose-links mt-10 space-y-8">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold text-slate-900">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="mt-3 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Try the {post.toolLabel}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Open the free calculator on the home page and get an instant educational estimate.
            </p>
            <Link
              href={post.toolHref}
              className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-emerald-800"
            >
              Open {post.toolLabel}
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <aside className="mx-auto mt-14 max-w-4xl border-t border-emerald-100 pt-10">
            <h2 className="text-lg font-bold text-slate-900">Related guides</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-800"
                  >
                    {item.title}
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
