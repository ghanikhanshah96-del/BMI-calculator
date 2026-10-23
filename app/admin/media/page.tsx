import { redirect } from "next/navigation";
import AdminShell from "@/app/components/admin/admin-shell";
import MediaLibrary from "@/app/components/admin/media-library";
import { requirePagePermission, sessionIsSuperAdmin } from "@/app/lib/auth";
import { listMediaLibrary } from "@/app/lib/media-library";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const session = await requirePagePermission("/admin/media");
  if (!session.isLoggedIn) redirect("/admin/login");

  const items = await listMediaLibrary();

  return (
    <AdminShell
      username={session.username}
      permissions={session.permissions}
      isSuperAdmin={sessionIsSuperAdmin(session)}
    >
      {" "}
      <MediaLibrary initialItems={items} />
    </AdminShell>
  );
}
