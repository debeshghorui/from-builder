import { z } from "zod";

const uuidSchema = z.string().uuid();

export const routeConditionSchema = z.object({
    fieldId: uuidSchema,
    operator: z.literal("equals"),
    value: z.union([z.string(), z.number(), z.boolean()]),
});

export const formPageSchema = z.object({
    id: uuidSchema,
    title: z.string().trim().min(1).max(100),
    index: z.number().int().min(0),
    positionX: z.number().int(),
    positionY: z.number().int(),
    isStart: z.boolean(),
});

export const formPageConnectionSchema = z.object({
    id: uuidSchema,
    sourcePageId: uuidSchema,
    targetPageId: uuidSchema,
    condition: routeConditionSchema.nullable().optional(),
});

export const saveFormFlowSchema = z.object({
    formId: uuidSchema,
    userId: uuidSchema,
    pages: z.array(formPageSchema).min(1).max(100),
    connections: z.array(formPageConnectionSchema).max(500),
});

export const getFormFlowSchema = z.object({
    formId: uuidSchema,
    userId: uuidSchema,
});

export type SaveFormFlowInput = z.infer<typeof saveFormFlowSchema>;
export type GetFormFlowInput = z.infer<typeof getFormFlowSchema>;
