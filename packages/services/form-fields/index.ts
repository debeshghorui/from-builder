import { and, db, desc, eq } from "@repo/database";
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
    private async getNextIndex(formId: string): Promise<string> {
        const [lastField] = await db
            .select({ index: formFieldsTable.index })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.createdBy, formId))
            .orderBy(desc(formFieldsTable.index))
            .limit(1);

        const lastIndex = lastField ? Number(lastField.index) : 0;
        const nextIndex = Number((lastIndex + 0.01).toFixed(2));

        if (nextIndex > 1)
            throw new Error(
                "No field positions remain; reorder the fields first",
            );

        return nextIndex.toFixed(2);
    }

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
        const { formId, label, ...input } =
            await CreateFieldInputSchema.parseAsync(payload);

        const index = await this.getNextIndex(formId);
        const [createdField] = await db
            .insert(formFieldsTable)
            .values({
                ...input,
                label,
                labelKey: createLabelKey(label),
                createdBy: formId,
                index,
            })
            .returning({ id: formFieldsTable.id });

        if (!createdField) throw new Error("Failed to create form field");
        return { id: createdField.id };
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
