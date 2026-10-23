import { revalidatePath } from "next/cache";
export function revalidateBlog(...slugs: string[]) {
  for (const path of [
    "/",
    "/blog",
    "/sitemap.xml",
    "/sitemap-page",
    ...slugs.map((s) => `/blog/${s}`),
  ])
    revalidatePath(path);
}
