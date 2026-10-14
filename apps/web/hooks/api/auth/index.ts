import { trpc } from "~/trpc/client"

export const useSignup = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status

    } = trpc.auth.createUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    });

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useSignIn = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
        onSuccess: async () => {
            await utils.auth.getLoggedInUserInfo.invalidate()
        }
    });

    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useSignOut = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: signOutAsync,
        mutate: signOut,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } = trpc.auth.signOut.useMutation({
        onSuccess: async () => {
            utils.auth.getLoggedInUserInfo.setData(undefined, undefined);
            await utils.auth.getLoggedInUserInfo.invalidate();
            await utils.invalidate();
        }
    });

    return {
        signOutAsync,
        signOut,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useUser = () => {
    const { data: user, error, isFetched, isFetching, isLoading, status } = trpc.auth.getLoggedInUserInfo.useQuery(undefined, {
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    return {
        user,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}

export const useRequestPasswordReset = () => {
    const {
        mutateAsync: requestPasswordResetAsync,
        mutate: requestPasswordReset,
        data,
        error,
        isPending,
        isSuccess,
        status,
    } = trpc.auth.requestPasswordReset.useMutation();

    return {
        requestPasswordResetAsync,
        requestPasswordReset,
        data,
        error,
        isPending,
        isSuccess,
        status,
    };
};

export const useResetPassword = () => {
    const {
        mutateAsync: resetPasswordAsync,
        mutate: resetPassword,
        data,
        error,
        isPending,
        isSuccess,
        status,
    } = trpc.auth.resetPassword.useMutation();

    return {
        resetPasswordAsync,
        resetPassword,
        data,
        error,
        isPending,
        isSuccess,
        status,
    };
};