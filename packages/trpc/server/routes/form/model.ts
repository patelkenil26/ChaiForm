import { z } from "zod";
import { formFieldObject } from "../form-field/model";

export const formVisibilityEnum = z.enum(["PUBLIC", "UNLISTED"]);
export const formCategoryEnum = z.enum([
    "GENERAL",
    "SURVEYS",
    "FEEDBACK",
    "QUIZZES",
    "EVENTS",
    "APPLICATIONS"
]);

export const slugModel = z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(60, "Slug cannot exceed 60 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens");

export const createFormInputModel = z.object({
    title: z.string().max(55).describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
    category: formCategoryEnum.default("GENERAL").optional().describe("Category of the form"),
    visibility: formVisibilityEnum.default("UNLISTED").describe("Visibility mode of the form"),
    isPublished: z.boolean().default(true).describe("Publish status of the form"),
    closesAt: z.coerce.date().nullable().optional().describe("Expiry date/time of the form"),
    responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap"),
    slug: slugModel.nullable().optional().describe("Custom clean URL slug"),
    password: z.string().min(1).max(50).nullable().optional().describe("Optional password for protecting the form"),
});

export const createFormOutputModel = z.object({
    id: z.string().describe("ID of the created form"),
});

export const listFormsOutputModel = z.array(
    z.object({
        id: z.string().describe("ID of the form"),
        title: z.string().describe("Title of the form"),
        description: z.string().nullable().optional().describe("Description of the form"),
        category: z.string().default("GENERAL").describe("Category of the form"),
        visibility: formVisibilityEnum.describe("Visibility mode of the form"),
        isPublished: z.boolean().describe("Publish status of the form"),
        isArchived: z.boolean().default(false).describe("Whether form is archived"),
        closesAt: z.date().nullable().optional().describe("Expiry timestamp"),
        responseLimit: z.number().nullable().optional().describe("Max response cap"),
        slug: z.string().nullable().optional().describe("Custom URL slug"),
        isPasswordProtected: z.boolean().default(false).describe("Whether form is password protected"),
        views: z.number().default(0).describe("Total impressions/views"),
        createdAt: z.date().nullable().describe("Creation timestamp"),
        updatedAt: z.date().nullable().describe("Last updated timestamp"),
    })
);

export const getFormInputModel = z.object({
    formId: z.string().min(1).describe("UUID or slug of the form"),
    password: z.string().optional().describe("Optional password to unlock protected form"),
});

export const getFormOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    category: z.string().default("GENERAL"),
    visibility: formVisibilityEnum,
    isPublished: z.boolean(),
    isArchived: z.boolean().default(false),
    closesAt: z.date().nullable().optional(),
    responseLimit: z.number().nullable().optional(),
    slug: z.string().nullable().optional(),
    isPasswordProtected: z.boolean().default(false),
    isUnlocked: z.boolean().default(true),
    submissionCount: z.number().default(0),
    views: z.number().default(0),
    isOpen: z.boolean().default(true),
    isExpired: z.boolean().default(false),
    isLimitReached: z.boolean().default(false),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    fields: z.array(formFieldObject),
}).nullable();

export const cloneFormInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form to clone"),
});

export const cloneFormOutputModel = z.object({
    id: z.string().describe("ID of the newly cloned form"),
});

export const archiveFormInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form to archive or unarchive"),
    isArchived: z.boolean().describe("Archive status: true to archive, false to restore"),
});

export const archiveFormOutputModel = z.object({
    id: z.string(),
    isArchived: z.boolean(),
});

export const updateFormVisibilityInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
    visibility: formVisibilityEnum.optional().describe("Visibility mode of the form: PUBLIC or UNLISTED"),
    isPublished: z.boolean().optional().describe("Publish status of the form"),
    closesAt: z.coerce.date().nullable().optional().describe("Expiry date/time of the form"),
    responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap"),
    slug: slugModel.nullable().optional().describe("Custom clean URL slug"),
    password: z.string().min(1).max(50).nullable().optional().describe("Password for form (null to remove, undefined to keep unchanged)"),
});

export const updateFormVisibilityOutputModel = z.object({
    id: z.string(),
    visibility: formVisibilityEnum,
    isPublished: z.boolean(),
    closesAt: z.date().nullable().optional(),
    responseLimit: z.number().nullable().optional(),
    slug: z.string().nullable().optional(),
});

export const updateFormSettingsInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
    category: formCategoryEnum.optional().describe("Category of the form"),
    visibility: formVisibilityEnum.optional().describe("Visibility mode of the form: PUBLIC or UNLISTED"),
    isPublished: z.boolean().optional().describe("Publish status of the form"),
    closesAt: z.coerce.date().nullable().optional().describe("Expiry date/time of the form (null to remove)"),
    responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap (null to remove)"),
    slug: slugModel.nullable().optional().describe("Custom clean URL slug (null to remove)"),
    password: z.string().min(1).max(50).nullable().optional().describe("Password to protect form (null to remove, undefined to keep unchanged)"),
});

export const updateFormSettingsOutputModel = z.object({
    id: z.string(),
    visibility: formVisibilityEnum,
    isPublished: z.boolean(),
    closesAt: z.date().nullable().optional(),
    responseLimit: z.number().nullable().optional(),
    slug: z.string().nullable().optional(),
    isPasswordProtected: z.boolean().default(false),
});

export const listPublicFormsInputModel = z.object({
    category: z.string().optional().describe("Filter by category"),
    search: z.string().optional().describe("Search in title or description"),
}).optional();

export const listPublicFormsOutputModel = z.array(
    z.object({
        id: z.string().describe("ID of the form"),
        title: z.string().describe("Title of the form"),
        description: z.string().nullable().optional().describe("Description of the form"),
        slug: z.string().nullable().optional().describe("Custom URL slug"),
        category: z.string().default("GENERAL").describe("Category of the form"),
        views: z.number().default(0).describe("Total views/impressions"),
        fieldsCount: z.number().default(0).describe("Number of fields/questions in the form"),
        createdAt: z.date().nullable().describe("Creation timestamp"),
        updatedAt: z.date().nullable().describe("Last updated timestamp"),
    })
);

export const useTemplateInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the public template form to clone"),
});

export const useTemplateOutputModel = z.object({
    id: z.string().describe("ID of the newly cloned form"),
});

export const recordViewInputModel = z.object({
    formId: z.string().min(1).describe("UUID or slug of the form"),
});

export const recordViewOutputModel = z.object({
    success: z.boolean(),
    views: z.number(),
});

// Re-export for seamless backward compatibility
export * from "../form-field/model";
export * from "../form-submission/model";

