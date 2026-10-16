import { trpc } from "~/trpc/client";

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
