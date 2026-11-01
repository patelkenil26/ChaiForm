import { boolean, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formVisibilityEnum = pgEnum("form_visibility_enum", ["PUBLIC", "UNLISTED"]);

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 55 }).notNull(),
  description: varchar("description", { length: 300 }),

  visibility: formVisibilityEnum("visibility").default("UNLISTED").notNull(),
  isPublished: boolean("is_published").default(true).notNull(),

  closesAt: timestamp("closes_at"),
  responseLimit: integer("response_limit"),
  category: varchar("category", { length: 50 }).default("GENERAL").notNull(),

  slug: varchar("slug", { length: 60 }).unique(),

  passwordHash: varchar("password_hash", { length: 255 }),
  passwordSalt: varchar("password_salt", { length: 64 }),

  // Custom Submit Button Text
  submitButtonText: varchar("submit_button_text", { length: 60 }).default("Submit"),

  // Customizable Thank You / Completion Page
  thankYouTitle: varchar("thank_you_title", { length: 120 }),
  thankYouDescription: varchar("thank_you_description", { length: 500 }),
  thankYouButtonText: varchar("thank_you_button_text", { length: 60 }),
  thankYouButtonUrl: varchar("thank_you_button_url", { length: 500 }),
  autoRedirectUrl: varchar("auto_redirect_url", { length: 500 }),

  // Optional Welcome / Cover Screen
  showWelcomeScreen: boolean("show_welcome_screen").default(false).notNull(),
  welcomeTitle: varchar("welcome_title", { length: 120 }),
  welcomeDescription: varchar("welcome_description", { length: 500 }),
  welcomeButtonText: varchar("welcome_button_text", { length: 60 }).default("Start Form"),
  estimatedTime: varchar("estimated_time", { length: 30 }),

  // Visual Theme & Appearance
  themePreset: varchar("theme_preset", { length: 50 }).default("citron-neon"),
  customBgColor: varchar("custom_bg_color", { length: 255 }),
  customTextColor: varchar("custom_text_color", { length: 50 }),
  customAccentColor: varchar("custom_accent_color", { length: 50 }),

  isArchived: boolean("is_archived").default(false).notNull(),
  views: integer("views").default(0).notNull(),

  createdBy: uuid("created_by").references(() => usersTable.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
