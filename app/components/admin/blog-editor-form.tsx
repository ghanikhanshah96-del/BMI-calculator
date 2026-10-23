"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { contentForEditor } from "@/app/lib/blog-content";
import { slugify } from "@/app/lib/slug";
import { blogCategories } from "@/app/lib/admin-categories";

const WysiwygEditor = dynamic(
  () => import("@/app/components/admin/wysiwyg-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[580px] items-center justify-center border border-slate-200 bg-white text-sm text-slate-400 shadow-sm">
        Loading editor…
      </div>
    ),
  },
);

export interface BlogEditorInitial {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  contentFormat?: string;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  coverImage?: string | null;
  coverImageAlt?: string;
  featured?: boolean;
  status?: string;
  date?: string;
}

const categories = blogCategories.filter((c) => c !== "All");

export default function BlogEditorForm({
  initial,
  mode,
}: {
  initial?: BlogEditorInitial;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(() =>
    contentForEditor(initial?.content || "", initial?.contentFormat),
  );
  const [category, setCategory] = useState(
    initial?.category || "Health & Fitness",
  );
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription || "",
  );
  const [focusKeyword, setFocusKeyword] = useState(initial?.focusKeyword || "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [coverImageAlt, setCoverImageAlt] = useState(
    initial?.coverImageAlt || "",
  );
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/media");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.images)) {
          setLibraryImages(data.images);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const permalink = useMemo(() => `/blog/${slug || "…"}`, [slug]);

  const uploadCover = async (file: File) => {
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
      setCoverImage(data.url);
      if (!coverImageAlt.trim()) {
        setCoverImageAlt(
          file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        );
      }
      setLibraryImages((prev) =>
        prev.includes(data.url) ? prev : [data.url, ...prev],
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (status: "draft" | "published") => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        title,
        slug,
        excerpt,
        content,
        contentFormat: "html",
        category,
        tags,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        focusKeyword,
        coverImage: coverImage || null,
        coverImageAlt: coverImageAlt.trim(),
        featured,
        status,
        date: initial?.date,
      };

      const url =
        mode === "edit" && initial?.id
          ? `/api/admin/blogs/${initial.id}`
          : "/api/admin/blogs";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/admin/blogs");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-lg font-medium text-slate-900 outline-none focus:border-slate-400"
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Permalink (slug)
          </label>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <span className="text-slate-400">/blog/</span>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="min-w-[12rem] flex-1 outline-none text-slate-800"
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Live URL:{" "}
            <span className="font-medium text-slate-700">{permalink}</span>
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Content
          </label>
          <WysiwygEditor value={content} onChange={setContent} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Short summary shown on the blog listing"
          />
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Publish</h3>
          {error && (
            <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={saving || !title.trim()}
              onClick={() => save("published")}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving
                ? "Saving…"
                : mode === "edit"
                  ? "Update & Publish"
                  : "Publish"}
            </button>
            <button
              type="button"
              disabled={saving || !title.trim()}
              onClick={() => save("draft")}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Save draft
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Status:{" "}
            <span className="font-medium text-slate-700">
              {initial?.status || "new"}
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Featured image
          </h3>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={coverImageAlt || "Cover preview"}
              className="mb-3 aspect-[16/9] w-full object-cover"
            />
          ) : (
            <div className="mb-3 flex aspect-[16/9] items-center justify-center bg-slate-100 text-xs text-slate-400">
              No image
            </div>
          )}

          <div className="mb-3">
            <label className="mb-1 block text-xs text-slate-500">
              Image alt text
            </label>
            <input
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="Describe the image for accessibility/SEO"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadCover(file);
                }}
              />
            </label>
            <button
              type="button"
              className="border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setShowLibrary((v) => !v)}
            >
              {showLibrary ? "Hide library" : "Choose from library"}
            </button>
            {coverImage && (
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => {
                  setCoverImage("");
                  setCoverImageAlt("");
                }}
              >
                Remove
              </button>
            )}
          </div>

          {showLibrary && (
            <div className="mt-3 max-h-56 overflow-y-auto border border-slate-200 bg-slate-50 p-2">
              <p className="mb-2 px-1 text-[11px] text-slate-500">
                Site blog images (same covers used on the public blog)
              </p>
              {libraryImages.length === 0 ? (
                <p className="px-1 py-3 text-center text-xs text-slate-400">
                  No library images yet
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {libraryImages.map((src) => {
                    const selected = coverImage === src;
                    return (
                      <button
                        key={src}
                        type="button"
                        title={src}
                        onClick={() => {
                          setCoverImage(src);
                          if (!coverImageAlt.trim()) {
                            const name = src.split("/").pop() || "";
                            setCoverImageAlt(
                              name
                                .replace(/\.[^.]+$/, "")
                                .replace(/[-_]/g, " "),
                            );
                          }
                        }}
                        className={`relative aspect-[4/3] overflow-hidden border-2 bg-white ${
                          selected
                            ? "border-[var(--brand)]"
                            : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">SEO</h3>
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Meta title
            </label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Meta description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Focus keyword
            </label>
            <input
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="e.g. healthy BMI range"
            />
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Organization</h3>
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-slate-400"
            >
              {Array.from(new Set([category, ...categories])).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">
              Tags (comma separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured post
          </label>
        </div>
      </aside>
    </div>
  );
}
