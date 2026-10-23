import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import {
  createReview,
  isFirebaseConfigured,
  listPublicReviews,
  REVIEWS_COLLECTION,
} from "@/app/lib/reviews-repo";
import { getDb } from "@/app/lib/firebase-admin";
import { sendEmail } from "@/app/lib/email";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
export async function GET() {
  try {
    return NextResponse.json(
      { reviews: await listPublicReviews() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Reviews are temporarily unavailable." },
      { status: 503 },
    );
  }
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  if (!isFirebaseConfigured())
    return NextResponse.json(
      { message: "Reviews are temporarily unavailable." },
      { status: 503 },
    );
  try {
    if (Number(request.headers.get("content-length")) > 4000)
      return NextResponse.json(
        { message: "Review is too long." },
        { status: 413 },
      );
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 4000)
      return NextResponse.json(
        { message: "Review is too long." },
        { status: 413 },
      );
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ message: "Invalid review." }, { status: 400 });
    }
    if (
      !body ||
      !Number.isInteger(body.rating) ||
      body.rating < 1 ||
      body.rating > 5 ||
      typeof body.comment !== "string" ||
      !body.comment.trim() ||
      body.comment.length > 280 ||
      (body.name !== undefined &&
        (typeof body.name !== "string" || body.name.length > 40)) ||
      (body.tool !== undefined &&
        (typeof body.tool !== "string" || body.tool.length > 80))
    )
      return NextResponse.json(
        {
          message:
            "Choose 1?5 stars and write a review of up to 280 characters.",
        },
        { status: 400 },
      );
    const secret =
      process.env.REVIEWS_RATE_LIMIT_SECRET || process.env.SESSION_SECRET;
    if (!secret || secret.length < 32)
      return NextResponse.json(
        { message: "Reviews are temporarily unavailable." },
        { status: 503 },
      );
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const key = createHmac("sha256", secret)
      .update(`${ip}:${new Date().toISOString().slice(0, 10)}`)
      .digest("hex");
    const { review, published } = await createReview(
      {
        name: body.name?.trim() || "Anonymous user",
        rating: body.rating,
        comment: body.comment.trim(),
        ...(body.tool?.trim() ? { tool: body.tool.trim() } : {}),
      },
      key,
    );
    if (!published) {
      let notificationStatus = "failed";
      try {
        await sendEmail({
          to:
            process.env.REVIEWS_TO_EMAIL ||
            process.env.CONTACT_TO_EMAIL ||
            process.env.EMAIL_TO ||
            process.env.SMTP_USER ||
            "",
          subject: `FitnessCalculatorPro feedback: ${review.rating}/5 stars`,
          html: `<h2>Feedback needs attention</h2><p>${escape(review.name)} rated ${escape(review.tool || "FitnessCalculatorPro")} ${review.rating}/5.</p><p>${escape(review.comment)}</p><p>Saved privately as ${review.id}.</p>`,
        });
        notificationStatus = "sent";
      } catch {
        console.error("[reviews] Notification failed for", review.id);
      }
      await getDb()
        .collection(REVIEWS_COLLECTION)
        .doc(review.id)
        .update({ notificationStatus })
        .catch(() => {
          console.error(
            "[reviews] Notification status could not be saved for",
            review.id,
          );
        });
    }
    return NextResponse.json(
      { review, published },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "REVIEW_LIMIT")
      return NextResponse.json(
        {
          message:
            "You have reached the daily review limit. Please try again tomorrow.",
        },
        { status: 429 },
      );
    console.error("[reviews] Review submission failed");
    return NextResponse.json(
      { message: "We could not save your review. Please try again." },
      { status: 503 },
    );
  }
}
