import test from "node:test";
import assert from "node:assert/strict";
import { generatePkcePair, getGoogleOAuthEnv } from "../lib/youtube-oauth.ts";

test("generatePkcePair creates valid verifier and sha256 challenge", () => {
  const { verifier, challenge } = generatePkcePair();
  assert.ok(verifier.length >= 43);
  assert.ok(challenge.length >= 43);
  assert.notEqual(verifier, challenge);
});

test("getGoogleOAuthEnv defaults to canonical production redirect URI", () => {
  delete process.env["YOUTUBE_REDIRECT_URI"];
  const env = getGoogleOAuthEnv();
  assert.equal(env.redirectUri, "https://sports-max-dig.vercel.app/api/youtube/oauth/callback");
});
