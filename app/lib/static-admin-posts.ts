import { blogPosts, type PostBlock } from "../blog/posts";
import { markdownToEditorHtml } from "./blog-content";
import type { BlogPostRecord } from "./blog-repo";
const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
function blockHtml(block: PostBlock): string {
  if (block.kind === "p") return markdownToEditorHtml(block.text);
  if (block.kind === "h3") return `<h3>${escape(block.text)}</h3>`;
  if (block.kind === "list") {
    const tag = block.ordered ? "ol" : "ul";
    return `<${tag}>${block.items.map((item) => `<li>${markdownToEditorHtml(item)}</li>`).join("")}</${tag}>`;
  }
  if (block.kind === "figure")
    return `<figure><img src="${escape(block.figure.src)}" alt="${escape(block.figure.alt)}" /><figcaption>${markdownToEditorHtml(block.figure.caption)}</figcaption></figure>`;
  return `<table><caption>${escape(block.caption)}</caption><thead><tr>${block.head.map((v) => `<th>${escape(v)}</th>`).join("")}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((v) => `<td>${markdownToEditorHtml(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}
export function staticAdminPosts(): BlogPostRecord[] {
  return blogPosts.map((post) => ({
    id: `static_${post.slug}`,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: [
      ...(post.takeaways.length
        ? [`<h2>Key takeaways</h2><ul>${post.takeaways.map((text) => `<li>${markdownToEditorHtml(text)}</li>`).join("")}</ul>`]
        : []),
      post.intro.map(blockHtml).join(""),
      ...post.sections.map(
        (s) =>
          `<h2>${escape(s.heading)}</h2>${s.blocks.map(blockHtml).join("")}`,
      ),
      ...(post.faqs.length
        ? [
            "<h2>Frequently asked questions</h2>",
            ...post.faqs.map(
              (f) =>
                `<h3>${escape(f.question)}</h3>${markdownToEditorHtml(f.answer)}`,
            ),
          ]
        : []),
    ].join(""),
    contentFormat: "html",
    date: post.publishedAt,
    updatedAt: post.updatedAt,
    readTime: "5 min read",
    category: post.toolLabel,
    tags: post.keywords,
    metaTitle: post.metaTitle,
    metaDescription: post.description,
    focusKeyword: post.keywords[0] || "",
    coverImage: post.image,
    coverImageAlt: post.imageAlt,
    featured: false,
    status: "published",
    createdAt: post.publishedAt,
    modifiedAt: post.updatedAt,
  }));
}
