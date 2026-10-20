import { z } from "zod";

// * Signup Routes Input And Output Schemas

// Create User With Email And Password Input Schema
export const createUserWithEmailAndPasswordInputSchema = z.object({
    firstName: z
        .string()
        .min(1)
        .max(255)
        .describe("The first name of the user"),
    lastName: z.string().min(1).max(255).describe("The last name of the user"),
    email: z.string().email().min(1).max(255).describe("The email of the user"),
    password: z.string().min(8).max(255).describe("The password of the user"),
});

// Create User With Email And Password Output Schema
export const createUserWithEmailAndPasswordOutputSchema = z.object({
    userId: z.string().describe("The ID of the created user"),
});

// * Signin Routes Input And Output Schemas

// Sign In User With Email And Password Input Schema
export const signInUserWithEmailAndPasswordInputSchema = z.object({
    email: z.string().email().min(1).max(255).describe("The email of the user"),
    password: z.string().min(8).max(255).describe("The password of the user"),
});

// Sign In User With Email And Password Output Schema
export const signInUserWithEmailAndPasswordOutputSchema = z.object({
    userId: z.string().describe("The ID of the signed in user"),
});

// Refresh User Token Routes Input And Output Schemas
export const refreshUserTokenInputSchema = z
    .undefined()
    .describe("Refresh the session using the refresh token cookie");

export const signOutUserInputSchema = z
    .object({})
    .describe("Sign out the current session using its cookies");

export const refreshUserTokenOutputSchema = z.object({
    userId: z.string().uuid().describe("The ID of the refreshed user"),
});

export const signOutUserOutputSchema = z.object({
    success: z.boolean(),
});

// * Get Logged In User Info Routes Input And Output Schemas

// Get Logged In User Info Input Schema
export const getLoggedInUserInfoInputSchema = z
    .undefined()
    .describe("No input needed for getting cookie");

// Get Logged In User Info Output Schema
export const getLoggedInUserInfoOutputSchema = z.object({
    userId: z.string().describe("The ID of the logged in user"),
    fullName: z
        .string()
        .min(1)
        .max(255)
        .describe("The full name of the logged in user"),
    email: z
        .string()
        .email()
        .min(1)
        .max(255)
        .describe("The email of the logged in user"),
    profileImageUrl: z
        .string()
        .optional()
        .nullable()
        .describe("The profile image URL of the logged in user"),
});
