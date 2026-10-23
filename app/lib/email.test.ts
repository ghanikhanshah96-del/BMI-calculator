import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ send: vi.fn(), sendMail: vi.fn(), transport: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; } }));
vi.mock("nodemailer", () => ({ default: { createTransport: mocks.transport } }));
import { sendEmail } from "./email";
beforeEach(() => {
 vi.clearAllMocks(); mocks.send.mockResolvedValue({ error: null }); mocks.sendMail.mockResolvedValue({ accepted: ["owner@example.com"] }); mocks.transport.mockReturnValue({ sendMail: mocks.sendMail });
 for (const key of ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "RESEND_API_KEY", "RESEND_FROM_EMAIL"]) vi.stubEnv(key, "");
});
afterEach(() => vi.unstubAllEnvs());
const message = { to: "owner@example.com", subject: "Review alert", html: "<p>Feedback</p>" };
describe("email provider selection", () => {
 it("uses Gmail SMTP when configured, preserving the requested recipient", async () => {
  vi.stubEnv("SMTP_HOST", "smtp.gmail.com"); vi.stubEnv("SMTP_USER", "sender@gmail.com"); vi.stubEnv("SMTP_PASS", "test-app-password"); vi.stubEnv("SMTP_PORT", "465");
  await sendEmail(message); expect(mocks.transport).toHaveBeenCalledWith(expect.objectContaining({ host: "smtp.gmail.com", port: 465, secure: true })); expect(mocks.sendMail).toHaveBeenCalledWith({ ...message, from: "sender@gmail.com" }); expect(mocks.send).not.toHaveBeenCalled();
 });
 it("uses Resend if SMTP is incomplete", async () => {
  vi.stubEnv("SMTP_HOST", "smtp.gmail.com"); vi.stubEnv("RESEND_API_KEY", "test-key"); vi.stubEnv("RESEND_FROM_EMAIL", "Website <onboarding@resend.dev>");
  await sendEmail(message); expect(mocks.send).toHaveBeenCalledWith({ ...message, from: "Website <onboarding@resend.dev>" }); expect(mocks.sendMail).not.toHaveBeenCalled();
 });
 it("propagates SMTP errors without attempting a duplicate send via another provider", async () => {
  vi.stubEnv("SMTP_HOST", "smtp.gmail.com"); vi.stubEnv("SMTP_USER", "sender@gmail.com"); vi.stubEnv("SMTP_PASS", "test-only"); mocks.sendMail.mockRejectedValueOnce(new Error("Authentication failed"));
  await expect(sendEmail(message)).rejects.toThrow("Authentication failed"); expect(mocks.send).not.toHaveBeenCalled();
 });
 it("propagates Resend errors so review notification status can record failure", async () => {
  vi.stubEnv("RESEND_API_KEY", "test-key"); vi.stubEnv("RESEND_FROM_EMAIL", "onboarding@resend.dev"); mocks.send.mockResolvedValueOnce({ error: { message: "Sender needs verification" } }); await expect(sendEmail(message)).rejects.toThrow("Sender needs verification");
 });
 it("rejects missing recipients and missing provider configuration", async () => { await expect(sendEmail({ ...message, to: "" })).rejects.toThrow("recipient"); await expect(sendEmail(message)).rejects.toThrow("Configure"); expect(mocks.send).not.toHaveBeenCalled(); });
});
