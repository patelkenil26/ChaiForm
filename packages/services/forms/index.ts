import { createHmac, randomBytes } from "crypto";
import db, { and, asc, count, desc, eq, ilike, inArray, ne, or } from "@repo/database";
import {
    createFormInput,
    CreateFormInputType,
    getFormByIdInput,
    GetFormByIdInputType,
    listFormsByUserIdInput,
    ListFormsByUserIdInputType,
    listPublicFormsFilterInput,
    ListPublicFormsFilterInputType,
    updateFormVisibilityInput,
    UpdateFormVisibilityInputType,
    updateFormSettingsInput,
    UpdateFormSettingsInputType,
    cloneFormInput,
    CloneFormInputType,
    archiveFormInput,
    ArchiveFormInputType,
    recordFormViewInput,
    RecordFormViewInputType,
    FormVisibilityType,
    FormCategoryType,
} from "./model";
import { formsTable } from '@repo/database/models/form'
import { formFieldsTable } from '@repo/database/models/form-field'
import { formSubmissionTable } from '@repo/database/models/form-submission'

const RESERVED_SLUGS = new Set([
    "api",
    "admin",
    "dashboard",
    "form",
    "forms",
    "auth",
    "login",
    "signup",
    "signin",
    "submit",
    "explore",
    "templates",
    "submissions",
    "new",
    "settings",
    "help",
    "support",
]);

class FormService {
    private generateSalt(): string {
        return randomBytes(32).toString('hex');
    }

