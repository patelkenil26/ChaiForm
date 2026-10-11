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
