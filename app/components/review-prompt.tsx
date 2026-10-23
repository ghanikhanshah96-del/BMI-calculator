"use client";
import { useEffect, useId, useRef, useState } from "react";
import { dismissReviewPrompt, markReviewSubmitted } from "../lib/reviews";
export function ReviewPrompt({
  toolName,
  onClose,
}: {
  toolName?: string;
  onClose: () => void;
}) {
  const titleId = useId(),
    dialog = useRef<HTMLDialogElement>(null),
    busy = useRef(false);
  const [rating, setRating] = useState(0),
    [name, setName] = useState(""),
    [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    el?.showModal();
    return () => {
      el?.close();
      previous?.focus();
    };
  }, []);
  const close = () => {
    if (busy.current) return;
    if (!sent) dismissReviewPrompt(14);
    onClose();
  };
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy.current || !rating || !comment.trim()) return;
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, name, comment, tool: toolName }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Your review could not be saved.");
      markReviewSubmitted();
      window.dispatchEvent(new Event("reviews-updated"));
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="review-dialog"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id={titleId} className="text-2xl text-emerald-950">
          {sent ? "Thank you for your feedback" : "How did we do?"}
        </h2>
        <button
          type="button"
          aria-label="Close review dialog"
          onClick={close}
          disabled={saving}
          className="review-secondary"
        >
          ?
        </button>
      </div>
      {sent ? (
        <div role="status">
          <p className="my-5 text-slate-600">
            Your feedback is saved and helps us improve our fitness calculators.
          </p>
          <button autoFocus className="review-primary" onClick={close}>
            Back to calculator
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="mt-3 text-sm text-slate-600">
            Share your experience
            {toolName ? ` with ${toolName}` : " with FitnessCalculatorPro"}.
          </p>
          <fieldset disabled={saving} className="mt-5 space-y-4">
            <legend className="sr-only">Your review</legend>
            <div role="group" aria-label="Star rating" className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                  aria-pressed={rating === star}
                  onClick={() => setRating(star)}
                  className={`rounded-lg px-2 text-4xl focus-visible:outline-2 focus-visible:outline-emerald-700 ${star <= rating ? "text-emerald-600" : "text-slate-300"}`}
                >
                  ?
                </button>
              ))}
            </div>
            <label className="block text-sm font-medium">
              Your name (optional)
              <input
                className="review-input mt-1"
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="block text-sm font-medium">
              Your review
              <textarea
                required
                className="review-input mt-1 min-h-28"
                maxLength={280}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What worked well, or what could be better?"
              />
            </label>
            <p className="text-right text-xs text-slate-500">
              {comment.length}/280
            </p>
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                className="review-primary flex-1"
                disabled={!rating || !comment.trim() || saving}
              >
                {saving ? "Saving?" : "Send review"}
              </button>
              <button
                type="button"
                className="review-secondary"
                onClick={close}
              >
                Not now
              </button>
            </div>
          </fieldset>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Selected 4?5 star reviews may appear publicly. Ratings of 1?3 stars
            are saved privately and a team email alert is attempted. Please
            leave out personal and medical information.
          </p>
        </form>
      )}
    </dialog>
  );
}
