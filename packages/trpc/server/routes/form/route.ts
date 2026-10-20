import { TRPCError } from "@trpc/server";
import { formFieldsService, formService } from "../../services";
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
        .mutation(async ({ input, ctx }) => {
            const form = await formService.createForm({
                ...input,
                createdBy: ctx.user.id,
            });
            return form;
        }),

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
            const form = await formService.getFormById(input);
            return form;
        }),

    getAllFormsByUserId: protectedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getAllFormsByUserId"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(noInputSchema)
        .output(formListOutputSchema)
        .query(async ({ ctx }) => {
            const forms = await formService.getAllFormsByUserId({
                userId: ctx.user.id,
            });
            return forms;
        }),

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
        .mutation(async ({ input, ctx }) => {
            const updatedForm = await formService.updateForm({
                ...input,
                userId: ctx.user.id,
            });
            return updatedForm;
        }),

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
        .mutation(async ({ input, ctx }) => {
            const deletedForm = await formService.deleteForm({
                ...input,
                userId: ctx.user.id,
            });
            return deletedForm;
        }),

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
        .mutation(async ({ input, ctx }) => {
            const publishedForm = await formService.publishForm({
                ...input,
                userId: ctx.user.id,
            });
            return publishedForm;
        }),

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
        .mutation(async ({ input, ctx }) => {
            const unpublishedForm = await formService.unpublishForm({
                ...input,
                userId: ctx.user.id,
            });
            return unpublishedForm;
        }),

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
            const formFields = await formFieldsService.getFieldsByFormId({
                formId: input.id,
            });
            return formFields;
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
            const formField = await formFieldsService.createField(input);
            return formField;
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
            const updatedFormField = await formFieldsService.updateField(input);
            return updatedFormField;
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
            const deletedFormField = await formFieldsService.deleteField(input);
            return deletedFormField;
        }),
});
