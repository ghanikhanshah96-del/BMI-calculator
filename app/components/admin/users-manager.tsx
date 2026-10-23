"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ADMIN_PERMISSIONS,
  type AdminPermissionId,
} from "@/app/lib/admin-permissions";

export type AdminUserListItem = {
  id: string;
  email: string;
  permissions: AdminPermissionId[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  invitedAt?: string;
};

/** Users tab last in the checkbox list (order matches ADMIN_PERMISSIONS). */
const ASSIGNABLE: (typeof ADMIN_PERMISSIONS)[number][] = [...ADMIN_PERMISSIONS];

export default function UsersManager({
  initialUsers,
}: {
  initialUsers: AdminUserListItem[];
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState<AdminPermissionId[]>([
    "dashboard",
    "blogs",
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const permissionLabels = useMemo(() => {
    const map = new Map(ADMIN_PERMISSIONS.map((p) => [p.id, p.label]));
    return map;
  }, []);

  const togglePermission = (id: AdminPermissionId) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const refresh = async () => {
    const res = await fetch("/api/admin/users");
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data.users)) setUsers(data.users);
  };

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, permissions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      if (data.warning) {
        setNotice(
          `${data.warning}${
            data.tempPassword ? ` Temporary password: ${data.tempPassword}` : ""
          }`,
        );
      } else {
        setNotice(`Invite sent to ${email}.`);
      }
      setEmail("");
      setPermissions(["dashboard", "blogs"]);
      await refresh();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string, userEmail: string) => {
    if (!confirm(`Remove access for ${userEmail}?`)) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const onReset = async (id: string) => {
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resetPassword" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      if (data.warning) {
        setNotice(
          `${data.warning}${
            data.tempPassword ? ` Temporary password: ${data.tempPassword}` : ""
          }`,
        );
      } else {
        setNotice("New password emailed to the user.");
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusyId(null);
    }
  };

  const onSavePermissions = async (id: string, next: AdminPermissionId[]) => {
    if (next.length === 0) {
      setError("Each user needs at least one permission");
      return;
    }
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        Invite teammates by email and choose which admin tabs they can open.
        They receive a login email with their email as username and a temporary
        password.
      </p>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </p>
      )}

      <form
        onSubmit={onCreate}
        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-6"
      >
        <h2 className="text-sm font-semibold text-slate-900">Add user</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none ring-[var(--brand)] focus:ring-2"
            />
            <p className="mt-2 text-xs text-slate-400">
              Username for login will be this email address.
            </p>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Access tabs
            </p>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
              {ASSIGNABLE.map((perm) => (
                <label
                  key={perm.id}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">
                      {perm.label}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {perm.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving || permissions.length === 0}
          className="mt-5 inline-flex rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "Sending invite…" : "Add user & send email"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-5 py-3.5 font-semibold">User</th>
              <th className="hidden px-4 py-3.5 font-semibold md:table-cell">
                Access
              </th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-14 text-center text-slate-500"
                >
                  No invited users yet.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">{user.email}</div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    Added {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1 md:hidden">
                    {user.permissions.map((id) => (
                      <span
                        key={id}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600"
                      >
                        {permissionLabels.get(id) || id}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="hidden px-4 py-4 md:table-cell">
                  <div className="flex flex-wrap gap-1.5">
                    {ASSIGNABLE.map((perm) => {
                      const checked = user.permissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                            checked
                              ? "border-[var(--brand)] bg-sky-50 text-slate-800"
                              : "border-slate-200 bg-white text-slate-500"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            disabled={busyId === user.id}
                            onChange={() => {
                              const next = checked
                                ? user.permissions.filter((p) => p !== perm.id)
                                : [...user.permissions, perm.id];
                              void onSavePermissions(user.id, next);
                            }}
                          />
                          {perm.label}
                        </label>
                      );
                    })}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={busyId === user.id}
                      onClick={() => void onReset(user.id)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60"
                    >
                      Reset password
                    </button>
                    <button
                      type="button"
                      disabled={busyId === user.id}
                      onClick={() => void onDelete(user.id, user.email)}
                      className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
