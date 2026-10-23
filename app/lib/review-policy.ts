import type { UserReview } from "@/app/lib/reviews";

export function isPublicReviewRating(rating: number) {
  return Number.isInteger(rating) && rating > 3 && rating <= 5;
}

export function selectPublicReviews(
  records: { id: string; data: Record<string, unknown> }[],
): UserReview[] {
  return records
    .flatMap(({ id, data: d }) => {
      if (
        d.published !== true ||
        typeof d.rating !== "number" ||
        !isPublicReviewRating(d.rating) ||
        typeof d.name !== "string" ||
        !d.name.trim() ||
        d.name.length > 40 ||
        typeof d.comment !== "string" ||
        !d.comment.trim() ||
        d.comment.length > 280 ||
        typeof d.createdAt !== "string" ||
        !Number.isFinite(Date.parse(d.createdAt))
      )
        return [];
      return [
        {
          id,
          name: d.name,
          rating: d.rating,
          comment: d.comment,
          createdAt: d.createdAt,
          ...(typeof d.tool === "string" ? { tool: d.tool } : {}),
        },
      ];
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 40);
}
