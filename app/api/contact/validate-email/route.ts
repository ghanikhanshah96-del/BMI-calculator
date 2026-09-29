import { NextResponse } from "next/server";
import { getEmailDomain, validateEmailFormat } from "../../../lib/contact-validation";
import { checkEmailDomain } from "../../../lib/email-domain";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim();

    const error = validateEmailFormat(email) ?? (await checkEmailDomain(getEmailDomain(email)));
    return NextResponse.json({ ok: !error, error: error ?? undefined });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to validate email." }, { status: 400 });
  }
}
