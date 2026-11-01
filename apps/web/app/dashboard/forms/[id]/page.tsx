"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ArrowLeft, Plus } from "lucide-react";

import {
    CanvasDropSurface,
    CanvasField,
} from "~/components/form-builder/canvas-field";
import { FieldInspector } from "~/components/form-builder/field-inspector";
import { FieldPalette } from "~/components/form-builder/field-palette";
import {
    fieldTypeDetails,
    isFormFieldType,
} from "~/components/form-builder/types";
import { useFormBuilder } from "~/hooks/form-builder/use-form-builder";
import { useGetFormById } from "~/hooks/api/form";
import { Button } from "~/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "~/components/ui/drawer";
import { useIsMobile } from "~/hooks/use-mobile";
import {
    DashboardPage,
    FormStatus,
    PageHeading,
    PageState,
} from "~/components/app-page";

export default function FormBuilderPage() {
    const { id: formId } = useParams<{ id: string }>();
    const formQuery = useGetFormById(formId);
    const builder = useFormBuilder(formId);
    const isMobile = useIsMobile();
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const activePaletteType: unknown = builder.drag.activePaletteType;
    const activePaletteDetails = isFormFieldType(activePaletteType)
        ? fieldTypeDetails[activePaletteType]
        : null;
    const ActivePaletteIcon = activePaletteDetails?.icon;

    if (formQuery.isPending) {
        return (
            <DashboardPage>
                <PageState
                    variant="loading"
                    title="Loading form"
                    className="min-h-64"
                />
            </DashboardPage>
        );
    }

    if (formQuery.isError || !formQuery.form) {
        return (
            <DashboardPage>
                <PageState
                    variant="error"
                    title="Could not load this form"
                    description={
                        formQuery.error?.message ||
                        "Please try again in a moment."
                    }
                    className="min-h-64"
                >
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => void formQuery.refetch()}
                        >
                            Try again
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/dashboard/forms">
                                <ArrowLeft aria-hidden="true" />
                                Back to forms
                            </Link>
                        </Button>
                    </div>
                </PageState>
            </DashboardPage>
        );
    }

    const form = formQuery.form;
    const paletteDisabled =
        builder.fields.isAtLimit ||
        builder.fields.isLoading ||
        builder.fields.isError ||
        builder.palette.isAdding;

    const renderInspector = () => (
        <FieldInspector
            field={
                builder.selection.isInspectorOpen
                    ? builder.selection.field
                    : null
            }
            values={builder.editor.values}
            saving={builder.editor.isSaving || builder.palette.isAdding}
            labelError={builder.editor.labelError}
            optionsError={builder.editor.optionsError}
            onChange={builder.editor.setValues}
            onSave={(event) => void builder.editor.save(event)}
            onCancel={builder.selection.requestClose}
            onDelete={builder.dialogs.deleteField.setField}
        />
    );

    const handleMobilePaletteAdd = async (
        type: Parameters<typeof builder.palette.add>[0],
    ) => {
        await builder.palette.add(type);
        setIsPaletteOpen(false);
    };

    return (
        <DashboardPage>
            <div className="space-y-3">
                <Button asChild variant="ghost" className="mb-3 -ml-3">
                    <Link href="/dashboard/forms">
                        <ArrowLeft aria-hidden="true" />
                        All forms
                    </Link>
                </Button>
                <PageHeading
                    eyebrow="Form builder"
                    title={form.title}
                    description={form.description ?? undefined}
                    actions={<FormStatus published={form.published} />}
                />
            </div>

            <DndContext
                sensors={builder.drag.sensors}
                collisionDetection={closestCenter}
                onDragStart={builder.drag.onStart}
                onDragEnd={(event) => void builder.drag.onEnd(event)}
                onDragCancel={builder.drag.onCancel}
            >
                <div className="flex flex-wrap gap-2 lg:hidden">
                    <Button
                        variant="outline"
                        onClick={() => setIsPaletteOpen(true)}
                        disabled={paletteDisabled}
                    >
                        <Plus aria-hidden="true" />
                        Add question
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            const selectedField = builder.selection.field;
                            if (selectedField)
                                builder.selection.request(selectedField.id);
                        }}
                        disabled={!builder.selection.field}
                    >
                        Field settings
                    </Button>
                </div>

                <div className="grid min-w-0 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)_20rem]">
                    {!isMobile && (
                        <aside className="card-chai h-fit p-4 lg:sticky lg:top-4">
                            <FieldPalette
                                disabled={paletteDisabled}
                                onAdd={(type) => void builder.palette.add(type)}
                            />
                        </aside>
                    )}

                    <section
                        aria-label="Form canvas"
                        className="min-w-0 space-y-3"
                    >
                        <header className="flex items-end justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Form canvas
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    Add questions and arrange what respondents
                                    see.
                                </p>
                            </div>
                            <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                                {builder.fields.count} / 100
                            </span>
                        </header>

                        <CanvasDropSurface>
                            {builder.fields.isLoading ? (
                                <PageState
                                    variant="loading"
                                    title="Loading form fields"
                                    className="min-h-64"
                                />
                            ) : builder.fields.isError ? (
                                <PageState
                                    variant="error"
                                    title="Could not load form fields"
                                    description={
                                        builder.fields.error?.message ||
                                        "Please try again in a moment."
                                    }
                                    className="min-h-64"
                                >
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            void builder.fields.refetch()
                                        }
                                    >
                                        Try again
                                    </Button>
                                </PageState>
                            ) : builder.fields.items.length > 0 ? (
                                <SortableContext
                                    items={builder.fields.items.map(
                                        (field) => field.id,
                                    )}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <ol className="space-y-3">
                                        {builder.fields.items.map(
                                            (field, index) => (
                                                <CanvasField
                                                    key={field.id}
                                                    field={field}
                                                    position={index + 1}
                                                    disabled={
                                                        builder.drag
                                                            .isReordering ||
                                                        builder.palette.isAdding
                                                    }
                                                    selectionDisabled={
                                                        builder.palette.isAdding
                                                    }
                                                    selected={
                                                        field.id ===
                                                        builder.selection
                                                            .fieldId
                                                    }
                                                    onSelect={() =>
                                                        builder.selection.request(
                                                            field.id,
                                                        )
                                                    }
                                                />
                                            ),
                                        )}
                                    </ol>
                                </SortableContext>
                            ) : (
                                <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-5 text-center">
                                    <Plus
                                        aria-hidden="true"
                                        className="text-muted-foreground size-5"
                                    />
                                    <h3 className="text-sm font-semibold">
                                        Your canvas is empty
                                    </h3>
                                    <p className="text-muted-foreground max-w-xs text-sm">
                                        Drag a question type here or select one
                                        from the palette to start your form.
                                    </p>
                                </div>
                            )}
                        </CanvasDropSurface>
                    </section>

                    {!isMobile && (
                        <aside className="min-w-0">{renderInspector()}</aside>
                    )}
                </div>

                <DragOverlay>
                    {activePaletteDetails && ActivePaletteIcon ? (
                        <div className="card-chai flex items-center gap-3 p-3 shadow-xl">
                            <ActivePaletteIcon
                                aria-hidden="true"
                                className="size-4"
                            />
                            <span className="text-sm font-medium">
                                {activePaletteDetails.label}
                            </span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {isMobile && (
                <Drawer
                    open={isPaletteOpen}
                    onOpenChange={setIsPaletteOpen}
                    direction="left"
                >
                    <DrawerContent className="overflow-y-auto p-4">
                        <DrawerHeader className="px-0">
                            <DrawerTitle>Add a question</DrawerTitle>
                            <DrawerDescription>
                                Choose a type to add it to the canvas.
                            </DrawerDescription>
                        </DrawerHeader>
                        <FieldPalette
                            disabled={paletteDisabled}
                            onAdd={(type) => void handleMobilePaletteAdd(type)}
                        />
                    </DrawerContent>
                </Drawer>
            )}

            {isMobile && (
                <Drawer
                    open={
                        builder.selection.isInspectorOpen &&
                        Boolean(builder.selection.field)
                    }
                    onOpenChange={(open) => {
                        if (!open) builder.selection.requestClose();
                    }}
                    direction="right"
                >
                    <DrawerContent className="overflow-y-auto p-4 sm:max-w-lg">
                        <DrawerHeader className="px-0">
                            <DrawerTitle>Field settings</DrawerTitle>
                            <DrawerDescription>
                                Edit the selected question.
                            </DrawerDescription>
                        </DrawerHeader>
                        {renderInspector()}
                    </DrawerContent>
                </Drawer>
            )}

            <p
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {builder.announcement}
            </p>

            <AlertDialog
                open={builder.dialogs.unsaved.isOpen}
                onOpenChange={(open) => {
                    if (!open) builder.dialogs.unsaved.close();
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Unsaved question changes
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Save your changes before leaving this question, or
                            discard them.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Continue editing</AlertDialogCancel>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                void builder.dialogs.unsaved.discard()
                            }
                        >
                            Discard changes
                        </Button>
                        <Button
                            type="button"
                            disabled={builder.editor.isSaving}
                            onClick={() => void builder.dialogs.unsaved.save()}
                        >
                            {builder.editor.isSaving
                                ? "Saving…"
                                : "Save changes"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={Boolean(builder.dialogs.deleteField.field)}
                onOpenChange={(open) => {
                    if (!open && !builder.dialogs.deleteField.isDeleting) {
                        builder.dialogs.deleteField.setField(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this field?</AlertDialogTitle>
                        <AlertDialogDescription>
                            “{builder.dialogs.deleteField.field?.label}” will be
                            removed from this form.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={builder.dialogs.deleteField.isDeleting}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={builder.dialogs.deleteField.isDeleting}
                            className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/30 text-white"
                            onClick={(event) => {
                                event.preventDefault();
                                void builder.dialogs.deleteField.confirm();
                            }}
                        >
                            {builder.dialogs.deleteField.isDeleting
                                ? "Deleting…"
                                : "Delete field"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardPage>
    );
}
