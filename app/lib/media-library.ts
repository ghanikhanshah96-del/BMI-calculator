import { getDb, isFirebaseConfigured } from "./firebase-admin";
import { readdir, stat } from "fs/promises";
import path from "path";
import { listBlogPosts } from "@/app/lib/blog-repo";
import siteMediaManifest from "@/app/lib/site-media-manifest.json";

export type MediaSource = "site" | "upload" | "cover" | "content";

export interface MediaItem {
  url: string;
  name: string;
  source: MediaSource;
  /** Lowercase extension without dot, e.g. "png", "svg". */
  ext: string;
  /** File size in bytes when available. */
  size?: number;
  /** ISO mtime when available. */
  modifiedAt?: string;
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg|ico)$/i;
const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/gi;

function fileNameFromUrl(url: string) {
  try {
    const pathname = url.startsWith("http")
      ? new URL(url).pathname
      : url.split("?")[0];
    return decodeURIComponent(pathname.split("/").pop() || url);
  } catch {
    return url.split("/").pop() || url;
  }
}

function extFromUrl(url: string) {
  const name = fileNameFromUrl(url);
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

function addImage(
  map: Map<string, MediaItem>,
  url: string,
  source: MediaSource,
  extra?: Pick<MediaItem, "size" | "modifiedAt" | "ext">,
) {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("data:")) return;
  if (!IMAGE_EXT.test(decodeURIComponent(trimmed.split("?")[0]))) return;

  const existing = map.get(trimmed);
  const rank: Record<MediaSource, number> = {
    upload: 4,
    cover: 3,
    content: 2,
    site: 1,
  };

  if (existing) {
    if (rank[source] > rank[existing.source]) {
      map.set(trimmed, {
        ...existing,
        source,
        ...extra,
        ext: extra?.ext || existing.ext,
      });
    } else if (extra) {
      map.set(trimmed, {
        ...existing,
        ...extra,
        ext: extra.ext || existing.ext,
      });
    }
    return;
  }

  map.set(trimmed, {
    url: trimmed,
    name: fileNameFromUrl(trimmed),
    source,
    ext: extra?.ext || extFromUrl(trimmed),
    ...extra,
  });
}

function extractContentImages(html: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  IMG_SRC_RE.lastIndex = 0;
  while ((match = IMG_SRC_RE.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

/** Local uploads only — never walks public/assets (that inflates Vercel functions). */
async function walkUploads(map: Map<string, MediaItem>) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  let entries;
  try {
    entries = await readdir(uploadDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".") || !entry.isDirectory()) continue;
    const dir = path.join(uploadDir, entry.name);
    let files;
    try {
      files = await readdir(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      if (!IMAGE_EXT.test(file)) continue;
      const abs = path.join(dir, file);
      const url = `/uploads/${entry.name}/${file}`;
      try {
        const info = await stat(abs);
        addImage(map, url, "upload", {
          size: info.size,
          modifiedAt: info.mtime.toISOString(),
          ext: path.extname(file).slice(1).toLowerCase(),
        });
      } catch {
        addImage(map, url, "upload", {
          ext: path.extname(file).slice(1).toLowerCase(),
        });
      }
    }
  }
}

export async function listMediaLibrary(): Promise<MediaItem[]> {
  const map = new Map<string, MediaItem>();

  // Build-time path list only (images stay on CDN / public, not in the lambda).
  for (const item of siteMediaManifest) {
    addImage(map, item.url, "site", {
      size: item.size,
      modifiedAt: item.modifiedAt,
      ext: item.ext,
    });
  }

  if (isFirebaseConfigured()) {
    const uploaded = await getDb().collection("adminMedia").get();
    for (const doc of uploaded.docs) {
      const data = doc.data();
      addImage(map, data.url, "upload", {
        size: data.size,
        modifiedAt: data.modifiedAt,
        ext: data.ext,
      });
    }
  }

  // Local uploads (empty on most serverless hosts; safe when present locally).
  await walkUploads(map);

  try {
    const posts = await listBlogPosts();
    for (const post of posts) {
      if (post.coverImage) addImage(map, post.coverImage, "cover");
      for (const src of extractContentImages(post.content || "")) {
        addImage(map, src, "content");
      }
    }
  } catch {
    // Firestore optional for media listing
  }

  return Array.from(map.values()).sort((a, b) => {
    const aTime = a.modifiedAt ? Date.parse(a.modifiedAt) : 0;
    const bTime = b.modifiedAt ? Date.parse(b.modifiedAt) : 0;
    if (aTime !== bTime) return bTime - aTime;
    return a.name.localeCompare(b.name);
  });
}
