import { z } from "zod";

export const submitFormInputModel = z.object({
    formId: z.string().min(1).describe("UUID or slug of the form being submitted"),
    values: z
        .array(
            z.object({
                formFieldId: z.string().uuid().describe("UUID of the form field"),
                value: z.string().describe("Answer value for this field"),
            })
        )
        .min(1),
});

export const submitFormOutputModel = z.object({
    id: z.string().describe("ID of the created submission"),
});

export const getFormSubmissionsInputModel = z.object({
    formId: z.string().uuid().describe("UUID of the form"),
});

export const getFormSubmissionsOutputModel = z.array(
    z.object({
        id: z.string(),
        createdAt: z.date().nullable(),
        values: z
            .array(
                z.object({
                    formFieldId: z.string(),
                    value: z.string(),
                })
            )
            .nullable(),
    })
);
