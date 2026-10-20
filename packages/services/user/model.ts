import { z } from "zod";

// Create User With Email And Password Input Schema
export const CreateUserWithEmailAndPasswordInputSchema = z.object({
    firstName: z.string().min(1).max(80).describe("The first name of the user"),
    lastName: z.string().min(1).max(80).describe("The last name of the user"),
    email: z
        .string()
        .email()
        .max(255)
        .transform((email) => email.toLowerCase())
        .describe("The email of the user"),
    password: z.string().min(8).max(255).describe("The password of the user"),
    profileImageUrl: z
        .string()
        .nullable()
        .optional()
        .describe("The profile image URL of the user"),
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<
    typeof CreateUserWithEmailAndPasswordInputSchema
>;

// User Token Payload Schema
export const UserTokenPayloadSchema = z.object({
    id: z.string().uuid().describe("The uuid of the user"),
    email: z.string().email().describe("The email of the user"),
});

export type UserTokenPayloadType = z.infer<typeof UserTokenPayloadSchema>;

// Sign In User With Email And Password Input Schema
export const signInUserWithEmailAndPasswordInputSchema = z.object({
    email: z.string().email().describe("The email of the user"),
    password: z.string().min(8).max(255).describe("The password of the user"),
});

export type SignInUserWithEmailAndPasswordInputType = z.infer<
    typeof signInUserWithEmailAndPasswordInputSchema
>;

// Refresh user token input and output schemas
export const RefreshUserTokenInputSchema = z.object({
    refreshToken: z.string().min(1),
});

export type RefreshUserTokenInputType = z.infer<
    typeof RefreshUserTokenInputSchema
>;

export const RefreshUserTokenOutputSchema = z.object({
    id: z.string().uuid(),
    token: z.string().min(1),
    refreshToken: z.string().min(1),
});

export type RefreshUserTokenOutputType = z.infer<
    typeof RefreshUserTokenOutputSchema
>;
