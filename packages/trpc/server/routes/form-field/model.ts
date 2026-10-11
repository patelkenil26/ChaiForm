import { z } from "zod";

export const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

export const formFieldObject = z.object({
    id: z.string().describe("ID of the field"),
    label: z.string().describe("Display label"),
    labelKey: z.string().describe("Immutable slug key"),
    type: fieldTypeEnum,
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean(),
    index: z.string().describe("Fractional index for ordering"),
});

export const createFieldInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
    label: z.string().max(100).describe("Display label for the field"),
    type: fieldTypeEnum.describe("Type of the field"),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional().default(false),
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
