import * as jwt from "jsonwebtoken";
import { timingSafeEqual } from "node:crypto";
import { and, db, eq, inArray } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formPageConnectionsTable } from "@repo/database/models/form-page-connection";
import { formPagesTable } from "@repo/database/models/form-page";
import { getFlowVersion } from "../form-flow/validation";
import { env } from "../env";
import {
    publicFormInputSchema,
    getPublishedFlowInputSchema,
    verifyFormPasswordInputSchema,
} from "./model";
import type {
    GetPublishedFlowInput,
    PublicFormInput,
    VerifyFormPasswordInput,
} from "./model";

const accessTokenLifetime = "30m";

function passwordsMatch(expected: string, provided: string) {
    const expectedBytes = Buffer.from(expected);
    const providedBytes = Buffer.from(provided);
    if (expectedBytes.length !== providedBytes.length) return false;
    return timingSafeEqual(expectedBytes, providedBytes);
}

class FormAccessService {
    public async getPublishedForm(payload: PublicFormInput) {
        const { formId } = await publicFormInputSchema.parseAsync(payload);
        const [form] = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                isProtected: formsTable.isProtected,
                collectEmail: formsTable.collectEmail,
                allowAnonymous: formsTable.allowAnonymous,
                responseLimit: formsTable.responseLimit,
            })
            .from(formsTable)
            .where(
                and(
                    eq(formsTable.id, formId),
                    eq(formsTable.published, true),
                    eq(formsTable.deleted, false),
                ),
            )
            .limit(1);
        if (!form) throw new Error("Published form not found");
        return {
            ...form,
            passwordRequired: form.isProtected,
        };
    }

    public async verifyPassword(payload: VerifyFormPasswordInput) {
        const { formId, password } =
            await verifyFormPasswordInputSchema.parseAsync(payload);
        const [form] = await db
            .select({
                id: formsTable.id,
                isProtected: formsTable.isProtected,
                password: formsTable.password,
                published: formsTable.published,
                deleted: formsTable.deleted,
            })
            .from(formsTable)
            .where(eq(formsTable.id, formId))
            .limit(1);
        if (!form || !form.published || form.deleted)
            throw new Error("Published form not found");
        if (!form.isProtected || !form.password)
            throw new Error("This form does not require a password");
        if (!passwordsMatch(form.password, password))
            throw new Error("The password is incorrect");

        const accessToken = jwt.sign(
            { formId, purpose: "published-form-access" },
            env.JWT_SECRET,
            { expiresIn: accessTokenLifetime },
        );
        return { accessToken };
    }

    public verifyAccessToken(formId: string, accessToken: string) {
        const payload = jwt.verify(accessToken, env.JWT_SECRET);
        if (
            typeof payload === "string" ||
            payload.formId !== formId ||
            payload.purpose !== "published-form-access"
        ) {
            throw new Error(
                "Form access has expired. Enter the password again.",
            );
        }
        return true;
    }

    public async getPublishedFlow(payload: GetPublishedFlowInput) {
        const { formId, accessToken } =
            await getPublishedFlowInputSchema.parseAsync(payload);
        const [form] = await db
            .select({
                id: formsTable.id,
                isProtected: formsTable.isProtected,
                published: formsTable.published,
                deleted: formsTable.deleted,
            })
            .from(formsTable)
            .where(eq(formsTable.id, formId))
            .limit(1);
        if (!form || !form.published || form.deleted)
            throw new Error("Published form not found");
        if (form.isProtected) {
            if (!accessToken)
                throw new Error(
                    "Enter the form password to view its questions",
                );
            this.verifyAccessToken(formId, accessToken);
        }

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
        const pageIds = pages.map((page) => page.id);
        const fields = pageIds.length
            ? await db
                  .select()
                  .from(formFieldsTable)
                  .where(inArray(formFieldsTable.pageId, pageIds))
                  .orderBy(formFieldsTable.index)
            : [];
        return {
            startPageId: pages.find((page) => page.isStart)?.id ?? null,
            flowVersion: getFlowVersion(pages, connections, fields),
            pages: pages.map((page) => ({
                id: page.id,
                title: page.title,
                fields: fields
                    .filter((field) => field.pageId === page.id)
                    .map((field) => ({
                        id: field.id,
                        label: field.label,
                        description: field.description,
                        placeholder: field.placeholder,
                        isRequired: field.isRequired,
                        type: field.type,
                        options: field.options,
                    })),
            })),
            connections: connections.map((connection) => ({
                id: connection.id,
                sourcePageId: connection.sourcePageId,
                targetPageId: connection.targetPageId,
                condition: connection.condition,
            })),
        };
    }
}

export default FormAccessService;
