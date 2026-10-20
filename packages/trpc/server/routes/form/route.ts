import { TRPCError } from "@trpc/server";
import { formFieldsService, formService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    createFormFieldInputSchema,
    createFormInputSchema,
    idOutputSchema,
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

type FormRecord = Awaited<ReturnType<typeof formService.getFormById>>;
type FormFieldRecord = Awaited<
    ReturnType<typeof formFieldsService.getFieldsByFormId>
>[number];

function toFormResponse(form: FormRecord) {
    return {
        id: form.id,
        title: form.title,
        description: form.description,
        createdBy: form.createdBy,
        isProtected: form.isProtected,
        published: form.published,
        publishedBy: form.publishedBy,
        publishedAt: form.publishedAt,
        unpublishedAt: form.unpublishedAt,
        deleted: form.deleted,
        deletedBy: form.deletedBy,
        deletedAt: form.deletedAt,
        participantLimit: form.participantLimit,
        participantLimitUnit: form.participantLimitUnit,
        totalSubmissions: form.totalSubmissions,
        unSubmittedSubmissions: form.unSubmittedSubmissions,
        timeLimit: form.timeLimit,
        timeLimitUnit: form.timeLimitUnit,
        formLink: form.formLink,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
    };
}

function toFormFieldResponse(field: FormFieldRecord) {
    return {
        id: field.id,
        label: field.label,
        labelKey: field.labelKey,
        description: field.description,
        placeholder: field.placeholder,
        isRequired: field.isRequired,
        type: field.type,
        options: field.options,
        index: field.index,
        createdBy: field.createdBy,
        createdAt: field.createdAt,
        updatedAt: field.updatedAt,
    };
}

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
            return toFormResponse(form);
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
            return toFormResponse(form);
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
            return forms.map((form) => toFormResponse(form));
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
            return toFormResponse(updatedForm);
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
        .output(idOutputSchema)
        .mutation(async ({ input, ctx }) => {
            const deletedForm = await formService.deleteForm({
                ...input,
                userId: ctx.user.id,
            });
            return { id: deletedForm.id };
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
            return toFormResponse(publishedForm);
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
            return toFormResponse(unpublishedForm);
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
            return formFields.map((field) => toFormFieldResponse(field));
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
        .output(idOutputSchema)
        .mutation(async ({ input, ctx }) => {
            await ensureFormOwner(input.formId, ctx.user.id);
            const formField = await formFieldsService.createField(input);
            return { id: formField.id };
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
        .output(idOutputSchema)
        .mutation(async ({ input, ctx }) => {
            await ensureFormOwner(input.formId, ctx.user.id);
            const updatedFormField = await formFieldsService.updateField(input);
            return { id: updatedFormField.id };
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
        .output(idOutputSchema)
        .mutation(async ({ input, ctx }) => {
            await ensureFormOwner(input.formId, ctx.user.id);
            const deletedFormField = await formFieldsService.deleteField(input);
            return { id: deletedFormField.id };
        }),
});
