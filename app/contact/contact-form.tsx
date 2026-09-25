"use client";

import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setFeedback(data.error || "Unable to send your message. Please try again.");
        return;
      }

      setStatus("success");
      setFeedback("Thanks — your message was sent. We will get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback("Network error. Check your connection and try again.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      <div className="mb-6 flex items-center gap-3 text-emerald-700">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
          <Mail className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-slate-600">
          We typically respond within 1–2 business days.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="How can we help?"
          />
        </label>
      </div>

      {feedback && (
        <div
          role="status"
          className={[
            "mt-5 flex items-start gap-2 rounded-lg px-4 py-3 text-sm",
            status === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-700",
          ].join(" ")}
        >
          {status === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
          <p>{feedback}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
