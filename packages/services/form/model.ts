import { z } from "zod";

const uuidSchema = z.string().uuid();

export const FormFieldTypeSchema = z.enum([
    "TEXT",
    "NUMBER",
    "EMAIL",
    "PHONE",
    "YES_NO",
    "PASSWORD",
]);

export const CreateFormInputSchema = z.object({
    title: z.string().trim().min(1).max(55),
    description: z.string().max(255).nullable().optional(),
    createdBy: uuidSchema,
    isProtected: z.boolean().optional(),
    password: z.string().min(1).max(255).optional(),
    participantLimit: z.number().int().positive().nullable().optional(),
    participantLimitUnit: z.string().max(10).nullable().optional(),
    timeLimit: z.number().int().positive().nullable().optional(),
    timeLimitUnit: z.string().max(255).nullable().optional(),
});
export type CreateFormInputType = z.infer<typeof CreateFormInputSchema>;

export const UpdateFormInputSchema = z.object({
    id: uuidSchema,
    userId: uuidSchema,
    title: z.string().trim().min(1).max(55).optional(),
    description: z.string().max(255).nullable().optional(),
    isProtected: z.boolean().optional(),
    password: z.string().min(1).max(255).nullable().optional(),
    participantLimit: z.number().int().positive().nullable().optional(),
    participantLimitUnit: z.string().max(10).nullable().optional(),
    timeLimit: z.number().int().positive().nullable().optional(),
    timeLimitUnit: z.string().max(255).nullable().optional(),
});
export type UpdateFormInputType = z.infer<typeof UpdateFormInputSchema>;

export const FormIdInputSchema = z.object({ id: uuidSchema });
export type FormIdInputType = z.infer<typeof FormIdInputSchema>;

export const UserIdInputSchema = z.object({ userId: uuidSchema });
export type UserIdInputType = z.infer<typeof UserIdInputSchema>;

export const FormOwnerInputSchema = z.object({
    id: uuidSchema,
    userId: uuidSchema,
});
export type FormOwnerInputType = z.infer<typeof FormOwnerInputSchema>;

export const CreateFormFieldInputSchema = z.object({
    formId: uuidSchema,
    label: z.string().trim().min(1).max(55),
    labelKey: z.string().trim().min(1).max(55),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
    type: FormFieldTypeSchema,
    options: z.unknown().optional(),
    index: z.number().min(0).max(1),
});
export type CreateFormFieldInputType = z.infer<
    typeof CreateFormFieldInputSchema
>;

export const UpdateFormFieldInputSchema = z.object({
    id: uuidSchema,
    formId: uuidSchema,
    label: z.string().trim().min(1).max(55).optional(),
    labelKey: z.string().trim().min(1).max(55).optional(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
    type: FormFieldTypeSchema.optional(),
    options: z.unknown().optional(),
    index: z.number().min(0).max(1).optional(),
});
export type UpdateFormFieldInputType = z.infer<
    typeof UpdateFormFieldInputSchema
>;

export const FormFieldIdInputSchema = z.object({
    id: uuidSchema,
    formId: uuidSchema,
});
export type FormFieldIdInputType = z.infer<typeof FormFieldIdInputSchema>;
