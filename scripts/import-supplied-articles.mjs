import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Import the supplied drafts into the existing typed blog format. SEO notes
// become metadata; FAQs, tables and source links remain reader-facing content.
const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "blobs content");
const date = "2026-10-22";
const details = {
  "army-body-fat-percentage-calculator": {
    image: "Army Body Fat Percentage Calculator 2026 Rules.png",
    alt: "Illustration of a Soldier and the Army waist-to-height ratio formula with a threshold below 0.55",
    caption: "Illustration of the Army waist-to-height assessment. This site is independent of the U.S. Army; home measurements do not establish official compliance.",
    takeaways: ["The Army adopted waist-to-height ratio in July 2026, with a standard below 0.55.", "Waist-to-height ratio is different from body fat percentage.", "Official Army assessments and recruiting guidance determine compliance and eligibility."],
  },
  "how-many-body-sculpting-sessions-do-i-need": {
    image: "How Many Body Sculpting Sessions Do I Need Guide.png",
    alt: "Illustration comparing typical fat freezing, ultrasound and radiofrequency treatment session counts",
    caption: "Illustrative treatment ranges from the American Academy of Dermatology. These are general estimates; individual results and treatment plans vary.",
    takeaways: ["Typical treatment counts vary by procedure and device; results are not guaranteed.", "A qualified healthcare professional must assess suitability, risks and timing.", "Body contouring does not treat obesity, and a body fat calculator cannot prescribe sessions."],
  },
  "what-does-a-healthy-body-look-like": {
    image: "What Does a Healthy Body Look Like Signs of Health.png",
    alt: "Wellness illustration with physical activity, sleep, eating habits and medical health measures",
    caption: "A wellness illustration, not an ideal body type. People of many shapes, sizes and physical abilities can be healthy; appearance cannot establish health.",
    takeaways: ["There is no single appearance that defines a healthy body.", "Blood pressure, cholesterol, blood sugar, habits and medical history add essential context.", "Body composition estimates are one piece of information, not a diagnosis."],
  },
  "what-is-the-major-source-of-energy-for-the-body": {
    image: "What Is the Major Source of Energy for the Body.png",
    alt: "Nutrition illustration showing carbohydrate foods supplying glucose and fats providing another source of energy",
    caption: "Simplified nutrition illustration. Carbohydrates supply glucose; fats can provide energy through other metabolic pathways and are not generally converted directly into glucose.",
    takeaways: ["Carbohydrates supply glucose, an important fuel for cells, tissues and organs.", "Fats also supply energy and serve as an energy reserve.", "Protein supports tissue maintenance and can provide energy when needed."],
  },
};
const clean = (text) => text.trim().replace(/\\([.=])/g, "$1").replaceAll("https://fitnesscalculatorpro.com/", "/");
const plain = (text) => clean(text).replace(/\*\*/g, "").replace(/^\*|\*$/g, "");
const posts = [];
for (const file of (await fs.readdir(source)).filter((name) => name.endsWith(".md")).sort()) {
  const markdown = (await fs.readFile(path.join(source, file), "utf8")).replace(/\r\n/g, "\n");
  const meta = (pattern) => markdown.match(pattern)?.[1]?.trim();
  const slug = meta(/(?:SEO-Friendly URL Slug|Suggested URL [Ss]lug):\s*`([^`]+)`/);
  const detail = details[slug];
  if (!detail) throw new Error(`Unrecognized article: ${file}`);
  const title = plain(meta(/^# (.+)$/m));
  const description = meta(/(?:SEO Meta Description|Meta description):\s*(.+)/i);
  const metaTitle = meta(/SEO [Mm]eta [Tt]itle:\s*(.+)/);
  if (!description || !metaTitle) throw new Error(`Missing metadata: ${file}`);
  const body = markdown.slice(markdown.indexOf("\n# ") + 1).split("\n").slice(1);
  const intro = [];
  const sections = [];
  const faqs = [];
  let target = intro;
  let faqMode = false;
  let faq;
  for (let i = 0; i < body.length; i++) {
    const line = clean(body[i]);
    if (!line) continue;
    if (line.startsWith("## ")) {
      const heading = plain(line.slice(3));
      faqMode = heading === "Frequently Asked Questions";
      faq = undefined;
      if (!faqMode) {
        const section = { heading, blocks: [] };
        sections.push(section);
        target = section.blocks;
      }
    } else if (line.startsWith("### ")) {
      const heading = plain(line.slice(4));
      if (faqMode) {
        faq = { question: heading, answer: "" };
        faqs.push(faq);
      } else target.push({ kind: "h3", text: heading });
    } else if (faqMode && faq) {
      faq.answer += (faq.answer ? " " : "") + line;
    } else if (line.startsWith("|")) {
      const cells = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map(plain);
      const head = cells(line);
      const rows = [];
      i++;
      while (i + 1 < body.length && body[i + 1].trim().startsWith("|")) rows.push(cells(body[++i]));
      target.push({ kind: "table", caption: sections.at(-1)?.heading || title, head, rows });
    } else if (/^(?:\* |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items = [line.replace(/^(?:\* |\d+\. )/, "")];
      while (i + 1 < body.length && /^(?:\* |\d+\. )/.test(body[i + 1].trim())) items.push(clean(body[++i]).replace(/^(?:\* |\d+\. )/, ""));
      target.push({ kind: "list", ordered, items });
    } else {
      const text = /^\*[^*].*\*$/.test(line) ? line.slice(1, -1) : line;
      target.push({ kind: "p", text });
    }
  }
  const image = `/blog/${slug}.webp`;
  const output = await sharp(path.join(source, "bolbs imgs", detail.image)).webp({ quality: 85 }).toFile(path.join(root, "public", image));
  intro.push({ kind: "figure", figure: { src: image, alt: detail.alt, width: output.width, height: output.height, caption: detail.caption } });
  const nutrition = slug.includes("source-of-energy");
  posts.push({
    slug, title, excerpt: description, description, metaTitle, metaTitleAbsolute: true,
    toolId: nutrition ? "macro" : "body-fat",
    toolLabel: nutrition ? "Macro Calculator" : "Body Fat Percentage Calculator",
    toolHref: nutrition ? "/macro-calculator" : "/body-fat-percentage-calculator",
    publishedAt: date, updatedAt: date, image, imageAlt: detail.alt,
    imageWidth: output.width, imageHeight: output.height,
    keywords: [meta(/Primary [Kk]eyword:\s*`([^`]+)`/), ...(meta(/Secondary [Kk]eywords:\s*(.+)/) || "").replace(/\.$/, "").split(", ")].filter(Boolean),
    relatedSlugs: ["how-to-calculate-body-fat-percentage", "how-to-measure-body-fat-at-home"],
    takeaways: detail.takeaways, intro, sections, faqs,
  });
}
if (posts.length !== 4) throw new Error("Expected exactly four supplied articles");
await fs.writeFile(path.join(root, "app/blog/supplied-posts.ts"), `// Generated by scripts/import-supplied-articles.mjs from the supplied drafts.\nimport type { BlogPost } from "./posts";\n\nexport const suppliedPosts = ${JSON.stringify(posts, null, 2)} satisfies BlogPost[];\n`);
console.log(`Imported ${posts.length} articles with optimized supplied images.`);
