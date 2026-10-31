import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

// Reloaded serverRouter with updated form public templates schema
import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";
import cookieParser from "cookie-parser";

export const app = express();
app.set("trust proxy", 1);
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: " OpenAPI",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

// Allowed origins for CORS (From apps/api/.env FRONTEND_URL & production domains)
const allowedOrigins = [
  env.FRONTEND_URL,
  "https://kenilpatel.in",
  "https://chaiform.kenilpatel.in",
  "http://localhost:3000",
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-trpc-source",
    "trpc-accept",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: " is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: " server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

// Global Express Error Handler (Never leak stack traces, internal paths, or SQL to clients)
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled server exception:", err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({
    error: {
      message: "An unexpected server error occurred. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
    },
  });
});

export default app;
