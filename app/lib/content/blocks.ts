/**
 * Building blocks for calculator and home page copy.
 * Text may use `**bold**` and `[label](/path)` links; FAQ answers stay plain because they feed JSON-LD
 * (paragraphs separated by a blank line, list items start with "- ").
 */

export type ToolFaq = { question: string; answer: string };
export type ToolSource = { label: string; url: string };

export type ContentTable = { caption?: string; head: string[]; rows: string[][] };
export type ContentCard = { title: string; blocks: ContentBlock[] };

export type ContentBlock =
  | { kind: "text"; text: string }
  | { kind: "formula"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "tables"; tables: ContentTable[] }
  | { kind: "cards"; items: ContentCard[] }
  | { kind: "terms"; items: { term: string; text: string }[] }
  | { kind: "note"; text: string }
  /** A closing line from the brief, rendered as a link back to the calculator. */
  | { kind: "action"; text: string };

export type SectionTone = "card" | "brand" | "frame";

type SectionHead = { id: string; title: string; nav?: string };

export type ArticleSection =
  | (SectionHead & {
      layout: "prose";
      blocks: ContentBlock[];
      tone?: SectionTone;
      /** Pairs with an adjacent half section from lg up; an unpaired half section renders full width. */
      half?: boolean;
    })
  | (SectionHead & { layout: "steps"; intro?: string; steps: { title: string; text: string[] }[] })
  | (SectionHead & { layout: "faq" });

export type ToolContent = {
  /** Hero copy under the H1. */
  intro: string;
  /** Intro copy shown right below the calculator, without a heading. */
  lead?: ContentBlock[];
  article: ArticleSection[];
  faqs: ToolFaq[];
  sources?: ToolSource[];
};

export const p = (text: string): ContentBlock => ({ kind: "text", text });
export const ul = (...items: string[]): ContentBlock => ({ kind: "list", items });
export const ol = (...items: string[]): ContentBlock => ({ kind: "list", items, ordered: true });
export const eq = (text: string): ContentBlock => ({ kind: "formula", text });
export const note = (text: string): ContentBlock => ({ kind: "note", text });
export const action = (text: string): ContentBlock => ({ kind: "action", text });
export const table = (head: string[], ...rows: string[][]): ContentBlock => ({ kind: "tables", tables: [{ head, rows }] });
export const tables = (...items: ContentTable[]): ContentBlock => ({ kind: "tables", tables: items });
export const sub = (title: string, ...blocks: ContentBlock[]): ContentCard => ({ title, blocks });
export const cards = (...items: ContentCard[]): ContentBlock => ({ kind: "cards", items });
export const terms = (...items: [string, string][]): ContentBlock => ({
  kind: "terms",
  items: items.map(([term, text]) => ({ term, text })),
});

export function section(
  id: string,
  title: string,
  blocks: ContentBlock[],
  options: { nav?: string; half?: boolean; tone?: SectionTone } = {},
): ArticleSection {
  return { layout: "prose", id, title, blocks, ...options };
}

export function steps(
  id: string,
  title: string,
  intro: string | undefined,
  items: [string, ...string[]][],
  nav?: string,
): ArticleSection {
  return { layout: "steps", id, title, intro, nav, steps: items.map(([stepTitle, ...text]) => ({ title: stepTitle, text })) };
}

export const faqSection = (title: string): ArticleSection => ({ layout: "faq", id: "faq", nav: "FAQ", title });

export function articleNav(sections: ArticleSection[]): { id: string; label: string }[] {
  return sections.flatMap((item) => (item.nav ? [{ id: item.id, label: item.nav }] : []));
}

/** Plain text for structured data. */
export function plainText(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
