import { z } from "zod";

const envSchema = z.object({
    JWT_SECRET: z.string().min(1).describe("The secret key for the JWT"),
    JWT_EXPIRATION_TIME: z
        .string()
        .min(1)
        .describe("The expiration time for the JWT"),
    JWT_REFRESH_SECRET: z
        .string()
        .min(1)
        .describe("The secret key for the JWT refresh token"),
    JWT_REFRESH_EXPIRATION_TIME: z
        .string()
        .min(1)
        .describe("The expiration time for the JWT refresh token"),
    JWT_RESET_PASSWORD_SECRET: z
        .string()
        .min(1)
        .describe("The secret key for the JWT reset password token"),
    JWT_RESET_PASSWORD_EXPIRATION_TIME: z
        .string()
        .min(1)
        .describe("The expiration time for the JWT reset password token"),
    JWT_VERIFY_EMAIL_SECRET: z
        .string()
        .min(1)
        .describe("The secret key for the JWT verify email token"),
    JWT_VERIFY_EMAIL_EXPIRATION_TIME: z
        .string()
        .min(1)
        .describe("The expiration time for the JWT verify email token"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success)
        throw new Error(safeParseResult.error.message);
    return safeParseResult.data;
}

export const env = createEnv(process.env);
