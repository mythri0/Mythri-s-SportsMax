// Server-side Contact Lead Processing
// Orchestrates:
// 1. Google Sheets lead recording (via Apps Script VITE_ANALYTICS_URL)
// 2. Jira Cloud issue creation in project KAN
// 3. Admin email notification via Resend to ADMIN_NOTIFICATION_EMAIL
// 4. Visitor acknowledgement email via Resend to the lead submitter

import { sendReportEmail } from "./email-sender";
import { renderLeadAcknowledgement } from "./email-templates";

export interface ContactLeadInput {
  leadNumber?: string | undefined;
  fullName: string;
  workEmail: string;
  roleTitle: string;
  organization: string;
  sports: string[];
  requirement: string;
  phone?: string | undefined;
  additionalDetails?: string | undefined;
  page?: string | undefined;
  visitorId?: string | undefined;
  sessionId?: string | undefined;
  source?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmContent?: string | undefined;
  utmTerm?: string | undefined;
  landingPage?: string | undefined;
}

export interface JiraSubtaskResult {
  summary: string;
  created: boolean;
  issueKey?: string | undefined;
  issueUrl?: string | undefined;
  error?: string | undefined;
}

export interface JiraLeadResult {
  attempted: boolean;
  created: boolean;
  issueKey?: string | undefined;
  issueUrl?: string | undefined;
  error?: string | undefined;
  subtasks: JiraSubtaskResult[];
}

export interface AirtableLeadResult {
  attempted: boolean;
  created: boolean;
  recordId?: string | undefined;
  error?: string | undefined;
}

export interface ContactLeadResult {
  success: boolean;
  leadNumber: string;
  sheetsRecorded: boolean;
  sheetsError?: string | undefined;
  airtable: AirtableLeadResult;
  jira: JiraLeadResult;
  email: {
    attempted: boolean;
    sent: boolean;
    messageId?: string | undefined;
    error?: string | undefined;
  };
  visitorEmail: {
    attempted: boolean;
    sent: boolean;
    messageId?: string | undefined;
    error?: string | undefined;
  };
}

// In-memory set for deduplication of repeated submissions within 10 minutes
const recentSubmissions = new Map<string, { timestamp: number; result: ContactLeadResult }>();

// Durable file-backed deduplication store
async function getDurableLogFilePath(): Promise<string> {
  const path = await import("path");
  return path.resolve(process.cwd(), "lead_dedup_store.json");
}

