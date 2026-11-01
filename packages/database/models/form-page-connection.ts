import {
    jsonb,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { formsTable } from "./form";
import { formPagesTable } from "./form-page";

export const formPageConnectionsTable = pgTable(
    "form_page_connections",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        formId: uuid("form_id")
            .notNull()
            .references(() => formsTable.id, { onDelete: "cascade" }),
        sourcePageId: uuid("source_page_id")
            .notNull()
            .references(() => formPagesTable.id, { onDelete: "cascade" }),
        targetPageId: uuid("target_page_id")
            .notNull()
            .references(() => formPagesTable.id, { onDelete: "cascade" }),
        condition: jsonb("condition"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    },
    (table) => ({
        oneDefaultDestinationPerPage: uniqueIndex(
            "form_page_connections_one_default_per_source",
        )
            .on(table.formId, table.sourcePageId)
            .where(sql`${table.condition} IS NULL`),
    }),
);

export type SelectFormPageConnection =
    typeof formPageConnectionsTable.$inferSelect;
export type InsertFormPageConnection =
    typeof formPageConnectionsTable.$inferInsert;
