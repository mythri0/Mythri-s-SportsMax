// Server-side Email Dispatcher for SportsMax Automated Reports
// Supports Resend, SMTP (via direct HTTP/fetch or Nodemailer-compatible endpoints), and simulation fallback.

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  provider: "resend" | "smtp" | "none";
  messageId?: string;
  error?: string;
}

/**
 * Dispatches an automated report email using server-side credentials only.
 * Priority:
 * 1. Resend API (via RESEND_API_KEY)
 * 2. Custom SMTP HTTP Relay (via SMTP_RELAY_URL or custom endpoint)
 * 3. None / Transparent recording (if unconfigured)
 */
export async function sendReportEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, subject, html, text, from } = params;
  const recipients = Array.isArray(to) ? to : [to];

  // 1. Check for Resend API Key
  const resendApiKey = process.env["RESEND_API_KEY"];
  if (resendApiKey) {
    let fromAddress = from || process.env["RESEND_FROM_EMAIL"] || "SportsMax Reports <onboarding@resend.dev>";
    // Trim and sanitize extra quotes if present from .env parsing
    fromAddress = fromAddress.trim().replace(/^["']|["']$/g, "");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: recipients,
          subject,
          html,
          text,
        }),
      });

      const resText = await res.text();
      let resJson: any = {};
      try {
        resJson = JSON.parse(resText);
      } catch {
        // ignore parse error
      }

      if (!res.ok) {
        const errorMsg = resJson.message || resJson.error || `HTTP ${res.status}`;
        console.error(`[Email Dispatcher] Resend API error (${res.status}): ${errorMsg}`);
        return {
          success: false,
          provider: "resend",
          error: `Resend (${res.status}): ${errorMsg}`,
        };
      }

      console.info(`[Email Dispatcher] Email accepted by Resend. Message ID: ${resJson.id}`);
      return {
        success: true,
        provider: "resend",
        messageId: resJson.id,
      };
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : String(err);
      console.error("[Email Dispatcher] Resend network exception:", errStr);
      return {
        success: false,
        provider: "resend",
        error: `Resend delivery failed: ${errStr}`,
      };
    }
  }

  // 2. Check for generic SMTP HTTP relay
  const smtpRelayUrl = process.env["SMTP_RELAY_URL"];
  if (smtpRelayUrl) {
    console.log(`[Email Dispatcher] Attempting delivery via SMTP Relay to: ${recipients.join(", ")}`);
    try {
      const res = await fetch(smtpRelayUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipients, subject, html, text, from }),
      });
      if (res.ok) {
        return { success: true, provider: "smtp" };
      }
      return { success: false, provider: "smtp", error: `SMTP Relay returned HTTP ${res.status}` };
    } catch (err: unknown) {
      return { success: false, provider: "smtp", error: String(err) };
    }
  }

  // 3. Neither provider configured
  console.warn(
    "[Email Dispatcher] No server email provider configured (RESEND_API_KEY or SMTP_RELAY_URL not set). " +
    "Report generated and rendered, but email delivery skipped."
  );
  return {
    success: false,
    provider: "none",
    error: "No server email provider configured. Set RESEND_API_KEY in environment variables.",
  };
}
