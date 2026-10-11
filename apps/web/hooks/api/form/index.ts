import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    };
};

export const useListForms = () => {
    const { data: forms, error, isFetched, isFetching, isLoading, status } =
        trpc.form.listForms.useQuery();

    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useGetForm = (formId: string, password?: string) => {
    const { data: form, error, isFetched, isFetching, isLoading, status, refetch } =
        trpc.form.getForm.useQuery({ formId, password }, { retry: false });

    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
        refetch,
    };
};

export const useUpdateFormVisibility = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: updateFormVisibilityAsync,
        mutate: updateFormVisibility,
        error,
        isError,
        isPending: isLoading,
    } = trpc.form.updateFormVisibility.useMutation({
        onSuccess: async (data) => {
            await utils.form.getForm.invalidate({ formId: data.id });
            await utils.form.listForms.invalidate();
        },
    });

    return { updateFormVisibilityAsync, updateFormVisibility, error, isError, isLoading };
};

export const useUpdateFormSettings = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: updateFormSettingsAsync,
        mutate: updateFormSettings,
        error,
        isError,
        isPending: isLoading,
    } = trpc.form.updateFormSettings.useMutation({
        onSuccess: async (data) => {
            await utils.form.getForm.invalidate({ formId: data.id });
            await utils.form.listForms.invalidate();
        },
    });

    return { updateFormSettingsAsync, updateFormSettings, error, isError, isLoading };
};

export const useListPublicForms = () => {
    const { data: publicForms, error, isFetched, isFetching, isLoading, status } =
        trpc.form.listPublicForms.useQuery();

    return {
        publicForms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useCloneForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: cloneFormAsync,
        mutate: cloneForm,
        error,
        isError,
        isPending: isLoading,
    } = trpc.form.cloneForm.useMutation({
        onSuccess: async () => {
            await utils.form.listForms.invalidate();
        },
    });

    return { cloneFormAsync, cloneForm, error, isError, isLoading };
};

export const useArchiveForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: archiveFormAsync,
        mutate: archiveForm,
        error,
        isError,
        isPending: isLoading,
    } = trpc.form.archiveForm.useMutation({
        onSuccess: async (data) => {
            await utils.form.getForm.invalidate({ formId: data.id });
            await utils.form.listForms.invalidate();
        },
    });

    return { archiveFormAsync, archiveForm, error, isError, isLoading };
};

export const useRecordFormView = () => {
    const {
        mutateAsync: recordViewAsync,
        mutate: recordView,
    } = trpc.form.recordView.useMutation();

    return { recordViewAsync, recordView };
};



