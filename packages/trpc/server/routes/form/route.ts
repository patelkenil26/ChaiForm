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
    updateFormSettingsInputModel,
    updateFormSettingsOutputModel,
    listPublicFormsInputModel,
    listPublicFormsOutputModel,
    useTemplateInputModel,
    useTemplateOutputModel,
    cloneFormInputModel,
    cloneFormOutputModel,
    archiveFormInputModel,
    archiveFormOutputModel,
    recordViewInputModel,
    recordViewOutputModel,
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
            const { title, description, visibility, isPublished, closesAt, responseLimit, slug, password } = input;
            const { id } = await formService.createForm({
                title,
                description,
                createdBy: ctx.user.id,
                visibility,
                isPublished,
                closesAt,
                responseLimit,
                slug,
                password,
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
            return await formService.getFormById({ formId: input.formId, password: input.password });
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
            const { formId, visibility, isPublished, closesAt, responseLimit, slug, password } = input;
            return await formService.updateFormVisibility({
                formId,
                userId: ctx.user.id,
                visibility,
                isPublished,
                closesAt,
                responseLimit,
                slug,
                password,
            });
        }),

    updateFormSettings: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/updateFormSettings"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(updateFormSettingsInputModel)
        .output(updateFormSettingsOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { formId, visibility, isPublished, closesAt, responseLimit, slug, password } = input;
            return await formService.updateFormSettings({
                formId,
                userId: ctx.user.id,
                visibility,
                isPublished,
                closesAt,
                responseLimit,
                slug,
                password,
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
        .input(listPublicFormsInputModel)
        .output(listPublicFormsOutputModel)
        .query(async ({ input }) => {
            return await formService.listPublicForms(input);
        }),

    useTemplate: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/useTemplate"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(useTemplateInputModel)
        .output(useTemplateOutputModel)
        .mutation(async ({ input, ctx }) => {
            return await formService.cloneForm({
                formId: input.formId,
                userId: ctx.user.id,
                allowPublicTemplate: true,
            });
        }),

    cloneForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/cloneForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(cloneFormInputModel)
        .output(cloneFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            return await formService.cloneForm({
                formId: input.formId,
                userId: ctx.user.id,
            });
        }),

    archiveForm: authenticatedProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/archiveForm"),
                tags: TAGS,
                protect: true,
            },
        })
        .input(archiveFormInputModel)
        .output(archiveFormOutputModel)
        .mutation(async ({ input, ctx }) => {
            return await formService.archiveForm({
                formId: input.formId,
                userId: ctx.user.id,
                isArchived: input.isArchived,
            });
        }),

    recordView: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/recordView"),
                tags: TAGS,
            },
        })
        .input(recordViewInputModel)
        .output(recordViewOutputModel)
        .mutation(async ({ input }) => {
            return await formService.recordFormView({ formId: input.formId });
        }),
};

export const formRouter = router(formProcedures);


