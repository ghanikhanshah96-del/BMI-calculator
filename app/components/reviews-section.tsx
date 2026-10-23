"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { UserReview } from "@/app/lib/reviews";
import { isPublicReviewRating } from "@/app/lib/review-policy";
import { ReviewPrompt } from "@/app/components/review-prompt";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [paused, setPaused] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );
  const row = useRef<HTMLUListElement>(null);
  const interaction = useRef(false);
  const id = useId();
  useEffect(() => {
    const controller = new AbortController();
    const accept = (data: { reviews: UserReview[] }) => {
      setReviews(
        data.reviews.filter((review) => isPublicReviewRating(review.rating)),
      );
      setStatus("ready");
    };
    const load = () =>
      fetch("/api/reviews", { cache: "no-store", signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then(accept)
        .catch(() => {
          if (!controller.signal.aborted) setStatus("unavailable");
        });
    const stream = new EventSource("/api/reviews/stream");
    stream.onmessage = (event) => {
      try {
        accept(JSON.parse(event.data));
      } catch {
        setStatus("unavailable");
      }
    };
    stream.onerror = () => {
      void load();
    };
    stream.addEventListener("unavailable", () => setStatus("unavailable"));
    // Refresh on submission/focus, and recover when a host cannot stream responses.
    void load();
    const timer = window.setInterval(() => {
      if (!document.hidden && stream.readyState !== EventSource.OPEN)
        void load();
    }, 15000);
    window.addEventListener("reviews-updated", load);
    window.addEventListener("focus", load);
    return () => {
      controller.abort();
      stream.close();
      window.clearInterval(timer);
      window.removeEventListener("reviews-updated", load);
      window.removeEventListener("focus", load);
    };
  }, []);
  useEffect(() => {
    if (
      paused ||
      reviews.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(() => {
      const el = row.current;
      if (!el || interaction.current || document.hidden) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1)
        el.scrollLeft = 0;
      else el.scrollLeft += 1;
    }, 35);
    return () => window.clearInterval(timer);
  }, [paused, reviews.length]);
  const move = (direction: number) => {
    setPaused(true);
    row.current?.scrollBy({
      left: direction * 340,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  return (
    <section
      id="reviews"
      className="bg-white py-12 sm:py-16"
      aria-labelledby={`${id}-heading`}
      aria-roledescription="carousel"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id={`${id}-heading`}
            className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl"
          >
            User reviews
          </h2>
          <p className="mt-3 text-sm text-[var(--ink-muted)]">
            Selected 4–5 star reviews from our users. Ratings of 1–3 stars are
            shared privately with our team. This selection does not represent
            all feedback.
          </p>
          <button
            className="review-primary mt-5"
            onClick={() => setReviewOpen(true)}
          >
            Write a review
          </button>
        </div>
        {!reviews.length && (
          <p
            role="status"
            className="mt-6 text-center text-sm text-[var(--ink-muted)]"
          >
            {status === "loading"
              ? "Loading reviews…"
              : status === "unavailable"
                ? "Reviews are temporarily unavailable. Please try again later."
                : "No public reviews yet. Share your experience with our fitness calculators."}
          </p>
        )}
        {reviews.length > 0 && (
          <div className="mt-5 flex justify-center gap-2">
            <button
              className="review-secondary"
              aria-label="Previous reviews"
              aria-controls={id}
              onClick={() => move(-1)}
            >
              &larr;
            </button>
            <button
              className="review-secondary"
              aria-controls={id}
              onClick={() => setPaused(!paused)}
            >
              {paused ? "Play" : "Pause"} scrolling
            </button>
            <button
              className="review-secondary"
              aria-label="Next reviews"
              aria-controls={id}
              onClick={() => move(1)}
            >
              &rarr;
            </button>
          </div>
        )}
        <ul
          id={id}
          ref={row}
          tabIndex={0}
          aria-label="Selected reviews; scroll to explore"
          className="mt-6 flex gap-4 overflow-x-auto rounded-xl pb-4 focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
          onMouseEnter={() => {
            interaction.current = true;
          }}
          onMouseLeave={() => {
            interaction.current = false;
          }}
          onFocus={() => {
            interaction.current = true;
          }}
          onBlur={() => {
            interaction.current = false;
          }}
          onTouchStart={() => setPaused(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              move(e.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          {reviews.map((review) => (
            <li
              key={review.id}
              className="w-[min(82vw,320px)] shrink-0 rounded-xl border border-[var(--border)] bg-[var(--background)] p-5"
            >
              <p
                aria-label={`${review.rating} out of 5 stars`}
                className="text-[var(--brand)]"
              >
                {"\u2605".repeat(review.rating)}
                <span className="opacity-30" aria-hidden="true">
                  {"\u2605".repeat(5 - review.rating)}
                </span>
              </p>
              <blockquote className="mt-3 break-words text-sm leading-relaxed text-[var(--ink)]">
                &ldquo;{review.comment}&rdquo;
              </blockquote>
              <p className="mt-4 break-words text-xs font-semibold text-[var(--ink-muted)]">
                {review.name}
                {review.tool ? ` / ${review.tool}` : ""}
              </p>
            </li>
          ))}
        </ul>
        {reviewOpen && <ReviewPrompt onClose={() => setReviewOpen(false)} />}
      </div>
    </section>
  );
}
