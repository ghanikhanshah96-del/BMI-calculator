import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ send: vi.fn(), domain: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));
vi.mock("./email-domain", () => ({ checkEmailDomain: mocks.domain }));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));
import { POST as contact } from "../api/contact/route";
import { POST as validateEmail } from "../api/contact/validate-email/route";
import { POST as revalidate } from "../api/revalidate/route";
import { revalidatePath } from "next/cache";
const req = (body: unknown) =>
  new NextRequest("http://localhost:3000/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.send.mockResolvedValue({ error: null });
  mocks.domain.mockResolvedValue(null);
  vi.stubEnv("RESEND_API_KEY", "test-only");
  vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
  vi.stubEnv("RESEND_FROM_EMAIL", "Website <website@example.com>");
});
afterEach(() => vi.unstubAllEnvs());
describe("website APIs", () => {
  const valid = {
    name: "Website Reader",
    email: "reader@gmail.com",
    message: "Please help me understand the calculator results on the website.",
  };
  it("sends valid contact submissions using the configured sender", async () => {
    const response = await contact(req(valid));
    expect(response.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Website <website@example.com>",
        to: ["owner@example.com"],
        replyTo: valid.email,
      }),
    );
  });
  it("rejects invalid contact fields and malformed JSON", async () => {
    for (const body of [
      null,
      { ...valid, name: 123 },
      { ...valid, email: "invalid" },
      { ...valid, message: "" },
    ])
      expect((await contact(req(body))).status).toBe(400);
    expect(mocks.send).not.toHaveBeenCalled();
    const malformed = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      body: "{",
    });
    expect((await contact(malformed)).status).toBe(400);
  });
  it("returns email-provider failure without claiming delivery", async () => {
    mocks.send.mockResolvedValue({
      error: { message: "Provider unavailable" },
    });
    const response = await contact(req(valid));
    expect(response.status).toBe(502);
    expect((await response.json()).ok).toBe(false);
  });
  it("reports missing email setup", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await contact(req(valid))).status).toBe(500);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("validates email syntax and domain availability", async () => {
    expect(
      (await (await validateEmail(req({ email: "reader@gmail.com" }))).json())
        .ok,
    ).toBe(true);
    mocks.domain.mockResolvedValue("Domain does not accept email");
    expect(
      (await (await validateEmail(req({ email: "reader@gmail.com" }))).json())
        .ok,
    ).toBe(false);
    expect(
      (await (await validateEmail(req({ email: "invalid" }))).json()).ok,
    ).toBe(false);
    expect((await validateEmail(req(null))).status).toBe(400);
  });
  it("protects the revalidation endpoint and refreshes the requested article", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "");
    expect((await revalidate(req({}))).status).toBe(503);
    vi.stubEnv("REVALIDATE_SECRET", "test-revalidation-secret-32-characters");
    expect((await revalidate(req({ secret: "wrong" }))).status).toBe(401);
    const response = await revalidate(
      req({ secret: process.env.REVALIDATE_SECRET, slug: "test-article" }),
    );
    expect(response.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/blog/test-article");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  });
});
