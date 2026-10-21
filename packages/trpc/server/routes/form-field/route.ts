import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formFieldService } from "../../services";
import {
    createFieldInputModel,
    createFieldOutputModel,
    updateFieldInputModel,
    updateFieldOutputModel,
    deleteFieldInputModel,
    deleteFieldOutputModel,
    getFieldsInputModel,
    getFieldsOutputModel,
    syncFormFieldsInputModel,
    syncFormFieldsOutputModel,
} from "./model";

const TAGS = ["Form Fields"];
const getPath = generatePath("/form");

export const formFieldProcedures = {
    getFields: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/getFields"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getFieldsInputModel)
        .output(getFieldsOutputModel)
        .query(async ({ input }) => {
            return formFieldService.getFields({ formId: input.formId });
        }),

    createField: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({ input }) => {
            const { formId, label, type, description, placeholder, isRequired, options } = input;
            const result = await formFieldService.createField({
                formId,
                label,
                type,
                description,
                placeholder,
                isRequired,
                options,
            });
            return result;
        }),

    updateField: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/updateField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFieldInputModel)
        .output(updateFieldOutputModel)
        .mutation(async ({ input }) => {
            const { fieldId, label, type, description, placeholder, isRequired, options } = input;
            const result = await formFieldService.updateField({
                fieldId,
                label,
                type,
                description,
                placeholder,
                isRequired,
                options,
            });
            return result;
        }),

    deleteField: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/deleteField"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(deleteFieldInputModel)
        .output(deleteFieldOutputModel)
        .mutation(async ({ input }) => {
            const { fieldId } = input;
            const result = await formFieldService.deleteField({ fieldId });
            return result;
        }),

    syncFormFields: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/syncFormFields"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(syncFormFieldsInputModel)
        .output(syncFormFieldsOutputModel)
        .mutation(async ({ input }) => {
            const result = await formFieldService.syncFormFields(input);
            return result;
        }),
};

export const formFieldRouter = router(formFieldProcedures);
