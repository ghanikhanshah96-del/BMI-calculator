import { describe, expect, it } from "vitest";
import { sanitizeBlogHtml } from "./sanitize-html";

describe("public sanitizeBlogHtml", () => {
  it("does not execute script payloads in stored HTML", () => {
    const dirty =
      '<p>Safe</p><img src=x onerror="alert(1)" /><script>document.cookie</script>';
    const out = sanitizeBlogHtml(dirty);
    expect(out).toContain("Safe");
    expect(out.toLowerCase()).not.toContain("script");
    expect(out.toLowerCase()).not.toContain("onerror");
  });
});
