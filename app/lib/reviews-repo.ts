import { randomBytes } from "crypto";
import {
  getDb,
  isFirebaseConfigured as firebaseConfigured,
} from "@/app/lib/firebase-admin";
import type { UserReview } from "@/app/lib/reviews";
import {
  isPublicReviewRating,
  selectPublicReviews,
} from "@/app/lib/review-policy";

export const REVIEWS_COLLECTION = "userReviews";
export const isFirebaseConfigured = firebaseConfigured;
export type AdminReview = UserReview & {
  published: boolean;
  notificationStatus: "sent" | "failed" | "pending" | "not-required";
};

export type ReviewEdit = Pick<UserReview, "name" | "rating" | "comment"> & {
  tool: string;
  published: boolean;
};

export async function updateReview(
  id: string,
  input: ReviewEdit,
  actor: string,
) {
  const db = getDb();
  const ref = db.collection(REVIEWS_COLLECTION).doc(id);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return false;
    const original = snapshot.data()!;
    transaction.update(ref, {
      ...input,
      published: input.published && isPublicReviewRating(input.rating),
      moderated: true,
      updatedAt: new Date().toISOString(),
      updatedBy: actor,
      originalReview: original.originalReview || {
        name: original.name || "",
        rating: original.rating,
        comment: original.comment || "",
        tool: original.tool || "",
      },
    });
    return true;
  });
}

export async function deleteReview(id: string) {
  const db = getDb();
  const ref = db.collection(REVIEWS_COLLECTION).doc(id);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) return false;
    transaction.delete(ref);
    return true;
  });
}

export async function listAdminReviews(): Promise<AdminReview[]> {
  const snapshot = await getDb()
    .collection(REVIEWS_COLLECTION)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: typeof data.name === "string" ? data.name : "Anonymous user",
      comment: typeof data.comment === "string" ? data.comment : "",
      rating: Number(data.rating),
      createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
      ...(typeof data.tool === "string" ? { tool: data.tool } : {}),
      published: data.published === true && isPublicReviewRating(data.rating),
      notificationStatus: [
        "sent",
        "failed",
        "pending",
        "not-required",
      ].includes(data.notificationStatus)
        ? data.notificationStatus
        : "not-required",
    } as AdminReview;
  });
}
export async function listPublicReviews(): Promise<UserReview[]> {
  if (!isFirebaseConfigured()) throw new Error("REVIEWS_NOT_CONFIGURED");
  // A single-field query avoids requiring a composite index at deployment.
  const snap = await getDb()
    .collection(REVIEWS_COLLECTION)
    .where("published", "==", true)
    .get();
  return selectPublicReviews(
    snap.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
  );
}
export async function createReview(
  input: Omit<UserReview, "id" | "createdAt">,
  limitKey: string,
) {
  if (!isFirebaseConfigured()) throw new Error("REVIEWS_NOT_CONFIGURED");
  const review: UserReview = {
    ...input,
    id: `rv_${randomBytes(10).toString("hex")}`,
    createdAt: new Date().toISOString(),
  };
  const published = isPublicReviewRating(review.rating),
    db = getDb();
  const ref = db.collection(REVIEWS_COLLECTION).doc(review.id);
  const limit = db.collection("reviewSubmissionLimits").doc(limitKey);
  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(limit);
    const count = Number(snapshot.data()?.count || 0);
    if (count >= 5) throw new Error("REVIEW_LIMIT");
    tx.set(limit, {
      count: count + 1,
      expiresAt: new Date(Date.now() + 2 * 86400000),
    });
    tx.set(ref, {
      ...review,
      published,
      moderated: false,
      notificationStatus: published ? "not-required" : "pending",
    });
  });
  return { review, published };
}
