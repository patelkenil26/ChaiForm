export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TIMEOUT"
  | "PRECONDITION_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;

  constructor(message: string, code: ErrorCode = "BAD_REQUEST", isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, "CONFLICT");
  }
}

export class TimeoutError extends AppError {
  constructor(message = "Request timed out") {
    super(message, "TIMEOUT");
  }
}

export class DatabaseConnectionError extends AppError {
  constructor(message = "Unable to connect to the database server. Please ensure database is running.") {
    super(message, "INTERNAL_SERVER_ERROR", true);
  }
}

export function isAppError(err: unknown): err is AppError {
  return (
    err instanceof AppError ||
    (typeof err === "object" &&
      err !== null &&
      "code" in err &&
      "isOperational" in err &&
      "message" in err)
  );
}
