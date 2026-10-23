"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl p-10">
      <h1 className="text-2xl">Admin service unavailable</h1>
      <p className="my-4">
        Check Firebase Admin credentials and connectivity, then try again. Your
        changes have not been confirmed.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-emerald-700 px-5 py-3 text-white"
      >
        Try again
      </button>
    </main>
  );
}
