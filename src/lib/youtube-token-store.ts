import { encryptAES256GCM, decryptAES256GCM } from "./youtube-crypto.ts";

export interface AirtableRecordFields {
  Key: string;
  EncryptedBlob: string;
  UpdatedAt?: string;
  ExpiresAt?: string;
  [key: string]: unknown;
}

export interface AirtableRecord {
  id: string;
  fields: AirtableRecordFields;
  createdTime?: string;
}

interface AirtableConfig {
  token: string | null;
  baseId: string;
  tableName: string;
}

/**
 * Loads Airtable configuration with fallback to .env file if available.
 */
export async function getYouTubeAirtableConfig(): Promise<AirtableConfig> {
  let token = process.env["AIRTABLE_TOKEN"] || null;
  let baseId = process.env["AIRTABLE_BASE_ID"] || "appTBNN3f03OsqEHl";
  let tableName = process.env["YOUTUBE_CONFIG_TABLE"] || "YouTube Config";

  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const envPath = path.resolve(process.cwd(), ".env");
    const envContent = await fs.readFile(envPath, "utf-8");

    const tokenMatch = envContent.match(/^AIRTABLE_TOKEN=(.*)$/m);
    const baseMatch = envContent.match(/^AIRTABLE_BASE_ID=(.*)$/m);
    const tableMatch = envContent.match(/^YOUTUBE_CONFIG_TABLE=(.*)$/m);

    if (tokenMatch && tokenMatch[1]) {
      const parsed = tokenMatch[1].trim().replace(/^['"]|['"]$/g, "");
      if (parsed) token = parsed;
    }
    if (baseMatch && baseMatch[1]) {
      const parsed = baseMatch[1].trim().replace(/^['"]|['"]$/g, "");
      if (parsed) baseId = parsed;
    }
    if (tableMatch && tableMatch[1]) {
      const parsed = tableMatch[1].trim().replace(/^['"]|['"]$/g, "");
      if (parsed) tableName = parsed;
    }
  } catch {
    // ignore filesystem read error and fall back to process.env
  }

  return { token, baseId, tableName };
}

/**
 * Queries Airtable for a record by its primary Key field.
 */
export async function findRecordByKey(key: string): Promise<AirtableRecord | null> {
  const { token, baseId, tableName } = await getYouTubeAirtableConfig();
  if (!token) return null;

  const endpoint = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const filterFormula = encodeURIComponent(`{Key} = '${key.replace(/'/g, "\\'")}'`);
  const url = `${endpoint}?filterByFormula=${filterFormula}&maxRecords=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    const errText = await res.text().catch(() => "");
    throw new Error(`Airtable lookup failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as { records?: AirtableRecord[] };
  if (data.records && data.records.length > 0) {
    const record = data.records[0];
    if (record) return record;
  }
  return null;
}

/**
 * Reads an encrypted record from Airtable and decrypts its JSON payload.
 */
export async function readEncryptedRecord<T = unknown>(key: string): Promise<T | null> {
  const record = await findRecordByKey(key);
  if (!record || !record.fields || !record.fields.EncryptedBlob) {
    return null;
  }

  try {
    const decryptedJson = decryptAES256GCM(record.fields.EncryptedBlob);
    return JSON.parse(decryptedJson) as T;
  } catch (err) {
    console.error(`[YouTube Token Store] Failed to decrypt record for key: ${key}`);
    return null;
  }
}

/**
 * Encrypts and writes a record to Airtable. Updates if key exists, creates otherwise.
 */
export async function writeEncryptedRecord(
  key: string,
  data: unknown,
  extraFields?: Partial<AirtableRecordFields>
): Promise<string> {
  const { token, baseId, tableName } = await getYouTubeAirtableConfig();
  if (!token) {
    throw new Error("AIRTABLE_TOKEN is not configured on the server");
  }

  const encryptedBlob = encryptAES256GCM(JSON.stringify(data));
  const existing = await findRecordByKey(key);
  const endpoint = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  const nowIso = new Date().toISOString();
  const fields: AirtableRecordFields = {
    Key: key,
    EncryptedBlob: encryptedBlob,
    UpdatedAt: nowIso,
    ...extraFields,
  };

  if (existing && existing.id) {
    // Update existing record
    const updateRes = await fetch(`${endpoint}/${existing.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text().catch(() => "");
      throw new Error(`Airtable record update failed (${updateRes.status}): ${err}`);
    }

    return existing.id;
  } else {
    // Create new record
    const createRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (!createRes.ok) {
      const err = await createRes.text().catch(() => "");
      throw new Error(`Airtable record creation failed (${createRes.status}): ${err}`);
    }

    const created = (await createRes.json()) as { id: string };
    return created.id;
  }
}

/**
 * Deletes a record from Airtable by key.
 */
export async function deleteRecordByKey(key: string): Promise<boolean> {
  const { token, baseId, tableName } = await getYouTubeAirtableConfig();
  if (!token) return false;

  const existing = await findRecordByKey(key);
  if (!existing || !existing.id) return false;

  const endpoint = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${existing.id}`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return res.ok;
}

/**
 * Clean up expired records matching a key prefix (e.g., 'yt_oauth_state_').
 */
export async function cleanExpiredRecords(prefix: string): Promise<number> {
  const { token, baseId, tableName } = await getYouTubeAirtableConfig();
  if (!token) return 0;

  const endpoint = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const filterFormula = encodeURIComponent(`FIND('${prefix}', {Key}) = 1`);
  const url = `${endpoint}?filterByFormula=${filterFormula}&maxRecords=50`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) return 0;
  const data = (await res.json()) as { records?: AirtableRecord[] };
  if (!data.records || data.records.length === 0) return 0;

  const now = Date.now();
  let deletedCount = 0;

  for (const record of data.records) {
    const expiresAt = record.fields.ExpiresAt;
    if (expiresAt && new Date(expiresAt).getTime() < now) {
      try {
        await fetch(`${endpoint}/${record.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        deletedCount++;
      } catch {
        // continue best-effort
      }
    }
  }

  return deletedCount;
}
