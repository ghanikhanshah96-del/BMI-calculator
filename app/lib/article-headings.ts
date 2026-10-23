/** Add safe, unique navigation anchors to headings in already-sanitized blog HTML. */
export function articleHeadings(content: string) {
  const headings: { id: string; label: string }[] = [];
  const html = content.replace(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level: string, body: string) => {
    const label = body.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
    if (!label) return `<h${level}>${body}</h${level}>`;
    // Prefix plus index avoids duplicate IDs and clashes with site navigation.
    const id = `article-section-${headings.length + 1}`;
    headings.push({ id, label });
    return `<h${level} id="${id}">${body}</h${level}>`;
  });
  return { html, headings };
}
