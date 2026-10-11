import { z } from "zod";

/**
 * =========================================================================
 * ⚙️ BACKEND CENTRAL ENVIRONMENT CONFIGURATION
 * =========================================================================
 * Backend me BASE_URL aur FRONTEND_URL strictly apps/api/.env se aate hain.
 * Code me kahin bhi localhost hardcoded nahi hai.
 * =========================================================================
 */

const envSchema = z.object({
  PORT: z.string().optional().default("8000"),
  NODE_ENV: z.enum(["development", "production", "prod"]).default("development"),

  // 1. Backend own public URL (OpenAPI docs, Scalar, webhooks)
  BASE_URL: z.string().min(1, "BASE_URL is required in apps/api/.env"),

  // 2. Allowed Frontend Client URL (For CORS & auth redirects)
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required in apps/api/.env"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
