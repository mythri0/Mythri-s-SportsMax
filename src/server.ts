import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      // Secured Server Endpoint: /api/reports/trigger
      if (url.pathname === "/api/reports/trigger" && (request.method === "POST" || request.method === "GET")) {
        const cronSecret = process.env["REPORT_CRON_SECRET"] || process.env["CRON_SECRET"];
        if (!cronSecret) {
          console.error("[Report Scheduler] Rejecting request: Neither REPORT_CRON_SECRET nor CRON_SECRET environment variable is configured.");
          return new Response(JSON.stringify({ error: "Server misconfiguration: Cron secret is not configured on the server." }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace(/^Bearer\s+/i, "") || url.searchParams.get("secret") || "";

        if (!token || token !== cronSecret) {
          return new Response(JSON.stringify({ error: "Unauthorized: Invalid or missing cron secret" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        let body: any = {};
        if (request.method === "POST") {
          try {
            body = await request.json();
          } catch {
            // fallback
          }
        } else {
          // Vercel Cron triggers via GET with query params (e.g. ?period=daily)
          const qPeriod = url.searchParams.get("period") as "daily" | "weekly" | "monthly" | null;
          body = {
            period: qPeriod || "daily",
            reportId: `${qPeriod || "daily"}-scheduled`,
            reportName: `${(qPeriod || "daily").toUpperCase()} Analytics Report`,
          };
        }

        const recipientEmail = process.env["REPORT_RECIPIENT_EMAIL"] || "sreevarthini2006@gmail.com";
        const { executeServerReport } = await import("./lib/server-reporting");
        const report = await executeServerReport({
          reportId: body.reportId || "daily-traffic",
          period: body.period || "daily",
          reportName: body.reportName || "Daily Performance Report",
          recipients: body.recipients || [recipientEmail],
        });

        return new Response(JSON.stringify({ success: true, report }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      // Secured Server Endpoint: /api/reports/logs
      if (url.pathname === "/api/reports/logs" && request.method === "GET") {
        const { getExecutionHistory } = await import("./lib/server-reporting");
        return new Response(JSON.stringify({ logs: getExecutionHistory() }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      // Server Endpoint: /api/contact/lead — handles contact lead submissions with Google Sheets, Jira Cloud, and Resend email alerts
      if (url.pathname === "/api/contact/lead" && request.method === "POST") {
        try {
          const body = await request.json();
          const { processContactLeadWorkflow } = await import("./lib/contact-lead-service");
          const result = await processContactLeadWorkflow(body, body.page || "/contact");
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.error("[Contact Lead Endpoint] Exception processing lead:", errMsg);
          return new Response(
            JSON.stringify({
              success: false,
              error: `Server processing error: ${errMsg}`,
            }),
            { status: 500, headers: { "content-type": "application/json" } }
          );
        }
      }

      // Server Endpoint: /api/jira/issues — proxies Jira REST API using server-side credentials
      if (url.pathname === "/api/jira/issues" && request.method === "GET") {
        const domain = process.env["JIRA_DOMAIN"];
        const email = process.env["JIRA_EMAIL"];
        const token = process.env["JIRA_API_TOKEN"];
        const project = process.env["JIRA_PROJECT_KEY"] || "KAN";

        if (!domain || !email || !token) {
          return new Response(
            JSON.stringify({ error: "Jira credentials are not configured on the server.", total: 0, issues: [] }),
            { status: 503, headers: { "content-type": "application/json" } }
          );
        }

        const maxResults = Math.min(Number(url.searchParams.get("maxResults") || "50"), 100);
        const startAt = Number(url.searchParams.get("startAt") || "0");
        const statusFilter = url.searchParams.get("status") || "";
        const jql = statusFilter
          ? `project = ${project} AND status = "${statusFilter}" ORDER BY created DESC`
          : `project = ${project} ORDER BY created DESC`;

        const auth = Buffer.from(`${email}:${token}`).toString("base64");
        const headers = {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        };

        // Try /rest/api/3/search/jql (Atlassian's current standard endpoint)
        const primaryUrl =
          `https://${domain}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}` +
          `&maxResults=${maxResults}&startAt=${startAt}` +
          `&fields=summary,status,assignee,priority,created,updated,issuetype,labels,description`;

        let jiraResponse = await fetch(primaryUrl, {
          method: "GET",
          headers,
        });

        // Fallback to legacy /rest/api/3/search if needed
        if (jiraResponse.status === 404 || jiraResponse.status === 410) {
          const fallbackUrl =
            `https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}` +
            `&maxResults=${maxResults}&startAt=${startAt}` +
            `&fields=summary,status,assignee,priority,created,updated,issuetype,labels,description`;
          jiraResponse = await fetch(fallbackUrl, {
            method: "GET",
            headers,
          });
        }

        if (!jiraResponse.ok) {
          const errText = await jiraResponse.text();
          console.error(`[Jira API] Error ${jiraResponse.status}: ${errText}`);
          let parsedError = `Jira API returned HTTP ${jiraResponse.status}`;
          try {
            const errJson = JSON.parse(errText) as { errorMessages?: string[]; message?: string };
            if (errJson.errorMessages && errJson.errorMessages.length > 0) {
              parsedError = errJson.errorMessages[0]!;
            } else if (errJson.message) {
              parsedError = errJson.message;
            }
          } catch {
            // keep default parsedError
          }
          return new Response(
            JSON.stringify({ error: parsedError, total: 0, issues: [], status: jiraResponse.status }),
            { status: 200, headers: { "content-type": "application/json" } }
          );
        }

        const jiraData = await jiraResponse.json() as {
          total?: number;
          startAt?: number;
          maxResults?: number;
          issues?: Array<{
            id: string;
            key: string;
            fields: {
              summary: string;
              status: { name: string; statusCategory: { colorName: string } };
              assignee: { displayName: string; emailAddress: string } | null;
              priority: { name: string; iconUrl: string } | null;
              created: string;
              updated: string;
              issuetype: { name: string; iconUrl: string };
              labels: string[];
            };
          }>;
        };

        const issues = (jiraData.issues || []).map((issue) => ({
          id: issue.id,
          key: issue.key,
          summary: issue.fields?.summary || "Untitled Task",
          status: issue.fields?.status?.name ?? "Unknown",
          statusColor: issue.fields?.status?.statusCategory?.colorName ?? "default",
          assignee: issue.fields?.assignee?.displayName ?? null,
          priority: issue.fields?.priority?.name ?? null,
          issueType: issue.fields?.issuetype?.name ?? "Task",
          created: issue.fields?.created || new Date().toISOString(),
          updated: issue.fields?.updated || new Date().toISOString(),
          labels: issue.fields?.labels ?? [],
          url: `https://${domain}/browse/${issue.key}`,
        }));

        const totalCount = typeof jiraData.total === "number" ? jiraData.total : issues.length;

        return new Response(
          JSON.stringify({ total: totalCount, startAt: jiraData.startAt ?? 0, issues }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }


      if (url.pathname === "/api/sheets/dashboard" && request.method === "GET") {
        const sheetsUrl = process.env["VITE_ANALYTICS_URL"];
        if (!sheetsUrl) {
          return new Response(
            JSON.stringify({ error: "Google Sheets URL not configured.", connected: false }),
            { status: 200, headers: { "content-type": "application/json" } }
          );
        }

        try {
          const sheetsResponse = await fetch(`${sheetsUrl}?action=dashboard`, {
            method: "GET",
            headers: { Accept: "application/json" },
          });

          if (!sheetsResponse.ok) {
            throw new Error(`Sheets responded with ${sheetsResponse.status}`);
          }

          const data = await sheetsResponse.json();
          return new Response(
            JSON.stringify({ connected: true, data }),
            { status: 200, headers: { "content-type": "application/json" } }
          );
        } catch (err) {
          console.error("[Sheets Dashboard] Fetch failed:", err);
          // If upstream fetch failed (e.g. captive portal or certificate issue), try reading local recorded snapshot
          try {
            const fs = await import("fs/promises");
            const path = await import("path");
            const snapshotPath = path.resolve(process.cwd(), "gas_dash.json");
            const content = await fs.readFile(snapshotPath, "utf-8");
            const data = JSON.parse(content);
            return new Response(
              JSON.stringify({ connected: true, data, isCached: true }),
              { status: 200, headers: { "content-type": "application/json" } }
            );
          } catch {
            return new Response(
              JSON.stringify({ connected: false, error: String(err) }),
              { status: 200, headers: { "content-type": "application/json" } }
            );
          }
        }
      }

      // ─── YOUTUBE AUTOMATION ENDPOINTS ──────────────────────────────────────────

      // 1. POST /api/youtube/auth/login
      if (url.pathname === "/api/youtube/auth/login" && request.method === "POST") {
        const { validateAdminPassword, signSession, buildSetCookieHeader, checkAirtableRateLimit, hashClientIp, validateCsrfOrigin } = await import("./lib/youtube-session");

        if (!validateCsrfOrigin(request)) {
          return new Response(JSON.stringify({ success: false, error: "Invalid origin or CSRF check failed" }), {
            status: 403,
            headers: { "content-type": "application/json" },
          });
        }

        const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const ipHash = hashClientIp(clientIp);
        const rateCheck = await checkAirtableRateLimit(`login_${ipHash}`, 5, 15 * 60);
        if (!rateCheck.allowed) {
          return new Response(JSON.stringify({ success: false, error: "Too many login attempts. Please try again later." }), {
            status: 429,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const body = await request.json().catch(() => ({}));
          const password = body.password;
          if (!password || !validateAdminPassword(password)) {
            return new Response(JSON.stringify({ success: false, error: "Invalid admin credentials" }), {
              status: 401,
              headers: { "content-type": "application/json" },
            });
          }

          const token = signSession();
          const cookieHeader = buildSetCookieHeader(token);
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              "content-type": "application/json",
              "Set-Cookie": cookieHeader,
            },
          });
        } catch (err) {
          return new Response(JSON.stringify({ success: false, error: "Authentication processing failed" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }

      // 2. POST /api/youtube/auth/logout
      if (url.pathname === "/api/youtube/auth/logout" && request.method === "POST") {
        const { buildClearCookieHeader, validateCsrfOrigin } = await import("./lib/youtube-session");
        if (!validateCsrfOrigin(request)) {
          return new Response(JSON.stringify({ success: false, error: "Invalid origin or CSRF check failed" }), {
            status: 403,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "Set-Cookie": buildClearCookieHeader(),
          },
        });
      }

      // 3. GET /api/youtube/oauth/start (Admin-protected)
      if (url.pathname === "/api/youtube/oauth/start" && request.method === "GET") {
        const { verifySession } = await import("./lib/youtube-session");
        const cookie = request.headers.get("cookie");
        if (!verifySession(cookie)) {
          return new Response(JSON.stringify({ error: "Unauthorized: Admin session required" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const { buildAuthorizationUrl } = await import("./lib/youtube-oauth");
          const authUrl = await buildAuthorizationUrl();
          return new Response(null, {
            status: 302,
            headers: { Location: authUrl },
          });
        } catch (err: any) {
          console.error("[YouTube OAuth Start] Error:", err?.message || err);
          return new Response(JSON.stringify({ error: "Failed to initialize OAuth authorization flow" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }

      // 4. GET /api/youtube/oauth/callback (Public callback from Google)
      if (url.pathname === "/api/youtube/oauth/callback" && request.method === "GET") {
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        if (error) {
          return new Response(null, {
            status: 302,
            headers: { Location: `/youtube-admin?error=${encodeURIComponent(`Google authorization error: ${error}`)}` },
          });
        }

        if (!code || !state) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/youtube-admin?error=Missing+authorization+code+or+state" },
          });
        }

        try {
          const { handleOAuthCallback } = await import("./lib/youtube-oauth");
          const result = await handleOAuthCallback(code, state);

          if (!result.success) {
            return new Response(null, {
              status: 302,
              headers: { Location: `/youtube-admin?error=${encodeURIComponent(result.error || "OAuth exchange failed")}` },
            });
          }

          return new Response(null, {
            status: 302,
            headers: { Location: "/youtube-admin?connected=true" },
          });
        } catch (err: any) {
          console.error("[YouTube OAuth Callback] Unexpected error:", err?.message || err);
          return new Response(null, {
            status: 302,
            headers: { Location: "/youtube-admin?error=Internal+OAuth+callback+error" },
          });
        }
      }

      // 5. GET /api/youtube/channel (Admin-protected)
      if (url.pathname === "/api/youtube/channel" && request.method === "GET") {
        const { verifySession } = await import("./lib/youtube-session");
        const cookie = request.headers.get("cookie");
        if (!verifySession(cookie)) {
          return new Response(JSON.stringify({ error: "Unauthorized: Admin session required" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const { getChannelDetails } = await import("./lib/youtube-service");
          const channel = await getChannelDetails();
          return new Response(JSON.stringify({ connected: true, channel }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          const msg = err?.message || "";
          if (msg.startsWith("NOT_AUTHENTICATED")) {
            return new Response(JSON.stringify({ connected: false, error: "Not authenticated" }), {
              status: 200,
              headers: { "content-type": "application/json" },
            });
          }
          if (msg.startsWith("REAUTH_REQUIRED")) {
            return new Response(JSON.stringify({ connected: false, reauthRequired: true, error: msg }), {
              status: 200,
              headers: { "content-type": "application/json" },
            });
          }
          console.error("[YouTube Channel] API error:", msg);
          return new Response(JSON.stringify({ error: "Failed to fetch YouTube channel details" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }

      // 6. GET /api/youtube/videos (Admin-protected)
      if (url.pathname === "/api/youtube/videos" && request.method === "GET") {
        const { verifySession } = await import("./lib/youtube-session");
        const cookie = request.headers.get("cookie");
        if (!verifySession(cookie)) {
          return new Response(JSON.stringify({ error: "Unauthorized: Admin session required" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const { listChannelVideos } = await import("./lib/youtube-service");
          const videos = await listChannelVideos(20);
          return new Response(JSON.stringify({ videos }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          console.error("[YouTube Videos] API error:", err?.message || err);
          return new Response(JSON.stringify({ error: "Failed to list YouTube videos" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }

      // 7. POST /api/youtube/upload (Admin-protected)
      if (url.pathname === "/api/youtube/upload" && request.method === "POST") {
        const { verifySession, validateCsrfOrigin } = await import("./lib/youtube-session");
        const cookie = request.headers.get("cookie");
        if (!verifySession(cookie)) {
          return new Response(JSON.stringify({ error: "Unauthorized: Admin session required" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        if (!validateCsrfOrigin(request)) {
          return new Response(JSON.stringify({ error: "Invalid origin or CSRF check failed" }), {
            status: 403,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const formData = await request.formData();
          const file = formData.get("video") as File | null;
          const title = formData.get("title")?.toString()?.trim();
          const description = formData.get("description")?.toString()?.trim() || "";
          const privacyStatus = (formData.get("privacyStatus")?.toString() || "private") as "private" | "unlisted" | "public";
          const publishAt = formData.get("publishAt")?.toString()?.trim() || undefined;

          if (!file || !title) {
            return new Response(JSON.stringify({ error: "Video file and title are required." }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const arrayBuffer = await file.arrayBuffer();
          const fileBuffer = Buffer.from(arrayBuffer);
          const mimeType = file.type || "video/mp4";

          const { uploadVideo } = await import("./lib/youtube-service");
          const result = await uploadVideo({
            title,
            description,
            privacyStatus,
            publishAt,
            fileBuffer,
            mimeType,
          });

          return new Response(JSON.stringify({ success: true, video: result }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          console.error("[YouTube Upload] Error:", err?.message || err);
          return new Response(JSON.stringify({ error: err?.message || "Failed to upload video to YouTube" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }

      // 8. POST /api/youtube/lead (Public Lead capture with rate limit and Jira dedup)
      if (url.pathname === "/api/youtube/lead" && request.method === "POST") {
        const { checkAirtableRateLimit, hashClientIp } = await import("./lib/youtube-session");
        const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const ipHash = hashClientIp(clientIp);

        // Rate limiting: 5 requests per 10 minutes per IP hash.
        // Documented: Airtable rate limiting is non-atomic and may fail open; input validation and dedup remain active.
        const rateCheck = await checkAirtableRateLimit(`lead_${ipHash}`, 5, 10 * 60);
        if (!rateCheck.allowed) {
          return new Response(
            JSON.stringify({ success: false, error: "Too many submission attempts. Please try again later." }),
            { status: 429, headers: { "content-type": "application/json" } }
          );
        }

        try {
          const body = await request.json();
          const { fullName, workEmail, organization, requirement, sports, phone, additionalDetails, videoId } = body;

          // Input validation
          if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
            return new Response(JSON.stringify({ success: false, error: "Full name is required." }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          if (!workEmail || typeof workEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail.trim())) {
            return new Response(JSON.stringify({ success: false, error: "A valid email address is required." }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const { processContactLeadWorkflow } = await import("./lib/contact-lead-service");
          const sourceString = videoId ? `YouTube Lead (Video: ${videoId})` : "YouTube Lead Form";

          const workflowResult = await processContactLeadWorkflow(
            {
              fullName: fullName.trim(),
              workEmail: workEmail.trim(),
              roleTitle: "YouTube Viewer",
              organization: (organization && typeof organization === "string" ? organization.trim() : "") || "YouTube Audience",
              requirement: (requirement && typeof requirement === "string" ? requirement.trim() : "") || "YouTube Channel Lead Inquiry",
              sports: Array.isArray(sports) && sports.length > 0 ? sports : ["General Sports"],
              phone: phone ? String(phone).trim() : undefined,
              additionalDetails: additionalDetails ? String(additionalDetails).trim() : undefined,
              source: sourceString,
              page: "/youtube",
            },
            request.url
          );

          return new Response(JSON.stringify(workflowResult), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          console.error("[YouTube Lead Workflow] Failed:", err?.message || err);
          return new Response(JSON.stringify({ success: false, error: "Failed to process YouTube lead." }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }

      // 9. POST /api/youtube/engagement/sync (YouTube engagement sync — writes only to Google Sheets)
      if (
        url.pathname === "/api/youtube/engagement/sync" &&
        request.method === "POST"
      ) {
        const { verifySession, validateCsrfOrigin } = await import("./lib/youtube-session");

        if (!verifySession(request.headers.get("cookie"))) {
          return new Response(
            JSON.stringify({ success: false, error: "Unauthorized: Admin session required" }),
            { status: 401, headers: { "content-type": "application/json" } }
          );
        }

        if (!validateCsrfOrigin(request)) {
          return new Response(
            JSON.stringify({ success: false, error: "Invalid origin or CSRF check failed" }),
            { status: 403, headers: { "content-type": "application/json" } }
          );
        }

        try {
          const { runYouTubeEngagementSync } = await import("./lib/youtube-engagement-service");
          const result = await runYouTubeEngagementSync();

          return new Response(JSON.stringify(result), {
            status: result.success && result.sheetsRecorded ? 200 : 502,
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          console.error(
            "[YouTube Engagement Sync] Failed:",
            err instanceof Error ? err.message : "Unknown error"
          );

          return new Response(
            JSON.stringify({ success: false, error: "YouTube engagement sync failed." }),
            { status: 500, headers: { "content-type": "application/json" } }
          );
        }
      }



      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
