import db, { and, asc, desc, eq } from "@repo/database";
import {
    createFormInput,
    CreateFormInputType,
    getFormByIdInput,
    GetFormByIdInputType,
    listFormsByUserIdInput,
    ListFormsByUserIdInputType,
    updateFormVisibilityInput,
    UpdateFormVisibilityInputType,
    FormVisibilityType,
} from "./model";
import { formsTable } from '@repo/database/models/form'
import { formFieldsTable } from '@repo/database/models/form-field'


class FormService {
    public async createForm(payload: CreateFormInputType) {
        const { title, description, createdBy, visibility, isPublished } = await createFormInput.parseAsync(payload);

        const result = await db.insert(formsTable).values({
            title,
            description,
            createdBy,
            visibility,
            isPublished,
        }).returning({
            id: formsTable.id,
        })

        if (!result || result.length === 0 || !result[0]?.id) throw new Error(`Something went wrong while creating the form`)

        return { id: result[0].id }
    }

    public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
        const { userId } = await listFormsByUserIdInput.parseAsync(payload)

        const forms = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            visibility: formsTable.visibility,
            isPublished: formsTable.isPublished,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        }).from(formsTable).where(eq(formsTable.createdBy, userId)).orderBy(desc(formsTable.createdAt))

        return forms;
    }

    public async getFormById(payload: GetFormByIdInputType) {
        const { formId } = await getFormByIdInput.parseAsync(payload)
        const rows = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                visibility: formsTable.visibility,
                isPublished: formsTable.isPublished,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
                field: {
                    id: formFieldsTable.id,
                    label: formFieldsTable.label,
                    labelKey: formFieldsTable.labelKey,
                    type: formFieldsTable.type,
                    description: formFieldsTable.description,
                    placeholder: formFieldsTable.placeholder,
                    isRequired: formFieldsTable.isRequired,
                    options: formFieldsTable.options,
                    index: formFieldsTable.index,
                },
            })
            .from(formsTable)
            .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
            .where(eq(formsTable.id, formId))
            .orderBy(asc(formFieldsTable.index))

        if (rows.length === 0) return null

        const { id, title, description, visibility, isPublished, createdAt, updatedAt } = rows[0]!
        const fields = rows
            .filter(r => r.field?.id !== null)
            .map(r => r.field as NonNullable<typeof r.field>)

        return { id, title, description, visibility, isPublished, createdAt, updatedAt, fields }
    }

    public async updateFormVisibility(payload: UpdateFormVisibilityInputType) {
        const { formId, userId, visibility, isPublished } = await updateFormVisibilityInput.parseAsync(payload);

        const updateData: { visibility?: FormVisibilityType; isPublished?: boolean } = {};
        if (visibility !== undefined) updateData.visibility = visibility;
        if (isPublished !== undefined) updateData.isPublished = isPublished;

        const result = await db.update(formsTable)
            .set(updateData)
            .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
            .returning({
                id: formsTable.id,
                visibility: formsTable.visibility,
                isPublished: formsTable.isPublished,
            });

        if (!result || result.length === 0 || !result[0]) {
            throw new Error("Form not found or you do not have permission to update it");
        }

        return result[0];
    }

    public async listPublicForms() {
        return await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        })
        .from(formsTable)
        .where(and(eq(formsTable.visibility, 'PUBLIC'), eq(formsTable.isPublished, true)))
        .orderBy(desc(formsTable.createdAt));
    }
}

export default FormService;