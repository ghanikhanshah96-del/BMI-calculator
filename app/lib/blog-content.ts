/** Convert legacy markdown-ish blog content to clean semantic HTML for TipTap. */
export function markdownToEditorHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "<p></p>";
  if (looksLikeHtml(trimmed)) return trimmed;

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    if (text) html.push(`<p>${inlineFormat(text)}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (inList) {
      html.push(inList === "ul" ? "</ul>" : "</ol>");
      inList = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushParagraph();
      closeList();
      continue;
    }

    const h2 = trimmedLine.match(/^##\s+(.+)$/);
    if (h2) {
      flushParagraph();
      closeList();
      html.push(`<h2>${inlineFormat(h2[1])}</h2>`);
      continue;
    }

    const h3 = trimmedLine.match(/^###\s+(.+)$/);
    if (h3) {
      flushParagraph();
      closeList();
      html.push(`<h3>${inlineFormat(h3[1])}</h3>`);
      continue;
    }

    const h1 = trimmedLine.match(/^#\s+(.+)$/);
    if (h1) {
      flushParagraph();
      closeList();
      html.push(`<h1>${inlineFormat(h1[1])}</h1>`);
      continue;
    }

    const quote = trimmedLine.match(/^>\s+(.+)$/);
    if (quote) {
      flushParagraph();
      closeList();
      html.push(`<blockquote><p>${inlineFormat(quote[1])}</p></blockquote>`);
      continue;
    }

    const ul = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (ul) {
      flushParagraph();
      if (inList !== "ul") {
        closeList();
        html.push("<ul>");
        inList = "ul";
      }
      html.push(`<li><p>${inlineFormat(ul[1])}</p></li>`);
      continue;
    }

    const ol = trimmedLine.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      flushParagraph();
      if (inList !== "ol") {
        closeList();
        html.push("<ol>");
        inList = "ol";
      }
      html.push(`<li><p>${inlineFormat(ol[1])}</p></li>`);
      continue;
    }

    closeList();
    paragraph.push(trimmedLine);
  }

  flushParagraph();
  closeList();

  return html.join("") || "<p></p>";
}

function inlineFormat(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<!_)_([^_]+)_(?!_)/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/** Convert legacy markdown-ish blog content to HTML for public display. */
export function markdownishToHtml(content: string): string {
  return markdownToEditorHtml(content);
}

export function looksLikeHtml(content: string): boolean {
  const trimmed = content.trim();
  return /^<[a-z][\s\S]*>/i.test(trimmed);
}

export function contentForEditor(
  content: string,
  contentFormat?: "html" | "markdown" | string,
): string {
  if (!content) return "";
  if (contentFormat === "html" || looksLikeHtml(content)) return content;
  return markdownToEditorHtml(content);
}

export function renderBlogContentHtml(
  content: string,
  contentFormat?: "html" | "markdown",
): string {
  if (contentFormat === "html" || looksLikeHtml(content)) {
    return content;
  }
  return markdownToEditorHtml(content);
}
