import { trpc } from "~/trpc/client";

// Create User With Email And Password Hook
export const useSignup = () => {
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
    } = trpc.auth.createUserWithEmailAndPassword.useMutation();

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
    } = trpc.auth.signInUserWithEmailAndPassword.useMutation();

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
