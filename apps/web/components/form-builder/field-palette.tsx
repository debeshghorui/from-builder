"use client";

import { Plus } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

import { Button } from "~/components/ui/button";
import {
    fieldTypeDetails,
    fieldTypes,
    type BuilderDragData,
    type FormFieldType,
} from "./types";

type FieldPaletteProps = {
    disabled: boolean;
    onAdd: (type: FormFieldType) => void;
};

function PaletteItem({
    type,
    disabled,
    onAdd,
}: FieldPaletteProps & { type: FormFieldType }) {
    const dragData = {
        kind: "palette-field",
        fieldType: type,
    } satisfies BuilderDragData;
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${type}`,
        data: dragData,
        disabled,
    });
    const detail = fieldTypeDetails[type];
    const Icon = detail.icon;

    return (
        <Button
            ref={setNodeRef}
            type="button"
            variant="outline"
            className={`h-auto w-full justify-start p-3 text-left whitespace-normal ${isDragging ? "opacity-50" : ""} ${disabled ? "cursor-not-allowed" : "cursor-grab touch-none active:cursor-grabbing"}`}
            aria-label={`Add ${detail.label} field`}
            disabled={disabled}
            onClick={() => onAdd(type)}
            {...attributes}
            {...listeners}
        >
            <span className="bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border">
                <Icon aria-hidden="true" className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                    {detail.label}
                </span>
                <span className="text-muted-foreground block text-xs font-normal">
                    {detail.description}
                </span>
            </span>
            <Plus aria-hidden="true" className="text-muted-foreground size-4" />
        </Button>
    );
}

export function FieldPalette({ disabled, onAdd }: FieldPaletteProps) {
    return (
        <section aria-label="Field components" className="space-y-3">
            <div>
                <h2 className="text-sm font-semibold">Add a question</h2>
                <p className="text-muted-foreground mt-1 text-xs">
                    Drag a type to the canvas or select it to add.
                </p>
            </div>
            <div className="grid gap-2">
                {fieldTypes.map((type) => (
                    <PaletteItem
                        key={type}
                        type={type}
                        disabled={disabled}
                        onAdd={onAdd}
                    />
                ))}
            </div>
            {disabled && (
                <p className="text-muted-foreground text-xs" role="status">
                    Forms can have up to 100 fields.
                </p>
            )}
        </section>
    );
}
