import type { RouterOutputs } from "@repo/trpc/client";
import { Check, CircleHelp, Hash, Mail, Phone, Type } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FormFieldListItem = RouterOutputs["form"]["getFormFields"][number];
export type FormFieldType = FormFieldListItem["type"];

export const fieldTypes = [
    "TEXT",
    "NUMBER",
    "EMAIL",
    "PHONE",
    "YES_NO",
    "PASSWORD",
] satisfies readonly FormFieldType[];

export const fieldTypeDetails = {
    TEXT: {
        label: "Short text",
        description: "A short written answer",
        icon: Type,
    },
    NUMBER: {
        label: "Number",
        description: "A numeric answer",
        icon: Hash,
    },
    EMAIL: {
        label: "Email",
        description: "An email address",
        icon: Mail,
    },
    PHONE: {
        label: "Phone",
        description: "A phone number",
        icon: Phone,
    },
    YES_NO: {
        label: "Yes or no",
        description: "A simple choice",
        icon: Check,
    },
    PASSWORD: {
        label: "Password",
        description: "A private text answer",
        icon: CircleHelp,
    },
} satisfies Record<
    FormFieldType,
    { label: string; description: string; icon: LucideIcon }
>;

export type FieldEditorValues = {
    label: string;
    description: string;
    placeholder: string;
    optionsJson: string;
    type: FormFieldType;
    isRequired: boolean;
};

export const emptyEditorValues: FieldEditorValues = {
    label: "",
    description: "",
    placeholder: "",
    optionsJson: "",
    type: "TEXT",
    isRequired: false,
};

export function getFieldEditorValues(
    field: FormFieldListItem,
): FieldEditorValues {
    return {
        label: field.label,
        description: field.description ?? "",
        placeholder: field.placeholder ?? "",
        optionsJson:
            field.options == null
                ? ""
                : (JSON.stringify(field.options, null, 2) ?? ""),
        type: field.type,
        isRequired: field.isRequired,
    };
}

export function areEditorValuesEqual(
    left: FieldEditorValues,
    right: FieldEditorValues,
): boolean {
    return (
        left.label === right.label &&
        left.description === right.description &&
        left.placeholder === right.placeholder &&
        left.optionsJson === right.optionsJson &&
        left.type === right.type &&
        left.isRequired === right.isRequired
    );
}

export function isFormFieldType(value: unknown): value is FormFieldType {
    return (
        typeof value === "string" &&
        fieldTypes.some((fieldType) => fieldType === value)
    );
}

export type BuilderDragData =
    | { kind: "palette-field"; fieldType: FormFieldType }
    | { kind: "canvas-field"; fieldId: string };

export function parseBuilderDragData(value: unknown): BuilderDragData | null {
    if (typeof value !== "object" || value === null || !("kind" in value))
        return null;

    if (
        value.kind === "palette-field" &&
        "fieldType" in value &&
        isFormFieldType(value.fieldType)
    ) {
        return { kind: "palette-field", fieldType: value.fieldType };
    }

    if (
        value.kind === "canvas-field" &&
        "fieldId" in value &&
        typeof value.fieldId === "string"
    ) {
        return { kind: "canvas-field", fieldId: value.fieldId };
    }

    return null;
}
