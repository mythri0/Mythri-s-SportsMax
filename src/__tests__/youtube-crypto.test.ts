import test from "node:test";
import assert from "node:assert/strict";
import { encryptAES256GCM, decryptAES256GCM } from "../lib/youtube-crypto.ts";

const TEST_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

test("encryptAES256GCM and decryptAES256GCM roundtrip string", () => {
  const original = JSON.stringify({ token: "secret_access_token_123", expiry: 1730000000 });
  const encrypted = encryptAES256GCM(original, TEST_KEY);

  assert.notEqual(encrypted, original);
  const parsed = JSON.parse(encrypted);
  assert.ok(parsed.iv);
  assert.ok(parsed.tag);
  assert.ok(parsed.data);

  const decrypted = decryptAES256GCM(encrypted, TEST_KEY);
  assert.equal(decrypted, original);
});

test("decryptAES256GCM fails on tampered payload", () => {
  const original = "secure_test_payload";
  const encrypted = encryptAES256GCM(original, TEST_KEY);
  const parsed = JSON.parse(encrypted);

  // Tamper with data
  parsed.data = parsed.data.slice(0, -2) + (parsed.data.endsWith("a") ? "b" : "a");
  const tampered = JSON.stringify(parsed);

  assert.throws(() => {
    decryptAES256GCM(tampered, TEST_KEY);
  });
});

test("encryptAES256GCM requires 64-hex char key", () => {
  assert.throws(() => {
    encryptAES256GCM("test", "shortkey");
  });
});
