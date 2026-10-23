"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

export function AdminDialog({
  open,
  title,
  description,
  children,
  onClose,
  busy = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    element
      ?.querySelector<HTMLElement>("input:not([disabled]), textarea, select")
      ?.focus();
    return () => {
      element?.close();
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="admin-dialog"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) {
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            onClose();
        }
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 id={titleId} className="text-base font-semibold text-slate-950">
            {title}
          </h2>
          {description && (
            <p
              id={descriptionId}
              className="mt-1 text-sm leading-relaxed text-slate-500"
            >
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="admin-btn admin-icon shrink-0"
          aria-label="Close dialog"
        >
          <AdminIcon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

const paths = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  blog: "M4 3h16v18H4zM8 7h8M8 11h8M8 15h5",
  image: "M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6M8 8h.01",
  external: "M14 3h7v7M10 14 21 3M21 14v6H4V3h6",
  menu: "M4 6h16M4 12h16M4 18h16",
  logout: "M9 3H4v18h5M13 8l5 4-5 4M8 12h13",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  edit: "m16 3 5 5-12 12H4v-5L16 3ZM14 5l5 5",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7",
  refresh:
    "M20 7v5h-5M4 17v-5h5M5.5 7a7 7 0 0 1 11-2L20 8M4 16l3.5 3a7 7 0 0 0 11-2",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  left: "m14 6-6 6 6 6",
  right: "m10 6 6 6-6 6",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.9M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
};

export function AdminIcon({
  name,
  className = "h-4 w-4",
}: {
  name: keyof typeof paths;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function AdminPagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
      <p>
        {total
          ? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, total)} of ${total}`
          : "0 results"}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="admin-btn admin-icon"
          aria-label="Previous page"
          disabled={!page}
          onClick={() => onChange(page - 1)}
        >
          <AdminIcon name="left" />
        </button>
        <span>
          {page + 1} / {pages}
        </span>
        <button
          className="admin-btn admin-icon"
          aria-label="Next page"
          disabled={page + 1 >= pages}
          onClick={() => onChange(page + 1)}
        >
          <AdminIcon name="right" />
        </button>
      </div>
    </div>
  );
}
