import { boolean, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formVisibilityEnum = pgEnum('form_visibility_enum', [
    'PUBLIC',
    'UNLISTED'
]);

export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar('title', { length: 55 }).notNull(),
    description: varchar('description', { length: 300 }),

    visibility: formVisibilityEnum('visibility').default('UNLISTED').notNull(),
    isPublished: boolean('is_published').default(true).notNull(),

    closesAt: timestamp("closes_at"),
    responseLimit: integer("response_limit"),

    slug: varchar("slug", { length: 60 }).unique(),

    passwordHash: varchar("password_hash", { length: 255 }),
    passwordSalt: varchar("password_salt", { length: 64 }),

    isArchived: boolean('is_archived').default(false).notNull(),
    
    createdBy: uuid('created_by').references(() => usersTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})  
