import z from "zod";

export const formVisibilitySchema = z.enum(['PUBLIC', 'UNLISTED']);
export type FormVisibilityType = z.infer<typeof formVisibilitySchema>;

export const createFormInput = z.object({
    title: z.string().max(55).describe("Title of the form"),
    description: z.string().max(300).optional().describe("Description of the form"),
    createdBy: z.string().uuid().describe('UUID of the user creating the form'),
    visibility: formVisibilitySchema.default('UNLISTED').describe("Visibility mode of the form"),
    isPublished: z.boolean().default(true).describe("Publish status of the form"),
})

export type CreateFormInputType = z.infer<typeof createFormInput>

export const updateFormVisibilityInput = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
    userId: z.string().uuid().describe('UUID of the owner user'),
    visibility: formVisibilitySchema.optional().describe('Visibility mode of the form'),
    isPublished: z.boolean().optional().describe('Publish status of the form'),
})

export type UpdateFormVisibilityInputType = z.infer<typeof updateFormVisibilityInput>

export const listFormsByUserIdInput = z.object({
    userId: z.string().uuid().describe('UUID of the user'),
})

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>

export const getFormByIdInput = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
})

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>