async function loadDurableStore(): Promise<Record<string, { timestamp: number; result: ContactLeadResult }>> {
  try {
    const fs = await import("fs/promises");
    const filePath = await getDurableLogFilePath();
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveDurableStore(store: Record<string, { timestamp: number; result: ContactLeadResult }>): Promise<void> {
  try {
    const fs = await import("fs/promises");
    const filePath = await getDurableLogFilePath();
    await fs.writeFile(filePath, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Lead Workflow] Failed to persist durable store:", err);
  }
}

function getSubmissionFingerprint(input: ContactLeadInput): string {
  return `${input.workEmail.toLowerCase().trim()}|${input.fullName.toLowerCase().trim()}|${input.organization.toLowerCase().trim()}|${input.requirement.trim()}`;
}

async function getAirtableConfig() {
  let token = process.env["AIRTABLE_TOKEN"];
  let baseId = process.env["AIRTABLE_BASE_ID"] || "appTBNN3f03OsqEHl";
  let tableName = process.env["AIRTABLE_TABLE_NAME"] || "Contact Leads";

  // If running in Node/Vite SSR, also check fresh .env file content directly
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const envPath = path.resolve(process.cwd(), ".env");
    const envContent = await fs.readFile(envPath, "utf-8");
    const tokenMatch = envContent.match(/^AIRTABLE_TOKEN=(.*)$/m);
    const baseMatch = envContent.match(/^AIRTABLE_BASE_ID=(.*)$/m);
    const tableMatch = envContent.match(/^AIRTABLE_TABLE_NAME=(.*)$/m);

    if (tokenMatch && tokenMatch[1]) {
      const parsedToken = tokenMatch[1].trim().replace(/^['"]|['"]$/g, "");
      if (parsedToken) token = parsedToken;
    }
    if (baseMatch && baseMatch[1]) {
      const parsedBase = baseMatch[1].trim().replace(/^['"]|['"]$/g, "");
      if (parsedBase) baseId = parsedBase;
    }
    if (tableMatch && tableMatch[1]) {
      const parsedTable = tableMatch[1].trim().replace(/^['"]|['"]$/g, "");
      if (parsedTable) tableName = parsedTable;
    }
  } catch {
    // fallback to process.env
  }

  return { token, baseId, tableName };
}

/**
 * Records a contact lead in Airtable using server-side credentials and actual table schema.
 * Deduplicates by querying existing records for the same Lead Number before creating.
 */
async function recordContactLeadInAirtable(
  leadNumber: string,
  input: ContactLeadInput,
  pageUrl: string
): Promise<AirtableLeadResult> {
  const { token, baseId, tableName } = await getAirtableConfig();

  if (!token) {
    return {
      attempted: false,
      created: false,
      error: "Airtable token (AIRTABLE_TOKEN) is not configured on the server.",
    };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const tableEndpoint = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  // 1. Idempotency Check: query Airtable for any existing record with this Lead Number
  try {
    const filterFormula = encodeURIComponent(`{Lead Number} = '${leadNumber}'`);
    const checkRes = await fetch(`${tableEndpoint}?filterByFormula=${filterFormula}&maxRecords=1`, {
      method: "GET",
      headers,
    });
    if (checkRes.ok) {
      const checkData = (await checkRes.json()) as { records?: Array<{ id: string }> };
      if (checkData.records && checkData.records.length > 0 && checkData.records[0]?.id) {
        const existingId = checkData.records[0].id;
        console.info(`[Airtable Service] Lead ${leadNumber} already exists with record ID ${existingId}`);
        return {
          attempted: true,
          created: true,
          recordId: existingId,
        };
      }
    }
  } catch (checkErr) {
    console.warn("[Airtable Service] Duplicate query check warning:", checkErr);
  }

  // 2. Build details/message body preserving all lead context
  const messageParts = [
    `Requirement: ${input.requirement}`,
    `Sport(s): ${input.sports.join(", ")}`,
  ];
  if (input.phone?.trim()) {
    messageParts.push(`Phone: ${input.phone.trim()}`);
  }
  if (input.additionalDetails?.trim()) {
    messageParts.push(`Details: ${input.additionalDetails.trim()}`);
  }
  if (pageUrl) {
    messageParts.push(`Source Page: ${pageUrl}`);
  }
  if (input.utmSource) {
    messageParts.push(`Campaign Source: ${input.utmSource}`);
  }
  if (input.utmMedium) {
    messageParts.push(`Medium: ${input.utmMedium}`);
  }
  if (input.utmCampaign) {
    messageParts.push(`Campaign: ${input.utmCampaign}`);
  }
  if (input.utmContent) {
    messageParts.push(`Campaign Content: ${input.utmContent}`);
  }

  // Map to actual writable Airtable fields in Contact Leads table:
  // "Lead Number", "Name", "Email", "Role", "Organization", "Status", "Source", "Message"
  // Note: "Created At" is an Airtable computed field and automatically populated upon record creation.
  const leadSource = input.utmSource
    ? `LinkedIn / ${input.utmSource}${input.utmCampaign ? ` (${input.utmCampaign})` : ""}`
    : input.source || "Website Contact Form";

  const payload = {
    fields: {
      "Lead Number": leadNumber,
      "Name": input.fullName,
      "Email": input.workEmail,
      "Role": input.roleTitle,
      "Organization": input.organization || "SportsMax Visitor",
      "Status": "New",
      "Source": leadSource,
      "Message": messageParts.join("\n"),
    },
  };

  try {
    const res = await fetch(tableEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const resText = await res.text();
    let resJson: any = {};
    try {
      resJson = JSON.parse(resText);
    } catch {
      // not json
    }

    if (!res.ok) {
      const errMessage = resJson.error?.message || resJson.error?.type || `HTTP ${res.status}: ${resText}`;
      console.error(`[Airtable Service] Record creation failed (${res.status}): ${errMessage}`);
      return {
        attempted: true,
        created: false,
        error: `Airtable (${res.status}): ${errMessage}`,
      };
    }

    const recordId = resJson.id as string;
    console.info(`[Airtable Service] Successfully created record ${recordId} for lead ${leadNumber}`);
    return {
      attempted: true,
      created: true,
      recordId,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Airtable Service] Network error creating Airtable record:", msg);
    return {
      attempted: true,
      created: false,
      error: `Network error: ${msg}`,
    };
  }
}

const REQUIRED_SUBTASKS = [
  {
    summary: "Review Lead Details",
    descriptionText: "Validate the submitted lead and inquiry details, verifying organizational identity and contact credentials.",
  },
  {
    summary: "Contact Lead and Send Response",
    descriptionText: "Follow up with the lead via work email or phone to initiate discovery conversation.",
  },
  {
    summary: "Evaluate Requirements",
    descriptionText: "Review the requested sports intelligence service, telemetry requirements, and team scope.",
  },
  {
    summary: "Update Lead Status",
    descriptionText: "Record the follow-up outcome in Jira and CRM, updating pipeline status.",
  },
];

/**
 * Creates a Jira parent Task and 4 linked Subtasks in project KAN using Atlassian Cloud REST API v3.
 */
async function createJiraIssueWithSubtasks(
  leadNumber: string,
  input: ContactLeadInput,
  pageUrl: string
): Promise<JiraLeadResult> {
  const domain = process.env["JIRA_DOMAIN"];
  const email = process.env["JIRA_EMAIL"];
  const token = process.env["JIRA_API_TOKEN"];
  const projectKey = process.env["JIRA_PROJECT_KEY"] || "KAN";

  if (!domain || !email || !token) {
    return {
      attempted: false,
      created: false,
      error: "Jira server credentials (JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN) are not configured.",
      subtasks: [],
    };
  }

  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const headers = {
    Authorization: `Basic ${auth}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // 1. Discover available issue types (Task and Subtask) for project KAN
  let parentIssueTypeId: string | undefined;
  let parentIssueTypeName = "Task";
  let subtaskIssueTypeId: string | undefined;
  let subtaskIssueTypeName = "Subtask";

  try {
    const metaRes = await fetch(
      `https://${domain}/rest/api/3/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`,
      { method: "GET", headers }
    );
    if (metaRes.ok) {
      const metaData = (await metaRes.json()) as any;
      const proj = metaData.projects?.[0];
      if (proj && Array.isArray(proj.issuetypes) && proj.issuetypes.length > 0) {
        const types: Array<{ id: string; name: string; subtask: boolean }> = proj.issuetypes;

        // Find standard parent type
        const matchedParent = types.find(
          (t) => !t.subtask && (t.name.toLowerCase() === "task" || t.name.toLowerCase() === "lead")
        );
        if (matchedParent) {
          parentIssueTypeId = matchedParent.id;
          parentIssueTypeName = matchedParent.name;
        } else {
          const firstStandard = types.find((t) => !t.subtask);
          if (firstStandard) {
            parentIssueTypeId = firstStandard.id;
            parentIssueTypeName = firstStandard.name;
          }
        }

        // Find subtask type
        const matchedSubtask = types.find((t) => t.subtask);
        if (matchedSubtask) {
          subtaskIssueTypeId = matchedSubtask.id;
          subtaskIssueTypeName = matchedSubtask.name;
        }
      }
    } else {
      console.warn(`[Jira Service] createmeta returned HTTP ${metaRes.status}`);
    }
  } catch (err) {
    console.warn("[Jira Service] Issue metadata check failed, using default types:", err);
  }

  // Summary required: "New SportsMax Contact Lead - [lead reference]"
  const summarySourceSuffix = input.source ? ` (${input.source})` : "";
  const summary = `New SportsMax Contact Lead - [${leadNumber}]${summarySourceSuffix}`;
  const submissionUtc = new Date().toISOString();

  // Clean, standards-compliant paragraph-based ADF for description
  const makeAdfParagraph = (boldLabel: string, textValue: string) => ({
    type: "paragraph",
    content: [
      { type: "text", text: `${boldLabel}: `, marks: [{ type: "strong" }] },
      { type: "text", text: textValue },
    ],
  });

  const parentDescriptionAdf = {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "New SportsMax contact lead inquiry submitted via web interface.",
            marks: [{ type: "strong" }],
          },
        ],
      },
      makeAdfParagraph("Lead Reference", leadNumber),
      makeAdfParagraph("Full Name", input.fullName),
      makeAdfParagraph("Work Email", input.workEmail),
      makeAdfParagraph("Organization", input.organization || "Not supplied"),
      makeAdfParagraph("Role / Title", input.roleTitle),
      makeAdfParagraph("Discipline(s)", input.sports.join(", ")),
      makeAdfParagraph("Enquiry Type / Requirement", input.requirement),
      ...(input.phone ? [makeAdfParagraph("Phone", input.phone)] : []),
      ...(input.additionalDetails ? [makeAdfParagraph("Message Summary", input.additionalDetails)] : []),
      makeAdfParagraph("Source Page", pageUrl),
      ...(input.utmSource ? [makeAdfParagraph("Campaign Source", input.utmSource)] : []),
      ...(input.utmMedium ? [makeAdfParagraph("Medium", input.utmMedium)] : []),
      ...(input.utmCampaign ? [makeAdfParagraph("Campaign Name", input.utmCampaign)] : []),
      ...(input.utmContent ? [makeAdfParagraph("Campaign Content", input.utmContent)] : []),
      ...(input.landingPage ? [makeAdfParagraph("Landing Page", input.landingPage)] : []),
      makeAdfParagraph("UTC Submission Timestamp", submissionUtc),
    ],
  };

  const labels = ["sportsmax-lead", "contact-form", "inquiry"];
  if (input.utmSource?.toLowerCase().includes("linkedin") || pageUrl.includes("/linkedin")) {
    labels.push("linkedin-lead");
  }

  const parentPayload: any = {
    fields: {
      project: { key: projectKey },
      summary,
      description: parentDescriptionAdf,
      labels,
    },
  };

  if (parentIssueTypeId) {
    parentPayload.fields.issuetype = { id: parentIssueTypeId };
  } else {
    parentPayload.fields.issuetype = { name: parentIssueTypeName };
  }

  // 2. Create the Parent Task
  let parentKey: string | undefined;
  let parentUrl: string | undefined;

  try {
    const res = await fetch(`https://${domain}/rest/api/3/issue`, {
      method: "POST",
      headers,
      body: JSON.stringify(parentPayload),
    });

    const resText = await res.text();
    let resJson: any = {};
    try {
      resJson = JSON.parse(resText);
    } catch {
      // not json
    }

    if (!res.ok) {
      const errDetail = resJson.errorMessages?.join(", ") || JSON.stringify(resJson.errors || resText);
      console.error(`[Jira Service] Failed to create parent task (${res.status}): ${errDetail}`);
      return {
        attempted: true,
        created: false,
        error: `Jira Parent Task (${res.status}): ${errDetail}`,
        subtasks: [],
      };
    }

    parentKey = resJson.key as string;
    parentUrl = `https://${domain}/browse/${parentKey}`;
    console.info(`[Jira Service] Successfully created parent task ${parentKey} for lead ${leadNumber}`);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Jira Service] Network exception creating Jira parent task:", errorMsg);
    return {
      attempted: true,
      created: false,
      error: `Network error creating parent: ${errorMsg}`,
      subtasks: [],
    };
  }

  // 3. Create the Four Linked Subtasks under the Parent Issue
  const subtaskResults: JiraSubtaskResult[] = [];

  for (const st of REQUIRED_SUBTASKS) {
    const subtaskDescAdf = {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: st.descriptionText }],
        },
        makeAdfParagraph("Lead Reference", leadNumber),
        makeAdfParagraph("Parent Task", parentKey),
      ],
    };

    const subtaskPayload: any = {
      fields: {
        project: { key: projectKey },
        parent: { key: parentKey },
        summary: st.summary,
        description: subtaskDescAdf,
        labels: ["sportsmax-lead", "subtask"],
      },
    };

    if (subtaskIssueTypeId) {
      subtaskPayload.fields.issuetype = { id: subtaskIssueTypeId };
    } else {
      subtaskPayload.fields.issuetype = { name: subtaskIssueTypeName };
    }

    try {
      const subRes = await fetch(`https://${domain}/rest/api/3/issue`, {
        method: "POST",
        headers,
        body: JSON.stringify(subtaskPayload),
      });

      const subResText = await subRes.text();
      let subResJson: any = {};
      try {
        subResJson = JSON.parse(subResText);
      } catch {
        // not json
      }

      if (!subRes.ok) {
        const subErr = subResJson.errorMessages?.join(", ") || JSON.stringify(subResJson.errors || subResText);
        console.error(`[Jira Service] Failed to create subtask '${st.summary}' (${subRes.status}): ${subErr}`);
        subtaskResults.push({
          summary: st.summary,
          created: false,
          error: `HTTP ${subRes.status}: ${subErr}`,
        });
      } else {
        const subKey = subResJson.key as string;
        const subUrl = `https://${domain}/browse/${subKey}`;
        console.info(`[Jira Service] Successfully created subtask ${subKey} ('${st.summary}') under parent ${parentKey}`);
        subtaskResults.push({
          summary: st.summary,
          created: true,
          issueKey: subKey,
          issueUrl: subUrl,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      subtaskResults.push({
        summary: st.summary,
        created: false,
        error: `Network error: ${msg}`,
      });
    }
  }

  return {
    attempted: true,
    created: true,
    issueKey: parentKey,
    issueUrl: parentUrl,
    subtasks: subtaskResults,
  };
}

/**
 * Sends a notification email to the admin with lead details and Jira ticket link.
 */
async function sendAdminLeadEmail(
  leadNumber: string,
  input: ContactLeadInput,
  jiraResult: { created: boolean; issueKey?: string | undefined; issueUrl?: string | undefined }
): Promise<{ sent: boolean; messageId?: string | undefined; error?: string | undefined }> {
  const recipient =
    process.env["ADMIN_NOTIFICATION_EMAIL"] ||
    process.env["REPORT_RECIPIENT_EMAIL"] ||
    "sreevarthini2006@gmail.com";

  const sportsFormatted = input.sports.join(", ");
  const submissionTime = new Date().toLocaleString("en-US", {
    timeZone: "UTC",
    dateStyle: "full",
    timeStyle: "medium",
  }) + " (UTC)";

  const jiraHtmlBlock = jiraResult.created && jiraResult.issueKey && jiraResult.issueUrl ? `
    <div style="background-color: #0b1a2a; border: 1px solid #1e3a5f; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
      <span style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">Linked Jira Task</span>
      <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-top: 4px;">
        Issue Key: <a href="${jiraResult.issueUrl}" style="color: #38bdf8; text-decoration: underline;">${jiraResult.issueKey}</a>
      </div>
      <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Tracked automatically in project KAN.</div>
    </div>
  ` : `
    <div style="background-color: #1e1b18; border: 1px solid #451a03; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
      <span style="font-size: 11px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em;">Jira Task Status</span>
      <div style="font-size: 13px; color: #cbd5e1; margin-top: 4px;">Direct ticketing not attached or credentials unverified.</div>
    </div>
  `;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New SportsMax Lead — ${leadNumber}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f1f5f9; margin: 0; padding: 32px 16px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 24px 28px;">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #ecfdf5;">SportsMax Intelligence</div>
      <h1 style="margin: 6px 0 0; font-size: 22px; font-weight: 800; color: #ffffff;">New Contact Inquiry Received</h1>
      <div style="font-size: 13px; color: #d1fae5; margin-top: 4px;">Reference ID: <strong>${leadNumber}</strong></div>
    </div>

    <!-- Body -->
    <div style="padding: 28px;">
      <p style="margin: 0 0 18px; font-size: 14px; color: #94a3b8; line-height: 1.5;">
        A prospective partner or athletic organization has submitted their requirement via the SportsMax contact interface.
      </p>

      ${jiraHtmlBlock}

      <!-- Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 140px;">Full Name</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 700;">${input.fullName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Work Email</td>
          <td style="padding: 10px 0; color: #38bdf8; font-weight: 600;"><a href="mailto:${input.workEmail}" style="color: #38bdf8; text-decoration: none;">${input.workEmail}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Organization</td>
          <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${input.organization}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Role / Title</td>
          <td style="padding: 10px 0; color: #cbd5e1;">${input.roleTitle}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Discipline(s)</td>
          <td style="padding: 10px 0; color: #10b981; font-weight: 600;">${sportsFormatted}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Requirement</td>
          <td style="padding: 10px 0; color: #cbd5e1;">${input.requirement}</td>
        </tr>
        ${input.phone ? `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Phone Number</td>
          <td style="padding: 10px 0; color: #cbd5e1;">${input.phone}</td>
        </tr>
        ` : ""}
        ${input.utmSource ? `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Traffic Source</td>
          <td style="padding: 10px 0; color: #0284c7; font-weight: 700;">${input.utmSource}${input.utmMedium ? ` / ${input.utmMedium}` : ""}</td>
        </tr>
        ` : ""}
        ${input.utmCampaign ? `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Campaign</td>
          <td style="padding: 10px 0; color: #cbd5e1;">${input.utmCampaign}</td>
        </tr>
        ` : ""}
        ${input.additionalDetails ? `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600; vertical-align: top;">Message</td>
          <td style="padding: 10px 0; color: #cbd5e1; line-height: 1.5;">${input.additionalDetails}</td>
        </tr>
        ` : ""}
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Submitted Time</td>
          <td style="padding: 10px 0; color: #94a3b8;">${submissionTime}</td>
        </tr>
      </table>

      <!-- Action Button -->
      <div style="margin-top: 28px; text-align: center;">
        <a href="mailto:${input.workEmail}?subject=Re:%20SportsMax%20Inquiry%20(${leadNumber})" style="display: inline-block; background-color: #10b981; color: #022c22; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
          Reply to ${input.fullName}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0b1120; border-top: 1px solid #1e293b; padding: 16px 28px; font-size: 11px; color: #64748b; text-align: center;">
      SportsMax Sports Intelligence Platform · Notification System<br>
      This email was automatically generated and delivered to <strong>${recipient}</strong>.
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
New SportsMax Lead Received: ${leadNumber}
==========================================

Lead ID: ${leadNumber}
Full Name: ${input.fullName}
Work Email: ${input.workEmail}
Organization: ${input.organization}
Role: ${input.roleTitle}
Discipline(s): ${sportsFormatted}
Requirement: ${input.requirement}
${input.phone ? `Phone: ${input.phone}\n` : ""}${input.additionalDetails ? `Message: ${input.additionalDetails}\n` : ""}Submitted: ${submissionTime}

${jiraResult.created && jiraResult.issueKey ? `Jira Task: ${jiraResult.issueKey} (${jiraResult.issueUrl})\n` : ""}

Reply directly: mailto:${input.workEmail}
  `.trim();

  const result = await sendReportEmail({
    to: recipient,
    subject: `[SportsMax Lead] ${input.fullName} (${input.organization}) - ${leadNumber}`,
    html,
    text,
  });

  return {
    sent: result.success,
    messageId: result.messageId,
    error: result.error,
  };
}

/**
 * Handles the complete contact lead submission workflow safely.
 */
export async function processContactLeadWorkflow(
  input: ContactLeadInput,
  pageUrl: string = "/contact"
): Promise<ContactLeadResult> {
  const leadNumber = input.leadNumber || `LD-${Date.now().toString().slice(-6)}`;
  const fingerprint = getSubmissionFingerprint(input);

  // Check durable deduplication store (accounts for server restarts)
  const now = Date.now();
  const durableStore = await loadDurableStore();
  const durableCached = durableStore[fingerprint];
  if (durableCached && (now - durableCached.timestamp < 600000)) {
    console.info(`[Lead Workflow] Deduplicated submission via durable store for ${input.workEmail} (Lead ${durableCached.result.leadNumber})`);
    return durableCached.result;
  }

  // Also check memory cache
  const memCached = recentSubmissions.get(fingerprint);
  if (memCached && (now - memCached.timestamp < 600000)) {
    console.info(`[Lead Workflow] Deduplicated duplicate submission in-memory for ${input.workEmail} (Lead ${memCached.result.leadNumber})`);
    return memCached.result;
  }

  // 1. Ingest into Google Sheets (Google Apps Script Web App)
  let sheetsRecorded = false;
  let sheetsError: string | undefined;
  const analyticsUrl = process.env["VITE_ANALYTICS_URL"];

  if (analyticsUrl) {
    const detailsParts = [
      `Sport(s): ${input.sports.join(", ")}`,
      `Requirement: ${input.requirement}`,
    ];
    if (input.additionalDetails?.trim()) {
      detailsParts.push(`Additional Details: ${input.additionalDetails.trim()}`);
    }
    if (input.phone?.trim()) {
      detailsParts.push(`Phone: ${input.phone.trim()}`);
    }

    const payload = {
      action: "contact_lead",
      event: "contact_lead",
      type: "contact_lead",
      leadNumber,
      lead_number: leadNumber,
      name: input.fullName,
      email: input.workEmail,
      role: input.roleTitle,
      organization: input.organization,
      details: detailsParts.join(" | "),
      sport: input.sports.join(", "),
      sports: input.sports.join(", "),
      requirement: input.requirement,
      phone: input.phone?.trim() || "Not provided",
      message: input.additionalDetails?.trim() || "None",
      hasPhone: Boolean(input.phone?.trim()),
      hasAdditionalDetails: Boolean(input.additionalDetails?.trim()),
      page: pageUrl,
      visitorId: input.visitorId || "server-lead",
      sessionId: input.sessionId || "server-lead",
      source: input.utmSource || input.source || "Website Contact",
      utmSource: input.utmSource || "",
      utm_source: input.utmSource || "",
      utmMedium: input.utmMedium || "",
      utm_medium: input.utmMedium || "",
      utmCampaign: input.utmCampaign || "",
      utm_campaign: input.utmCampaign || "",
      utmContent: input.utmContent || "",
      utm_content: input.utmContent || "",
      utmTerm: input.utmTerm || "",
      utm_term: input.utmTerm || "",
      landingPage: input.landingPage || pageUrl,
      landing_page: input.landingPage || pageUrl,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(analyticsUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        sheetsRecorded = true;
      } else {
        sheetsError = `Google Sheets HTTP ${res.status}`;
      }
    } catch (err: unknown) {
      sheetsError = err instanceof Error ? err.message : String(err);
      console.warn("[Lead Workflow] Google Sheets logging network error:", sheetsError);
    }
  } else {
    sheetsError = "VITE_ANALYTICS_URL not configured on server.";
  }

  // 2. Record Lead in Airtable Contact Leads Table
  const airtableRes = await recordContactLeadInAirtable(leadNumber, input, pageUrl);

  // 3. Create Jira Parent Task and 4 Linked Subtasks in Project KAN
  const jiraRes = await createJiraIssueWithSubtasks(leadNumber, input, pageUrl);

  // 4. Dispatch Notification Email via Resend to ADMIN_NOTIFICATION_EMAIL
  const emailRes = await sendAdminLeadEmail(leadNumber, input, jiraRes);

  // 5. Send branded acknowledgement email to the visitor / lead submitter
  let visitorEmailResult: { attempted: boolean; sent: boolean; messageId?: string; error?: string } = {
    attempted: false,
    sent: false,
  };
  if (input.workEmail) {
    try {
      const ackTemplate = renderLeadAcknowledgement({
        fullName: input.fullName,
        workEmail: input.workEmail,
        organization: input.organization,
        roleTitle: input.roleTitle,
        sports: input.sports,
        requirement: input.requirement,
        leadNumber,
        ...(input.phone !== undefined ? { phone: input.phone } : {}),
        ...(input.additionalDetails !== undefined ? { additionalDetails: input.additionalDetails } : {}),
      });
      const fromAddr = process.env["RESEND_FROM_EMAIL"];
      const ackRes = await sendReportEmail({
        to: input.workEmail,
        subject: ackTemplate.subject,
        html: ackTemplate.html,
        text: ackTemplate.text,
        ...(fromAddr ? { from: fromAddr } : {}),
      });
      const nextResult: { attempted: boolean; sent: boolean; messageId?: string; error?: string } = {
        attempted: true,
        sent: ackRes.success,
      };
      if (ackRes.messageId !== undefined) nextResult.messageId = ackRes.messageId;
      if (ackRes.error !== undefined) nextResult.error = ackRes.error;
      visitorEmailResult = nextResult;
      if (ackRes.success) {
        console.info(`[Lead Workflow] Visitor acknowledgement email sent to ${input.workEmail} (Lead ${leadNumber})`);
      } else {
        console.warn(`[Lead Workflow] Visitor ack email failed for ${input.workEmail}: ${ackRes.error}`);
      }
    } catch (ackErr: unknown) {
      const errStr = ackErr instanceof Error ? ackErr.message : String(ackErr);
      console.warn(`[Lead Workflow] Visitor ack email exception for ${input.workEmail}: ${errStr}`);
      visitorEmailResult = { attempted: true, sent: false, error: errStr };
    }
  }


  const result: ContactLeadResult = {
    success: true, // Lead payload safely accepted & processed
    leadNumber,
    sheetsRecorded,
    sheetsError,
    airtable: airtableRes,
    jira: jiraRes,
    email: {
      attempted: true,
      sent: emailRes.sent,
      messageId: emailRes.messageId,
      error: emailRes.error,
    },
    visitorEmail: visitorEmailResult,
  };

  // Cache in-memory and persist to durable file store
  recentSubmissions.set(fingerprint, { timestamp: now, result });
  durableStore[fingerprint] = { timestamp: now, result };
  // Clean up entries older than 24h
  for (const [k, v] of Object.entries(durableStore)) {
    if (now - v.timestamp > 86400000) {
      delete durableStore[k];
    }
  }
  await saveDurableStore(durableStore);

  return result;
}
