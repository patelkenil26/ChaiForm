import { trpc } from "~/trpc/client";

export const useGetFields = (formId: string) => {
    const { data: fields, error, isFetched, isFetching, isLoading, status } =
        trpc.formField.getFields.useQuery({ formId });

    return {
        fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useCreateField = (formId: string) => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFieldAsync,
        mutate: createField,
        error,
        isError,
        isPending: isLoading,
    } = trpc.formField.createField.useMutation({
        onSuccess: async () => {
            await utils.formField.getFields.invalidate({ formId });
            await utils.form.getForm.invalidate({ formId });
        },
    });

    return { createFieldAsync, createField, error, isError, isLoading };
};

export const useUpdateField = (formId: string) => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: updateFieldAsync,
        mutate: updateField,
        error,
        isError,
        isPending: isLoading,
    } = trpc.formField.updateField.useMutation({
        onSuccess: async () => {
            await utils.formField.getFields.invalidate({ formId });
            await utils.form.getForm.invalidate({ formId });
        },
    });

    return { updateFieldAsync, updateField, error, isError, isLoading };
};

export const useDeleteField = (formId: string) => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: deleteFieldAsync,
        mutate: deleteField,
        error,
        isError,
        isPending: isLoading,
    } = trpc.formField.deleteField.useMutation({
        onSuccess: async () => {
            await utils.formField.getFields.invalidate({ formId });
            await utils.form.getForm.invalidate({ formId });
        },
    });

    return { deleteFieldAsync, deleteField, error, isError, isLoading };
};
