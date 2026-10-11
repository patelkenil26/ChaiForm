import { z } from "zod";
import { formFieldObject } from "../form-field/model";

export const formVisibilityEnum = z.enum(["PUBLIC", "UNLISTED"]);

export const createFormInputModel = z.object({
    title: z.string().max(55).describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
    visibility: formVisibilityEnum.default("UNLISTED").describe("Visibility mode of the form"),
    isPublished: z.boolean().default(true).describe("Publish status of the form"),
    closesAt: z.coerce.date().nullable().optional().describe("Expiry date/time of the form"),
    responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap"),
});

export const createFormOutputModel = z.object({
    id: z.string().describe("ID of the created form"),
});

export const listFormsOutputModel = z.array(
    z.object({
        id: z.string().describe("ID of the form"),
        title: z.string().describe("Title of the form"),
        description: z.string().nullable().optional().describe("Description of the form"),
        visibility: formVisibilityEnum.describe("Visibility mode of the form"),
        isPublished: z.boolean().describe("Publish status of the form"),
        closesAt: z.date().nullable().optional().describe("Expiry timestamp"),
        responseLimit: z.number().nullable().optional().describe("Max response cap"),
        createdAt: z.date().nullable().describe("Creation timestamp"),
        updatedAt: z.date().nullable().describe("Last updated timestamp"),
    })
);

export const getFormInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
});

export const getFormOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    visibility: formVisibilityEnum,
    isPublished: z.boolean(),
    closesAt: z.date().nullable().optional(),
    responseLimit: z.number().nullable().optional(),
    submissionCount: z.number().default(0),
    isOpen: z.boolean().default(true),
    isExpired: z.boolean().default(false),
    isLimitReached: z.boolean().default(false),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    fields: z.array(formFieldObject),
}).nullable();

export const updateFormVisibilityInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
    visibility: formVisibilityEnum.optional().describe("Visibility mode of the form: PUBLIC or UNLISTED"),
    isPublished: z.boolean().optional().describe("Publish status of the form"),
    closesAt: z.coerce.date().nullable().optional().describe("Expiry date/time of the form"),
    responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap"),
});

export const updateFormVisibilityOutputModel = z.object({
    id: z.string(),
    visibility: formVisibilityEnum,
    isPublished: z.boolean(),
    closesAt: z.date().nullable().optional(),
    responseLimit: z.number().nullable().optional(),
});

export const updateFormSettingsInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
    visibility: formVisibilityEnum.optional().describe("Visibility mode of the form: PUBLIC or UNLISTED"),
    isPublished: z.boolean().optional().describe("Publish status of the form"),
    closesAt: z.coerce.date().nullable().optional().describe("Expiry date/time of the form (null to remove)"),
    responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap (null to remove)"),
});

export const updateFormSettingsOutputModel = z.object({
    id: z.string(),
    visibility: formVisibilityEnum,
    isPublished: z.boolean(),
    closesAt: z.date().nullable().optional(),
    responseLimit: z.number().nullable().optional(),
});

export const listPublicFormsOutputModel = z.array(
    z.object({
        id: z.string().describe("ID of the form"),
        title: z.string().describe("Title of the form"),
        description: z.string().nullable().optional().describe("Description of the form"),
        createdAt: z.date().nullable().describe("Creation timestamp"),
        updatedAt: z.date().nullable().describe("Last updated timestamp"),
    })
);

// Re-export for seamless backward compatibility
export * from "../form-field/model";
export * from "../form-submission/model";
