import { trpc } from "~/trpc/client";

export const useSubmitForm = () => {
    const { mutateAsync: submitFormAsync, mutate: submitForm, error, isError, isPending: isLoading } =
        trpc.formSubmission.submitForm.useMutation();

    return { submitFormAsync, submitForm, error, isError, isLoading };
};

export const useGetFormSubmissions = (formId: string) => {
    const { data: submissions, error, isFetched, isFetching, isLoading, status } =
        trpc.formSubmission.getFormSubmissions.useQuery({ formId });

    return {
        submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useUserWorkspaceStats = () => {
    const { data: stats, error, isFetched, isFetching, isLoading, status, refetch } =
        trpc.formSubmission.getUserWorkspaceStats.useQuery(undefined, {
            staleTime: 5 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        });

    return {
        stats,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
        refetch,
    };
};
