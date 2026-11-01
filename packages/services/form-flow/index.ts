import { and, db, eq, inArray } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formPageConnectionsTable } from "@repo/database/models/form-page-connection";
import { formPagesTable } from "@repo/database/models/form-page";
import { formsTable } from "@repo/database/models/form";
import { getFormFlowSchema, saveFormFlowSchema } from "./model";
import type { GetFormFlowInput, SaveFormFlowInput } from "./model";

function validateUniqueValues(input: SaveFormFlowInput) {
    const pageIds = new Set(input.pages.map((page) => page.id));
    if (pageIds.size !== input.pages.length)
        throw new Error("Each page must have a unique ID");
    if (input.pages.filter((page) => page.isStart).length !== 1)
        throw new Error("A form flow must have exactly one start page");

    const connectionIds = new Set(input.connections.map(({ id }) => id));
    if (connectionIds.size !== input.connections.length)
        throw new Error("Each connection must have a unique ID");

    const defaultSources = new Set<string>();
    const conditionalDestinations = new Set<string>();
    const conditionalFields = new Map<string, string>();
    for (const connection of input.connections) {
        if (
            !pageIds.has(connection.sourcePageId) ||
            !pageIds.has(connection.targetPageId)
        ) {
            throw new Error("Connections must point to pages in this form");
        }
        if (!connection.condition) {
            if (defaultSources.has(connection.sourcePageId))
                throw new Error(
                    "A page can have only one default next-page connection",
                );
            defaultSources.add(connection.sourcePageId);
        } else {
            const priorFieldId = conditionalFields.get(connection.sourcePageId);
            if (priorFieldId && priorFieldId !== connection.condition.fieldId) {
                throw new Error(
                    "Use one routing question for each page's conditional routes",
                );
            }
            conditionalFields.set(
                connection.sourcePageId,
                connection.condition.fieldId,
            );
            const routeKey = [
                connection.sourcePageId,
                connection.condition.fieldId,
                JSON.stringify(connection.condition.value),
            ].join(":");
            if (conditionalDestinations.has(routeKey))
                throw new Error(
                    "Each answer outcome can have only one destination",
                );
            conditionalDestinations.add(routeKey);
        }
    }
}

class FormFlowService {
    public async getFlow(payload: GetFormFlowInput) {
        const { formId, userId } = await getFormFlowSchema.parseAsync(payload);
        const [form] = await db
            .select({ id: formsTable.id })
            .from(formsTable)
            .where(
                and(
                    eq(formsTable.id, formId),
                    eq(formsTable.createdBy, userId),
                    eq(formsTable.deleted, false),
                ),
            )
            .limit(1);
        if (!form) throw new Error("Form not found");

        const [pages, connections] = await Promise.all([
            db
                .select()
                .from(formPagesTable)
                .where(eq(formPagesTable.formId, formId))
                .orderBy(formPagesTable.index),
            db
                .select()
                .from(formPageConnectionsTable)
                .where(eq(formPageConnectionsTable.formId, formId)),
        ]);
        return { pages, connections };
    }

