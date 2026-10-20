import { toast } from "sonner";
import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.form.createForm.useMutation({
        onSuccess: () => {
            utils.form.getAllFormsByUserId.invalidate();
        },
        onError: (mutationError) => {
            toast.error(mutationError.message || "Failed to create form");
        },
    });

    return {
        createFormAsync,
        createForm,
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
