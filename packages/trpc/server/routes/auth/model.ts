import { z } from "zod";

// Create User With Email And Password Input Schema
export const createUserWithEmailAndPasswordInputSchema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    password: z.string().min(8).max(255),
});

// Create User With Email And Password Output Schema
export const createUserWithEmailAndPasswordOutputSchema = z.object({
    userId: z.string(),
});

// Sign In User With Email And Password Input Schema
export const signInUserWithEmailAndPasswordInputSchema = z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(8).max(255),
});

// Sign In User With Email And Password Output Schema
export const signInUserWithEmailAndPasswordOutputSchema = z.object({
    userId: z.string(),
});