    private generateHash(salt: string, password: string): string {
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    public async createForm(payload: CreateFormInputType) {
        const { title, description, category, createdBy, visibility, isPublished, closesAt, responseLimit, slug, password } = await createFormInput.parseAsync(payload);

        let normalizedSlug: string | null = null;
        if (slug) {
            normalizedSlug = slug.toLowerCase().trim();
            if (RESERVED_SLUGS.has(normalizedSlug)) {
                throw new Error(`'${normalizedSlug}' is a reserved keyword and cannot be used as a slug.`);
            }

            const existing = await db
                .select({ id: formsTable.id })
                .from(formsTable)
                .where(eq(formsTable.slug, normalizedSlug))
                .limit(1);

            if (existing.length > 0) {
                throw new Error(`The slug '${normalizedSlug}' is already taken. Please choose another one.`);
            }
        }

        let passwordHash: string | null = null;
        let passwordSalt: string | null = null;
        if (password && password.trim() !== "") {
            passwordSalt = this.generateSalt();
            passwordHash = this.generateHash(passwordSalt, password);
        }

        const result = await db.insert(formsTable).values({
            title,
            description,
            category: category ?? 'GENERAL',
            createdBy,
            visibility,
            isPublished,
            closesAt,
            responseLimit,
            slug: normalizedSlug,
            passwordHash,
            passwordSalt,
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
            category: formsTable.category,
            visibility: formsTable.visibility,
            isPublished: formsTable.isPublished,
            isArchived: formsTable.isArchived,
            closesAt: formsTable.closesAt,
            responseLimit: formsTable.responseLimit,
            slug: formsTable.slug,
            passwordHash: formsTable.passwordHash,
            views: formsTable.views,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        }).from(formsTable).where(eq(formsTable.createdBy, userId)).orderBy(desc(formsTable.createdAt))

        return forms.map(f => ({
            id: f.id,
            title: f.title,
            description: f.description,
            category: f.category ?? 'GENERAL',
            visibility: f.visibility,
            isPublished: f.isPublished,
            isArchived: f.isArchived,
            closesAt: f.closesAt,
            responseLimit: f.responseLimit,
            slug: f.slug,
            isPasswordProtected: Boolean(f.passwordHash),
            views: f.views ?? 0,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
        }));
    }

    public async getFormById(payload: GetFormByIdInputType) {
        const { formId, password } = await getFormByIdInput.parseAsync(payload)

        // Check if formId is a UUID or a custom slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(formId);
        const condition = isUuid
            ? or(eq(formsTable.id, formId), eq(formsTable.slug, formId))
            : eq(formsTable.slug, formId);

        const rows = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                category: formsTable.category,
                visibility: formsTable.visibility,
                isPublished: formsTable.isPublished,
                isArchived: formsTable.isArchived,
                closesAt: formsTable.closesAt,
                responseLimit: formsTable.responseLimit,
                slug: formsTable.slug,
                passwordHash: formsTable.passwordHash,
                passwordSalt: formsTable.passwordSalt,
                views: formsTable.views,
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
            .where(condition)
            .orderBy(asc(formFieldsTable.index))

        if (rows.length === 0) return null

        const { id, title, description, category, visibility, isPublished, isArchived, closesAt, responseLimit, slug, passwordHash, passwordSalt, views, createdAt, updatedAt } = rows[0]!

        const isPasswordProtected = Boolean(passwordHash);
        let isUnlocked = true;
        let fields = rows
            .filter(r => r.field?.id !== null)
            .map(r => r.field as NonNullable<typeof r.field>);

        if (isPasswordProtected) {
            if (password) {
                const enteredHash = this.generateHash(passwordSalt!, password);
                if (enteredHash !== passwordHash) {
                    throw new Error("Invalid form password");
                }
                isUnlocked = true;
            } else {
                isUnlocked = false;
                fields = []; // Don't leak fields to client until unlocked
            }
        }

        const [subCountResult] = await db
            .select({ count: count() })
            .from(formSubmissionTable)
            .where(eq(formSubmissionTable.formId, id));

        const submissionCount = subCountResult ? Number(subCountResult.count) : 0;

        const isExpired = closesAt ? new Date() > new Date(closesAt) : false;
        const isLimitReached = responseLimit ? submissionCount >= responseLimit : false;
        const isOpen = isPublished && !isExpired && !isLimitReached && !isArchived;

        return {
            id,
            title,
            description,
            category: category ?? 'GENERAL',
            visibility,
            isPublished,
            isArchived,
            closesAt,
            responseLimit,
            slug,
            isPasswordProtected,
            isUnlocked,
            submissionCount,
            views: views ?? 0,
            isOpen,
            isExpired,
            isLimitReached,
            createdAt,
            updatedAt,
            fields,
        }
    }

    public async updateFormSettings(payload: UpdateFormSettingsInputType) {
        const { formId, userId, category, visibility, isPublished, closesAt, responseLimit, slug, password } = await updateFormSettingsInput.parseAsync(payload);

        const updateData: {
            category?: FormCategoryType;
            visibility?: FormVisibilityType;
            isPublished?: boolean;
            closesAt?: Date | null;
            responseLimit?: number | null;
            slug?: string | null;
            passwordHash?: string | null;
            passwordSalt?: string | null;
        } = {};
        if (category !== undefined) updateData.category = category;
        if (visibility !== undefined) updateData.visibility = visibility;
        if (isPublished !== undefined) updateData.isPublished = isPublished;
        if (closesAt !== undefined) updateData.closesAt = closesAt;
        if (responseLimit !== undefined) updateData.responseLimit = responseLimit;

        if (slug !== undefined) {
            if (slug === null || slug.trim() === "") {
                updateData.slug = null;
            } else {
                const normalizedSlug = slug.toLowerCase().trim();
                if (RESERVED_SLUGS.has(normalizedSlug)) {
                    throw new Error(`'${normalizedSlug}' is a reserved keyword and cannot be used as a slug.`);
                }

                // Check uniqueness against other forms
                const existing = await db
                    .select({ id: formsTable.id })
                    .from(formsTable)
                    .where(and(eq(formsTable.slug, normalizedSlug), ne(formsTable.id, formId)))
                    .limit(1);

                if (existing.length > 0) {
                    throw new Error(`The slug '${normalizedSlug}' is already taken. Please choose another one.`);
                }
                updateData.slug = normalizedSlug;
            }
        }

        if (password !== undefined) {
            if (password === null || password.trim() === "") {
                updateData.passwordHash = null;
                updateData.passwordSalt = null;
            } else {
                const salt = this.generateSalt();
                const hash = this.generateHash(salt, password);
                updateData.passwordSalt = salt;
                updateData.passwordHash = hash;
            }
        }

        const result = await db.update(formsTable)
            .set(updateData)
            .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
            .returning({
                id: formsTable.id,
                visibility: formsTable.visibility,
                isPublished: formsTable.isPublished,
                closesAt: formsTable.closesAt,
                responseLimit: formsTable.responseLimit,
                slug: formsTable.slug,
                passwordHash: formsTable.passwordHash,
            });

        if (!result || result.length === 0 || !result[0]) {
            throw new Error("Form not found or you do not have permission to update it");
        }

        const updated = result[0];
        return {
            id: updated.id,
            visibility: updated.visibility,
            isPublished: updated.isPublished,
            closesAt: updated.closesAt,
            responseLimit: updated.responseLimit,
            slug: updated.slug,
            isPasswordProtected: Boolean(updated.passwordHash),
        };
    }

    public async updateFormVisibility(payload: UpdateFormVisibilityInputType) {
        return this.updateFormSettings(payload);
    }

    public async listPublicForms(payload?: ListPublicFormsFilterInputType) {
        const filter = await listPublicFormsFilterInput.parseAsync(payload);

        const conditions = [
            eq(formsTable.visibility, 'PUBLIC'),
            eq(formsTable.isPublished, true),
            eq(formsTable.isArchived, false),
        ];

        if (filter?.category && filter.category !== 'ALL') {
            conditions.push(eq(formsTable.category, filter.category));
        }

        if (filter?.search && filter.search.trim() !== '') {
            const term = `%${filter.search.trim()}%`;
            conditions.push(or(ilike(formsTable.title, term), ilike(formsTable.description, term))!);
        }

        const publicForms = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            slug: formsTable.slug,
            category: formsTable.category,
            views: formsTable.views,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        })
        .from(formsTable)
        .where(and(...conditions))
        .orderBy(desc(formsTable.createdAt));

