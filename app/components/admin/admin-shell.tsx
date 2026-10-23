"use client";

import BrandLogo from "@/app/components/brand-logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  hasPermission,
  type AdminPermissionId,
} from "@/app/lib/admin-permissions";

type NavItem = {
  href: string;
  label: string;
  permission: AdminPermissionId;
  exact?: boolean;
  icon: (props: { className?: string }) => React.ReactNode;
};

const nav: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    permission: "dashboard",
    exact: true,
    icon: DashboardIcon,
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
    permission: "blogs",
    icon: BlogIcon,
  },
  {
    href: "/admin/media",
    label: "Media",
    permission: "media",
    icon: MediaIcon,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    permission: "reviews",
    icon: BlogIcon,
  },
  {
    href: "/admin/users",
    label: "Users",
    permission: "users",
    icon: UsersIcon,
  },
];

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function BlogIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h6" strokeLinecap="round" />
    </svg>
  );
}

function MediaIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <path
        d="M21 16l-5.5-5.5L7 19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <circle cx="9" cy="8" r="3.5" />
      <path
        d="M3.5 19c.8-3 2.9-4.5 5.5-4.5S13.7 16 14.5 19"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.5" />
      <path
        d="M15.5 19c.4-1.8 1.6-3 3.5-3 1.2 0 2.2.5 2.9 1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M14 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L20 4" strokeLinecap="round" />
      <path
        d="M20 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getPageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/blogs/new")) return "New post";
  if (pathname.includes("/edit")) return "Edit post";
  if (pathname.startsWith("/admin/blogs")) return "Blogs";
  if (pathname.startsWith("/admin/media")) return "Media";
  if (pathname.startsWith("/admin/reviews")) return "Reviews";
  if (pathname.startsWith("/admin/users")) return "Users";
  return "Admin";
}

export default function AdminShell({
  children,
  username,
  permissions,
  isSuperAdmin,
}: {
  children: React.ReactNode;
  username?: string;
  permissions?: AdminPermissionId[];
  isSuperAdmin?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const can = (id: AdminPermissionId) =>
    hasPermission(permissions, id, Boolean(isSuperAdmin));

  const visibleNav = useMemo(
    () => nav.filter((item) => can(item.permission)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, isSuperAdmin],
  );

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const roleLabel = isSuperAdmin ? "Super admin" : "Team member";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 [&_.brand-name]:text-[12px] [&_.brand-eyebrow]:text-[8px]"
          onClick={() => setMobileOpen(false)}
        >
          <BrandLogo tone="dark" />
        </Link>
      </div>

      <div className="px-4 pt-5">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Main menu
        </p>
        <nav className="space-y-1">
          {visibleNav.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--brand)] text-white shadow-lg shadow-emerald-900/30"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalIcon className="h-4 w-4" />
          View live site
        </Link>
        <div className="rounded-xl bg-white/5 px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-semibold text-white">
              {(username || "A").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {username || "admin"}
              </p>
              <p className="text-[11px] text-slate-400">{roleLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6fbf8] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-[#052e23] lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-[#052e23] shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-4 rounded-lg p-2 text-slate-300 hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  FitnessCalculatorPro Admin
                </p>
                <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {getPageTitle(pathname)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {can("blogs") && (
                <Link
                  href="/admin/blogs/new"
                  className="hidden rounded-lg bg-[var(--brand)] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex"
                >
                  + New post
                </Link>
              )}
              <Link
                href="/blog"
                target="_blank"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Blog
              </Link>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#052e23] text-[11px] font-semibold text-white">
                  {(username || "A").slice(0, 1).toUpperCase()}
                </span>
                <span className="text-xs font-medium text-slate-700">
                  {username || "admin"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
