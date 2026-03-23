import { Resend } from "resend";

// Initialised lazily so the module can be imported without crashing
// when RESEND_API_KEY is not yet set in development.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? "protocol@bio.protocol";
const APP_URL      = process.env.NEXT_PUBLIC_APP_URL ?? "https://bio.protocol";

// ─── Delivery email (PDF attachment) ─────────────────────────────────────────
export async function sendReportEmail(
  toEmail: string,
  toName: string,
  pdfBuffer: Buffer,
  score: number,
  bioType: string,
): Promise<void> {
  const resend = getResend();

  const firstName = toName.split(" ")[0] || toName;

  await resend.emails.send({
    from: `bio.protocol <${FROM_ADDRESS}>`,
    to:   toEmail,
    subject: `Your bio.protocol report is ready, ${firstName}`,
    html: buildReportEmailHtml(firstName, score, bioType),
    attachments: [
      {
        filename: `bio-protocol-report-${firstName.toLowerCase()}.pdf`,
        content:  pdfBuffer,
      },
    ],
  });
}

// ─── HTML email template ──────────────────────────────────────────────────────
function buildReportEmailHtml(name: string, score: number, bioType: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your bio.protocol Report</title>
</head>
<body style="margin:0;padding:0;background:#09090F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090F;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background:#0F1118;border:1px solid #1E2030;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0A0C12 0%,#111827 100%);padding:36px 40px 28px;border-bottom:1px solid #1E2030;">
              <p style="margin:0 0 24px;font-size:18px;font-weight:600;color:#F0EEE8;letter-spacing:0.02em;">
                bio<span style="color:#7FBDAF;">.</span>protocol
              </p>
              <p style="margin:0 0 8px;font-size:28px;font-weight:300;color:#F0EEE8;line-height:1.3;font-style:italic;">
                Your report is here, ${name}.
              </p>
              <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">
                Your personalized anti-aging protocol is attached to this email as a PDF.
              </p>
            </td>
          </tr>

          <!-- Score + Type -->
          <tr>
            <td style="padding:28px 40px;border-bottom:1px solid #1E2030;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:10px;">
                    <div style="background:#0A0C12;border:1px solid #1E2030;border-radius:10px;padding:18px;">
                      <p style="margin:0 0 4px;font-size:9px;color:#6B7280;letter-spacing:0.15em;text-transform:uppercase;">
                        Wellness Score
                      </p>
                      <p style="margin:0;font-size:32px;font-weight:700;color:#7FBDAF;line-height:1;">
                        ${score}<span style="font-size:14px;color:#374151;font-weight:400;"> /100</span>
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:10px;">
                    <div style="background:#0A0C12;border:1px solid #1E2030;border-radius:10px;padding:18px;">
                      <p style="margin:0 0 4px;font-size:9px;color:#6B7280;letter-spacing:0.15em;text-transform:uppercase;">
                        Bio Human Type
                      </p>
                      <p style="margin:0;font-size:16px;font-weight:600;color:#F0EEE8;line-height:1.3;">
                        ${bioType}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's inside -->
          <tr>
            <td style="padding:28px 40px;border-bottom:1px solid #1E2030;">
              <p style="margin:0 0 16px;font-size:11px;color:#6B7280;letter-spacing:0.1em;text-transform:uppercase;">
                Inside your report
              </p>
              ${[
                ["⬡", "Bio Human Type analysis and biological archetype"],
                ["◈", "Biomarker reference panel with optimal target ranges"],
                ["≡", "Complete morning ritual protocol — step by step"],
                ["◐", "Priority supplement stack (6 compounds for your type)"],
                ["◎", "Moon cycle sync guide for hormonal alignment"],
              ].map(([icon, text]) => `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                <tr>
                  <td width="32" valign="top">
                    <div style="width:28px;height:28px;background:#1A1C26;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;text-align:center;line-height:28px;">
                      ${icon}
                    </div>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.5;">${text}</p>
                  </td>
                </tr>
              </table>`).join("")}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 40px;border-bottom:1px solid #1E2030;text-align:center;">
              <p style="margin:0 0 16px;font-size:13px;color:#9CA3AF;line-height:1.7;">
                Your free report is just the beginning. The full bio.protocol platform
                connects every element of your biology — live biomarkers, habit tracker,
                moon calendar, menopause stage map, and your complete protocol in one place.
              </p>
              <a href="${APP_URL}/auth/login"
                style="display:inline-block;background:#7FBDAF;color:#05120F;text-decoration:none;
                       font-size:13px;font-weight:600;padding:12px 28px;border-radius:8px;
                       letter-spacing:0.03em;">
                Access bio.protocol Platform →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;">
              <p style="margin:0;font-size:10px;color:#374151;line-height:1.6;text-align:center;">
                bio.protocol · Your data is private and never sold to third parties.<br/>
                <a href="${APP_URL}/unsubscribe" style="color:#4B5563;text-decoration:none;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/privacy" style="color:#4B5563;text-decoration:none;">Privacy Policy</a>
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

// ─── Magic link / welcome email ───────────────────────────────────────────────
export async function sendWelcomeEmail(
  toEmail: string,
  toName: string,
): Promise<void> {
  const resend = getResend();
  const firstName = toName.split(" ")[0] || toName;

  await resend.emails.send({
    from: `bio.protocol <${FROM_ADDRESS}>`,
    to:   toEmail,
    subject: `Welcome to bio.protocol, ${firstName}`,
    html: `
<!DOCTYPE html><html><body style="background:#09090F;font-family:sans-serif;padding:40px 20px;">
<table width="600" style="max-width:600px;margin:0 auto;background:#0F1118;border:1px solid #1E2030;border-radius:16px;padding:40px;">
  <tr><td>
    <p style="font-size:20px;color:#F0EEE8;font-weight:600;margin:0 0 8px;">
      bio<span style="color:#7FBDAF;">.</span>protocol
    </p>
    <p style="font-size:24px;color:#F0EEE8;font-weight:300;font-style:italic;margin:0 0 16px;">
      Welcome, ${firstName}.
    </p>
    <p style="font-size:13px;color:#9CA3AF;line-height:1.7;margin:0 0 24px;">
      Your account is ready. Access your complete personalized platform including your
      protocol dashboard, supplement tracker, moon calendar, and biomarker log.
    </p>
    <a href="${APP_URL}/dashboard" style="display:inline-block;background:#7FBDAF;color:#05120F;
      text-decoration:none;font-size:13px;font-weight:600;padding:12px 28px;border-radius:8px;">
      Open my platform →
    </a>
    <p style="font-size:10px;color:#374151;margin-top:32px;">
      bio.protocol · Private by design.
    </p>
  </td></tr>
</table>
</body></html>`,
  });
}
