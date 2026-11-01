import { and, count, db, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formPagesTable } from "@repo/database/models/form-page";
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
        const { formId, pageId, fieldIds } =
            await ReorderFieldsInputSchema.parseAsync(payload);

        return db.transaction(async (tx) => {
            await tx
                .select({ id: formsTable.id })
                .from(formsTable)
                .where(eq(formsTable.id, formId))
                .for("update");

            const conditions = [eq(formFieldsTable.createdBy, formId)];
            if (pageId) conditions.push(eq(formFieldsTable.pageId, pageId));
            const currentFields = await tx
                .select({ id: formFieldsTable.id })
                .from(formFieldsTable)
                .where(and(...conditions));
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
                            ...(pageId
                                ? [eq(formFieldsTable.pageId, pageId)]
                                : []),
                        ),
                    );
            }

            return { fieldIds };
        });
    }

    public async createField(payload: CreateFieldInputType) {
        const {
            formId,
            pageId: requestedPageId,
            position,
            label,
            ...input
        } = await CreateFieldInputSchema.parseAsync(payload);

        return db.transaction(async (tx) => {
            await tx
                .select({ id: formsTable.id })
                .from(formsTable)
                .where(eq(formsTable.id, formId))
                .for("update");

            let pageId = requestedPageId;
            if (pageId) {
                const [page] = await tx
                    .select({ id: formPagesTable.id })
                    .from(formPagesTable)
                    .where(
                        and(
                            eq(formPagesTable.id, pageId),
                            eq(formPagesTable.formId, formId),
                        ),
                    )
                    .limit(1);
                if (!page) throw new Error("Page not found in this form");
            } else {
                const [existingPage] = await tx
                    .select({ id: formPagesTable.id })
                    .from(formPagesTable)
                    .where(eq(formPagesTable.formId, formId))
                    .orderBy(formPagesTable.index)
                    .limit(1);
                pageId = existingPage?.id;
                if (!pageId) {
                    const [createdPage] = await tx
                        .insert(formPagesTable)
                        .values({
                            formId,
                            title: "Page 1",
                            index: "0.00",
                            isStart: true,
                        })
                        .returning({ id: formPagesTable.id });
                    if (!createdPage)
                        throw new Error("Failed to create the first form page");
                    pageId = createdPage.id;
                }
            }

            const existingFields = await tx
                .select({ id: formFieldsTable.id })
                .from(formFieldsTable)
                .where(
                    and(
                        eq(formFieldsTable.createdBy, formId),
                        eq(formFieldsTable.pageId, pageId),
                    ),
                )
                .orderBy(formFieldsTable.index);

            const [totalRow] = await tx
                .select({ value: count() })
                .from(formFieldsTable)
                .where(eq(formFieldsTable.createdBy, formId));
            const totalFields = totalRow?.value ?? 0;
            if (totalFields >= 100)
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
                    pageId,
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
                            eq(formFieldsTable.pageId, pageId),
                        ),
                    );
            }

            return { id: createdField.id };
        });
    }

    public async updateField(payload: UpdateFieldInputType) {
        const { id, formId, pageId, index, ...input } =
            await UpdateFieldInputSchema.parseAsync(payload);

        if (
            Object.keys(input).length === 0 &&
            pageId === undefined &&
            index === undefined
        )
            throw new Error(
                "At least one form field property must be provided",
            );

        let updatedIndex = index;
        if (pageId) {
            const [page] = await db
                .select({ id: formPagesTable.id })
                .from(formPagesTable)
                .where(
                    and(
                        eq(formPagesTable.id, pageId),
                        eq(formPagesTable.formId, formId),
                    ),
                )
                .limit(1);
            if (!page) throw new Error("Page not found in this form");

            const [currentField] = await db
                .select({ pageId: formFieldsTable.pageId })
                .from(formFieldsTable)
                .where(
                    and(
                        eq(formFieldsTable.id, id),
                        eq(formFieldsTable.createdBy, formId),
                    ),
                )
                .limit(1);
            if (!currentField)
                throw new Error(`Form field with ID ${id} does not exist`);
            if (currentField.pageId !== pageId && updatedIndex === undefined) {
                const [pageCountRow] = await db
                    .select({ value: count() })
                    .from(formFieldsTable)
                    .where(
                        and(
                            eq(formFieldsTable.createdBy, formId),
                            eq(formFieldsTable.pageId, pageId),
                        ),
                    );
                const pageFieldCount = pageCountRow?.value ?? 0;
                updatedIndex = pageFieldCount / 100;
            }
        }

        const [updatedField] = await db
            .update(formFieldsTable)
            .set({
                ...input,
                ...(pageId === undefined ? {} : { pageId }),
                ...(updatedIndex === undefined
                    ? {}
                    : { index: updatedIndex.toFixed(2) }),
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
