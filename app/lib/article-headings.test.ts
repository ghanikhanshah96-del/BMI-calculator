import { describe, expect, it } from "vitest";
import { articleHeadings } from "./article-headings";

describe("editor article navigation", () => {
  it("keeps inline formatting and gives repeated headings distinct safe anchors", () => {
    const { html, headings } = articleHeadings('<h2>Steps &amp; <em>tips</em></h2><p>Body</p><h3>Steps &amp; tips</h3>');
    expect(headings).toEqual([
      { id: "article-section-1", label: "Steps & tips" },
      { id: "article-section-2", label: "Steps & tips" },
    ]);
    expect(html).toContain('<h2 id="article-section-1">Steps &amp; <em>tips</em></h2>');
    expect(html).toContain("<p>Body</p>");
  });

  it("leaves lists, tables and images intact and skips empty headings", () => {
    const content = '<h2> </h2><ul><li>One</li></ul><table><tr><td>A</td></tr></table><img src="/api/media/example.webp">';
    expect(articleHeadings(content)).toEqual({ html: content, headings: [] });
  });
});
