/**
 * Safely extracts and formats user-friendly error messages from TRPC,
 * Zod validation errors, or standard Error objects.
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

  // Root cause mapping for User Login
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

  // Fallback to raw message if present
  if (rawMessage.trim()) {
    return {
      title: "Authentication Error",
      description: rawMessage,
    };
  }

  return {
    title: "Authentication Failed",
    description: "Please check your credentials and try again.",
  };
}
