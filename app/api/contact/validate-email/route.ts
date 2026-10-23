import { NextResponse } from "next/server";
import { getEmailDomain, validateEmailFormat } from "../../../lib/contact-validation";
import { checkEmailDomain } from "../../../lib/email-domain";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.email !== "string") return NextResponse.json({ ok: false, error: "Provide an email address." }, { status: 400 });
    const email = (body.email ?? "").trim();

    const error = validateEmailFormat(email) ?? (await checkEmailDomain(getEmailDomain(email)));
    return NextResponse.json({ ok: !error, error: error ?? undefined });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to validate email." }, { status: 400 });
  }
}
