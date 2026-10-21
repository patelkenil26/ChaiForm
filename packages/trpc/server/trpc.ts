import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";
import { userService } from "./services";
import { isAppError } from "@repo/services/errors";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({
    errorFormatter({ shape, error }) {
      // 1. Strip sensitive stack traces from client responses
      const sanitizedData = { ...shape.data };
      if ("stack" in sanitizedData) {
        delete (sanitizedData as Record<string, unknown>).stack;
      }

      // 2. Standard Industry Pattern: Check cause type
      // If the error was an operational Domain / Application Error, preserve its message and status
      if (isAppError(error.cause)) {
        return {
          ...shape,
          message: error.cause.message,
          data: {
            ...sanitizedData,
            code: error.cause.code,
          },
        };
      }

      // 3. If it is an intentional tRPC user error (BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, FORBIDDEN, CONFLICT, etc.)
      if (error.code !== "INTERNAL_SERVER_ERROR") {
        return {
          ...shape,
          message: error.message,
          data: sanitizedData,
        };
      }

      // 4. Any unexpected crash, raw database error (e.g. Drizzle query crash, Postgres offline),
      // network dropped, syntax error, or unhandled internal server error:
      // Log it safely to backend console and mask from client completely.
      console.error("[tRPC Internal Server Error]:", error);
      return {
        ...shape,
        message: "An unexpected server error occurred. Please try again later.",
        data: sanitizedData,
      };
    },
  });

// Base middleware to map domain AppErrors to typed TRPCErrors
const domainErrorMiddleware = tRPCContext.middleware(async ({ next }) => {
  const result = await next();
  if (!result.ok && result.error) {
    const cause = result.error.cause;
    if (isAppError(cause)) {
      throw new TRPCError({
        code: cause.code,
        message: cause.message,
        cause,
      });
    }
  }
  return result;
});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure.use(domainErrorMiddleware);

export const authenticatedProcedure = publicProcedure.use(async options => {
  const { ctx } = options;

  const userToken = getAuthenticationCookie(ctx);

  if (!userToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  const { id } = await userService.verifyAndDecodeUserToken(userToken);

  return options.next({
    ctx: {
      ...ctx,
      user: { id },
    },
  });
});