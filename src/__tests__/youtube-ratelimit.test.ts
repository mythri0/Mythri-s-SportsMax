import test from "node:test";
import assert from "node:assert/strict";
import { checkAirtableRateLimit } from "../lib/youtube-session.ts";

test("checkAirtableRateLimit documents non-atomic limitation and fails open on storage missing", async () => {
  // Without AIRTABLE_TOKEN configured in this test process, Airtable lookup fails.
  // Requirement 2: System must fail open safely and preserve input validation and lead deduplication.
  const result = await checkAirtableRateLimit("test_bucket", 5, 60);

  // Verifies fail-open behavior so legitimate user flow is not permanently severed if Airtable is unreachable
  assert.equal(result.allowed, true);
  assert.ok(result.remaining >= 0);
});
