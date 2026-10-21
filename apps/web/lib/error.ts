/**
 * Safely extracts user-friendly error messages from tRPC,
 * Zod validation errors, or standard Error objects for Authentication flows.
 */
export function parseAuthErrorMessage(err: unknown): { title: string; description: string } {
  if (!err) {
    return {
      title: "Authentication Failed",
      description: "An unexpected error occurred. Please try again.",
    };
  }

  let rawMessage = "";

  if (typeof err === "string") {
    rawMessage = err;
  } else if (typeof err === "object" && err !== null && "message" in err) {
    rawMessage = String((err as { message: unknown }).message);
  }

  // Check if rawMessage is a JSON array of Zod issues
  try {
    const parsed = JSON.parse(rawMessage);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.message) {
      const messages = parsed.map((item: { message?: string }) => item.message).filter(Boolean);
      return {
        title: "Validation Error",
        description: messages.join(", ") || "Please check the form inputs.",
      };
    }
  } catch {
    // Not JSON
  }

  const lower = rawMessage.toLowerCase();

  // 1. Connection-level or database offline messages
  if (lower.includes("unable to connect to the database") || lower.includes("service temporarily unavailable")) {
    return {
      title: "Service Temporarily Unavailable",
      description: "Unable to connect to the database server. Please ensure the database service is running and try again.",
    };
  }

  // 2. Network / Fetch failures
  if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("network error")) {
    return {
      title: "Network Error",
      description: "Unable to reach the server. Please check your internet connection and try again.",
    };
  }

  // 3. User Login root causes
  if (lower.includes("does not exist") || lower.includes("not found")) {
    return {
      title: "Account Not Found",
      description: "No account exists with this email address. Please check for typos or create a new account.",
    };
  }

  if (
    lower.includes("invalid email address or password") ||
    lower.includes("invalid password") ||
    lower.includes("password is incorrect")
  ) {
    return {
      title: "Incorrect Password",
      description: "The password you entered is incorrect. Please try again or click 'Forgot password?' to reset it.",
    };
  }

  if (lower.includes("already exists")) {
    return {
      title: "Account Already Exists",
      description: "An account with this email address already exists. Please sign in instead.",
    };
  }

  if (lower.includes("invalid authentication method")) {
    return {
      title: "Authentication Error",
      description: "This account was registered using a different authentication method.",
    };
  }

  if (lower.includes("reset link has expired") || lower.includes("invalid reset token")) {
    return {
      title: "Reset Link Expired",
      description: "This password reset link has expired or is invalid. Please request a new one.",
    };
  }

  // 4. Return the clean server message
  if (rawMessage.trim()) {
    return {
      title: "Authentication Failed",
      description: rawMessage,
    };
  }

  return {
    title: "Authentication Failed",
    description: "Please verify your credentials and try again.",
  };
}

/**
 * Generic safe error extractor for general toasts and UI components.
 */
export function getSafeErrorMessage(
  err: unknown,
  fallback = "An unexpected error occurred. Please try again.",
): string {
  if (!err) return fallback;

  let rawMessage = "";
  if (typeof err === "string") {
    rawMessage = err;
  } else if (typeof err === "object" && err !== null && "message" in err) {
    rawMessage = String((err as { message: unknown }).message);
  }

  if (!rawMessage.trim()) return fallback;

  const lower = rawMessage.toLowerCase();
  if (lower.includes("failed to fetch") || lower.includes("network error")) {
    return "Network error. Please check your internet connection.";
  }

  return rawMessage;
}
