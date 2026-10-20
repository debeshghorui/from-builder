import { trpc } from "~/trpc/client";
import { toast } from "sonner";

// Create User With Email And Password Hook
export const useSignup = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.auth.createUserWithEmailAndPassword.useMutation({
        onSuccess: () => {
            utils.auth.getLoggedInUserInfo.invalidate();
        },

        onError: (error) => {
            toast.error(error.message || "Failed to create user");
        },
    });

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    };
};

// Sign In User With Email And Password Hook
export const useSignin = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation({
        onSuccess: () => {
            utils.auth.getLoggedInUserInfo.invalidate();
        },

        onError: (error) => {
            toast.error(error.message || "Failed to sign in");
        },

        onSettled: () => {
            utils.auth.getLoggedInUserInfo.invalidate();
        },
    });

    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    };
};

// Get Logged In User Info Hook
export const useUser = () => {
    const {
        data: user,
        isPending,
        isFetched,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.auth.getLoggedInUserInfo.useQuery();

    return {
        user,
        isPending,
        isFetched,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    };
};
