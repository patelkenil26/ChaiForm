import db, { eq, max, asc, inArray } from '@repo/database'
import { formFieldsTable } from '@repo/database/models/form-field'
import {
    type CreateFieldInputType, createFieldInput,
    type UpdateFieldInputType, updateFieldInput,
    type DeleteFieldInputType, deleteFieldInput,
    type GetFieldsInputType, getFieldsInput,
    type SyncFormFieldsInputType, syncFormFieldsInput,
} from './model'
import {
    BadRequestError,
    NotFoundError,
    AppError,
} from "../errors";

function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
}

class FormFieldService {

    private async getNextIndex(formId: string): Promise<string> {
        const result = await db
            .select({ maxIndex: max(formFieldsTable.index) })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))

        const current = result[0]?.maxIndex
        const next = current ? parseFloat(current) + 1 : 1
        return next.toFixed(2)
    }

    public async createField(payload: CreateFieldInputType) {
        const { label, type, formId, description, placeholder, isRequired, options } =
            await createFieldInput.parseAsync(payload)

        const labelKey = toLabelKey(label)
        const index = await this.getNextIndex(formId)

        const result = await db
            .insert(formFieldsTable)
            .values({ label, labelKey, type, formId, description, placeholder, isRequired, options, index })
            .returning({ id: formFieldsTable.id })

        if (!result || result.length === 0 || !result[0]?.id)
            throw new AppError(`Something went wrong while creating the field`, 'INTERNAL_SERVER_ERROR')

        return { id: result[0].id, labelKey, index }
    }

    public async updateField(payload: UpdateFieldInputType) {
        const { fieldId, ...updates } = await updateFieldInput.parseAsync(payload)

        const patch: Partial<typeof formFieldsTable.$inferInsert> = {}
        if (updates.label !== undefined) patch.label = updates.label
        if (updates.type !== undefined) patch.type = updates.type
        if ('description' in updates) patch.description = updates.description ?? null
        if ('placeholder' in updates) patch.placeholder = updates.placeholder ?? null
        if (updates.isRequired !== undefined) patch.isRequired = updates.isRequired
        if ('options' in updates) patch.options = updates.options ?? null

        if (Object.keys(patch).length === 0) throw new BadRequestError(`No fields provided to update`)

        const result = await db
            .update(formFieldsTable)
            .set(patch)
            .where(eq(formFieldsTable.id, fieldId))
            .returning({ id: formFieldsTable.id })

        if (!result || result.length === 0) throw new NotFoundError(`Field with ID ${fieldId} does not exist`)

        return { id: result[0]!.id }
    }

    public async getFields(payload: GetFieldsInputType) {
        const { formId } = await getFieldsInput.parseAsync(payload)

        return db
            .select({
                id: formFieldsTable.id,
                label: formFieldsTable.label,
                labelKey: formFieldsTable.labelKey,
                type: formFieldsTable.type,
                description: formFieldsTable.description,
                placeholder: formFieldsTable.placeholder,
                isRequired: formFieldsTable.isRequired,
                options: formFieldsTable.options,
                index: formFieldsTable.index,
            })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(asc(formFieldsTable.index))
    }

    public async deleteField(payload: DeleteFieldInputType) {
        const { fieldId } = await deleteFieldInput.parseAsync(payload)

        const result = await db
            .delete(formFieldsTable)
            .where(eq(formFieldsTable.id, fieldId))
            .returning({ id: formFieldsTable.id })

        if (!result || result.length === 0) throw new NotFoundError(`Field with ID ${fieldId} does not exist`)

        return { id: result[0]!.id }
    }

    public async syncFormFields(payload: SyncFormFieldsInputType) {
        const { formId, fields } = await syncFormFieldsInput.parseAsync(payload);

        // Fetch existing fields for this form
        const existing = await db
            .select({ id: formFieldsTable.id })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));

        const existingIds = new Set(existing.map(f => f.id));
        const incomingIds = new Set(fields.filter(f => f.id && existingIds.has(f.id)).map(f => f.id!));

        // Delete any fields that were removed by the user in this sync
        const toDelete = existing.filter(f => !incomingIds.has(f.id));
        if (toDelete.length > 0) {
            await db
                .delete(formFieldsTable)
                .where(inArray(formFieldsTable.id, toDelete.map(f => f.id)));
        }

        // Process fields in order
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i]!;
            const labelKey = toLabelKey(field.label);
            const index = (i + 1).toFixed(2);

            if (field.id && existingIds.has(field.id)) {
                // Update existing field
                await db
                    .update(formFieldsTable)
                    .set({
                        label: field.label,
                        labelKey,
                        type: field.type,
                        description: field.description ?? null,
                        placeholder: field.placeholder ?? null,
                        isRequired: field.isRequired ?? false,
                        options: field.options ?? null,
                        index,
                    })
                    .where(eq(formFieldsTable.id, field.id));
            } else {
                // Insert new field
                await db
                    .insert(formFieldsTable)
                    .values({
                        formId,
                        label: field.label,
                        labelKey,
                        type: field.type,
                        description: field.description ?? null,
                        placeholder: field.placeholder ?? null,
                        isRequired: field.isRequired ?? false,
                        options: field.options ?? null,
                        index,
                    });
            }
        }

        return this.getFields({ formId });
    }

}

export default FormFieldService
