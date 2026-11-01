import { and, db, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formsTable } from "@repo/database/models/form";

import {
    CreateFieldInputSchema,
    DeleteFieldInputSchema,
    GetFieldsByFormIdInputSchema,
    ReorderFieldsInputSchema,
    UpdateFieldInputSchema,
} from "./model";
import type {
    CreateFieldInputType,
    DeleteFieldInputType,
    GetFieldsByFormIdInputType,
    ReorderFieldsInputType,
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

    public async reorderFields(payload: ReorderFieldsInputType) {
        const { formId, fieldIds } =
            await ReorderFieldsInputSchema.parseAsync(payload);

        return db.transaction(async (tx) => {
            await tx
                .select({ id: formsTable.id })
                .from(formsTable)
                .where(eq(formsTable.id, formId))
                .for("update");

            const currentFields = await tx
                .select({ id: formFieldsTable.id })
                .from(formFieldsTable)
                .where(eq(formFieldsTable.createdBy, formId));
            const currentIds = new Set(currentFields.map(({ id }) => id));

            if (
                currentIds.size !== fieldIds.length ||
                fieldIds.some((id) => !currentIds.has(id))
            ) {
                throw new Error(
                    "The submitted field list does not match this form",
                );
            }

            for (const [position, id] of fieldIds.entries()) {
                await tx
                    .update(formFieldsTable)
                    .set({ index: (position / 100).toFixed(2) })
                    .where(
                        and(
                            eq(formFieldsTable.id, id),
                            eq(formFieldsTable.createdBy, formId),
                        ),
                    );
            }

            return { fieldIds };
        });
    }

    public async createField(payload: CreateFieldInputType) {
        const { formId, position, label, ...input } =
            await CreateFieldInputSchema.parseAsync(payload);

        return db.transaction(async (tx) => {
            await tx
                .select({ id: formsTable.id })
                .from(formsTable)
                .where(eq(formsTable.id, formId))
                .for("update");

            const existingFields = await tx
                .select({ id: formFieldsTable.id })
                .from(formFieldsTable)
                .where(eq(formFieldsTable.createdBy, formId))
                .orderBy(formFieldsTable.index);

            if (existingFields.length >= 100)
                throw new Error("A form can contain at most 100 fields");

            const insertionPosition = position ?? existingFields.length;
            if (insertionPosition > existingFields.length)
                throw new Error("Field position is outside the form");

            const [createdField] = await tx
                .insert(formFieldsTable)
                .values({
                    ...input,
                    label,
                    labelKey: createLabelKey(label),
                    createdBy: formId,
                    index: "0.00",
                })
                .returning({ id: formFieldsTable.id });

            if (!createdField) throw new Error("Failed to create form field");

            const fieldIds = existingFields.map(({ id }) => id);
            fieldIds.splice(insertionPosition, 0, createdField.id);
            for (const [index, id] of fieldIds.entries()) {
                await tx
                    .update(formFieldsTable)
                    .set({ index: (index / 100).toFixed(2) })
                    .where(
                        and(
                            eq(formFieldsTable.id, id),
                            eq(formFieldsTable.createdBy, formId),
                        ),
                    );
            }

            return { id: createdField.id };
        });
    }

    public async updateField(payload: UpdateFieldInputType) {
        const { id, formId, index, ...input } =
            await UpdateFieldInputSchema.parseAsync(payload);

        if (Object.keys(input).length === 0 && index === undefined)
            throw new Error(
                "At least one form field property must be provided",
            );

        const [updatedField] = await db
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
            .returning({ id: formFieldsTable.id });

        if (!updatedField)
            throw new Error(`Form field with ID ${id} does not exist`);
        return { id: updatedField.id };
    }

    public async deleteField(payload: DeleteFieldInputType) {
        const { id, formId } = await DeleteFieldInputSchema.parseAsync(payload);

        const [deletedField] = await db
            .delete(formFieldsTable)
            .where(
                and(
                    eq(formFieldsTable.id, id),
                    eq(formFieldsTable.createdBy, formId),
                ),
            )
            .returning({ id: formFieldsTable.id });

        if (!deletedField)
            throw new Error(`Form field with ID ${id} does not exist`);
        return { id: deletedField.id };
    }
}

export default FormFieldsService;
