import { z } from "zod";

const uuidSchema = z.string().uuid();

export const submitFormResponseSchema = z.object({
    formId: uuidSchema,
    email: z.string().trim().email().max(255).nullable(),
    answers: z.record(z.string(), z.unknown()),
    flowVersion: z.string().min(1).max(100),
    visitedPageIds: z.array(uuidSchema).min(1).max(500),
});

export const listFormResponsesSchema = z.object({
    formId: uuidSchema,
    userId: uuidSchema,
});

export const getFormResponseSchema = z.object({
    formId: uuidSchema,
    userId: uuidSchema,
    responseId: uuidSchema,
});

export type SubmitFormResponseInput = z.infer<typeof submitFormResponseSchema>;
export type ListFormResponsesInput = z.infer<typeof listFormResponsesSchema>;
export type GetFormResponseInput = z.infer<typeof getFormResponseSchema>;
