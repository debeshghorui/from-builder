import { TRPCError } from "@trpc/server";
import { userService } from "../../services";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    createUserWithEmailAndPasswordInputSchema,
    createUserWithEmailAndPasswordOutputSchema,
    signInUserWithEmailAndPasswordInputSchema,
    signInUserWithEmailAndPasswordOutputSchema,
    getLoggedInUserInfoInputSchema,
    getLoggedInUserInfoOutputSchema,
    refreshUserTokenInputSchema,
    refreshUserTokenOutputSchema,
    signOutUserOutputSchema,
} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
    createUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createUserWithEmailAndPassword"),
                tags: TAGS,
            },
        })
        .input(createUserWithEmailAndPasswordInputSchema)
        .output(createUserWithEmailAndPasswordOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { firstName, lastName, email, password } = input;

            const { id, token, refreshToken } =
                await userService.createUserWithEmailAndPassword({
                    firstName,
                    lastName,
                    email,
                    password,
                });

            ctx.setAuthenticationCookie(token);
            ctx.setRefreshTokenCookie(refreshToken);

            return {
                userId: id,
                token,
                refreshToken,
            };
        }),
    signInUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/signInUserWithEmailAndPassword"),
                tags: TAGS,
            },
        })
        .input(signInUserWithEmailAndPasswordInputSchema)
        .output(signInUserWithEmailAndPasswordOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const { email, password } =
                await signInUserWithEmailAndPasswordInputSchema.parseAsync(
                    input,
                );

            const { id, token, refreshToken } =
                await userService.signInUserWithEmailAndPassword({
                    email,
                    password,
                });

            ctx.setAuthenticationCookie(token);
            ctx.setRefreshTokenCookie(refreshToken);

            return {
                userId: id,
                token,
                refreshToken,
            };
        }),
    refreshUserToken: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/refreshUserToken"),
                tags: TAGS,
            },
        })
        .input(refreshUserTokenInputSchema)
        .output(refreshUserTokenOutputSchema)
        .mutation(async ({ ctx }) => {
            const refreshToken = ctx.getRefreshTokenCookie();

            if (!refreshToken) {
                ctx.clearAuthenticationCookie();
                ctx.clearRefreshTokenCookie();

                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Refresh token cookie is missing",
                });
            }

            let refreshedUser: Awaited<
                ReturnType<typeof userService.refreshUserToken>
            >;

            try {
                refreshedUser = await userService.refreshUserToken({
                    refreshToken,
                });
            } catch (error) {
                ctx.clearAuthenticationCookie();
                ctx.clearRefreshTokenCookie();

                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Refresh token is invalid or expired",
                    cause: error,
                });
            }

            const {
                id,
                token,
                refreshToken: rotatedRefreshToken,
            } = refreshedUser;

            ctx.setAuthenticationCookie(token);
            ctx.setRefreshTokenCookie(rotatedRefreshToken);

            return { userId: id };
        }),
    signOutUser: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/signOutUser"),
                tags: TAGS,
            },
        })
        .input(refreshUserTokenInputSchema)
        .output(signOutUserOutputSchema)
        .mutation(async ({ ctx }) => {
            await userService.revokeRefreshToken(ctx.getRefreshTokenCookie());
            ctx.clearAuthenticationCookie();
            ctx.clearRefreshTokenCookie();
            return { success: true };
        }),
    getLoggedInUserInfo: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getLoggedInUserInfo"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getLoggedInUserInfoInputSchema)
        .output(getLoggedInUserInfoOutputSchema)
        .query(async ({ ctx }) => {
            const { id, firstName, lastName, email, profileImageUrl } =
                await userService.getUserInfoById(ctx.user.id);

            return {
                userId: id,
                fullName: `${firstName} ${lastName}`,
                email,
                profileImageUrl,
            };
        }),
});
