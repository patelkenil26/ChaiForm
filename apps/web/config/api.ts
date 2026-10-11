/**
 * =========================================================================
 * 🌐 FRONTEND API URL
 * =========================================================================
 * Frontend ka backend URL sirf apps/web/.env (NEXT_PUBLIC_API_URL) se load hota hai.
 * Code me kahin bhi localhost hardcoded nahi hai.
 * =========================================================================
 */

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "") as string;

/**
 * Clean Base URL (Bina /trpc ke, useful for scalar docs or health check links)
 */
export const API_BASE_URL = API_URL ? API_URL.replace(/\/trpc\/?$/, "") : "";

