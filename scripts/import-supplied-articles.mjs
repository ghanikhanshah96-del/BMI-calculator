import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Import the supplied drafts into the existing typed blog format. SEO notes
// become metadata; FAQs, tables and source links remain reader-facing content.
const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "blobs content");
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
  "what-is-considered-light-exercise-tdee": {
    image: "What Is Considered Light Exercise TDEE.jpg",
    date: "2026-10-28",
    alt: "Adult sitting on an exercise mat and raising two dumbbells during a light home workout",
    caption: "Light exercise can include low-intensity sessions at home. Photo by Nenad Stojkovic via [Flickr](https://www.flickr.com/photos/202846129@N03/54579614508), licensed [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/).",
    takeaways: ["Lightly Active usually means light exercise about 1–3 days per week or some regular daily movement, with a common multiplier of 1.375.", "Light exercise intensity is not the same as the Lightly Active TDEE category, which reflects overall weekly activity.", "Choose Lightly Active from your usual routine, not from one unusually active day."],
  },
  "how-to-determine-activity-level-for-tdee": {
    image: "How to Determine Activity Level for TDEE.jpg",
    date: "2026-10-28",
    alt: "Adult holding a dumbbell during a gym resistance-training session",
    caption: "Activity level depends on workouts and everyday movement. Photo by PattayaPatrol via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:DSC_6393_Bald_man_working_out_with_a_15_lb_dumbbell_looking_off_to_the_side_in_a_bright_gym.jpg), licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).",
    takeaways: ["Choose a TDEE activity level from your typical week, including work, walking, and exercise—not one unusually busy day.", "Common multipliers range from 1.2 for sedentary to about 1.9 for extremely active routines.", "Use the result as a starting estimate of maintenance calories and adjust if your weight trend differs over several weeks."],
  },
};
function toolMeta(slug) {
  if (slug.includes("source-of-energy")) {
    return { toolId: "macro", toolLabel: "Macro Calculator", toolHref: "/macro-calculator" };
  }
  if (slug.includes("tdee") || slug.includes("light-exercise")) {
    return { toolId: "tdee", toolLabel: "TDEE Calculator", toolHref: "/tdee-calculator" };
  }
  return { toolId: "body-fat", toolLabel: "Body Fat Percentage Calculator", toolHref: "/body-fat-percentage-calculator" };
}
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
  const publishedAt = detail.date || "2026-10-22";
  posts.push({
    slug, title, excerpt: description, description, metaTitle, metaTitleAbsolute: true,
    ...toolMeta(slug),
    publishedAt, updatedAt: publishedAt, image, imageAlt: detail.alt,
    imageWidth: output.width, imageHeight: output.height,
    keywords: [meta(/Primary [Kk]eyword:\s*`([^`]+)`/), ...(meta(/Secondary [Kk]eywords:\s*(.+)/) || "").replace(/\.$/, "").split(", ")].filter(Boolean),
    relatedSlugs: slug.includes("tdee")
      ? slug.includes("activity-level")
        ? ["what-is-considered-light-exercise-tdee", "what-is-the-major-source-of-energy-for-the-body"]
        : ["how-to-determine-activity-level-for-tdee", "what-is-the-major-source-of-energy-for-the-body"]
      : ["how-to-calculate-body-fat-percentage", "how-to-measure-body-fat-at-home"],
    takeaways: detail.takeaways, intro, sections, faqs,
  });
}
if (posts.length !== 6) throw new Error("Expected exactly six supplied articles");
await fs.writeFile(path.join(root, "app/blog/supplied-posts.ts"), `// Generated by scripts/import-supplied-articles.mjs from the supplied drafts.\nimport type { BlogPost } from "./posts";\n\nexport const suppliedPosts = ${JSON.stringify(posts, null, 2)} satisfies BlogPost[];\n`);
console.log(`Imported ${posts.length} articles with optimized supplied images.`);
