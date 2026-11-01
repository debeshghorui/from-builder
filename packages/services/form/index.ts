import { and, db, desc, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";

import {
    CreateFormInputSchema,
    FormIdInputSchema,
    FormOwnerInputSchema,
    UpdateFormInputSchema,
    UserIdInputSchema,
    validateResponseSettings,
} from "./model";
import type {
    CreateFormInputType,
    FormIdInputType,
    FormOwnerInputType,
    UpdateFormInputType,
    UserIdInputType,
} from "./model";

class FormService {
    public async createForm(payload: CreateFormInputType) {
        const { createdBy, ...input } =
            await CreateFormInputSchema.parseAsync(payload);
        if (input.isProtected && !input.password)
            throw new Error("Set a password before enabling form protection");
        validateResponseSettings({
            collectEmail: input.collectEmail ?? true,
            allowAnonymous: input.allowAnonymous ?? false,
            perRespondentLimit: input.perRespondentLimit ?? null,
        });
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

        const currentForm = await this.getFormById({ id });
        if (currentForm.createdBy !== userId)
            throw new Error(`Form with ID ${id} does not exist`);
        validateResponseSettings({
            collectEmail: input.collectEmail ?? currentForm.collectEmail,
            allowAnonymous: input.allowAnonymous ?? currentForm.allowAnonymous,
            perRespondentLimit:
                input.perRespondentLimit === undefined
                    ? currentForm.perRespondentLimit
                    : input.perRespondentLimit,
        });
        if (
            (input.isProtected ?? currentForm.isProtected) &&
            (input.password === undefined
                ? !currentForm.password
                : !input.password)
        ) {
            throw new Error("Set a password before enabling form protection");
        }
        const formUpdate = {
            ...input,
            ...(!input.isProtected && input.password === undefined
                ? { password: null, passwordSalt: null }
                : input.password !== undefined
                  ? { passwordSalt: null }
                  : {}),
        };

        const [form] = await db
            .update(formsTable)
            .set(formUpdate)
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
}

export default FormService;
