import { redirect } from "next/navigation";
import AdminShell from "@/app/components/admin/admin-shell";
import BlogEditorForm from "@/app/components/admin/blog-editor-form";
import { requirePagePermission, sessionIsSuperAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const session = await requirePagePermission("/admin/blogs/new");
  if (!session.isLoggedIn) redirect("/admin/login");

  return (
    <AdminShell
      username={session.username}
      permissions={session.permissions}
      isSuperAdmin={sessionIsSuperAdmin(session)}
    >
      {" "}
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          Add title, content, SEO fields, and publish
        </p>
      </div>
      <BlogEditorForm mode="create" />
    </AdminShell>
  );
}
