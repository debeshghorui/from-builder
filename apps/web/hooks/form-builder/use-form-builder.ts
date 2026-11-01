import { useEffect, useRef, useState } from "react";
import {
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { FormEvent } from "react";

import {
    useCreateFormField,
    useDeleteFormField,
    useGetFormFields,
    useReorderFormFields,
    useUpdateFormField,
} from "~/hooks/api/form";
import {
    areEditorValuesEqual,
    emptyEditorValues,
    getFieldEditorValues,
    parseBuilderDragData,
    type FieldEditorValues,
    type FormFieldListItem,
    type FormFieldType,
} from "~/components/form-builder/types";

const canvasDropId = "form-canvas-drop";

export function useFormBuilder(formId: string, pageId?: string) {
    const fieldsQuery = useGetFormFields(formId);
    const createFieldMutation = useCreateFormField();
    const updateFieldMutation = useUpdateFormField();
    const deleteFieldMutation = useDeleteFormField();
    const reorderFieldsMutation = useReorderFormFields();

    const [optimisticFields, setOptimisticFields] = useState<
        FormFieldListItem[] | null
    >(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [editorValues, setEditorValues] =
        useState<FieldEditorValues>(emptyEditorValues);
    const [activePaletteType, setActivePaletteType] =
        useState<FormFieldType | null>(null);
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);
    const [pendingSelectionId, setPendingSelectionId] = useState<string | null>(
        null,
    );
    const [isUnsavedDialogOpen, setIsUnsavedDialogOpen] = useState(false);
    const [pendingInspectorClose, setPendingInspectorClose] = useState(false);
    const [fieldToDelete, setFieldToDelete] =
        useState<FormFieldListItem | null>(null);
    const [optionsError, setOptionsError] = useState<string | null>(null);
    const [labelError, setLabelError] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState("");
    const previousSelectedFieldId = useRef<string | undefined>(undefined);

    const allFields: FormFieldListItem[] =
        optimisticFields ?? fieldsQuery.formFields ?? [];
    const fields = pageId
        ? allFields.filter((field) => field.pageId === pageId)
        : allFields;
    const selectedField =
        fields.find((field) => field.id === selectedFieldId) ?? null;
    const isAtFieldLimit = allFields.length >= 100;
    const hasUnsavedChanges = Boolean(
        selectedField &&
        !areEditorValuesEqual(
            editorValues,
            getFieldEditorValues(selectedField),
        ),
    );
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    useEffect(() => {
        setOptimisticFields(null);
    }, [fieldsQuery.formFields]);

    useEffect(() => {
        const currentSelectedFieldId = selectedField?.id;
        if (previousSelectedFieldId.current === currentSelectedFieldId) return;
        previousSelectedFieldId.current = currentSelectedFieldId;
        setEditorValues(
            selectedField
                ? getFieldEditorValues(selectedField)
                : emptyEditorValues,
        );
        setOptionsError(null);
        setLabelError(null);
    }, [selectedField]);

    const commitSelection = (fieldId: string | null) => {
        setSelectedFieldId(fieldId);
        setIsInspectorOpen(Boolean(fieldId));
        setPendingSelectionId(null);
        setPendingInspectorClose(false);
        const nextField = fields.find((field) => field.id === fieldId);
        setEditorValues(
            nextField ? getFieldEditorValues(nextField) : emptyEditorValues,
        );
        setOptionsError(null);
        setLabelError(null);
    };

    const requestSelection = (fieldId: string) => {
        if (fieldId === selectedFieldId) {
            setIsInspectorOpen(true);
            return;
        }
        if (hasUnsavedChanges) {
            setAnnouncement(
                "Save or discard your changes before selecting another question.",
            );
            setPendingSelectionId(fieldId);
            setPendingInspectorClose(false);
            setIsUnsavedDialogOpen(true);
            return;
        }
        commitSelection(fieldId);
        const field = fields.find((item) => item.id === fieldId);
        if (field) setAnnouncement(`Selected ${field.label}. Settings opened.`);
    };

    const requestInspectorClose = () => {
        if (hasUnsavedChanges) {
            setPendingSelectionId(null);
            setPendingInspectorClose(true);
            setIsUnsavedDialogOpen(true);
            return;
        }
        setIsInspectorOpen(false);
    };

    const createField = async (type: FormFieldType, position?: number) => {
        if (isAtFieldLimit || createFieldMutation.isPending) return;
        try {
            const created = await createFieldMutation.createFormFieldAsync({
                formId,
                pageId,
                position,
                label: "Untitled question",
                type,
                isRequired: false,
                options: null,
            });
            if (hasUnsavedChanges) {
                requestSelection(created.id);
            } else {
                setEditorValues({
                    ...emptyEditorValues,
                    label: "Untitled question",
                    type,
                });
                commitSelection(created.id);
            }
            setAnnouncement(`${type} question added. Settings opened.`);
        } catch {
            setAnnouncement("Could not add this question.");
        }
    };

    const saveSelectedField = async (
        event?: FormEvent<HTMLFormElement>,
    ): Promise<boolean> => {
        event?.preventDefault();
        if (!selectedField) return false;
        const label = editorValues.label.trim();
        if (!label) {
            setLabelError("Enter a question label.");
            return false;
        }

        let options: unknown;
        if (editorValues.optionsJson.trim()) {
            try {
                options = JSON.parse(editorValues.optionsJson);
            } catch {
                setOptionsError("Enter valid JSON for field options.");
                return false;
            }
        }

        setOptionsError(null);
        setLabelError(null);
        try {
            await updateFieldMutation.updateFormFieldAsync({
                formId,
                id: selectedField.id,
                label,
                description: editorValues.description.trim() || null,
                placeholder: editorValues.placeholder.trim() || null,
                type: editorValues.type,
                isRequired: editorValues.isRequired,
                options: editorValues.optionsJson.trim() ? options : null,
            });
        } catch {
            return false;
        }
        setAnnouncement("Question settings saved.");
        return true;
    };

    const resolveUnsavedChanges = async (save: boolean) => {
        if (save && !(await saveSelectedField())) return;
        setIsUnsavedDialogOpen(false);
        commitSelection(pendingInspectorClose ? null : pendingSelectionId);
    };

    const closeUnsavedDialog = () => {
        setIsUnsavedDialogOpen(false);
        setPendingSelectionId(null);
        setPendingInspectorClose(false);
    };

    const deleteSelectedField = async () => {
        if (!fieldToDelete) return;
        try {
            await deleteFieldMutation.deleteFormFieldAsync({
                id: fieldToDelete.id,
                formId,
            });
            setFieldToDelete(null);
            commitSelection(null);
        } catch {
            // The mutation hook displays the error and leaves confirmation open.
        }
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        const data = parseBuilderDragData(active.data.current);
        setActivePaletteType(
            data?.kind === "palette-field" ? data.fieldType : null,
        );
        if (data?.kind === "palette-field") {
            setAnnouncement(`Moving ${data.fieldType} to the canvas.`);
        } else if (data?.kind === "canvas-field") {
            const field = fields.find((item) => item.id === data.fieldId);
            setAnnouncement(field ? `Moving ${field.label}.` : "Moving field.");
        }
    };

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
        setActivePaletteType(null);
        const activeData = parseBuilderDragData(active.data.current);
        if (!activeData || !over) return;

        if (activeData.kind === "palette-field") {
            let position = fields.length;
            if (over.id !== canvasDropId) {
                const targetPosition = fields.findIndex(
                    (field) => field.id === over.id,
                );
                if (targetPosition < 0) return;
                const translatedRect = active.rect.current.translated;
                const draggedCenter = translatedRect
                    ? translatedRect.top + translatedRect.height / 2
                    : over.rect.top;
                const targetCenter = over.rect.top + over.rect.height / 2;
                position =
                    targetPosition + (draggedCenter > targetCenter ? 1 : 0);
            }
            await createField(activeData.fieldType, position);
            return;
        }

        if (reorderFieldsMutation.isPending) return;
        const previousFields = fields;
        const oldPosition = previousFields.findIndex(
            (field) => field.id === activeData.fieldId,
        );
        const newPosition =
            over.id === canvasDropId
                ? previousFields.length - 1
                : previousFields.findIndex((field) => field.id === over.id);
        if (oldPosition < 0 || newPosition < 0 || oldPosition === newPosition) {
            return;
        }

        const reorderedFields = arrayMove(
            previousFields,
            oldPosition,
            newPosition,
        );
        setOptimisticFields(reorderedFields);
        setAnnouncement(
            `Moved ${reorderedFields[newPosition]?.label} to position ${newPosition + 1} of ${reorderedFields.length}. Saving order.`,
        );
        try {
            await reorderFieldsMutation.reorderFormFieldsAsync({
                formId,
                pageId,
                fieldIds: reorderedFields.map((field) => field.id),
            });
            setAnnouncement("Field order saved.");
        } catch {
            setOptimisticFields(previousFields);
            setAnnouncement(
                "Could not save field order. The previous order has been restored.",
            );
        }
    };

    return {
        fields: {
            items: fields,
            count: allFields.length,
            isAtLimit: isAtFieldLimit,
            isLoading: fieldsQuery.isPending,
            isError: fieldsQuery.isError,
            error: fieldsQuery.error,
            refetch: fieldsQuery.refetch,
        },
        selection: {
            field: selectedField,
            fieldId: selectedFieldId,
            isInspectorOpen,
            hasUnsavedChanges,
            request: requestSelection,
            requestClose: requestInspectorClose,
        },
        editor: {
            values: editorValues,
            setValues: (values: FieldEditorValues) => {
                setEditorValues(values);
                setOptionsError(null);
                setLabelError(null);
            },
            save: saveSelectedField,
            isSaving: updateFieldMutation.isPending,
            labelError,
            optionsError,
        },
        palette: {
            add: createField,
            isAdding: createFieldMutation.isPending,
            isAtLimit: isAtFieldLimit,
        },
        drag: {
            sensors,
            activePaletteType,
            isReordering: reorderFieldsMutation.isPending,
            onStart: handleDragStart,
            onEnd: handleDragEnd,
            onCancel: () => {
                setActivePaletteType(null);
                setAnnouncement("Move cancelled.");
            },
        },
        dialogs: {
            unsaved: {
                isOpen: isUnsavedDialogOpen,
                close: closeUnsavedDialog,
                save: () => resolveUnsavedChanges(true),
                discard: () => resolveUnsavedChanges(false),
            },
            deleteField: {
                field: fieldToDelete,
                setField: setFieldToDelete,
                confirm: deleteSelectedField,
                isDeleting: deleteFieldMutation.isPending,
            },
        },
        announcement,
    };
}
