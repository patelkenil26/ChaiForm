import { z } from 'zod'

export const fieldTypeEnum = z.enum([
    'TEXT',
    'TEXTAREA',
    'NUMBER',
    'EMAIL',
    'PHONE',
    'URL',
    'DATE',
    'TIME',
    'YES_NO',
    'PASSWORD',
    'SELECT',
    'RADIO',
    'CHECKBOX',
    'RATING',
])

export type FieldType = z.infer<typeof fieldTypeEnum>

export const createFieldInput = z.object({
    label: z.string().max(100).describe('Display label for the field'),
    type: fieldTypeEnum.describe('Type of the field'),
    formId: z.string().uuid().describe('UUID of the form this field belongs to'),
    description: z.string().optional().describe('Helper text shown below the field'),
    placeholder: z.string().optional().describe('Placeholder text for the field'),
    isRequired: z.boolean().optional().default(false).describe('Whether the field is required'),
    options: z.array(z.string()).optional().describe('Options list for choice fields (SELECT, RADIO, CHECKBOX)'),
})

export type CreateFieldInputType = z.infer<typeof createFieldInput>

export const updateFieldInput = z.object({
    fieldId: z.string().uuid().describe('UUID of the field to update'),
    label: z.string().max(100).optional().describe('Updated display label'),
    type: fieldTypeEnum.optional().describe('Updated field type'),
    description: z.string().optional().nullable().describe('Updated helper text'),
    placeholder: z.string().optional().nullable().describe('Updated placeholder text'),
    isRequired: z.boolean().optional().describe('Updated required flag'),
    options: z.array(z.string()).optional().nullable().describe('Updated options list'),
})

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>

export const getFieldsInput = z.object({
    formId: z.string().uuid().describe('UUID of the form to fetch fields for'),
})

export type GetFieldsInputType = z.infer<typeof getFieldsInput>

export const deleteFieldInput = z.object({
    fieldId: z.string().uuid().describe('UUID of the field to delete'),
})

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>

export const syncFieldItemInput = z.object({
    id: z.string().optional().describe('Existing field UUID or temporary draft ID'),
    label: z.string().min(1, 'Field title is required').max(100),
    type: fieldTypeEnum,
    description: z.string().optional().nullable(),
    placeholder: z.string().optional().nullable(),
    isRequired: z.boolean().optional().default(false),
    options: z.array(z.string()).optional().nullable(),
})

export const syncFormFieldsInput = z.object({
    formId: z.string().uuid(),
    fields: z.array(syncFieldItemInput),
})

export type SyncFormFieldsInputType = z.infer<typeof syncFormFieldsInput>

