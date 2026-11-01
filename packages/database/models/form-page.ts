import {
    boolean,
    integer,
    numeric,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { formsTable } from "./form";

export const formPagesTable = pgTable(
    "form_pages",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        formId: uuid("form_id")
            .notNull()
            .references(() => formsTable.id, { onDelete: "cascade" }),
        title: varchar("title", { length: 100 }).notNull(),
        index: numeric("index", { scale: 2 }).notNull(),
        positionX: integer("position_x").default(0).notNull(),
        positionY: integer("position_y").default(0).notNull(),
        isStart: boolean("is_start").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    },
    (table) => ({
        oneStartPagePerForm: uniqueIndex("form_pages_one_start_per_form")
            .on(table.formId)
            .where(sql`${table.isStart} = true`),
    }),
);

export type SelectFormPage = typeof formPagesTable.$inferSelect;
export type InsertFormPage = typeof formPagesTable.$inferInsert;
