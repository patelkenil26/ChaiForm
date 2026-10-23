import { createHmac, randomBytes } from "node:crypto";

/**
 * Generates a cryptographically secure random salt hex string.
 * @param length Number of random bytes (default: 16)
 */
export function generateSalt(length = 16): string {
  return randomBytes(length).toString("hex");
}

/**
 * Computes a SHA-256 HMAC digest using a salt and secret/password.
 */
export function generateHash(salt: string, value: string): string {
  return createHmac("sha256", salt).update(value).digest("hex");
}
