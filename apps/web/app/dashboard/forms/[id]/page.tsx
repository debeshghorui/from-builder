"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import type { RouterOutputs } from "@repo/trpc/client";

import {
    useCreateFormField,
    useGetFormById,
    useGetFormFields,
} from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const fieldTypes = [
    "TEXT",
    "NUMBER",
    "EMAIL",
    "PHONE",
    "YES_NO",
    "PASSWORD",
] as const;
type FormFieldType = (typeof fieldTypes)[number];
type FormFieldListItem = RouterOutputs["form"]["getFormFields"][number];

export default function FormBuilderPage() {
    const { id: formId } = useParams<{ id: string }>();
    const {
        form,
        isPending: isFormPending,
        isError: isFormError,
        error: formError,
    } = useGetFormById(formId);
    const {
        formFields,
        isPending: areFieldsPending,
        isError: areFieldsError,
        error: fieldsError,
    } = useGetFormFields(formId);
    const { createFormFieldAsync, isPending: isCreatingField } =
        useCreateFormField();
    const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
    const [label, setLabel] = useState("");
    const [fieldType, setFieldType] = useState<FormFieldType>("TEXT");
    const [isRequired, setIsRequired] = useState(false);

    const handleAddField = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedLabel = label.trim();
        if (!trimmedLabel) return;

        try {
            await createFormFieldAsync({
                formId,
                label: trimmedLabel,
                type: fieldType,
                isRequired,
            });
        } catch {
            return;
        }

        setLabel("");
        setFieldType("TEXT");
        setIsRequired(false);
        setIsAddFieldOpen(false);
    };

    if (isFormPending) {
        return <main className="p-6 text-sm">Loading form…</main>;
    }

    if (isFormError || !form) {
        return (
            <main className="space-y-4 p-6">
                <p className="text-destructive" role="alert">
                    {formError?.message || "Could not load this form."}
                </p>
                <Button asChild variant="outline">
                    <Link href="/dashboard/forms">
                        <ArrowLeft aria-hidden="true" />
                        Back to forms
                    </Link>
                </Button>
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div>
                <Button asChild variant="ghost" className="mb-3 -ml-3">
                    <Link href="/dashboard/forms">
                        <ArrowLeft aria-hidden="true" />
                        All forms
                    </Link>
                </Button>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-muted-foreground text-sm">
                            Form builder
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            {form.title}
                        </h1>
                        {form.description && (
                            <p className="text-muted-foreground mt-2 text-sm">
                                {form.description}
                            </p>
                        )}
                    </div>
                    <span className="bg-muted rounded-full px-3 py-1 text-xs font-medium">
                        {form.published ? "Published" : "Draft"}
                    </span>
                </div>
            </div>

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">Form fields</h2>
                        <p className="text-muted-foreground text-sm">
                            Add and arrange the questions people will answer.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddFieldOpen(true)}
                        disabled={(formFields?.length ?? 0) >= 100}
                    >
                        <Plus aria-hidden="true" />
                        Add field
                    </Button>
                </div>

                {areFieldsPending ? (
                    <div className="text-muted-foreground rounded-xl border p-6 text-sm">
                        Loading fields…
                    </div>
                ) : areFieldsError ? (
                    <div
                        className="text-destructive rounded-xl border p-6 text-sm"
                        role="alert"
                    >
                        {fieldsError?.message || "Could not load form fields."}
                    </div>
                ) : formFields && formFields.length > 0 ? (
                    <ol className="space-y-3">
                        {formFields.map(
                            (field: FormFieldListItem, index: number) => (
                                <li
                                    key={field.id}
                                    className="bg-card flex items-start justify-between gap-4 rounded-xl border p-4"
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="text-muted-foreground mt-0.5 text-sm">
                                            {index + 1}.
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {field.label}
                                            </p>
                                            {field.description && (
                                                <p className="text-muted-foreground mt-1 text-sm">
                                                    {field.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-xs">
                                        <span>
                                            {field.type.replaceAll("_", " ")}
                                        </span>
                                        {field.isRequired && (
                                            <span>Required</span>
                                        )}
                                    </div>
                                </li>
                            ),
                        )}
                    </ol>
                ) : (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center">
                        <h3 className="font-medium">No fields yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                            Add your first field to start building this form.
                        </p>
                        <Button
                            className="mt-4"
                            variant="outline"
                            onClick={() => setIsAddFieldOpen(true)}
                        >
                            <Plus aria-hidden="true" />
                            Add first field
                        </Button>
                    </div>
                )}
            </section>

            <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a form field</DialogTitle>
                        <DialogDescription>
                            Choose a label and response type for this field.
                        </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-5" onSubmit={handleAddField}>
                        <div className="space-y-2">
                            <Label htmlFor="field-label">Field label</Label>
                            <Input
                                id="field-label"
                                autoFocus
                                maxLength={55}
                                required
                                placeholder="e.g. Your name"
                                value={label}
                                onChange={(event) =>
                                    setLabel(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="field-type">Response type</Label>
                            <select
                                id="field-type"
                                className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                                value={fieldType}
                                onChange={(event) =>
                                    setFieldType(
                                        event.target.value as FormFieldType,
                                    )
                                }
                            >
                                {fieldTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type.replaceAll("_", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={isRequired}
                                onChange={(event) =>
                                    setIsRequired(event.target.checked)
                                }
                            />
                            Required field
                        </label>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isCreatingField}
                                onClick={() => setIsAddFieldOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreatingField || !label.trim()}
                            >
                                {isCreatingField ? "Adding…" : "Add field"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    );
}
