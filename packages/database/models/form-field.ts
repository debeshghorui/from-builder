import {
    pgTable,
    uuid,
    numeric,
    text,
    varchar,
    boolean,
    jsonb,
    timestamp,
    pgEnum,
    unique,
} from "drizzle-orm/pg-core";

import { formsTable } from "./form";

export const FormFieldTypeEnum = pgEnum("form_field_type", [
    "TEXT",
    "NUMBER",
    "EMAIL",
    "PHONE",
    "YES_NO",
    "PASSWORD",
]);

export const formFieldsTable = pgTable(
    "form_fields",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        label: varchar("label", { length: 55 }).notNull(),
        labelKey: varchar("label_key", { length: 55 }).notNull(),

        description: text("description"),

        placeholder: text("placeholder"),
        isRequired: boolean("is_required").default(false).notNull(),

        type: FormFieldTypeEnum("type").notNull(),
        options: jsonb("options"),

        // 0.00 to 1.00 Fractional Indexing
        index: numeric("index", { scale: 2 }).notNull(),

        createdBy: uuid("created_by").references(() => formsTable.id),

        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    },
    (table) => {
        return {
            uniqueFormIdAndIndex: unique().on(table.id, table.index),
        };
    },
);

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;