    public async saveFlow(payload: SaveFormFlowInput) {
        const input = await saveFormFlowSchema.parseAsync(payload);
        validateUniqueValues(input);

        return db.transaction(async (tx) => {
            const [form] = await tx
                .select({ id: formsTable.id })
                .from(formsTable)
                .where(
                    and(
                        eq(formsTable.id, input.formId),
                        eq(formsTable.createdBy, input.userId),
                        eq(formsTable.deleted, false),
                    ),
                )
                .for("update");
            if (!form) throw new Error("Form not found");

            const existingPages = await tx
                .select({
                    id: formPagesTable.id,
                    formId: formPagesTable.formId,
                })
                .from(formPagesTable)
                .where(eq(formPagesTable.formId, input.formId));
            const requestedIds = input.pages.map(({ id }) => id);
            const requestedRecords = requestedIds.length
                ? await tx
                      .select({
                          id: formPagesTable.id,
                          formId: formPagesTable.formId,
                      })
                      .from(formPagesTable)
                      .where(inArray(formPagesTable.id, requestedIds))
                : [];
            if (requestedRecords.some(({ formId }) => formId !== input.formId))
                throw new Error("A page belongs to another form");
            const existingPageIds = new Set(existingPages.map(({ id }) => id));
            const requestedPageIds = new Set(input.pages.map(({ id }) => id));

            const removedPageIds = existingPages
                .map(({ id }) => id)
                .filter((id) => !requestedPageIds.has(id));
            if (removedPageIds.length) {
                const fieldsInRemovedPages = await tx
                    .select({ pageId: formFieldsTable.pageId })
                    .from(formFieldsTable)
                    .where(
                        and(
                            eq(formFieldsTable.createdBy, input.formId),
                            inArray(formFieldsTable.pageId, removedPageIds),
                        ),
                    );
                if (fieldsInRemovedPages.length)
                    throw new Error(
                        "Move questions to another page before removing this page",
                    );
            }

            if (existingPageIds.size) {
                await tx
                    .update(formPagesTable)
                    .set({ isStart: false })
                    .where(eq(formPagesTable.formId, input.formId));
            }

            for (const page of input.pages) {
                await tx
                    .insert(formPagesTable)
                    .values({
                        id: page.id,
                        formId: input.formId,
                        title: page.title,
                        index: (page.index / 100).toFixed(2),
                        positionX: page.positionX,
                        positionY: page.positionY,
                        isStart: page.isStart,
                    })
                    .onConflictDoUpdate({
                        target: formPagesTable.id,
                        set: {
                            title: page.title,
                            index: (page.index / 100).toFixed(2),
                            positionX: page.positionX,
                            positionY: page.positionY,
                            isStart: page.isStart,
                        },
                    });
            }

            await tx
                .delete(formPageConnectionsTable)
                .where(eq(formPageConnectionsTable.formId, input.formId));
            if (input.connections.length) {
                const pageIds = new Set(input.pages.map(({ id }) => id));
                const conditions = input.connections
                    .map((connection) => connection.condition)
                    .filter(
                        (condition) =>
                            condition !== null && condition !== undefined,
                    );
                const fields = conditions.length
                    ? await tx
                          .select({
                              id: formFieldsTable.id,
                              pageId: formFieldsTable.pageId,
                          })
                          .from(formFieldsTable)
                          .where(eq(formFieldsTable.createdBy, input.formId))
                    : [];
                for (const connection of input.connections) {
                    if (!pageIds.has(connection.sourcePageId))
                        throw new Error("Connection source page is invalid");
                    if (connection.condition) {
                        const field = fields.find(
                            ({ id }) => id === connection.condition?.fieldId,
                        );
                        if (!field || field.pageId !== connection.sourcePageId)
                            throw new Error(
                                "Routing questions must belong to the source page",
                            );
                    }
                }
                await tx.insert(formPageConnectionsTable).values(
                    input.connections.map((connection) => ({
                        id: connection.id,
                        formId: input.formId,
                        sourcePageId: connection.sourcePageId,
                        targetPageId: connection.targetPageId,
                        condition: connection.condition ?? null,
                    })),
                );
            }

            if (removedPageIds.length) {
                await tx
                    .delete(formPagesTable)
                    .where(
                        and(
                            eq(formPagesTable.formId, input.formId),
                            inArray(formPagesTable.id, removedPageIds),
                        ),
                    );
            }
            return { pages: input.pages, connections: input.connections };
        });
    }

    public async validateForPublish(payload: GetFormFlowInput) {
        const flow = await this.getFlow(payload);
        if (flow.pages.length === 0)
            throw new Error("Add at least one page before publishing");
        if (flow.pages.filter((page) => page.isStart).length !== 1)
            throw new Error("Choose exactly one start page before publishing");

        const pageIds = new Set(flow.pages.map((page) => page.id));
        const candidate = {
            formId: payload.formId,
            userId: payload.userId,
            pages: flow.pages.map((page, index) => ({
                id: page.id,
                title: page.title,
                index,
                positionX: page.positionX,
                positionY: page.positionY,
                isStart: page.isStart,
            })),
            connections: flow.connections.map((connection) => ({
                id: connection.id,
                sourcePageId: connection.sourcePageId,
                targetPageId: connection.targetPageId,
                condition: connection.condition as {
                    fieldId: string;
                    operator: "equals";
                    value: string | number | boolean;
                } | null,
            })),
        };
        validateUniqueValues(candidate);
        if (
            flow.connections.some(
                (connection) =>
                    !pageIds.has(connection.sourcePageId) ||
                    !pageIds.has(connection.targetPageId),
            )
        ) {
            throw new Error("Remove connections that point to missing pages");
        }

        const conditionalConnections = flow.connections.filter(
            (connection) => connection.condition !== null,
        );
        if (conditionalConnections.length) {
            const fields = await db
                .select({
                    id: formFieldsTable.id,
                    pageId: formFieldsTable.pageId,
                })
                .from(formFieldsTable)
                .where(eq(formFieldsTable.createdBy, payload.formId));
            for (const connection of conditionalConnections) {
                const condition = connection.condition as {
                    fieldId: string;
                };
                const field = fields.find(({ id }) => id === condition.fieldId);
                if (!field || field.pageId !== connection.sourcePageId)
                    throw new Error(
                        "Move each routing question onto the page it routes from",
                    );
            }
        }
        return { valid: true };
    }
}

export default FormFlowService;
