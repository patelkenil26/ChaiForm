import { z } from "zod";

export const fieldTypeEnum = z.enum([
    "TEXT",
    "TEXTAREA",
    "NUMBER",
    "EMAIL",
    "PHONE",
    "URL",
    "DATE",
    "TIME",
    "YES_NO",
    "PASSWORD",
    "SELECT",
    "RADIO",
    "CHECKBOX",
    "RATING",
]);

export const formFieldObject = z.object({
    id: z.string().describe("ID of the field"),
    label: z.string().describe("Display label"),
    labelKey: z.string().describe("Immutable slug key"),
    type: fieldTypeEnum,
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean(),
    options: z.array(z.string()).nullable().optional().describe("Options list for choice fields"),
    index: z.string().describe("Fractional index for ordering"),
});

export const createFieldInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
    label: z.string().max(100).describe("Display label for the field"),
    type: fieldTypeEnum.describe("Type of the field"),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional().default(false),
    options: z.array(z.string()).optional().describe("Options for SELECT, RADIO, CHECKBOX"),
});

export const createFieldOutputModel = z.object({
    id: z.string(),
    labelKey: z.string(),
    index: z.string(),
});

export const updateFieldInputModel = z.object({
    fieldId: z.string().uuid().describe("UUID of the field to update"),
    label: z.string().max(100).optional(),
    type: fieldTypeEnum.optional(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional(),
    options: z.array(z.string()).nullable().optional().describe("Updated options for choice fields"),
});

export const updateFieldOutputModel = z.object({
    id: z.string(),
});

export const deleteFieldInputModel = z.object({
    fieldId: z.string().uuid().describe("UUID of the field to delete"),
});

export const deleteFieldOutputModel = z.object({
    id: z.string(),
});

export const getFieldsInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
});

export const getFieldsOutputModel = z.array(formFieldObject);

export const syncFieldItemModel = z.object({
    id: z.string().optional().describe("Existing field UUID or temporary draft ID"),
    label: z.string().min(1, "Field title cannot be empty").max(100),
    type: fieldTypeEnum,
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean().optional().default(false),
    options: z.array(z.string()).nullable().optional(),
});

export const syncFormFieldsInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
    fields: z.array(syncFieldItemModel),
});

export const syncFormFieldsOutputModel = z.array(formFieldObject);

