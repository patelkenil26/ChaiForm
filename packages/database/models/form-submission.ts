import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    text,
    numeric,
    pgEnum,
    unique,
    json,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export interface FormSubmissionValue {
    formFieldId: string
    value: string
}

export type FormSubmissionValueRow = FormSubmissionValue[]

export const formSubmissionTable = pgTable("form_submissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid('form_id').references(() => formsTable.id),

    values: json('values').$type<FormSubmissionValueRow>(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})
