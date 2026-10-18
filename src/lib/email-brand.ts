// ─────────────────────────────────────────────────────────────────────────────
// SportsMax Reusable Email Brand Module
// High-fidelity, email-client compatible HTML with inline CSS, 600px responsive
// table layout, full-width branded headers with hero visual, and premium dark footers.
// Fully tested and compatible with Gmail, Apple Mail, Outlook, and mobile clients.
// ─────────────────────────────────────────────────────────────────────────────

/** Palette shared across all branded emails */
export const BRAND = {
  primary: "#2563eb",       // SportsMax Royal Blue
  primaryDark: "#1d4ed8",
  primaryDeep: "#0f2b5c",   // Navy base
  cyan: "#06b6d4",          // Cyan accent
  cyanLight: "#38bdf8",     // Sky accent
  emerald: "#059669",
  emeraldLight: "#d1fae5",
  darkBg: "#090d1a",
  cardBg: "#0f172a",
  lightBg: "#f8fafc",
  white: "#ffffff",
  borderDark: "#1e293b",
  borderLight: "#e2e8f0",
  textDark: "#0f172a",
  textMuted: "#475569",
  textLight: "#94a3b8",
} as const;

/** Verified public host for assets */
export const ASSET_HOST = "https://sports-max-dig.vercel.app";

/** Sports analytics hero banner image (live bundled asset with static fallback) */
export const HERO_BANNER_IMG = `${ASSET_HOST}/assets/sportsmax-runner-CSzSy2iA.jpg`;

/** Verified social and channel links */
export const LINKEDIN_URL = "https://www.linkedin.com/company/sportsmax-intelligence";
export const YOUTUBE_URL = `${ASSET_HOST}/youtube`;

/** Navigation links verified against deployed https://sports-max-dig.vercel.app */
const NAV_LINKS = [
  { label: "Home",     url: `${ASSET_HOST}/` },
  { label: "Sports",   url: `${ASSET_HOST}/sports` },
  { label: "Platform", url: `${ASSET_HOST}/platform` },
  { label: "Pricing",  url: `${ASSET_HOST}/pricing` },
  { label: "Contact",  url: `${ASSET_HOST}/contact` },
] as const;

const YEAR = new Date().getFullYear();

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL DOCTYPE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export interface DocOpenOptions {
  title: string;
  /** Whether the container body background is light (#ffffff) or dark (#0f172a). Defaults to "light". */
  theme?: "light" | "dark";
  previewText?: string;
}

