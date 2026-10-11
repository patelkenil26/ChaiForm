import z from "zod";

export const formVisibilitySchema = z.enum(['PUBLIC', 'UNLISTED']);
export type FormVisibilityType = z.infer<typeof formVisibilitySchema>;

export const slugSchema = z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(60, "Slug cannot exceed 60 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and single hyphens (e.g. 'my-form-2026')");

export const createFormInput = z.object({
    title: z.string().max(55).describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
    createdBy: z.string().uuid().describe('UUID of the user creating the form'),
    visibility: formVisibilitySchema.default('UNLISTED').describe("Visibility mode of the form"),
    isPublished: z.boolean().default(true).describe("Publish status of the form"),
    closesAt: z.date().nullable().optional().describe("Expiry date/time of the form"),
    responseLimit: z.number().int().positive().nullable().optional().describe("Maximum response cap"),
    slug: slugSchema.nullable().optional().describe("Custom clean URL slug"),
    password: z.string().min(1, "Password cannot be empty").max(50).nullable().optional().describe("Optional password for protecting the form"),
})

export type CreateFormInputType = z.infer<typeof createFormInput>

export const updateFormVisibilityInput = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
    userId: z.string().uuid().describe('UUID of the owner user'),
    visibility: formVisibilitySchema.optional().describe('Visibility mode of the form'),
    isPublished: z.boolean().optional().describe('Publish status of the form'),
    closesAt: z.date().nullable().optional().describe('Expiry date/time of the form'),
    responseLimit: z.number().int().positive().nullable().optional().describe('Maximum response cap'),
    slug: slugSchema.nullable().optional().describe("Custom clean URL slug"),
    password: z.string().min(1, "Password cannot be empty").max(50).nullable().optional().describe("Password for form (null to remove, string to set, undefined to keep unchanged)"),
})

export type UpdateFormVisibilityInputType = z.infer<typeof updateFormVisibilityInput>

export const updateFormSettingsInput = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
    userId: z.string().uuid().describe('UUID of the owner user'),
    visibility: formVisibilitySchema.optional().describe('Visibility mode of the form'),
    isPublished: z.boolean().optional().describe('Publish status of the form'),
    closesAt: z.date().nullable().optional().describe('Expiry date/time of the form (null to remove)'),
    responseLimit: z.number().int().positive().nullable().optional().describe('Maximum response cap (null to remove)'),
    slug: slugSchema.nullable().optional().describe('Custom clean URL slug (null to remove)'),
    password: z.string().min(1, "Password cannot be empty").max(50).nullable().optional().describe('Password for form (null to remove, string to set, undefined to keep unchanged)'),
})

export type UpdateFormSettingsInputType = z.infer<typeof updateFormSettingsInput>

export const listFormsByUserIdInput = z.object({
    userId: z.string().uuid().describe('UUID of the user'),
})

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>

export const getFormByIdInput = z.object({
    formId: z.string().min(1).describe('UUID or custom slug of the form'),
    password: z.string().optional().describe('Optional password to unlock password-protected form'),
})

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>

