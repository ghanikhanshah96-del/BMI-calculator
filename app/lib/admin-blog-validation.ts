export function validateBlogPayload(
  body: Record<string, unknown>,
): string | null {
  if (typeof body.title !== "string" || !body.title.trim())
    return "Title is required";
  if (body.title.length > 200) return "Title must be at most 200 characters";
  if (body.content != null && typeof body.content !== "string")
    return "Content must be text";
  if (typeof body.content === "string" && body.content.length > 1000000)
    return "Article is too large";
  if (
    body.status != null &&
    !["draft", "published"].includes(String(body.status))
  )
    return "Status must be draft or published";
  if (body.date) {
    const value = String(body.date);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    )
      return "Date must be a valid YYYY-MM-DD date";
  }
  if (body.coverImage) {
    const value = String(body.coverImage);
    if (!(value.startsWith("/") && !value.startsWith("//"))) {
      try {
        if (new URL(value).protocol !== "https:")
          return "Cover image must be a local path or HTTPS URL";
      } catch {
        return "Cover image must be a local path or HTTPS URL";
      }
    }
  }
  return null;
}
