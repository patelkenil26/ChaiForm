import { z } from "zod";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";
import {
    createFormInputModel,
    createFormOutputModel,
    listFormsOutputModel,
    getFormInputModel,
    getFormOutputModel,
    updateFormVisibilityInputModel,
    updateFormVisibilityOutputModel,
    listPublicFormsOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formProcedures = {
    createForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { title, description, visibility, isPublished } = input;
            const { id } = await formService.createForm({
                title,
                description,
                createdBy: ctx.user.id,
                visibility,
                isPublished,
            });
            return { id };
        }),

    listForms: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/listForms"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(z.undefined())
        .output(listFormsOutputModel)
        .query(async ({ ctx }) => {
            return await formService.listFormsByUserId({ userId: ctx.user.id });
        }),

    getForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(getFormInputModel)
        .output(getFormOutputModel)
        .query(async ({ input }) => {
            return await formService.getFormById({ formId: input.formId });
        }),

    updateFormVisibility: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/updateFormVisibility"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFormVisibilityInputModel)
        .output(updateFormVisibilityOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { formId, visibility, isPublished } = input;
            return await formService.updateFormVisibility({
                formId,
                userId: ctx.user.id,
                visibility,
                isPublished,
            });
        }),

    listPublicForms: publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/listPublicForms"),
                tags: TAGS,
            },
        })
        .input(z.undefined())
        .output(listPublicFormsOutputModel)
        .query(async () => {
            return await formService.listPublicForms();
        }),
};

export const formRouter = router(formProcedures);

