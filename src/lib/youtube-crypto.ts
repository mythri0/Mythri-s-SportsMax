import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

export interface EncryptedPayload {
  iv: string; // hex
  tag: string; // hex
  data: string; // hex
}

/**
 * Validates and converts a 32-byte (64 hex char) encryption key into a Buffer.
 * Never logs or prints the key.
 */
function getKeyBuffer(keyHex?: string): Buffer {
  const hex = keyHex || process.env["YOUTUBE_TOKEN_ENCRYPTION_KEY"];
  if (!hex || typeof hex !== "string") {
    throw new Error("YOUTUBE_TOKEN_ENCRYPTION_KEY is required and must be a 64-character hex string");
  }
  const trimmed = hex.trim();
  if (trimmed.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    throw new Error("YOUTUBE_TOKEN_ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters)");
  }
  return Buffer.from(trimmed, "hex");
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a serialized JSON string containing hex-encoded iv, tag, and ciphertext data.
 */
export function encryptAES256GCM(plaintext: string, keyHex?: string): string {
  const key = getKeyBuffer(keyHex);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const payload: EncryptedPayload = {
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
    data: encrypted.toString("hex"),
  };

  return JSON.stringify(payload);
}

/**
 * Decrypts an AES-256-GCM encrypted payload back to plaintext.
 * Throws if the payload is tampered with or key is invalid.
 */
export function decryptAES256GCM(encryptedJson: string, keyHex?: string): string {
  const key = getKeyBuffer(keyHex);
  let payload: EncryptedPayload;
  try {
    payload = JSON.parse(encryptedJson);
  } catch {
    throw new Error("Invalid encrypted payload format");
  }

  if (!payload.iv || !payload.tag || !payload.data) {
    throw new Error("Encrypted payload missing required fields (iv, tag, data)");
  }

  const iv = Buffer.from(payload.iv, "hex");
  const tag = Buffer.from(payload.tag, "hex");
  const data = Buffer.from(payload.data, "hex");

  if (iv.length !== IV_LENGTH || tag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Malformed encryption parameters");
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
