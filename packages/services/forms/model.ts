import z from "zod";

export const formVisibilitySchema = z.enum(["PUBLIC", "UNLISTED"]);
export type FormVisibilityType = z.infer<typeof formVisibilitySchema>;

export const formCategorySchema = z.enum([
  "GENERAL",
  "SURVEYS",
  "FEEDBACK",
  "QUIZZES",
  "EVENTS",
  "APPLICATIONS",
]);
export type FormCategoryType = z.infer<typeof formCategorySchema>;

export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(60, "Slug cannot exceed 60 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and single hyphens (e.g. 'my-form-2026')",
  );

export const createFormInput = z.object({
  title: z.string().max(55).describe("Title of the form"),
  description: z.string().max(300).optional().describe("Description of the form"),
  category: formCategorySchema.default("GENERAL").optional().describe("Category of the form"),
  createdBy: z.string().uuid().describe("UUID of the user creating the form"),
  visibility: formVisibilitySchema.default("UNLISTED").describe("Visibility mode of the form"),
  isPublished: z.boolean().default(true).describe("Publish status of the form"),
  closesAt: z.date().nullable().optional().describe("Expiry date/time of the form"),
  responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap"),
  slug: slugSchema.nullable().optional().describe("Custom clean URL slug"),
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .max(50)
    .nullable()
    .optional()
    .describe("Optional password for protecting the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const updateFormVisibilityInput = z.object({
  formId: z.string().uuid().describe("UUID of the form"),
  userId: z.string().uuid().describe("UUID of the owner user"),
  visibility: formVisibilitySchema.optional().describe("Visibility mode of the form"),
  isPublished: z.boolean().optional().describe("Publish status of the form"),
  closesAt: z.date().nullable().optional().describe("Expiry date/time of the form"),
  responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap"),
  slug: slugSchema.nullable().optional().describe("Custom clean URL slug"),
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .max(50)
    .nullable()
    .optional()
    .describe("Password for form (null to remove, string to set, undefined to keep unchanged)"),
});

export type UpdateFormVisibilityInputType = z.infer<typeof updateFormVisibilityInput>;

export const updateFormSettingsInput = z.object({
  formId: z.string().uuid().describe("UUID of the form"),
  userId: z.string().uuid().describe("UUID of the owner user"),
  category: formCategorySchema.optional().describe("Category of the form"),
  visibility: formVisibilitySchema.optional().describe("Visibility mode of the form"),
  isPublished: z.boolean().optional().describe("Publish status of the form"),
  closesAt: z
    .date()
    .nullable()
    .optional()
    .describe("Expiry date/time of the form (null to remove)"),
  responseLimit: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional()
    .describe("Maximum response cap (null to remove)"),
  slug: slugSchema.nullable().optional().describe("Custom clean URL slug (null to remove)"),
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .max(50)
    .nullable()
    .optional()
    .describe("Password for form (null to remove, string to set, undefined to keep unchanged)"),

  // Custom submit button
  submitButtonText: z
    .string()
    .max(60)
    .nullable()
    .optional()
    .describe("Custom text on submit button"),

  // Custom Thank You page & redirect
  thankYouTitle: z
    .string()
    .max(120)
    .nullable()
    .optional()
    .describe("Custom title on Thank You screen"),
  thankYouDescription: z
    .string()
    .max(500)
    .nullable()
    .optional()
    .describe("Custom description on Thank You screen"),
  thankYouButtonText: z
    .string()
    .max(60)
    .nullable()
    .optional()
    .describe("Custom action button text on Thank You screen"),
  thankYouButtonUrl: z
    .string()
    .max(500)
    .nullable()
    .optional()
    .describe("Custom action button URL on Thank You screen"),
  autoRedirectUrl: z
    .string()
    .max(500)
    .nullable()
    .optional()
    .describe("Auto-redirect URL after form submission"),

  // Optional Welcome / Cover screen
  showWelcomeScreen: z
    .boolean()
    .optional()
    .describe("Whether to display welcome cover screen before questions"),
  welcomeTitle: z.string().max(120).nullable().optional().describe("Title on welcome screen"),
  welcomeDescription: z
    .string()
    .max(500)
    .nullable()
    .optional()
    .describe("Description on welcome screen"),
  welcomeButtonText: z
    .string()
    .max(60)
    .nullable()
    .optional()
    .describe("Text on start button of welcome screen"),
  estimatedTime: z
    .string()
    .max(30)
    .nullable()
    .optional()
    .describe("Estimated completion time badge (e.g. Takes 2 mins)"),

  // Visual Theme & Appearance
  themePreset: z.string().max(50).optional().describe("Visual theme preset ID"),
  customBgColor: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .describe("Custom background color or gradient string"),
  customTextColor: z.string().max(50).nullable().optional().describe("Custom text color"),
  customAccentColor: z
    .string()
    .max(50)
    .nullable()
    .optional()
    .describe("Custom accent/button color"),
});

export type UpdateFormSettingsInputType = z.infer<typeof updateFormSettingsInput>;

export const listFormsByUserIdInput = z.object({
  userId: z.string().uuid().describe("UUID of the user"),
});

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;

export const getFormByIdInput = z.object({
  formId: z.string().min(1).describe("UUID or custom slug of the form"),
  password: z.string().optional().describe("Optional password to unlock password-protected form"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

export const cloneFormInput = z.object({
  formId: z.string().uuid().describe("UUID of the form to clone"),
  userId: z.string().uuid().describe("UUID of the owner user"),
  allowPublicTemplate: z
    .boolean()
    .default(false)
    .optional()
    .describe("Allow cloning if form is a public template"),
});

export type CloneFormInputType = z.infer<typeof cloneFormInput>;

export const listPublicFormsFilterInput = z
  .object({
    category: z.string().optional(),
    search: z.string().optional(),
  })
  .optional();

export type ListPublicFormsFilterInputType = z.infer<typeof listPublicFormsFilterInput>;

export const archiveFormInput = z.object({
  formId: z.string().uuid().describe("UUID of the form to archive or unarchive"),
  userId: z.string().uuid().describe("UUID of the owner user"),
  isArchived: z.boolean().describe("Archive status (true to archive, false to restore)"),
});

export type ArchiveFormInputType = z.infer<typeof archiveFormInput>;

export const recordFormViewInput = z.object({
  formId: z.string().min(1).describe("UUID or custom slug of the form"),
});

export type RecordFormViewInputType = z.infer<typeof recordFormViewInput>;
