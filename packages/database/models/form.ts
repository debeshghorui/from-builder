import {
    pgTable,
    uuid,
    integer,
    varchar,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";

export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 55 }).notNull(),
    description: varchar("description", { length: 255 }),

    createdBy: uuid("created_by").references(() => usersTable.id),

    isProtected: boolean("is_protected").default(false).notNull(),
    password: varchar("password", { length: 255 }),
    passwordSalt: varchar("password_salt", { length: 255 }),

    published: boolean("published").default(false).notNull(),
    publishedBy: uuid("published_by").references(() => usersTable.id),
    publishedAt: timestamp("published_at"),
    unpublishedAt: timestamp("unpublished_at"),

    deleted: boolean("deleted").default(false).notNull(),
    deletedBy: uuid("deleted_by").references(() => usersTable.id),
    deletedAt: timestamp("deleted_at"),

    participantLimit: integer("participant_limit"),
    participantLimitUnit: varchar("participant_limit_unit", { length: 10 }),

    totalSubmissions: integer("total_submissions"),
    unSubmittedSubmissions: integer("unsubmitted_submissions"),

    timeLimit: integer("time_limit"),
    timeLimitUnit: varchar("time_limit_unit", { length: 255 }),

    formLink: varchar("form_link", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
