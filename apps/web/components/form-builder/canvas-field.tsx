"use client";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "~/components/ui/button";
import {
    fieldTypeDetails,
    type BuilderDragData,
    type FormFieldListItem,
} from "./types";

const canvasDropId = "form-canvas-drop";

type CanvasFieldProps = {
    field: FormFieldListItem;
    position: number;
    disabled: boolean;
    selected: boolean;
    selectionDisabled: boolean;
    onSelect: () => void;
};

export function CanvasField({
    field,
    position,
    disabled,
    selected,
    selectionDisabled,
    onSelect,
}: CanvasFieldProps) {
    const dragData = {
        kind: "canvas-field",
        fieldId: field.id,
    } satisfies BuilderDragData;
    const sortableOptions = {
        id: field.id,
        disabled,
        data: dragData,
    } satisfies Parameters<typeof useSortable>[0];
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable(sortableOptions);

    return (
        <li
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={`card-chai flex items-start gap-3 p-4 ${isDragging ? "z-10 opacity-70" : ""} ${selected ? "border-primary ring-primary/30 ring-1" : ""}`}
        >
            <Button
                ref={setActivatorNodeRef}
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground mt-0.5 cursor-grab touch-none active:cursor-grabbing"
                aria-label={`Reorder ${field.label}, position ${position}`}
                disabled={disabled}
                {...attributes}
                {...listeners}
            >
                <GripVertical aria-hidden="true" />
            </Button>
            <button
                type="button"
                className="focus-visible:ring-ring min-w-0 flex-1 text-left focus-visible:ring-2 focus-visible:outline-none"
                aria-pressed={selected}
                disabled={selectionDisabled}
                onClick={onSelect}
            >
                <span className="text-muted-foreground text-xs tabular-nums">
                    Question {position} · {fieldTypeDetails[field.type].label}
                    {field.isRequired ? " · Required" : ""}
                </span>
                <span className="mt-1 block truncate font-medium">
                    {field.label}
                </span>
                {field.description && (
                    <span className="text-muted-foreground mt-1 line-clamp-2 block text-sm">
                        {field.description}
                    </span>
                )}
                {field.placeholder && (
                    <span className="text-muted-foreground mt-2 block rounded-md border border-dashed px-3 py-2 text-xs">
                        {field.placeholder}
                    </span>
                )}
            </button>
        </li>
    );
}

export function CanvasDropSurface({ children }: { children: ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({ id: canvasDropId });
    return (
        <div
            ref={setNodeRef}
            className={`min-h-64 rounded-xl border p-3 transition-colors sm:p-4 ${isOver ? "border-primary bg-primary/5" : "border-dashed"}`}
        >
            {children}
        </div>
    );
}

export { canvasDropId };
