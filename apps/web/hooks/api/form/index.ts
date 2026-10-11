import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate()
        }
    })

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useListForms = () => {
    const { data: forms, error, isFetched, isFetching, isLoading, status } =
        trpc.form.listForms.useQuery()

    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useGetForm = (formId: string) => {
    const { data: form, error, isFetched, isFetching, isLoading, status } =
        trpc.form.getForm.useQuery({ formId })

    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    }
}

export const useGetFields = (formId: string) => {
    const { data: fields, error, isFetched, isFetching, isLoading, status } =
        trpc.form.getFields.useQuery({ formId })

    return {
        fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    }
}

export const useCreateField = (formId: string) => {
    const utils = trpc.useUtils()

    const { mutateAsync: createFieldAsync, mutate: createField, error, isError, isPending: isLoading } = 
        trpc.form.createField.useMutation({
            onSuccess: async () => {
                await utils.form.getFields.invalidate({ formId })
                await utils.form.getForm.invalidate({ formId })
            }
        })

    return { createFieldAsync, createField, error, isError, isLoading }
}

export const useUpdateField = (formId: string) => {
    const utils = trpc.useUtils()

    const { mutateAsync: updateFieldAsync, mutate: updateField, error, isError, isPending: isLoading } = 
        trpc.form.updateField.useMutation({
            onSuccess: async () => {
                await utils.form.getFields.invalidate({ formId })
                await utils.form.getForm.invalidate({ formId })
            }
        })

    return { updateFieldAsync, updateField, error, isError, isLoading }
}

export const useDeleteField = (formId: string) => {
    const utils = trpc.useUtils()

    const { mutateAsync: deleteFieldAsync, mutate: deleteField, error, isError, isPending: isLoading } = 
        trpc.form.deleteField.useMutation({
            onSuccess: async () => {
                await utils.form.getFields.invalidate({ formId })
                await utils.form.getForm.invalidate({ formId })
            }
        })

    return { deleteFieldAsync, deleteField, error, isError, isLoading }
}

export const useSubmitForm = () => {
    const { mutateAsync: submitFormAsync, mutate: submitForm, error, isError, isPending: isLoading } = 
        trpc.form.submitForm.useMutation()

    return { submitFormAsync, submitForm, error, isError, isLoading }
}

export const useGetFormSubmissions = (formId: string) => {
    const { data: submissions, error, isFetched, isFetching, isLoading, status } =
        trpc.form.getFormSubmissions.useQuery({ formId })

    return {
        submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    }
}
