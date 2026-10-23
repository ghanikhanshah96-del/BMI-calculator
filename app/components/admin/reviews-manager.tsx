"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { AdminReview, ReviewEdit } from "@/app/lib/reviews-repo";
import { ReviewStar } from "../review-icons";
import {
  AdminDialog,
  AdminIcon,
  AdminPagination,
} from "@/app/components/admin/review-dialog";

const PAGE_SIZE = 10;
const alertLabels = {
  sent: "Alert sent",
  failed: "Email failed",
  pending: "Email pending",
  "not-required": "No alert sent",
};
const dateLabel = (value: string) =>
  Number.isFinite(Date.parse(value))
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
      })
    : "—";

export function ReviewsManager({
  initialReviews,
}: {
  initialReviews: AdminReview[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<AdminReview | null>(null);
  const [removing, setRemoving] = useState<AdminReview | null>(null);
  const [draft, setDraft] = useState<ReviewEdit>({
    name: "",
    comment: "",
    rating: 5,
    tool: "",
    published: false,
  });
  const [dialogError, setDialogError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/reviews", {
        cache: "no-store",
        signal,
      });
      if (!response.ok)
        throw new Error(
          response.status === 401
            ? "Your session expired. Sign in again."
            : "Feedback could not be refreshed.",
        );
      const data = await response.json();
      if (!signal?.aborted) {
        setReviews(data.reviews);
        setError("");
      }
    } catch (err) {
      if (!signal?.aborted)
        setError(
          err instanceof Error
            ? err.message
            : "Feedback could not be refreshed.",
        );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const update = () => {
      if (!document.hidden && !editing && !removing)
        void refresh(controller.signal);
    };
    const timer = window.setInterval(update, 15000);
    window.addEventListener("focus", update);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, [refresh, editing, removing]);

  const filtered = reviews.filter((review) => {
    const matches =
      filter === "all" ||
      (filter === "below3" && review.rating < 3) ||
      (filter === "private" && !review.published) ||
      (filter === "public" && review.published) ||
      (filter === "failed" && review.notificationStatus === "failed");
    return (
      matches &&
      `${review.name} ${review.comment} ${review.tool || ""}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    );
  });
  const page = Math.min(
    pageIndex,
    Math.max(0, Math.ceil(filtered.length / PAGE_SIZE) - 1),
  );
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const chooseFilter = (value: string) => {
    setFilter(value);
    setPageIndex(0);
  };
  const startEdit = (review: AdminReview) => {
    setEditing(review);
    setDialogError("");
    setDraft({
      name: review.name,
      comment: review.comment,
      rating: review.rating,
      tool: review.tool || "",
      published: review.published,
    });
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing || busy) return;
    setBusy(true);
    setDialogError("");
    try {
      const response = await fetch(`/api/admin/reviews/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Review could not be saved.");
      setReviews((items) =>
        items.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                ...draft,
                published: draft.published && draft.rating > 3,
              }
            : item,
        ),
      );
      setEditing(null);
      setNotice("Review updated. Public changes appear automatically.");
      window.dispatchEvent(new Event("reviews-updated"));
    } catch (err) {
      setDialogError(
        err instanceof Error ? err.message : "Review could not be saved.",
      );
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!removing || busy) return;
    setBusy(true);
    setDialogError("");
    try {
      const response = await fetch(`/api/admin/reviews/${removing.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Review could not be deleted.");
      setReviews((items) => items.filter((item) => item.id !== removing.id));
      setRemoving(null);
      setNotice("Review deleted.");
      window.dispatchEvent(new Event("reviews-updated"));
    } catch (err) {
      setDialogError(
        err instanceof Error ? err.message : "Review could not be deleted.",
      );
    } finally {
      setBusy(false);
    }
  };
  const status = (review: AdminReview) => (
    <span
      className={`admin-pill ${review.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
    >
      {review.published ? "Public" : "Private"}
    </span>
  );
  const actions = (review: AdminReview) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        className="admin-btn admin-icon admin-btn-quiet"
        aria-label={`Edit review by ${review.name}`}
        title="Edit review"
        onClick={() => startEdit(review)}
      >
        <AdminIcon name="edit" />
      </button>
      <button
        type="button"
        className="admin-btn admin-icon admin-btn-quiet !text-red-600"
        aria-label={`Delete review by ${review.name}`}
        title="Delete review"
        onClick={() => {
          setRemoving(review);
          setDialogError("");
        }}
      >
        <AdminIcon name="trash" />
      </button>
    </div>
  );
  const comment = (review: AdminReview) => (
    <>
      <p
        className={`mt-1 break-words text-[13px] leading-5 text-slate-600 ${expanded !== review.id ? "line-clamp-2" : ""}`}
      >
        {review.comment}
      </p>
      {review.comment.length > 70 && (
        <button
          type="button"
          className="mt-1 text-xs font-medium text-[var(--brand)]"
          onClick={() => setExpanded(expanded === review.id ? null : review.id)}
        >
          {expanded === review.id ? "Show less" : "Read full feedback"}
        </button>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Customer feedback
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Read, edit, and manage reviews. Only 4–5 star reviews can be public.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn"
          disabled={loading}
          onClick={() => void refresh()}
        >
          <AdminIcon
            name="refresh"
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Refreshing" : "Refresh"}
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          {notice}
          <button
            className="admin-btn admin-icon admin-btn-quiet"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <AdminIcon name="close" />
          </button>
        </div>
      )}
      <div className="admin-panel overflow-hidden">
        <div
          className="flex flex-wrap gap-1 border-b border-slate-100 px-3 pt-2"
          aria-label="Review views"
        >
          {[
            { value: "all", label: "All reviews", count: reviews.length },
            {
              value: "below3",
              label: "1–2 stars",
              count: reviews.filter((r) => r.rating < 3).length,
            },
            {
              value: "private",
              label: "Private",
              count: reviews.filter((r) => !r.published).length,
            },
            {
              value: "public",
              label: "Public",
              count: reviews.filter((r) => r.published).length,
            },
          ].map((tab) => (
            <button
              type="button"
              key={tab.value}
              onClick={() => chooseFilter(tab.value)}
              aria-pressed={filter === tab.value}
              className={`flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition ${filter === tab.value ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-slate-500 hover:text-slate-900"}`}
            >
              {tab.label}
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative w-full sm:max-w-sm">
            <span className="sr-only">Search feedback</span>
            <AdminIcon
              name="search"
              className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPageIndex(0);
              }}
              placeholder="Search reviews, names, or tools"
              className="admin-input !pl-9"
            />
          </label>
          <label className="sm:w-48">
            <span className="sr-only">Filter feedback</span>
            <select
              value={filter}
              onChange={(event) => chooseFilter(event.target.value)}
              className="admin-input"
            >
              <option value="all">All feedback</option>
              <option value="below3">Below 3 stars (1–2)</option>
              <option value="private">Private feedback (1–3)</option>
              <option value="public">Public reviews (4–5)</option>
              <option value="failed">Email delivery failed</option>
            </select>
          </label>
        </div>
        {!visible.length ? (
          <div className="px-6 py-10 text-center">
            <AdminIcon
              name="star"
              className="mx-auto mb-3 h-7 w-7 text-slate-300"
            />
            <h3 className="text-sm font-semibold text-slate-800">
              {reviews.length ? "No matching reviews" : "No reviews yet"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {reviews.length
                ? "Try another search or clear your filters."
                : "Feedback will appear here when a customer submits a review."}
            </p>
            {reviews.length > 0 && (
              <button
                className="admin-btn mt-3"
                onClick={() => {
                  chooseFilter("all");
                  setSearch("");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="admin-table table-fixed">
                <thead>
                  <tr>
                    <th>Feedback</th>
                    <th className="w-16">Rating</th>
                    <th className="w-36">Visibility / email</th>
                    <th className="w-28">Received</th>
                    <th className="w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <p
                          title={`${review.name}${review.tool ? ` / ${review.tool}` : ""}`}
                          className="line-clamp-1 break-all font-semibold text-slate-900"
                        >
                          {review.name}
                          <span className="ml-2 font-normal text-slate-400">
                            {review.tool}
                          </span>
                        </p>
                        {comment(review)}
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                          <ReviewStar filled className="h-4 w-4 text-amber-500" />
                          {review.rating}
                        </span>
                      </td>
                      <td>
                        {status(review)}
                        <p
                          className={`mt-1.5 text-[11px] ${review.notificationStatus === "failed" ? "text-red-600" : "text-slate-400"}`}
                        >
                          {alertLabels[review.notificationStatus]}
                        </p>
                      </td>
                      <td className="text-xs text-slate-500">
                        <time dateTime={review.createdAt}>
                          {dateLabel(review.createdAt)}
                        </time>
                      </td>
                      <td>{actions(review)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-slate-100 md:hidden">
              {visible.map((review) => (
                <li key={review.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {review.name}
                    </p>
                    {status(review)}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                      <ReviewStar filled className="h-4 w-4" />{review.rating}/5
                    </span>
                    {review.tool && (
                      <span className="max-w-24 truncate" title={review.tool}>
                        {review.tool}
                      </span>
                    )}
                    <span className="ml-auto shrink-0">
                      {dateLabel(review.createdAt)}
                    </span>
                  </div>
                  {comment(review)}
                  <div className="mt-1 flex items-center justify-between">
                    <span
                      className={`text-[11px] ${review.notificationStatus === "failed" ? "text-red-600" : "text-slate-400"}`}
                    >
                      {alertLabels[review.notificationStatus]}
                    </span>
                    {actions(review)}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        <AdminPagination
          page={page}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onChange={setPageIndex}
        />
      </div>
      <AdminDialog
        open={!!editing}
        title="Edit review"
        description="Update the feedback or change its visibility."
        busy={busy}
        onClose={() => setEditing(null)}
      >
        <form onSubmit={save}>
          <fieldset disabled={busy} className="space-y-4 p-5">
            <div className="grid grid-cols-[1fr_110px] gap-3">
              <label>
                <span className="admin-label">Customer name</span>
                <input
                  className="admin-input"
                  required
                  maxLength={40}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </label>
              <label>
                <span className="admin-label">Rating</span>
                <select
                  className="admin-input"
                  aria-label="Rating"
                  value={draft.rating}
                  onChange={(e) => {
                    const rating = Number(e.target.value);
                    setDraft({
                      ...draft,
                      rating,
                      published: rating > 3 && draft.published,
                    });
                  }}
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} {rating === 1 ? "star" : "stars"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="admin-label">Feedback</span>
              <textarea
                className="admin-input"
                required
                maxLength={280}
                value={draft.comment}
                onChange={(e) =>
                  setDraft({ ...draft, comment: e.target.value })
                }
              />
              <span className="mt-1 block text-right text-[11px] text-slate-400">
                {draft.comment.length}/280
              </span>
            </label>
            <label className="block">
              <span className="admin-label">
                Tool{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </span>
              <input
                className="admin-input"
                maxLength={80}
                value={draft.tool}
                onChange={(e) => setDraft({ ...draft, tool: e.target.value })}
              />
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <input
                type="checkbox"
                className="mt-0.5 accent-[var(--brand)]"
                checked={draft.published}
                disabled={draft.rating <= 3}
                onChange={(e) =>
                  setDraft({ ...draft, published: e.target.checked })
                }
              />
              <span className="text-sm font-medium text-slate-800">
                Show on the website
                <span className="mt-0.5 block text-xs font-normal text-slate-500">
                  {draft.rating <= 3
                    ? "Reviews of 3 stars or below always stay private."
                    : "Public reviews update on the homepage automatically."}
                </span>
              </span>
            </label>
            {dialogError && (
              <p role="alert" className="text-sm text-red-700">
                {dialogError}
              </p>
            )}
          </fieldset>
          <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
            <button
              type="button"
              className="admin-btn"
              disabled={busy}
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={busy}
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </AdminDialog>
      <AdminDialog
        open={!!removing}
        title="Delete review?"
        description="The review will be removed from the database and website. This cannot be undone."
        busy={busy}
        onClose={() => setRemoving(null)}
      >
        <div className="p-5">
          <p className="text-sm font-semibold text-slate-900">
            {removing?.name} · {removing?.rating}/5 stars
          </p>
          <p className="mt-2 break-words text-sm text-slate-500">
            {removing?.comment}
          </p>
          {dialogError && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {dialogError}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button
            className="admin-btn"
            disabled={busy}
            onClick={() => setRemoving(null)}
          >
            Keep review
          </button>
          <button
            className="admin-btn admin-btn-danger"
            disabled={busy}
            onClick={() => void remove()}
          >
            {busy ? "Deleting…" : "Delete review"}
          </button>
        </div>
      </AdminDialog>
    </div>
  );
}
