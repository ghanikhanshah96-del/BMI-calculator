import {
  getBlogPostById,
  listBlogPosts,
  type BlogPostRecord,
} from "./blog-repo";
export function dbPostToView(post: BlogPostRecord) {
  return { ...post };
}
export async function getAllAdminBlogPosts() {
  return listBlogPosts({ orderBy: "modifiedAt" });
}
export async function getAdminBlogPostById(id: string) {
  return getBlogPostById(id);
}

export function getBlogCoverImageSrc(post: { coverImage?: string | null }) {
  return post.coverImage || "/logo.png";
}
