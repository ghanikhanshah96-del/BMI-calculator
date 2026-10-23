import AdminShell from "@/app/components/admin/admin-shell";
import { ReviewsManager } from "@/app/components/admin/reviews-manager";
import { requirePagePermission, sessionIsSuperAdmin } from "@/app/lib/auth";
import { listAdminReviews } from "@/app/lib/reviews-repo";
export const dynamic = "force-dynamic";
export default async function ReviewsPage() {
  const session = await requirePagePermission("/admin/reviews");
  const reviews = await listAdminReviews();
  return (
    <AdminShell
      username={session.username}
      permissions={session.permissions}
      isSuperAdmin={sessionIsSuperAdmin(session)}
    >
      <ReviewsManager initialReviews={reviews} />
    </AdminShell>
  );
}
