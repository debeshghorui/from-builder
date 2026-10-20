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

export const useGetAllFormsByUserId = () => {
    const {
        data: forms,
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        status,
    } = trpc.form.getAllFormsByUserId.useQuery();

    return {
        forms,
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        status,
    };
};

export const useGetFormById = (formId: string) => {
    const {
        data: form,
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        status,
    } = trpc.form.getFormById.useQuery(
        { id: formId },
        { enabled: Boolean(formId) },
    );

    return {
        form,
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        status,
    };
};

export const useUpdateForm = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: updateFormAsync,
        mutate: updateForm,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.form.updateForm.useMutation({
        onSuccess: async (_form, input) => {
            await Promise.all([
                utils.form.getAllFormsByUserId.invalidate(),
                utils.form.getFormById.invalidate({ id: input.id }),
            ]);
        },
        onError: (mutationError) => {
            toast.error(mutationError.message || "Failed to update form");
        },
    });

    return {
        updateFormAsync,
        updateForm,
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

export const useDeleteForm = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: deleteFormAsync,
        mutate: deleteForm,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.form.deleteForm.useMutation({
        onSuccess: async (_result, input) => {
            await Promise.all([
                utils.form.getAllFormsByUserId.invalidate(),
                utils.form.getFormById.invalidate({ id: input.id }),
            ]);
        },
        onError: (mutationError) => {
            toast.error(mutationError.message || "Failed to delete form");
        },
    });

    return {
        deleteFormAsync,
        deleteForm,
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

export const usePublishForm = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: publishFormAsync,
        mutate: publishForm,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.form.publishForm.useMutation({
        onSuccess: async (_form, input) => {
            await Promise.all([
                utils.form.getAllFormsByUserId.invalidate(),
                utils.form.getFormById.invalidate({ id: input.id }),
            ]);
        },
        onError: (mutationError) => {
            toast.error(mutationError.message || "Failed to publish form");
        },
    });

    return {
        publishFormAsync,
        publishForm,
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

export const useUnpublishForm = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: unpublishFormAsync,
        mutate: unpublishForm,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.form.unpublishForm.useMutation({
        onSuccess: async (_form, input) => {
            await Promise.all([
                utils.form.getAllFormsByUserId.invalidate(),
                utils.form.getFormById.invalidate({ id: input.id }),
            ]);
        },
        onError: (mutationError) => {
            toast.error(mutationError.message || "Failed to unpublish form");
        },
    });

    return {
        unpublishFormAsync,
        unpublishForm,
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

export const useGetFormFields = (formId: string) => {
    const {
        data: formFields,
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        status,
    } = trpc.form.getFormFields.useQuery(
        { id: formId },
        { enabled: Boolean(formId) },
    );

    return {
        formFields,
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        status,
    };
};

export const useCreateFormField = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: createFormFieldAsync,
        mutate: createFormField,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.form.createFormField.useMutation({
        onSuccess: async (_field, input) => {
            await utils.form.getFormFields.invalidate({ id: input.formId });
        },
        onError: (mutationError) => {
            toast.error(mutationError.message || "Failed to create form field");
        },
    });

    return {
        createFormFieldAsync,
        createFormField,
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

export const useUpdateFormField = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: updateFormFieldAsync,
        mutate: updateFormField,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.form.updateFormField.useMutation({
        onSuccess: async (_field, input) => {
            await utils.form.getFormFields.invalidate({ id: input.formId });
        },
        onError: (mutationError) => {
            toast.error(mutationError.message || "Failed to update form field");
        },
    });

    return {
        updateFormFieldAsync,
        updateFormField,
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

export const useDeleteFormField = () => {
    const utils = trpc.useUtils();
    const {
        mutateAsync: deleteFormFieldAsync,
        mutate: deleteFormField,
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = trpc.form.deleteFormField.useMutation({
        onSuccess: async (_field, input) => {
            await utils.form.getFormFields.invalidate({ id: input.formId });
        },
        onError: (mutationError) => {
            toast.error(mutationError.message || "Failed to delete form field");
        },
    });

    return {
        deleteFormFieldAsync,
        deleteFormField,
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
