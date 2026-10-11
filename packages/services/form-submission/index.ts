import db, { eq, desc, count } from '@repo/database'
import { formSubmissionTable } from '@repo/database/models/form-submission'
import { formsTable } from '@repo/database/models/form'
import { type SubmitFormInputType, submitFormInput, type GetFormSubmissionsInputType, getFormSubmissionsInput } from './model'

class FormSubmissionService {

    public async submitForm(payload: SubmitFormInputType) {
        const { formId, values } = await submitFormInput.parseAsync(payload)

        const form = await db
            .select({
                isPublished: formsTable.isPublished,
                closesAt: formsTable.closesAt,
                responseLimit: formsTable.responseLimit,
            })
            .from(formsTable)
            .where(eq(formsTable.id, formId))
            .limit(1)

        if (!form || form.length === 0) {
            throw new Error('Form not found')
        }

        const formData = form[0]!

        if (!formData.isPublished) {
            throw new Error('This form is currently closed and not accepting responses')
        }

        if (formData.closesAt && new Date() > new Date(formData.closesAt)) {
            throw new Error('This form has expired and is no longer accepting responses')
        }

        if (formData.responseLimit) {
            const [subCountResult] = await db
                .select({ count: count() })
                .from(formSubmissionTable)
                .where(eq(formSubmissionTable.formId, formId));

            const currentCount = subCountResult ? Number(subCountResult.count) : 0;
            if (currentCount >= formData.responseLimit) {
                throw new Error('This form has reached its maximum response limit and is no longer accepting responses');
            }
        }

        const result = await db
            .insert(formSubmissionTable)
            .values({ formId, values })
            .returning({ id: formSubmissionTable.id })

        if (!result || result.length === 0 || !result[0]?.id)
            throw new Error('Something went wrong while saving your submission')

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

}

export default FormSubmissionService
