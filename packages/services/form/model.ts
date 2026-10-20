import { z } from "zod";

const uuidSchema = z.string().uuid();

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
