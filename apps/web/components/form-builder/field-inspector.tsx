"use client";

import type { FormEvent } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
    fieldTypeDetails,
    fieldTypes,
    isFormFieldType,
    type FieldEditorValues,
    type FormFieldListItem,
} from "./types";

type FieldInspectorProps = {
    field: FormFieldListItem | null;
    values: FieldEditorValues;
    saving: boolean;
    labelError: string | null;
    optionsError: string | null;
    onChange: (values: FieldEditorValues) => void;
    onSave: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    onDelete: (field: FormFieldListItem) => void;
};

export function FieldInspector({
    field,
    values,
    saving,
    labelError,
    optionsError,
    onChange,
    onSave,
    onCancel,
    onDelete,
}: FieldInspectorProps) {
    if (!field) {
        return (
            <section className="card-chai flex min-h-64 flex-col items-center justify-center gap-2 p-5 text-center">
                <h2 className="text-sm font-semibold">Field settings</h2>
                <p className="text-muted-foreground text-sm">
                    Add a question or select one on the canvas to edit it.
                </p>
            </section>
        );
    }

    return (
        <section className="card-chai p-4 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-medium">
                        {fieldTypeDetails[values.type].label}
                    </p>
                    <h2 className="mt-1 truncate text-base font-semibold">
                        Field settings
                    </h2>
                    <p className="text-muted-foreground mt-1 text-xs">
                        Changes apply to this question only.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Delete ${field.label}`}
                    disabled={saving}
                    onClick={() => onDelete(field)}
                >
                    <Trash2 aria-hidden="true" />
                </Button>
            </div>
            <form className="space-y-4" onSubmit={onSave}>
                <div className="space-y-2">
                    <Label htmlFor="field-label">Question</Label>
                    <Input
                        id="field-label"
                        maxLength={55}
                        required
                        disabled={saving}
                        value={values.label}
                        aria-invalid={Boolean(labelError)}
                        onChange={(event) =>
                            onChange({ ...values, label: event.target.value })
                        }
                    />
                    {labelError && (
                        <p className="text-destructive text-sm" role="alert">
                            {labelError}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="field-description">Description</Label>
                    <Textarea
                        id="field-description"
                        placeholder="Help explain this question"
                        disabled={saving}
                        value={values.description}
                        onChange={(event) =>
                            onChange({
                                ...values,
                                description: event.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="field-placeholder">Placeholder</Label>
                    <Input
                        id="field-placeholder"
                        placeholder="Text shown inside the answer field"
                        disabled={saving}
                        value={values.placeholder}
                        onChange={(event) =>
                            onChange({
                                ...values,
                                placeholder: event.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="field-type">Response type</Label>
                    <select
                        id="field-type"
                        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                        value={values.type}
                        disabled={saving}
                        onChange={(event) => {
                            if (!isFormFieldType(event.target.value)) return;
                            onChange({ ...values, type: event.target.value });
                        }}
                    >
                        {fieldTypes.map((type) => (
                            <option key={type} value={type}>
                                {fieldTypeDetails[type].label}
                            </option>
                        ))}
                    </select>
                </div>
                <label
                    htmlFor="field-required"
                    className="flex items-center gap-2 text-sm"
                >
                    <input
                        id="field-required"
                        type="checkbox"
                        disabled={saving}
                        checked={values.isRequired}
                        onChange={(event) =>
                            onChange({
                                ...values,
                                isRequired: event.target.checked,
                            })
                        }
                    />
                    Required field
                </label>
                <details className="rounded-lg border px-3 py-2">
                    <summary className="cursor-pointer text-sm font-medium">
                        Advanced options (JSON)
                    </summary>
                    <div className="mt-3 space-y-2">
                        <Label htmlFor="field-options">Field options</Label>
                        <Textarea
                            id="field-options"
                            rows={5}
                            placeholder={'{"choices":["Option 1","Option 2"]}'}
                            value={values.optionsJson}
                            disabled={saving}
                            aria-invalid={Boolean(optionsError)}
                            onChange={(event) =>
                                onChange({
                                    ...values,
                                    optionsJson: event.target.value,
                                })
                            }
                        />
                        {optionsError && (
                            <p
                                className="text-destructive text-sm"
                                role="alert"
                            >
                                {optionsError}
                            </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                            Stored as JSON for fields that need extra
                            configuration.
                        </p>
                    </div>
                </details>
                <div className="flex gap-2 pt-1">
                    <Button type="submit" className="flex-1" disabled={saving}>
                        {saving ? "Saving…" : "Save changes"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={saving}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </section>
    );
}