        if (publicForms.length === 0) return [];

        const formIds = publicForms.map(f => f.id);
        const fieldCounts = await db
            .select({
                formId: formFieldsTable.formId,
                count: count(formFieldsTable.id),
            })
            .from(formFieldsTable)
            .where(inArray(formFieldsTable.formId, formIds))
            .groupBy(formFieldsTable.formId);

        const countMap = new Map(fieldCounts.map(fc => [fc.formId, Number(fc.count)]));

        return publicForms.map(f => ({
            id: f.id,
            title: f.title,
            description: f.description,
            slug: f.slug,
            category: f.category ?? 'GENERAL',
            views: f.views ?? 0,
            fieldsCount: countMap.get(f.id) ?? 0,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
        }));
    }

    public async cloneForm(payload: CloneFormInputType) {
        const { formId, userId, allowPublicTemplate } = await cloneFormInput.parseAsync(payload);

        // Fetch original form: allow if owned by user or if it's a public published template
        const whereClause = allowPublicTemplate
            ? or(
                and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)),
                and(eq(formsTable.id, formId), eq(formsTable.visibility, 'PUBLIC'), eq(formsTable.isPublished, true))
              )
            : and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId));

        const originalRows = await db
            .select()
            .from(formsTable)
            .where(whereClause)
            .limit(1);

        if (!originalRows || originalRows.length === 0) {
            throw new Error("Form or template not found or not accessible to clone");
        }

        const original = originalRows[0]!;

        // Generate clean duplicate title
        const baseTitle = original.title.endsWith("(Copy)")
            ? original.title
            : `${original.title} (Copy)`;
        const newTitle = baseTitle.length > 55 ? baseTitle.slice(0, 55) : baseTitle;

        // Create new duplicate form
        const [clonedForm] = await db
            .insert(formsTable)
            .values({
                title: newTitle,
                description: original.description,
                category: original.category,
                visibility: 'UNLISTED',
                isPublished: false, // Start as draft for safety
                closesAt: original.closesAt,
                responseLimit: original.responseLimit,
                slug: null, // Slugs must be unique, creator can customize later
                isArchived: false,
                createdBy: userId,
            })
            .returning({ id: formsTable.id });

        if (!clonedForm?.id) {
            throw new Error("Failed to clone form");
        }

        // Fetch fields belonging to the original form
        const originalFields = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(asc(formFieldsTable.index));

        if (originalFields.length > 0) {
            await db.insert(formFieldsTable).values(
                originalFields.map((field) => ({
                    formId: clonedForm.id,
                    label: field.label,
                    labelKey: field.labelKey,
                    type: field.type,
                    description: field.description,
                    placeholder: field.placeholder,
                    isRequired: field.isRequired,
                    options: field.options,
                    index: field.index,
                }))
            );
        }

        return { id: clonedForm.id };
    }

    public async archiveForm(payload: ArchiveFormInputType) {
        const { formId, userId, isArchived } = await archiveFormInput.parseAsync(payload);

        const [updated] = await db
            .update(formsTable)
            .set({ isArchived })
            .where(and(eq(formsTable.id, formId), eq(formsTable.createdBy, userId)))
            .returning({ id: formsTable.id, isArchived: formsTable.isArchived });

        if (!updated) {
            throw new Error("Form not found or you don't have permission to update it");
        }

        return updated;
    }

    public async recordFormView(payload: RecordFormViewInputType) {
        const { formId } = await recordFormViewInput.parseAsync(payload);
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(formId);
        const condition = isUuid
            ? or(eq(formsTable.id, formId), eq(formsTable.slug, formId))
            : eq(formsTable.slug, formId);

        const [form] = await db
            .select({ id: formsTable.id, views: formsTable.views })
            .from(formsTable)
            .where(condition);

        if (!form) return { success: false, views: 0 };

        const nextViews = (form.views ?? 0) + 1;
        await db
            .update(formsTable)
            .set({ views: nextViews })
            .where(eq(formsTable.id, form.id));

        return { success: true, views: nextViews };
    }
}

export default FormService;

