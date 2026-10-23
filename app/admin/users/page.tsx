import { redirect } from "next/navigation";
import AdminShell from "@/app/components/admin/admin-shell";
import UsersManager from "@/app/components/admin/users-manager";
import { requirePagePermission, sessionIsSuperAdmin } from "@/app/lib/auth";
import { listAdminUsers } from "@/app/lib/admin-users";
import { sessionHasPermission } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requirePagePermission("/admin/users");
  if (!session.isLoggedIn) redirect("/admin/login");
  if (!sessionHasPermission(session, "users")) redirect("/admin?denied=1");

  const users = await listAdminUsers();

  return (
    <AdminShell
      username={session.username}
      permissions={session.permissions}
      isSuperAdmin={sessionIsSuperAdmin(session)}
    >
      <UsersManager initialUsers={users} />
    </AdminShell>
  );
}
