import { z } from "zod";

// UUID schema
const uuidSchema = z.string().uuid();

// Form field type schema
export const FormFieldTypeSchema = z.enum([
    "TEXT",
    "NUMBER",
    "EMAIL",
    "PHONE",
    "YES_NO",
    "PASSWORD",
]);

// Get fields by form ID input schema
export const GetFieldsByFormIdInputSchema = z.object({
    formId: uuidSchema,
});

export type GetFieldsByFormIdInputType = z.infer<
    typeof GetFieldsByFormIdInputSchema
>;

// Create field input schema
export const CreateFieldInputSchema = z.object({
    formId: uuidSchema,
    label: z.string().trim().min(1).max(55),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
    type: FormFieldTypeSchema,
    options: z.unknown().optional(),
});

export type CreateFieldInputType = z.infer<typeof CreateFieldInputSchema>;

// Update field input schema
export const UpdateFieldInputSchema = z.object({
    id: uuidSchema,
    formId: uuidSchema,
    label: z.string().trim().min(1).max(55).optional(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
    type: FormFieldTypeSchema.optional(),
    options: z.unknown().optional(),
    index: z.number().min(0).max(1).optional(),
});

export type UpdateFieldInputType = z.infer<typeof UpdateFieldInputSchema>;

// Delete field input schema
export const DeleteFieldInputSchema = z.object({
    id: uuidSchema,
    formId: uuidSchema,
});

export type DeleteFieldInputType = z.infer<typeof DeleteFieldInputSchema>;
