import { createHmac, randomBytes } from "crypto";
import db, { and, asc, count, desc, eq, ne, or } from "@repo/database";
import {
    createFormInput,
    CreateFormInputType,
    getFormByIdInput,
    GetFormByIdInputType,
    listFormsByUserIdInput,
    ListFormsByUserIdInputType,
    updateFormVisibilityInput,
    UpdateFormVisibilityInputType,
    updateFormSettingsInput,
    UpdateFormSettingsInputType,
    FormVisibilityType,
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
        const { title, description, createdBy, visibility, isPublished, closesAt, responseLimit, slug, password } = await createFormInput.parseAsync(payload);

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
            visibility: formsTable.visibility,
            isPublished: formsTable.isPublished,
            closesAt: formsTable.closesAt,
            responseLimit: formsTable.responseLimit,
            slug: formsTable.slug,
            passwordHash: formsTable.passwordHash,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
        }).from(formsTable).where(eq(formsTable.createdBy, userId)).orderBy(desc(formsTable.createdAt))

        return forms.map(f => ({
            id: f.id,
            title: f.title,
            description: f.description,
            visibility: f.visibility,
            isPublished: f.isPublished,
            closesAt: f.closesAt,
            responseLimit: f.responseLimit,
            slug: f.slug,
            isPasswordProtected: Boolean(f.passwordHash),
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
                visibility: formsTable.visibility,
                isPublished: formsTable.isPublished,
                closesAt: formsTable.closesAt,
                responseLimit: formsTable.responseLimit,
                slug: formsTable.slug,
                passwordHash: formsTable.passwordHash,
                passwordSalt: formsTable.passwordSalt,
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

        const { id, title, description, visibility, isPublished, closesAt, responseLimit, slug, passwordHash, passwordSalt, createdAt, updatedAt } = rows[0]!

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
        const isOpen = isPublished && !isExpired && !isLimitReached;

        return {
            id,
            title,
            description,
            visibility,
            isPublished,
            closesAt,
            responseLimit,
            slug,
            isPasswordProtected,
            isUnlocked,
            submissionCount,
            isOpen,
            isExpired,
            isLimitReached,
            createdAt,
            updatedAt,
            fields,
        }
    }

    public async updateFormSettings(payload: UpdateFormSettingsInputType) {
        const { formId, userId, visibility, isPublished, closesAt, responseLimit, slug, password } = await updateFormSettingsInput.parseAsync(payload);

        const updateData: {
            visibility?: FormVisibilityType;
            isPublished?: boolean;
            closesAt?: Date | null;
            responseLimit?: number | null;
            slug?: string | null;
            passwordHash?: string | null;
            passwordSalt?: string | null;
        } = {};
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