import Link from "next/link";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  if (
    !process.env.ADMIN_PASSWORD ||
    !process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET.length < 32
  ) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20">
        <h1 className="text-3xl text-emerald-800">
          FitnessCalculatorPro admin setup
        </h1>
        <p className="mt-5">
          Set ADMIN_USERNAME, ADMIN_PASSWORD and a random SESSION_SECRET of at
          least 32 characters in your server environment, then restart the
          application.
        </p>
        <p className="mt-3">
          Blog and user management also require FIREBASE_PROJECT_ID,
          FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY. Image uploads use
          FIREBASE_STORAGE_BUCKET.
        </p>
        <Link href="/" className="mt-6 inline-block text-emerald-700">
          Back to website
        </Link>
      </main>
    );
  }
  return children;
}
