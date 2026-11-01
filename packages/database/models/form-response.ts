import {
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const formResponsesTable = pgTable("form_responses", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
        .notNull()
        .references(() => formsTable.id, { onDelete: "cascade" }),
    respondentEmail: varchar("respondent_email", { length: 255 }),
    answers: jsonb("answers").notNull(),
    flowVersion: text("flow_version").notNull(),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export type SelectFormResponse = typeof formResponsesTable.$inferSelect;
export type InsertFormResponse = typeof formResponsesTable.$inferInsert;
