import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formSubmissionService } from "../../services";
import {
    submitFormInputModel,
    submitFormOutputModel,
    getFormSubmissionsInputModel,
    getFormSubmissionsOutputModel,
} from "./model";

const TAGS = ["Form Submissions"];
const getPath = generatePath("/form");

export const formSubmissionProcedures = {
    submitForm: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/submitForm"),
                tags: TAGS,
            },
        })
        .input(submitFormInputModel)
        .output(submitFormOutputModel)
        .mutation(async ({ input }) => {
            return formSubmissionService.submitForm(input);
        }),

    getFormSubmissions: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getFormSubmissions"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getFormSubmissionsInputModel)
        .output(getFormSubmissionsOutputModel)
        .query(async ({ input }) => {
            return formSubmissionService.getFormSubmissions({ formId: input.formId });
        }),
};

export const formSubmissionRouter = router(formSubmissionProcedures);
