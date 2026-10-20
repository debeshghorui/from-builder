import { and, db, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";

import {
    CreateFieldInputSchema,
    DeleteFieldInputSchema,
    GetFieldsByFormIdInputSchema,
    UpdateFieldInputSchema,
} from "./model";
import type {
    CreateFieldInputType,
    DeleteFieldInputType,
    GetFieldsByFormIdInputType,
    UpdateFieldInputType,
} from "./model";

function createLabelKey(label: string) {
    return (
        label
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 55) || "field"
    );
}

class FormFieldsService {
    public async getFieldsByFormId(payload: GetFieldsByFormIdInputType) {
        const { formId } =
            await GetFieldsByFormIdInputSchema.parseAsync(payload);

        return db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.createdBy, formId))
            .orderBy(formFieldsTable.index);
    }

    public async createField(payload: CreateFieldInputType) {
        const { formId, label, index, ...input } =
            await CreateFieldInputSchema.parseAsync(payload);
        const [field] = await db
            .insert(formFieldsTable)
            .values({
                ...input,
                label,
                labelKey: createLabelKey(label),
                createdBy: formId,
                index: index.toFixed(2),
            })
            .returning();

        if (!field) throw new Error("Failed to create form field");
        return field;
    }

    public async updateField(payload: UpdateFieldInputType) {
        const { id, formId, index, ...input } =
            await UpdateFieldInputSchema.parseAsync(payload);
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

    public async deleteField(payload: DeleteFieldInputType) {
        const { id, formId } = await DeleteFieldInputSchema.parseAsync(payload);
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

export default FormFieldsService;
