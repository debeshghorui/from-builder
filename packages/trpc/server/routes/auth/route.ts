import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { setAuthenticationCookie } from "../../utils/cookie";
import {
    createUserWithEmailAndPasswordInputSchema,
    createUserWithEmailAndPasswordOutputSchema,
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
});
