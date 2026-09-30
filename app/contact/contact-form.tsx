"use client";

import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "../components/icons";
import type { FormEvent } from "react";
import { useRef, useState } from "react";
import {
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  validateEmailFormat,
  validateMessage,
  validateName,
} from "../lib/contact-validation";

type Status = "idle" | "loading" | "success" | "error";
type Field = "name" | "email" | "message";
type FieldErrors = Record<Field, string | null>;

const validators: Record<Field, (value: string) => string | null> = {
  name: validateName,
  email: validateEmailFormat,
  message: validateMessage,
};

const emptyErrors: FieldErrors = { name: null, email: null, message: null };
const emptyTouched: Record<Field, boolean> = { name: false, email: false, message: false };

const inputBaseClass =
  "w-full rounded-xl border bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:bg-white focus:ring-4";
const inputValidClass =
  "border-slate-200 hover:border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100";
const inputInvalidClass = "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-100";

function FieldError({ id, message }: { id: string; message: string | null }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm text-red-600">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>(emptyErrors);
  const [touched, setTouched] = useState(emptyTouched);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const emailCheckId = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function focusField(field: Field) {
    const refs = { name: nameRef, email: emailRef, message: messageRef };
    refs[field].current?.focus();
  }

  function setFieldError(field: Field, error: string | null) {
    setErrors((current) => ({ ...current, [field]: error }));
  }

  function onChange(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (field === "email") emailCheckId.current += 1;
    const hasInvalidNameChars = field === "name" && /[^\p{L}\p{M} '’.-]/u.test(value);
    if (touched[field] || hasInvalidNameChars) setFieldError(field, validators[field](value));
  }

  async function checkEmailDomain(email: string) {
    const checkId = ++emailCheckId.current;
    setCheckingEmail(true);
    try {
      const response = await fetch("/api/contact/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (checkId === emailCheckId.current && !data.ok && data.error) {
        setFieldError("email", data.error);
      }
    } catch {
      // Domain check is best-effort; the server re-validates on submit.
    } finally {
      if (checkId === emailCheckId.current) setCheckingEmail(false);
    }
  }

  function onBlur(field: Field) {
    setTouched((current) => ({ ...current, [field]: true }));
    const error = validators[field](values[field]);
    setFieldError(field, error);
    if (field === "email" && !error) void checkEmailDomain(values.email.trim());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    const nextErrors: FieldErrors = {
      name: validateName(values.name),
      email: errors.email ?? validateEmailFormat(values.email),
      message: validateMessage(values.message),
    };
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });

    const firstInvalid = (Object.keys(nextErrors) as Field[]).find((field) => nextErrors[field]);
    if (firstInvalid) {
      setStatus("idle");
      focusField(firstInvalid);
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; field?: Field };

      if (!response.ok || !data.ok) {
        if (data.field && data.field in validators) {
          setStatus("idle");
          setFieldError(data.field, data.error ?? "Please check this field.");
          focusField(data.field);
          return;
        }
        setStatus("error");
        setFeedback(data.error || "Unable to send your message. Please try again.");
        return;
      }

      setStatus("success");
      setFeedback("Thanks — your message was sent. We will get back to you soon.");
      setValues({ name: "", email: "", message: "" });
      setErrors(emptyErrors);
      setTouched(emptyTouched);
    } catch {
      setStatus("error");
      setFeedback("Network error. Check your connection and try again.");
    }
  }

  const inputClass = (field: Field) =>
    `${inputBaseClass} ${errors[field] ? inputInvalidClass : inputValidClass}`;

  return (
    <form
      onSubmit={onSubmit}
      id="contact-form"
      className="relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-emerald-900/10 ring-1 ring-slate-900/5 sm:p-10"
      noValidate
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.14),transparent_70%)]"
      />
      <div className="relative mb-8 flex items-center gap-4">
        <span className="icon-badge h-12 w-12 rounded-xl">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl text-slate-900">Send us a message</h2>
          <p className="text-sm text-slate-500">All fields are required.</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            ref={nameRef}
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            maxLength={NAME_MAX_LENGTH}
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            onBlur={() => onBlur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass("name")}
            placeholder="Your name"
          />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            ref={emailRef}
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={EMAIL_MAX_LENGTH}
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass("email")}
            placeholder="you@example.com"
          />
          {checkingEmail && !errors.email && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking email domain…
            </p>
          )}
          <FieldError id="contact-email-error" message={errors.email} />
        </div>

        <div className="flex flex-1 flex-col">
          <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            ref={messageRef}
            id="contact-message"
            name="message"
            required
            maxLength={MESSAGE_MAX_LENGTH}
            rows={6}
            value={values.message}
            onChange={(e) => onChange("message", e.target.value)}
            onBlur={() => onBlur("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={`${inputClass("message")} min-h-36 flex-1 resize-none overflow-y-auto`}
            placeholder="How can we help?"
          />
          <FieldError id="contact-message-error" message={errors.message} />
        </div>
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
        data-magnetic
        className="btn-gradient mt-8 self-start rounded-full px-7 py-3 text-sm font-semibold"
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
