import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/app/components/admin/admin-shell";
import { requirePagePermission, sessionIsSuperAdmin } from "@/app/lib/auth";
import { getAllAdminBlogPosts } from "@/app/lib/blog-service";
import DeleteBlogButton from "@/app/components/admin/delete-blog-button";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const session = await requirePagePermission("/admin/blogs");
  if (!session.isLoggedIn) redirect("/admin/login");

  const posts = await getAllAdminBlogPosts();

  return (
    <AdminShell
      username={session.username}
      permissions={session.permissions}
      isSuperAdmin={sessionIsSuperAdmin(session)}
    >
      {" "}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-slate-500">
          Create, edit, and publish posts for the public blog.
        </p>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          + New post
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Title</th>
              <th className="hidden px-4 py-3.5 font-semibold sm:table-cell">
                Status
              </th>
              <th className="hidden px-4 py-3.5 font-semibold md:table-cell">
                Date
              </th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-14 text-center text-slate-500"
                >
                  No posts yet.{" "}
                  <Link
                    href="/admin/blogs/new"
                    className="font-medium text-[var(--brand)] hover:underline"
                  >
                    Create one
                  </Link>
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">
                      {post.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      /blog/{post.slug}
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-slate-500 md:table-cell">
                    {post.date}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "published" && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-xs font-medium text-slate-500 hover:text-slate-800"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/blogs/${post.id}/edit`}
                        className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        Edit
                      </Link>
                      {post.id && (
                        <DeleteBlogButton id={post.id} title={post.title} />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
