import { sendEmail } from "@/app/lib/email";
import {
  ADMIN_PERMISSIONS,
  type AdminPermissionId,
} from "@/app/lib/admin-permissions";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "https://fitnesscalculatorpro.com"
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildAdminInviteHtml(opts: {
  email: string;
  password: string;
  permissions: AdminPermissionId[];
  loginUrl: string;
  logoUrl: string;
  year: number;
}) {
  const email = escapeHtml(opts.email);
  const password = escapeHtml(opts.password);
  const permissionChips = opts.permissions
    .map((id) => ADMIN_PERMISSIONS.find((p) => p.id === id)?.label || id)
    .map(
      (label) => `
      <span style="display:inline-block;margin:0 6px 6px 0;padding:6px 12px;border-radius:999px;background:#ecfdf5;color:#047857;font-size:12px;font-weight:600;letter-spacing:0.02em;line-height:1;">
        ${escapeHtml(label)}
      </span>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>FitnessCalculatorPro Admin Access</title>
</head>
<body style="margin:0;padding:0;background:#e8eef5;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Your FitnessCalculatorPro admin account is ready â€” sign in with the credentials inside.
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#e8eef5;margin:0;padding:0;width:100%;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;border-collapse:separate;">
          <!-- Brand header -->
          <tr>
            <td style="background:linear-gradient(135deg,#052e23 0%,#0a2744 55%,#0980a8 100%);border-radius:20px 20px 0 0;padding:28px 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    <img src="${opts.logoUrl}" alt="FitnessCalculatorPro" width="148" height="38" style="display:block;border:0;outline:none;height:38px;width:auto;max-width:148px;filter:brightness(0) invert(1);" />
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,0.12);color:#d7f4ff;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">
                      Admin Invite
                    </span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:28px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;font-weight:700;color:#ffffff;">
                Youâ€™re invited to the dashboard
              </h1>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:rgba(255,255,255,0.82);max-width:420px;">
                An administrator created your FitnessCalculatorPro admin account. Use the secure credentials below to get started.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:28px 32px 8px;border-left:1px solid #dbe4ef;border-right:1px solid #dbe4ef;">
              <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#475569;">
                Keep this email private â€” it contains a temporary password.
              </p>

              <!-- Credentials card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:4px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #e8eef5;">
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:6px;">Username</div>
                          <a href="mailto:${email}" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;color:#0980a8;text-decoration:none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #e8eef5;">
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:8px;">Temporary password</div>
                          <span style="display:inline-block;font-family:Consolas,Monaco,'Courier New',monospace;font-size:16px;font-weight:700;letter-spacing:0.04em;color:#052e23;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;padding:10px 14px;">
                            ${password}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 20px;">
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:10px;">Access granted</div>
                          <div>${permissionChips || `<span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#64748b;">No tabs assigned yet</span>`}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
                <tr>
                  <td align="center" style="border-radius:12px;background:#0980a8;">
                    <a href="${opts.loginUrl}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;background:#0980a8;">
                      Sign in to admin â†’
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#94a3b8;">
                Or copy this link:<br />
                <a href="${opts.loginUrl}" style="color:#0980a8;word-break:break-all;text-decoration:underline;">${escapeHtml(opts.loginUrl)}</a>
              </p>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="background:#ffffff;padding:0 32px 28px;border-left:1px solid #dbe4ef;border-right:1px solid #dbe4ef;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;">
                <tr>
                  <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#9a3412;">
                    <strong style="display:block;margin-bottom:4px;color:#c2410c;">Security tip</strong>
                    After your first login, ask an administrator to reset your password so this temporary one is no longer valid.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#052e23;border-radius:0 0 20px 20px;padding:22px 32px;">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;color:#ffffff;">
                FitnessCalculatorPro
              </p>
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:rgba(255,255,255,0.65);">
                Health and fitness calculators and educational guides.
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:rgba(255,255,255,0.45);">
                Â© ${opts.year} FitnessCalculatorPro. If you werenâ€™t expecting this invite, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendAdminInviteEmail(opts: {
  email: string;
  password: string;
  permissions: AdminPermissionId[];
}) {
  const origin = siteOrigin();
  const loginUrl = `${origin}/admin/login`;
  const logoUrl = `${origin}/logo.png`;

  await sendEmail({
    to: opts.email,
    subject: "Your FitnessCalculatorPro admin access is ready",
    html: buildAdminInviteHtml({
      email: opts.email,
      password: opts.password,
      permissions: opts.permissions,
      loginUrl,
      logoUrl,
      year: new Date().getFullYear(),
    }),
  });
}
