import { and, db, desc, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formsTable } from "@repo/database/models/form";

import {
    CreateFormFieldInputSchema,
    CreateFormInputSchema,
    FormFieldIdInputSchema,
    FormIdInputSchema,
    FormOwnerInputSchema,
    UpdateFormFieldInputSchema,
    UpdateFormInputSchema,
    UserIdInputSchema,
} from "./model";
import type {
    CreateFormFieldInputType,
    CreateFormInputType,
    FormFieldIdInputType,
    FormIdInputType,
    FormOwnerInputType,
    UpdateFormFieldInputType,
    UpdateFormInputType,
    UserIdInputType,
} from "./model";

class FormService {
    public async createForm(payload: CreateFormInputType) {
        const { createdBy, ...input } =
            await CreateFormInputSchema.parseAsync(payload);
        const [form] = await db
            .insert(formsTable)
            .values({ ...input, createdBy })
            .returning();

        if (!form) throw new Error("Failed to create form");
        return form;
    }

    public async getFormById(payload: FormIdInputType) {
        const { id } = await FormIdInputSchema.parseAsync(payload);
        const [form] = await db
            .select()
            .from(formsTable)
            .where(and(eq(formsTable.id, id), eq(formsTable.deleted, false)))
            .limit(1);

        if (!form) throw new Error(`Form with ID ${id} does not exist`);
        return form;
    }

    public async getAllFormsByUserId(payload: UserIdInputType) {
        const { userId } = await UserIdInputSchema.parseAsync(payload);
        return db
            .select()
            .from(formsTable)
            .where(
                and(
                    eq(formsTable.createdBy, userId),
                    eq(formsTable.deleted, false),
                ),
            )
            .orderBy(desc(formsTable.createdAt));
    }

    public async updateForm(payload: UpdateFormInputType) {
        const { id, userId, ...input } =
            await UpdateFormInputSchema.parseAsync(payload);
        if (Object.keys(input).length === 0)
            throw new Error("At least one form field must be provided");

        const [form] = await db
            .update(formsTable)
            .set(input)
            .where(
                and(
                    eq(formsTable.id, id),
                    eq(formsTable.createdBy, userId),
                    eq(formsTable.deleted, false),
                ),
            )
            .returning();

        if (!form) throw new Error(`Form with ID ${id} does not exist`);
        return form;
    }

    public async deleteForm(payload: FormOwnerInputType) {
        const { id, userId } = await FormOwnerInputSchema.parseAsync(payload);
        const [form] = await db
            .update(formsTable)
            .set({ deleted: true, deletedBy: userId, deletedAt: new Date() })
            .where(
                and(
                    eq(formsTable.id, id),
                    eq(formsTable.createdBy, userId),
                    eq(formsTable.deleted, false),
                ),
            )
            .returning({ id: formsTable.id });

        if (!form) throw new Error(`Form with ID ${id} does not exist`);
        return form;
    }

    public async publishForm(payload: FormOwnerInputType) {
        const { id, userId } = await FormOwnerInputSchema.parseAsync(payload);
        const [form] = await db
            .update(formsTable)
            .set({
                published: true,
                publishedBy: userId,
                publishedAt: new Date(),
            })
            .where(
                and(
                    eq(formsTable.id, id),
                    eq(formsTable.createdBy, userId),
                    eq(formsTable.deleted, false),
                ),
            )
            .returning();

        if (!form) throw new Error(`Form with ID ${id} does not exist`);
        return form;
    }

    public async unpublishForm(payload: FormOwnerInputType) {
        const { id, userId } = await FormOwnerInputSchema.parseAsync(payload);
        const [form] = await db
            .update(formsTable)
            .set({ published: false, unpublishedAt: new Date() })
            .where(
                and(
                    eq(formsTable.id, id),
                    eq(formsTable.createdBy, userId),
                    eq(formsTable.deleted, false),
                ),
            )
            .returning();

        if (!form) throw new Error(`Form with ID ${id} does not exist`);
        return form;
    }

    public async getFormFields(payload: FormIdInputType) {
        const { id: formId } = await FormIdInputSchema.parseAsync(payload);
        return db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.createdBy, formId))
            .orderBy(formFieldsTable.index);
    }

    public async createFormField(payload: CreateFormFieldInputType) {
        const { formId, index, ...input } =
            await CreateFormFieldInputSchema.parseAsync(payload);
        const [field] = await db
            .insert(formFieldsTable)
            .values({ ...input, createdBy: formId, index: index.toFixed(2) })
            .returning();

        if (!field) throw new Error("Failed to create form field");
        return field;
    }

    public async updateFormField(payload: UpdateFormFieldInputType) {
        const { id, formId, index, ...input } =
            await UpdateFormFieldInputSchema.parseAsync(payload);
        if (Object.keys(input).length === 0 && index === undefined)
            throw new Error(
                "At least one form field property must be provided",
            );

        const [field] = await db
            .update(formFieldsTable)
            .set({
                ...input,
                ...(index === undefined ? {} : { index: index.toFixed(2) }),
            })
            .where(
                and(
                    eq(formFieldsTable.id, id),
                    eq(formFieldsTable.createdBy, formId),
                ),
            )
            .returning();

        if (!field) throw new Error(`Form field with ID ${id} does not exist`);
        return field;
    }

    public async deleteFormField(payload: FormFieldIdInputType) {
        const { id, formId } = await FormFieldIdInputSchema.parseAsync(payload);
        const [field] = await db
            .delete(formFieldsTable)
            .where(
                and(
                    eq(formFieldsTable.id, id),
                    eq(formFieldsTable.createdBy, formId),
                ),
            )
            .returning({ id: formFieldsTable.id });

        if (!field) throw new Error(`Form field with ID ${id} does not exist`);
        return field;
    }
}

export default FormService;
