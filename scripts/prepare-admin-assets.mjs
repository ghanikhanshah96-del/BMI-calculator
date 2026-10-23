import { cp, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
await mkdir("public/tinymce", { recursive: true });
await cp("node_modules/tinymce", "public/tinymce", { recursive: true });
const items = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "tinymce") continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(png|jpe?g|webp|avif|gif|svg|ico)$/i.test(file)) {
      const info = await stat(file);
      items.push({
        url: "/" + path.relative("public", file).replaceAll("\\", "/"),
        size: info.size,
        modifiedAt: info.mtime.toISOString(),
        ext: path.extname(file).slice(1),
      });
    }
  }
}
await walk("public");
await writeFile("app/lib/site-media-manifest.json", JSON.stringify(items));
