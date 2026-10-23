import { Resend } from "resend";
import nodemailer from "nodemailer";
export function formatEmailError(error: unknown) {
  return error instanceof Error ? error.message : "Email delivery failed";
}
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  text?: string;
}) {
  if (!options.to) throw new Error("Configure an email recipient");
  const host = process.env.SMTP_HOST,
    user = process.env.SMTP_USER,
    pass = process.env.SMTP_PASS;
  if (host && user && pass) {
    const port = Number(process.env.SMTP_PORT) || 587;
    await nodemailer
      .createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 10000,
        socketTimeout: 15000,
      })
      .sendMail({ ...options, from: process.env.SMTP_FROM || user });
    return;
  }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL)
    throw new Error("Configure Resend sender credentials or SMTP");
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    ...options,
    from: process.env.RESEND_FROM_EMAIL,
  });
  if (error) throw new Error(error.message);
}
