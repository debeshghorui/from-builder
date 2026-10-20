import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";
import { userService } from "./services";

export const tRPCContext = initTRPC
    .meta<OpenApiMeta>()
    .context<typeof createContext>()
    .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const protectedProcedure = tRPCContext.procedure.use(
    async ({ ctx, next }) => {
        const userToken = getAuthenticationCookie(ctx);

        if (!userToken)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "user is not logged in",
            });

        let user: Awaited<
            ReturnType<typeof userService.verifyAndDecodeUserToken>
        >;
        try {
            user = await userService.verifyAndDecodeUserToken(userToken);
        } catch {
            // Expired access tokens must return 401 so the web client can
            // silently exchange the refresh token and retry the request.
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User session is expired or invalid",
            });
        }

        return next({
            ctx: {
                ...ctx,
                user,
            },
        });
    },
);
