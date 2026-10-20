import { toast } from "sonner";
import { trpc } from "~/trpc/client";

type MutationStateLike = {
    isPending: boolean;
    isIdle: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: unknown;
    failureReason: unknown;
    failureCount: number;
    status: string;
};

// Return the common status values so each mutation hook can focus on its action.
function getMutationState<T extends MutationStateLike>(
    mutation: T,
): Pick<T, keyof MutationStateLike> {
    const {
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    } = mutation;

    return {
        isPending,
        isIdle,
        isSuccess,
        isError,
        error,
        failureReason,
        failureCount,
        status,
    };
}

type QueryStateLike = {
    isPending: boolean;
    isFetching: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: unknown;
    status: string;
};

// Return shared query status values while keeping each hook's data name clear.
function getQueryState<T extends QueryStateLike>(
    query: T,
): Pick<T, keyof QueryStateLike> {
    const {
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        status,
    } = query;

    return {
        isPending,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error,
        status,
    };
}

// Create a form and refresh the signed-in user's form list.
export const useCreateForm = () => {
    const utils = trpc.useUtils();
    const mutation = trpc.form.createForm.useMutation({
        onSuccess: () => {
            utils.form.getAllFormsByUserId.invalidate();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create form");
        },
    });

    return {
        createFormAsync: mutation.mutateAsync,
        createForm: mutation.mutate,
        ...getMutationState(mutation),
    };
};

// Load all forms owned by the signed-in user.
export const useGetAllFormsByUserId = () => {
    const query = trpc.form.getAllFormsByUserId.useQuery();

    return {
        forms: query.data,
        refetch: query.refetch,
        ...getQueryState(query),
    };
};

// Load one form by ID; the request stays disabled until an ID is provided.
export const useGetFormById = (formId: string) => {
    const query = trpc.form.getFormById.useQuery(
        { id: formId },
        { enabled: Boolean(formId) },
    );

    return {
        form: query.data,
        refetch: query.refetch,
        ...getQueryState(query),
    };
};

// Update a form and refresh both the user's list and that form's detail query.
export const useUpdateForm = () => {
    const utils = trpc.useUtils();
    const mutation = trpc.form.updateForm.useMutation({
        onSuccess: async (_form, input) => {
            await Promise.all([
                utils.form.getAllFormsByUserId.invalidate(),
                utils.form.getFormById.invalidate({ id: input.id }),
            ]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update form");
        },
    });

    return {
        updateFormAsync: mutation.mutateAsync,
        updateForm: mutation.mutate,
        ...getMutationState(mutation),
    };
};

// Soft-delete a form and refresh the affected form queries.
export const useDeleteForm = () => {
    const utils = trpc.useUtils();
    const mutation = trpc.form.deleteForm.useMutation({
        onSuccess: async (_result, input) => {
            await Promise.all([
                utils.form.getAllFormsByUserId.invalidate(),
                utils.form.getFormById.invalidate({ id: input.id }),
            ]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete form");
        },
    });

    return {
        deleteFormAsync: mutation.mutateAsync,
        deleteForm: mutation.mutate,
        ...getMutationState(mutation),
    };
};

// Publish a form and refresh its list and detail queries.
export const usePublishForm = () => {
    const utils = trpc.useUtils();
    const mutation = trpc.form.publishForm.useMutation({
        onSuccess: async (_form, input) => {
            await Promise.all([
                utils.form.getAllFormsByUserId.invalidate(),
                utils.form.getFormById.invalidate({ id: input.id }),
            ]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to publish form");
        },
    });

    return {
        publishFormAsync: mutation.mutateAsync,
        publishForm: mutation.mutate,
        ...getMutationState(mutation),
    };
};

// Unpublish a form and refresh its list and detail queries.
export const useUnpublishForm = () => {
    const utils = trpc.useUtils();
    const mutation = trpc.form.unpublishForm.useMutation({
        onSuccess: async (_form, input) => {
            await Promise.all([
                utils.form.getAllFormsByUserId.invalidate(),
                utils.form.getFormById.invalidate({ id: input.id }),
            ]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to unpublish form");
        },
    });

    return {
        unpublishFormAsync: mutation.mutateAsync,
        unpublishForm: mutation.mutate,
        ...getMutationState(mutation),
    };
};

// Load the fields belonging to a form; wait until the form ID is available.
export const useGetFormFields = (formId: string) => {
    const query = trpc.form.getFormFields.useQuery(
        { id: formId },
        { enabled: Boolean(formId) },
    );

    return {
        formFields: query.data,
        refetch: query.refetch,
        ...getQueryState(query),
    };
};

// Create a form field and refresh that form's field list.
export const useCreateFormField = () => {
    const utils = trpc.useUtils();
    const mutation = trpc.form.createFormField.useMutation({
        onSuccess: async (_field, input) => {
            await utils.form.getFormFields.invalidate({ id: input.formId });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create form field");
        },
    });

    return {
        createFormFieldAsync: mutation.mutateAsync,
        createFormField: mutation.mutate,
        ...getMutationState(mutation),
    };
};

// Update a form field and refresh its form's field list.
export const useUpdateFormField = () => {
    const utils = trpc.useUtils();
    const mutation = trpc.form.updateFormField.useMutation({
        onSuccess: async (_field, input) => {
            await utils.form.getFormFields.invalidate({ id: input.formId });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update form field");
        },
    });

    return {
        updateFormFieldAsync: mutation.mutateAsync,
        updateFormField: mutation.mutate,
        ...getMutationState(mutation),
    };
};

// Delete a form field and refresh its form's field list.
export const useDeleteFormField = () => {
    const utils = trpc.useUtils();
    const mutation = trpc.form.deleteFormField.useMutation({
        onSuccess: async (_field, input) => {
            await utils.form.getFormFields.invalidate({ id: input.formId });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete form field");
        },
    });

    return {
        deleteFormFieldAsync: mutation.mutateAsync,
        deleteFormField: mutation.mutate,
        ...getMutationState(mutation),
    };
};
