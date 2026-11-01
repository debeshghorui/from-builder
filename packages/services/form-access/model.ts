import { z } from "zod";

export const publicFormInputSchema = z.object({
    formId: z.string().uuid(),
});

export const verifyFormPasswordInputSchema = z.object({
    formId: z.string().uuid(),
    password: z.string().min(1).max(255),
});

export const getPublishedFlowInputSchema = z.object({
    formId: z.string().uuid(),
    accessToken: z.string().min(1).optional(),
});

export type PublicFormInput = z.infer<typeof publicFormInputSchema>;
export type VerifyFormPasswordInput = z.infer<
    typeof verifyFormPasswordInputSchema
>;
export type GetPublishedFlowInput = z.infer<typeof getPublishedFlowInputSchema>;
