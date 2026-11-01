import { z } from "zod";
import {
    formPageConnectionSchema,
    formPageSchema,
} from "@repo/services/form-flow/model";

const uuidSchema = z.string().uuid();

// Form procedure inputs
export const createFormInputSchema = z.object({
    title: z.string().trim().min(1).max(55),
    description: z.string().max(255).nullable().optional(),
    isProtected: z.boolean().optional(),
    password: z.string().min(1).max(255).optional(),
    participantLimit: z.number().int().positive().nullable().optional(),
    participantLimitUnit: z.string().max(10).nullable().optional(),
    collectEmail: z.boolean().optional(),
    allowAnonymous: z.boolean().optional(),
    responseLimit: z.number().int().positive().nullable().optional(),
    perRespondentLimit: z.number().int().positive().nullable().optional(),
    timeLimit: z.number().int().positive().nullable().optional(),
    timeLimitUnit: z.string().max(255).nullable().optional(),
});

export const updateFormInputSchema = z.object({
    id: uuidSchema,
    title: z.string().trim().min(1).max(55).optional(),
    description: z.string().max(255).nullable().optional(),
    isProtected: z.boolean().optional(),
    password: z.string().min(1).max(255).nullable().optional(),
    participantLimit: z.number().int().positive().nullable().optional(),
    participantLimitUnit: z.string().max(10).nullable().optional(),
    collectEmail: z.boolean().optional(),
    allowAnonymous: z.boolean().optional(),
    responseLimit: z.number().int().positive().nullable().optional(),
    perRespondentLimit: z.number().int().positive().nullable().optional(),
    timeLimit: z.number().int().positive().nullable().optional(),
    timeLimitUnit: z.string().max(255).nullable().optional(),
});

export const formIdInputSchema = z.object({ id: uuidSchema });
export const noInputSchema = z.undefined();

// Form field procedure inputs
export const formFieldTypeSchema = z.enum([
    "TEXT",
    "NUMBER",
    "EMAIL",
    "PHONE",
    "YES_NO",
    "PASSWORD",
]);

export const createFormFieldInputSchema = z.object({
    formId: uuidSchema,
    pageId: uuidSchema.optional(),
    position: z.number().int().min(0).max(99).optional(),
    label: z.string().trim().min(1).max(55),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional().default(false),
    type: formFieldTypeSchema,
    options: z.unknown().optional(),
});

export const updateFormFieldInputSchema = z.object({
    id: uuidSchema,
    formId: uuidSchema,
    pageId: uuidSchema.optional(),
    label: z.string().trim().min(1).max(55).optional(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
    type: formFieldTypeSchema.optional(),
    options: z.unknown().optional(),
    index: z.number().min(0).max(1).optional(),
});

export const formFieldIdInputSchema = z.object({
    id: uuidSchema,
    formId: uuidSchema,
});

export const saveFormFlowInputSchema = z.object({
    formId: uuidSchema,
    pages: z.array(formPageSchema).min(1).max(100),
    connections: z.array(formPageConnectionSchema).max(500),
});

export const formFlowOutputSchema = z.object({
    pages: z.array(
        z.object({
            id: uuidSchema,
            title: z.string(),
            index: z.number(),
            positionX: z.number(),
            positionY: z.number(),
            isStart: z.boolean(),
        }),
    ),
    connections: z.array(
        z.object({
            id: uuidSchema,
            sourcePageId: uuidSchema,
            targetPageId: uuidSchema,
            condition: z.unknown().nullable(),
        }),
    ),
});

export const formResponseListInputSchema = z.object({
    formId: uuidSchema,
});

export const formFlowInputSchema = z.object({
    formId: uuidSchema,
});

export const formResponseDetailInputSchema = z.object({
    formId: uuidSchema,
    responseId: uuidSchema,
});

export const formResponseListOutputSchema = z.array(
    z.object({
        id: uuidSchema,
        email: z.string().nullable(),
        submittedAt: z.date(),
    }),
);

export const formResponseOutputSchema = z.object({
    id: uuidSchema,
    email: z.string().nullable(),
    answers: z.unknown(),
    submittedAt: z.date(),
});

export const reorderFormFieldsInputSchema = z.object({
    formId: uuidSchema,
    pageId: uuidSchema.optional(),
    fieldIds: z.array(uuidSchema).max(100),
});

// Form procedure outputs. Password and passwordSalt are intentionally omitted.
export const formOutputSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    createdBy: z.string().nullable(),
    isProtected: z.boolean(),
    published: z.boolean(),
    publishedBy: z.string().nullable(),
    publishedAt: z.date().nullable(),
    unpublishedAt: z.date().nullable(),
    deleted: z.boolean(),
    deletedBy: z.string().nullable(),
    deletedAt: z.date().nullable(),
    participantLimit: z.number().nullable(),
    participantLimitUnit: z.string().nullable(),
    collectEmail: z.boolean(),
    allowAnonymous: z.boolean(),
    responseLimit: z.number().nullable(),
    perRespondentLimit: z.number().nullable(),
    totalSubmissions: z.number().nullable(),
    unSubmittedSubmissions: z.number().nullable(),
    timeLimit: z.number().nullable(),
    timeLimitUnit: z.string().nullable(),
    formLink: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
});

export const formFieldOutputSchema = z.object({
    id: z.string(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable(),
    placeholder: z.string().nullable(),
    isRequired: z.boolean(),
    type: formFieldTypeSchema,
    options: z.unknown().nullable(),
    index: z.string(),
    createdBy: z.string().nullable(),
    pageId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
});

export const formListOutputSchema = z.array(formOutputSchema);
export const formFieldsOutputSchema = z.array(formFieldOutputSchema);
export const idOutputSchema = z.object({ id: z.string() });
