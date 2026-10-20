import { TRPCError } from "@trpc/server";
import { formService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    createFormFieldInputSchema,
    createFormInputSchema,
    deletedOutputSchema,
    formFieldIdInputSchema,
    formFieldsOutputSchema,
    formIdInputSchema,
    formListOutputSchema,
    formOutputSchema,
    noInputSchema,
    updateFormFieldInputSchema,
    updateFormInputSchema,
} from "./model";

const TAGS = ["Forms"];
const getPath = generatePath("/form");

async function ensureFormOwner(formId: string, userId: string) {
    const form = await formService.getFormById({ id: formId });
    if (form.createdBy !== userId)
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
}

export const formRouter = router({
    createForm: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFormInputSchema)
        .output(formOutputSchema)
        .mutation(async ({ input, ctx }) =>
            formService.createForm({ ...input, createdBy: ctx.user.id }),
        ),

    getFormById: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFormById"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(formIdInputSchema)
        .output(formOutputSchema)
        .query(async ({ input, ctx }) => {
            await ensureFormOwner(input.id, ctx.user.id);
            return formService.getFormById(input);
        }),

    getFormsByUserId: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFormsByUserId"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(noInputSchema)
        .output(formListOutputSchema)
        .query(({ ctx }) =>
            formService.getFormsByUserId({ userId: ctx.user.id }),
        ),

    updateForm: protectedProcedure
        .meta({
            openapi: {
                method: "PATCH",
                path: getPath("/updateForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFormInputSchema)
        .output(formOutputSchema)
        .mutation(({ input, ctx }) =>
            formService.updateForm({ ...input, userId: ctx.user.id }),
        ),

    deleteForm: protectedProcedure
        .meta({
            openapi: {
                method: "DELETE",
                path: getPath("/deleteForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(formIdInputSchema)
        .output(deletedOutputSchema)
        .mutation(({ input, ctx }) =>
            formService.deleteForm({ ...input, userId: ctx.user.id }),
        ),

    publishForm: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/publishForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(formIdInputSchema)
        .output(formOutputSchema)
        .mutation(({ input, ctx }) =>
            formService.publishForm({ ...input, userId: ctx.user.id }),
        ),

    unpublishForm: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/unpublishForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(formIdInputSchema)
        .output(formOutputSchema)
        .mutation(({ input, ctx }) =>
            formService.unpublishForm({ ...input, userId: ctx.user.id }),
        ),

    getFormFields: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFormFields"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(formIdInputSchema)
        .output(formFieldsOutputSchema)
        .query(async ({ input, ctx }) => {
            await ensureFormOwner(input.id, ctx.user.id);
            return formService.getFormFields(input);
        }),

    createFormField: protectedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createFormField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFormFieldInputSchema)
        .output(formFieldsOutputSchema.element)
        .mutation(async ({ input, ctx }) => {
            await ensureFormOwner(input.formId, ctx.user.id);
            return formService.createFormField(input);
        }),

    updateFormField: protectedProcedure
        .meta({
            openapi: {
                method: "PATCH",
                path: getPath("/updateFormField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFormFieldInputSchema)
        .output(formFieldsOutputSchema.element)
        .mutation(async ({ input, ctx }) => {
            await ensureFormOwner(input.formId, ctx.user.id);
            return formService.updateFormField(input);
        }),

    deleteFormField: protectedProcedure
        .meta({
            openapi: {
                method: "DELETE",
                path: getPath("/deleteFormField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(formFieldIdInputSchema)
        .output(deletedOutputSchema)
        .mutation(async ({ input, ctx }) => {
            await ensureFormOwner(input.formId, ctx.user.id);
            return formService.deleteFormField(input);
        }),
});
