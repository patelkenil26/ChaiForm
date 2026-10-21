import { createHmac } from 'crypto'
import db, { eq, desc, count, or } from '@repo/database'
import { formSubmissionTable } from '@repo/database/models/form-submission'
import { formsTable } from '@repo/database/models/form'
import { type SubmitFormInputType, submitFormInput, type GetFormSubmissionsInputType, getFormSubmissionsInput } from './model'
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    AppError,
} from "../errors";

class FormSubmissionService {

    public async submitForm(payload: SubmitFormInputType) {
        const { formId, values, password } = await submitFormInput.parseAsync(payload)

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(formId)
        const whereCondition = isUuid
            ? or(eq(formsTable.id, formId), eq(formsTable.slug, formId))
            : eq(formsTable.slug, formId)

        const form = await db
            .select({
                id: formsTable.id,
                isPublished: formsTable.isPublished,
                isArchived: formsTable.isArchived,
                closesAt: formsTable.closesAt,
                responseLimit: formsTable.responseLimit,
                passwordHash: formsTable.passwordHash,
                passwordSalt: formsTable.passwordSalt,
            })
            .from(formsTable)
            .where(whereCondition)
            .limit(1)

        if (!form || form.length === 0) {
            throw new NotFoundError('Form not found')
        }

        const formData = form[0]!
        const resolvedFormId = formData.id

        if (formData.isArchived) {
            throw new BadRequestError('This form has been archived and is no longer accepting responses')
        }

        if (!formData.isPublished) {
            throw new BadRequestError('This form is currently closed and not accepting responses')
        }

        if (formData.passwordHash) {
            if (!password) {
                throw new UnauthorizedError('This form is password protected. Password is required to submit.')
            }
            const hash = createHmac('sha256', formData.passwordSalt!).update(password).digest('hex')
            if (hash !== formData.passwordHash) {
                throw new UnauthorizedError('Invalid form password. Submission rejected.')
            }
        }

        if (formData.closesAt && new Date() > new Date(formData.closesAt)) {
            throw new BadRequestError('This form has expired and is no longer accepting responses')
        }

        if (formData.responseLimit) {
            const [subCountResult] = await db
                .select({ count: count() })
                .from(formSubmissionTable)
                .where(eq(formSubmissionTable.formId, resolvedFormId));

            const currentCount = subCountResult ? Number(subCountResult.count) : 0;
            if (currentCount >= formData.responseLimit) {
                throw new BadRequestError('This form has reached its maximum response limit and is no longer accepting responses');
            }
        }

        const result = await db
            .insert(formSubmissionTable)
            .values({ formId: resolvedFormId, values })
            .returning({ id: formSubmissionTable.id })

        if (!result || result.length === 0 || !result[0]?.id)
            throw new AppError('Something went wrong while saving your submission', 'INTERNAL_SERVER_ERROR')

        return { id: result[0].id }
    }

    public async getFormSubmissions(payload: GetFormSubmissionsInputType) {
        const { formId } = await getFormSubmissionsInput.parseAsync(payload)

        return await db
            .select({
                id: formSubmissionTable.id,
                values: formSubmissionTable.values,
                createdAt: formSubmissionTable.createdAt,
            })
            .from(formSubmissionTable)
            .where(eq(formSubmissionTable.formId, formId))
            .orderBy(desc(formSubmissionTable.createdAt))
    }

    public async getUserSubmissionsStats(payload: { userId: string }) {
        const { userId } = payload

        const [subCountResult] = await db
            .select({ total: count() })
            .from(formSubmissionTable)
            .innerJoin(formsTable, eq(formSubmissionTable.formId, formsTable.id))
            .where(eq(formsTable.createdBy, userId));

        const recentSubmissions = await db
            .select({
                id: formSubmissionTable.id,
                formId: formSubmissionTable.formId,
                formTitle: formsTable.title,
                formSlug: formsTable.slug,
                values: formSubmissionTable.values,
                createdAt: formSubmissionTable.createdAt,
            })
            .from(formSubmissionTable)
            .innerJoin(formsTable, eq(formSubmissionTable.formId, formsTable.id))
            .where(eq(formsTable.createdBy, userId))
            .orderBy(desc(formSubmissionTable.createdAt))
            .limit(6);

        const allUserSubmissions = await db
            .select({
                id: formSubmissionTable.id,
                formId: formSubmissionTable.formId,
                createdAt: formSubmissionTable.createdAt,
            })
            .from(formSubmissionTable)
            .innerJoin(formsTable, eq(formSubmissionTable.formId, formsTable.id))
            .where(eq(formsTable.createdBy, userId))
            .orderBy(desc(formSubmissionTable.createdAt));

        return {
            totalSubmissions: subCountResult ? Number(subCountResult.total) : 0,
            recentSubmissions: recentSubmissions.map((s) => ({
                id: s.id,
                formId: s.formId,
                formTitle: s.formTitle,
                formSlug: s.formSlug,
                answersCount: Array.isArray(s.values) ? s.values.length : 0,
                createdAt: s.createdAt,
            })),
            allSubmissions: allUserSubmissions,
        };
    }

}

export default FormSubmissionService
