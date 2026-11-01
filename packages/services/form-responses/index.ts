import { and, count, db, desc, eq, inArray } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formPageConnectionsTable } from "@repo/database/models/form-page-connection";
import { formPagesTable } from "@repo/database/models/form-page";
import { formResponsesTable } from "@repo/database/models/form-response";
import { formsTable } from "@repo/database/models/form";
import {
    getFlowVersion,
    validateSubmissionPath,
} from "../form-flow/validation";
import {
    getFormResponseSchema,
    listFormResponsesSchema,
    submitFormResponseSchema,
} from "./model";
import type {
    GetFormResponseInput,
    ListFormResponsesInput,
    SubmitFormResponseInput,
} from "./model";

function normalizeEmail(email: string) {
    return email.trim().toLocaleLowerCase("en-US");
}

class FormResponsesService {
    public async submit(payload: SubmitFormResponseInput) {
        const input = await submitFormResponseSchema.parseAsync(payload);
        const respondentEmail = input.email
            ? normalizeEmail(input.email)
            : null;

        return db.transaction(async (tx) => {
            const [form] = await tx
                .select()
                .from(formsTable)
                .where(
                    and(
                        eq(formsTable.id, input.formId),
                        eq(formsTable.deleted, false),
                        eq(formsTable.published, true),
                    ),
                )
                .for("update");
            if (!form) throw new Error("Published form not found");
            if (!form.collectEmail && respondentEmail)
                throw new Error("This form does not collect email addresses");
            if (!form.allowAnonymous && !respondentEmail)
                throw new Error("An email address is required to submit");
            if (form.perRespondentLimit !== null && !respondentEmail)
                throw new Error(
                    "An email address is required for the per-respondent limit",
                );

            const pages = await tx
                .select()
                .from(formPagesTable)
                .where(eq(formPagesTable.formId, input.formId))
                .orderBy(formPagesTable.index);
            const connections = await tx
                .select()
                .from(formPageConnectionsTable)
                .where(eq(formPageConnectionsTable.formId, input.formId));
            const pageIds = pages.map((page) => page.id);
            const fields = pageIds.length
                ? await tx
                      .select()
                      .from(formFieldsTable)
                      .where(inArray(formFieldsTable.pageId, pageIds))
                      .orderBy(formFieldsTable.index)
                : [];
            if (
                getFlowVersion(pages, connections, fields) !== input.flowVersion
            )
                throw new Error(
                    "This form changed while you were responding. Reload it before submitting.",
                );
            validateSubmissionPath({
                pages,
                connections,
                fields,
                visitedPageIds: input.visitedPageIds,
                answers: input.answers,
            });

            const [totalCountRow] = await tx
                .select({ value: count() })
                .from(formResponsesTable)
                .where(eq(formResponsesTable.formId, input.formId));
            const totalCount = totalCountRow?.value ?? 0;
            if (
                form.responseLimit !== null &&
                totalCount >= form.responseLimit
            ) {
                throw new Error("This form has reached its response limit");
            }

            if (form.perRespondentLimit !== null && respondentEmail) {
                const [respondentCountRow] = await tx
                    .select({ value: count() })
                    .from(formResponsesTable)
                    .where(
                        and(
                            eq(formResponsesTable.formId, input.formId),
                            eq(
                                formResponsesTable.respondentEmail,
                                respondentEmail,
                            ),
                        ),
                    );
                const respondentCount = respondentCountRow?.value ?? 0;
                if (respondentCount >= form.perRespondentLimit)
                    throw new Error(
                        "You have reached the response limit for this form",
                    );
            }

            const [response] = await tx
                .insert(formResponsesTable)
                .values({
                    formId: input.formId,
                    respondentEmail,
                    answers: input.answers,
                    flowVersion: input.flowVersion,
                })
                .returning({ id: formResponsesTable.id });
            if (!response) throw new Error("Failed to save form response");
            return response;
        });
    }

    public async listForOwner(payload: ListFormResponsesInput) {
        const { formId, userId } =
            await listFormResponsesSchema.parseAsync(payload);
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

        return db
            .select({
                id: formResponsesTable.id,
                email: formResponsesTable.respondentEmail,
                submittedAt: formResponsesTable.submittedAt,
            })
            .from(formResponsesTable)
            .where(eq(formResponsesTable.formId, formId))
            .orderBy(desc(formResponsesTable.submittedAt));
    }

    public async getForOwner(payload: GetFormResponseInput) {
        const { formId, userId, responseId } =
            await getFormResponseSchema.parseAsync(payload);
        const [response] = await db
            .select({
                id: formResponsesTable.id,
                email: formResponsesTable.respondentEmail,
                answers: formResponsesTable.answers,
                submittedAt: formResponsesTable.submittedAt,
            })
            .from(formResponsesTable)
            .innerJoin(formsTable, eq(formResponsesTable.formId, formsTable.id))
            .where(
                and(
                    eq(formResponsesTable.id, responseId),
                    eq(formResponsesTable.formId, formId),
                    eq(formsTable.createdBy, userId),
                    eq(formsTable.deleted, false),
                ),
            )
            .limit(1);
        if (!response) throw new Error("Response not found");
        return response;
    }
}

export default FormResponsesService;