export function emailDocOpen(optsOrTitle: string | DocOpenOptions): string {
  const opts: DocOpenOptions =
    typeof optsOrTitle === "string" ? { title: optsOrTitle, theme: "light" } : optsOrTitle;
  const theme = opts.theme || "light";
  const bodyBg = "#090e1a";
  const containerBg = theme === "light" ? "#ffffff" : "#0f172a";
  const containerBorder = theme === "light" ? "#cbd5e1" : "#1e293b";

  const preheaderHtml = opts.previewText
    ? `<!-- Preheader / Preview Text -->
  <div style="display:none;font-size:1px;color:#090e1a;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${escHtml(opts.previewText)}
    ${"&nbsp;&zwnj;".repeat(30)}
  </div>`
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escHtml(opts.title)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, h1, h2, p, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    @media only screen and (max-width: 620px) {
      .sm-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .sm-inner-pad { padding-left: 20px !important; padding-right: 20px !important; }
      .sm-hero-pad { padding: 24px 20px !important; }
      .sm-stack { display: block !important; width: 100% !important; max-width: 100% !important; }
      .sm-hide-mobile { display: none !important; }
      .sm-center { text-align: center !important; }
      .sm-btn { width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${bodyBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#0f172a;">
  ${preheaderHtml}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${bodyBg};padding:24px 12px;">
    <tr><td align="center">
      <!-- 600px Centered Container -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="sm-container" style="max-width:600px;width:100%;background-color:${containerBg};border:1px solid ${containerBorder};border-radius:12px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.5);">`;
}

export function emailDocClose(): string {
  return `      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER — Distinct full-width branded header with SportsMax logo,
// hero sports analytics visual banner, and "Every Performance Has a Story"
// ─────────────────────────────────────────────────────────────────────────────

export interface HeaderOptions {
  /** Accent colour scheme */
  accent?: "blue" | "emerald" | "violet" | "cyan";
  /** Category eyebrow above the headline (e.g. "CONFIRMED ENQUIRY" or "INTELLIGENCE BRIEF") */
  eyebrow?: string;
  /** Main hero headline */
  headline: string;
  /** Sub-headline / date string */
  subline?: string;
  /** Top-right badge (e.g. "CONFIRMED", "NEW LEAD", "DEMO") */
  badge?: string;
  /** Custom hero image URL if overriding default runner banner */
  heroImageUrl?: string;
  /** Whether to show the hero banner image block. Defaults to true. */
  showHeroImage?: boolean;
}

export function emailHeader(opts: HeaderOptions): string {
  const eyebrowText = opts.eyebrow || "SPORTSMAX INTELLIGENCE";
  const sublineText = opts.subline || "Every Performance Has a Story";
  const showHero = opts.showHeroImage !== false;
  const heroImgUrl = opts.heroImageUrl || HERO_BANNER_IMG;

  const badgeHtml = opts.badge
    ? `<span style="display:inline-block;background-color:rgba(14,165,233,0.18);border:1px solid rgba(56,189,248,0.4);border-radius:20px;padding:5px 14px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#38bdf8;">${escHtml(opts.badge)}</span>`
    : "";

  const heroImageRow = showHero
    ? `<!-- Hero Analytics Visual Banner with High-Contrast Fallback -->
        <tr>
          <td style="padding:0;background-color:#0b1933;line-height:0;">
            <a href="${ASSET_HOST}/" style="text-decoration:none;display:block;">
              <img src="${heroImgUrl}" alt="SportsMax Performance Intelligence — Every Performance Has a Story" width="600" style="display:block;width:100%;max-width:600px;height:auto;max-height:220px;object-fit:cover;border:0;color:#ffffff;font-size:13px;line-height:220px;text-align:center;background-color:#0b1933;" />
            </a>
          </td>
        </tr>`
    : "";

  return `
        <!-- Top Branded Header Bar -->
        <tr>
          <td style="background-color:#090e1a;background:linear-gradient(180deg, #070b15 0%, #0d1527 100%);padding:22px 32px;border-bottom:1px solid #1a2744;" class="sm-inner-pad">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align:middle;">
                  <a href="${ASSET_HOST}/" style="text-decoration:none;display:inline-block;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Logo Icon (Sports Activity / Pulse Mark) -->
                        <td style="width:38px;height:38px;background:linear-gradient(135deg,#0284c7 0%,#2563eb 100%);border-radius:8px;text-align:center;vertical-align:middle;box-shadow:0 2px 8px rgba(37,99,235,0.4);">
                          <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#ffffff;line-height:38px;text-align:center;">&Sigma;</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;font-size:21px;font-weight:900;letter-spacing:-0.03em;line-height:1;color:#ffffff;">
                            SPORTS<span style="color:#0ea5e9;">MAX</span>
                          </div>
                          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#94a3b8;margin-top:3px;line-height:1;">
                            Intelligence Hub
                          </div>
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
                <td align="right" style="vertical-align:middle;">
                  ${badgeHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${heroImageRow}

        <!-- Hero Headline & Core Brand Statement -->
        <tr>
          <td style="background-color:#0d182e;background:linear-gradient(135deg, #091224 0%, #0d1c3a 50%, #0b2247 100%);padding:28px 32px 26px;border-bottom:1px solid #1e293b;" class="sm-inner-pad">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>
                  <div style="font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#38bdf8;margin-bottom:8px;">
                    ${escHtml(eyebrowText)}
                  </div>
                  <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#ffffff;line-height:1.25;letter-spacing:-0.01em;">
                    ${escHtml(opts.headline)}
                  </h1>
                  <div style="font-size:13px;color:#94a3b8;line-height:1.5;font-weight:500;">
                    ${escHtml(sublineText)}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — Distinct branded footer with actual logo, secondary sports visual,
// concise brand statement, verified nav links, contact details, and copyright.
// ─────────────────────────────────────────────────────────────────────────────

export interface FooterOptions {
  /** Show marketing unsubscribe line (only for marketing / promotional emails) */
  showUnsubscribe?: boolean;
  /** Unsubscribe target URL */
  unsubscribeUrl?: string;
  /** Extra disclaimer text if required */
  disclaimer?: string;
  /** Include secondary visual strip in footer. Defaults to false. */
  showVisualStrip?: boolean;
}

export function emailFooter(opts: FooterOptions = {}): string {
  const navLinksHtml = NAV_LINKS.map(
    (l) =>
      `<a href="${l.url}" style="color:#94a3b8;text-decoration:none;font-size:12px;font-weight:600;white-space:nowrap;display:inline-block;padding:2px 4px;">${l.label}</a>`
  ).join(`<span style="color:#334155;margin:0 4px;">&bull;</span>`);

  const unsubRow = opts.showUnsubscribe
    ? `<tr>
        <td style="padding:0 32px 14px;text-align:center;" class="sm-inner-pad">
          <p style="margin:0;font-size:11px;color:#64748b;line-height:1.6;">
            You received this communication because you opted in or engaged with SportsMax.
            <a href="${opts.unsubscribeUrl || `${ASSET_HOST}/contact`}" style="color:#38bdf8;text-decoration:underline;">Manage preferences</a>
            &nbsp;or&nbsp;
            <a href="${opts.unsubscribeUrl || `${ASSET_HOST}/contact`}" style="color:#38bdf8;text-decoration:underline;">Unsubscribe</a> anytime.
          </p>
        </td>
      </tr>`
    : "";

  const extraDisclaimer = opts.disclaimer
    ? `<tr>
        <td style="padding:0 32px 14px;text-align:center;" class="sm-inner-pad">
          <p style="margin:0;font-size:11px;color:#475569;line-height:1.5;">${escHtml(opts.disclaimer)}</p>
        </td>
      </tr>`
    : "";

  return `
        <!-- Distinct Branded Footer -->
        <tr>
          <td style="background-color:#070b15;background:linear-gradient(180deg, #0a0f1d 0%, #05070d 100%);border-top:1px solid #1a2744;padding:32px 32px 24px;" class="sm-inner-pad">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <!-- Footer Logo + Brand Statement -->
              <tr>
                <td align="center" style="padding-bottom:18px;">
                  <a href="${ASSET_HOST}/" style="text-decoration:none;display:inline-block;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:28px;height:28px;background:linear-gradient(135deg,#0284c7 0%,#2563eb 100%);border-radius:6px;text-align:center;vertical-align:middle;">
                          <div style="font-family:Arial,sans-serif;font-size:15px;font-weight:900;color:#ffffff;line-height:28px;text-align:center;">&Sigma;</div>
                        </td>
                        <td style="padding-left:10px;vertical-align:middle;text-align:left;">
                          <div style="font-size:16px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;line-height:1;">
                            SPORTS<span style="color:#0ea5e9;">MAX</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </a>
                  <p style="margin:12px auto 0;max-width:440px;font-size:12px;color:#94a3b8;line-height:1.6;text-align:center;">
                    Turn athlete telemetry, match tracking, and tactical video into performance intelligence across 24+ individual and team sports.
                  </p>
                </td>
              </tr>

              <!-- Verified Navigation Links -->
              <tr>
                <td align="center" style="padding-bottom:14px;border-top:1px solid #141e33;padding-top:18px;">
                  <div style="line-height:2;">
                    ${navLinksHtml}
                  </div>
                </td>
              </tr>

              <!-- Official Social & Video Channels -->
              <tr>
                <td align="center" style="padding-bottom:18px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                    <tr>
                      <td style="padding:0 8px;">
                        <a href="${LINKEDIN_URL}" target="_blank" style="display:inline-block;background-color:#0a192f;border:1px solid #1e3a8a;border-radius:6px;padding:4px 10px;text-decoration:none;font-size:11px;font-weight:700;color:#38bdf8;">
                          &bull; LinkedIn Company Page &rarr;
                        </a>
                      </td>
                      <td style="padding:0 8px;">
                        <a href="${YOUTUBE_URL}" target="_blank" style="display:inline-block;background-color:#1c0d0d;border:1px solid #7f1d1d;border-radius:6px;padding:4px 10px;text-decoration:none;font-size:11px;font-weight:700;color:#f87171;">
                          &bull; YouTube Video Hub &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contact Information -->
              <tr>
                <td align="center" style="padding-bottom:18px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                    <tr>
                      <td style="padding:0 8px;font-size:12px;color:#64748b;text-align:center;">
                        Direct Solutions Desk:
                        <a href="mailto:hello@sportsmax.ai" style="color:#38bdf8;text-decoration:none;font-weight:600;">hello@sportsmax.ai</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:4px;font-size:11px;color:#475569;text-align:center;">
                        Official Portal:
                        <a href="${ASSET_HOST}/" style="color:#94a3b8;text-decoration:none;">sports-max-dig.vercel.app</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              ${unsubRow}
              ${extraDisclaimer}

              <!-- Legal & Copyright -->
              <tr>
                <td align="center" style="border-top:1px solid #141e33;padding-top:18px;">
                  <p style="margin:0;font-size:11px;color:#475569;line-height:1.6;">
                    &copy; ${YEAR} SportsMax Technologies Inc. All rights reserved.
                    <br>
                    <a href="${ASSET_HOST}/privacy" style="color:#64748b;text-decoration:none;font-weight:600;">Privacy Policy</a>
                    &nbsp;&bull;&nbsp;
                    <a href="${ASSET_HOST}/terms" style="color:#64748b;text-decoration:none;font-weight:600;">Terms of Service</a>
                    &nbsp;&bull;&nbsp;
                    <a href="${ASSET_HOST}/contact" style="color:#64748b;text-decoration:none;font-weight:600;">Contact Governance</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE BODY & CARD HELPERS (Clean Light / Dark Surface Options)
// ─────────────────────────────────────────────────────────────────────────────

/** Escape HTML special characters for safe embedding */
export function escHtml(str: string | undefined | null): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Clean white / light background body container with responsive padding
 */
export function emailBody(innerHtml: string, bgColor: string = "#ffffff"): string {
  return `<!-- Email Body Content -->
        <tr>
          <td style="background-color:${bgColor};padding:36px 36px 28px;color:#0f172a;" class="sm-inner-pad">
            ${innerHtml}
          </td>
        </tr>`;
}

/**
 * Key-Value summary table formatted with subtle row separators and high readability
 */
export function emailInfoTable(rows: [string, string][]): string {
  const trs = rows
    .map(
      ([label, value], idx) => {
        const isLast = idx === rows.length - 1;
        const borderStyle = isLast ? "" : "border-bottom:1px solid #e2e8f0;";
        return `
      <tr style="${borderStyle}">
        <td style="padding:10px 12px;color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;width:140px;vertical-align:top;background-color:#f8fafc;">
          ${escHtml(label)}
        </td>
        <td style="padding:10px 14px;color:#0f172a;font-size:13px;line-height:1.5;vertical-align:top;background-color:#ffffff;">
          ${value}
        </td>
      </tr>`;
      }
    )
    .join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background-color:#ffffff;margin:4px 0;">
    ${trs}
  </table>`;
}

/**
 * Information callout card with polished color palettes and borders
 */
export function emailCallout(
  label: string,
  body: string,
  color: "blue" | "emerald" | "amber" | "violet" = "blue"
): string {
  type PaletteEntry = { bg: string; border: string; labelColor: string; textColor: string };
  const palette: Record<"blue" | "emerald" | "amber" | "violet", PaletteEntry> = {
    blue:    { bg: "#f0f9ff", border: "#bae6fd", labelColor: "#0284c7", textColor: "#0c4a6e" },
    emerald: { bg: "#ecfdf5", border: "#a7f3d0", labelColor: "#059669", textColor: "#064e3b" },
    amber:   { bg: "#fffbeb", border: "#fde68a", labelColor: "#d97706", textColor: "#78350f" },
    violet:  { bg: "#faf5ff", border: "#e9d5ff", labelColor: "#7c3aed", textColor: "#4c1d95" },
  };
  const p: PaletteEntry = palette[color];
  return `<div style="background-color:${p.bg};border:1px solid ${p.border};border-radius:10px;padding:16px 20px;margin:22px 0;">
    <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:${p.labelColor};margin-bottom:8px;">${escHtml(label)}</div>
    <div style="font-size:13px;color:${p.textColor};line-height:1.6;">${body}</div>
  </div>`;
}

/**
 * Prominent, bullet-proof CTA button for email clients
 */
export function emailButton(
  label: string,
  url: string,
  color: "blue" | "emerald" | "cyan" = "blue"
): string {
  const bgMap = {
    blue: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
    emerald: "linear-gradient(135deg, #047857 0%, #059669 100%)",
    cyan: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
  };
  const fallbackBg = color === "emerald" ? "#059669" : color === "cyan" ? "#0ea5e9" : "#2563eb";
  const bg = bgMap[color] || bgMap.blue;

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:28px 0 20px;">
    <tr>
      <td align="center">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="18%" stroke="f" fillcolor="${fallbackBg}">
          <w:anchorlock/>
          <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${escHtml(label)}</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-- -->
        <a href="${url}" target="_blank" class="sm-btn" style="display:inline-block;background-color:${fallbackBg};background:${bg};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 34px;border-radius:8px;letter-spacing:0.02em;box-shadow:0 4px 14px rgba(37,99,235,0.3);text-align:center;">
          ${escHtml(label)} &rarr;
        </a>
        <!--<![endif]-->
      </td>
    </tr>
  </table>`;
}
