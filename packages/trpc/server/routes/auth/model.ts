import { z } from "zod";

export const createUserWithEmailAndPasswordInputSchema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    password: z.string().min(8).max(255),
});

export const createUserWithEmailAndPasswordOutputSchema = z.object({
    userId: z.string(),
});
