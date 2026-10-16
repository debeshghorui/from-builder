import express from "express";
import cors from "cors";
import { apiReference } from "@scalar/express-api-reference";

import { logger } from "@repo/logger";
import * as trpcExpress from "@trpc/server/adapters/express";
import {
    generateOpenApiDocument,
    createOpenApiExpressMiddleware,
} from "trpc-to-openapi";
import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();

const openApiDocument = generateOpenApiDocument(serverRouter, {
    title: "Streamyst OpenAPI",
    version: "1.0.0",
    baseUrl: env.BASE_URL.concat("/api"),
});

if (env.NODE_ENV !== "prod") {
    app.use(
        cors({
            // Cannot use "*" when frontend sends credentials: "include".
            // The browser blocks any credentialed request whose response has
            // Access-Control-Allow-Origin: * (CORS spec, section 3.2.2).
            origin: env.FRONTEND_URL ?? "http://localhost:3000",
            credentials: true,
        }),
    );
}

app.use(express.json());

app.get("/", (_, res) => {
    return res.json({ message: "Streamyst is up and running..." });
});

app.get("/health", (_, res) => {
    return res.json({ message: "Streamyst server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (_, res) => {
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

export default app;
