import { sendEmail } from "../../lib/email";
import { NextResponse } from "next/server";
import {
  getEmailDomain,
  validateEmailFormat,
  validateMessage,
  validateName,
} from "../../lib/contact-validation";
import { checkEmailDomain } from "../../lib/email-domain";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || [body.name, body.email, body.message].some(value => value != null && typeof value !== "string")) {
      return NextResponse.json({ ok: false, error: "Provide name, email, and message as text." }, { status: 400 });
    }

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const message = (body.message ?? "").trim();

    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json({ ok: false, field: "name", error: nameError }, { status: 400 });
    }

    const emailError =
      validateEmailFormat(email) ?? (await checkEmailDomain(getEmailDomain(email)));
    if (emailError) {
      return NextResponse.json({ ok: false, field: "email", error: emailError }, { status: 400 });
    }

    const messageError = validateMessage(message);
    if (messageError) {
      return NextResponse.json(
        { ok: false, field: "message", error: messageError },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    if ((!smtpConfigured && (!apiKey || !fromEmail)) || !toEmail) {
      return NextResponse.json(
        { ok: false, error: "Email service is not configured. Please try again later." },
        { status: 500 },
      );
    }

    try {
    await sendEmail({
      to: [toEmail],
      replyTo: email,
      subject: `Contact form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    } catch (error) {
      return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to send your message right now." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
