import test from "node:test";
import assert from "node:assert/strict";
import {
  signSession,
  verifySession,
  validateAdminPassword,
  validateCsrfOrigin,
  hashClientIp,
  buildSetCookieHeader,
  buildClearCookieHeader,
} from "../lib/youtube-session.ts";

process.env["YOUTUBE_ADMIN_SECRET"] = "super_secure_random_admin_secret_999";

test("signSession generates verifiable token", () => {
  const token = signSession();
  assert.ok(token.includes("."));
  const header = `yt_admin_session=${token}`;
  assert.equal(verifySession(header), true);
});

test("verifySession rejects invalid or forged cookie", () => {
  const fakeHeader = "yt_admin_session=invalid.token";
  assert.equal(verifySession(fakeHeader), false);
  assert.equal(verifySession(null), false);
});

test("validateAdminPassword uses constant time check", () => {
  assert.equal(validateAdminPassword("super_secure_random_admin_secret_999"), true);
  assert.equal(validateAdminPassword("wrong_password"), false);
  assert.equal(validateAdminPassword(""), false);
});

test("validateCsrfOrigin validates origin matching host", () => {
  const validReq = new Request("https://sports-max-dig.vercel.app/api/youtube/auth/login", {
    method: "POST",
    headers: {
      origin: "https://sports-max-dig.vercel.app",
      host: "sports-max-dig.vercel.app",
    },
  });
  assert.equal(validateCsrfOrigin(validReq), true);

  const maliciousReq = new Request("https://sports-max-dig.vercel.app/api/youtube/auth/login", {
    method: "POST",
    headers: {
      origin: "https://evil-hacker.com",
      host: "sports-max-dig.vercel.app",
    },
  });
  assert.equal(validateCsrfOrigin(maliciousReq), false);
});

test("hashClientIp creates consistent 16-char hex hash", () => {
  const hash1 = hashClientIp("192.168.1.1");
  const hash2 = hashClientIp("192.168.1.1");
  const hash3 = hashClientIp("10.0.0.1");

  assert.equal(hash1, hash2);
  assert.notEqual(hash1, hash3);
  assert.equal(hash1.length, 16);
});

test("cookie headers formatting", () => {
  const setCookie = buildSetCookieHeader("xyz");
  assert.ok(setCookie.includes("HttpOnly"));
  assert.ok(setCookie.includes("SameSite=Strict"));

  const clearCookie = buildClearCookieHeader();
  assert.ok(clearCookie.includes("Max-Age=0"));
});
