import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    setAuthenticationCookie,
    getAuthenticationCookie,
} from "../../utils/cookie";
import {
    createUserWithEmailAndPasswordInputSchema,
    createUserWithEmailAndPasswordOutputSchema,
    signInUserWithEmailAndPasswordInputSchema,
    signInUserWithEmailAndPasswordOutputSchema,
    getLoggedInUserInfoInputSchema,
    getLoggedInUserInfoOutputSchema,
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

            setAuthenticationCookie(ctx, token);

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

            setAuthenticationCookie(ctx, token);

            return {
                userId: id,
                token,
                refreshToken,
            };
        }),
    getLoggedInUserInfo: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getLoggedInUserInfo"),
                tags: TAGS,
            },
        })
        .input(getLoggedInUserInfoInputSchema)
        .output(getLoggedInUserInfoOutputSchema)
        .query(async ({ ctx }) => {
            const userToken = getAuthenticationCookie(ctx);

            if (!userToken) throw new Error(`user is not logged in`);

            const { id, firstName, lastName, email, profileImageUrl } =
                await userService.verifyAndDecodeUserToken(userToken);

            return {
                userId: id,
                fullName: `${firstName} ${lastName}`,
                email,
                profileImageUrl,
            };
        }),
});
