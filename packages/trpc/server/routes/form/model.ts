import { z } from "zod";
import {
    CreateFormInputSchema,
    FormIdInputSchema,
    UpdateFormInputSchema,
} from "@repo/services/form/model";
import {
    CreateFieldInputSchema,
    DeleteFieldInputSchema,
    UpdateFieldInputSchema,
} from "@repo/services/form-fields/model";

export const createFormInputSchema = CreateFormInputSchema.omit({
    createdBy: true,
});
export const updateFormInputSchema = UpdateFormInputSchema.omit({
    userId: true,
});
export const formIdInputSchema = FormIdInputSchema;
export const formFieldIdInputSchema = DeleteFieldInputSchema;
export const createFormFieldInputSchema = CreateFieldInputSchema;
export const updateFormFieldInputSchema = UpdateFieldInputSchema;
export const noInputSchema = z.undefined();

// Keep password and passwordSalt out of API responses.
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
    type: z.enum(["TEXT", "NUMBER", "EMAIL", "PHONE", "YES_NO", "PASSWORD"]),
    options: z.unknown().nullable(),
    index: z.string(),
    createdBy: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
});

export const formListOutputSchema = z.array(formOutputSchema);
export const formFieldsOutputSchema = z.array(formFieldOutputSchema);
export const deletedOutputSchema = z.object({ id: z.string() });
