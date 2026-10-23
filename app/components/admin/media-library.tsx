"use client";

import { useMemo, useRef, useState } from "react";
import type { MediaItem, MediaSource } from "@/app/lib/media-library";

const SOURCE_LABEL: Record<MediaSource, string> = {
  site: "Site",
  upload: "Upload",
  cover: "Cover",
  content: "In post",
};

type TypeFilter = "all" | "png" | "jpg" | "webp" | "svg" | "other";

function formatBytes(bytes?: number) {
  if (bytes == null) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function matchesType(item: MediaItem, type: TypeFilter) {
  if (type === "all") return true;
  if (type === "jpg") return item.ext === "jpg" || item.ext === "jpeg";
  if (type === "other") {
    return !["png", "jpg", "jpeg", "webp", "svg"].includes(item.ext);
  }
  return item.ext === type;
}

function isIconLike(item: MediaItem) {
  return (
    item.ext === "svg" ||
    item.ext === "ico" ||
    /icon|logo|tick|bullet|arrow/i.test(item.name)
  );
}

export default function MediaLibrary({
  initialItems,
}: {
  initialItems: MediaItem[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initialItems);
  const [sourceFilter, setSourceFilter] = useState<"all" | MediaSource>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (sourceFilter !== "all" && item.source !== sourceFilter) return false;
      if (!matchesType(item, typeFilter)) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.ext.toLowerCase().includes(q)
      );
    });
  }, [items, sourceFilter, typeFilter, query]);

  const refresh = async () => {
    const res = await fetch("/api/admin/media");
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data.items)) setItems(data.items);
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      await refresh();
      const name = decodeURIComponent(new URL(data.url, window.location.origin).pathname.split("/").pop() || "image.webp").split("/").pop() || "image.webp";
      setSelected({
        url: data.url,
        name,
        source: "upload",
        ext: name.includes(".") ? name.split(".").pop()!.toLowerCase() : "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError("Could not copy URL");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-slate-500">
          Every PNG, JPG, WebP, SVG, and icon under the site assets — plus
          uploads and images used in posts.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "+ Upload media"}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or path…"
            className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none ring-[var(--brand)] focus:ring-2"
          />
          <p className="ml-auto text-xs text-slate-400">
            {filtered.length} of {items.length} file
            {items.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "All types"],
              ["png", "PNG"],
              ["jpg", "JPG"],
              ["webp", "WebP"],
              ["svg", "SVG / icons"],
              ["other", "Other"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTypeFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                typeFilter === value
                  ? "bg-[#052e23] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "All sources"],
              ["site", "Site assets"],
              ["upload", "Uploads"],
              ["cover", "Covers"],
              ["content", "In posts"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSourceFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                sourceFilter === value
                  ? "bg-slate-700 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-5">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              No media found for this filter.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {filtered.map((item) => {
                const active = selected?.url === item.url;
                const icon = isIconLike(item);
                return (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`group overflow-hidden rounded-xl border bg-slate-50 text-left transition ${
                      active
                        ? "border-[var(--brand)] ring-2 ring-[var(--brand)]/30"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`relative aspect-square overflow-hidden ${
                        icon ? "bg-white p-4" : "bg-slate-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.name}
                        className={`h-full w-full transition group-hover:scale-[1.02] ${
                          icon ? "object-contain" : "object-cover"
                        }`}
                      />
                    </div>
                    <div className="space-y-1 p-2.5">
                      <p className="truncate text-xs font-medium text-slate-800">
                        {item.name}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                          {item.ext || "file"}
                        </span>
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                          {SOURCE_LABEL[item.source]}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-semibold text-slate-900">Details</h2>
          {!selected ? (
            <p className="mt-4 text-sm text-slate-500">
              Select a file to view details and copy its URL.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              <div
                className={`overflow-hidden rounded-xl border border-slate-200 ${
                  isIconLike(selected) ? "bg-white p-6" : "bg-slate-50"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.url}
                  alt={selected.name}
                  className={`aspect-[4/3] w-full ${
                    isIconLike(selected) ? "object-contain" : "object-cover"
                  }`}
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  File name
                </p>
                <p className="mt-1 break-all text-sm text-slate-800">
                  {selected.name}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  URL
                </p>
                <p className="mt-1 break-all text-xs text-slate-600">
                  {selected.url}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium uppercase">
                  {selected.ext || "file"}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">
                  {SOURCE_LABEL[selected.source]}
                </span>
                {formatBytes(selected.size) && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">
                    {formatBytes(selected.size)}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => void copyUrl(selected.url)}
                  className="rounded-xl bg-[#052e23] px-3 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  {copied === selected.url ? "Copied!" : "Copy URL"}
                </button>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Open original
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
