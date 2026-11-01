"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, Plus } from "lucide-react";
import type { RouterOutputs } from "@repo/trpc/client";

import { useCreateForm, useGetAllFormsByUserId } from "~/hooks/api/form";
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
import { Textarea } from "~/components/ui/textarea";
import {
    DashboardPage,
    FormStatus,
    PageHeading,
    PageState,
} from "~/components/app-page";

type FormListItem = RouterOutputs["form"]["getAllFormsByUserId"][number];

export default function FormsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { createFormAsync, isPending } = useCreateForm();
    const {
        forms,
        refetch: refetchForms,
        isPending: isFormsPending,
        isError: isFormsError,
        error: formsError,
    } = useGetAllFormsByUserId();

    const handleCreateForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        try {
            await createFormAsync({
                title: trimmedTitle,
                ...(description.trim()
                    ? { description: description.trim() }
                    : {}),
            });
        } catch {
            // The mutation hook displays the error toast; keep the dialog open for retry.
            return;
        }

        setTitle("");
        setDescription("");
        setIsCreateDialogOpen(false);
    };

    return (
        <DashboardPage>
            <PageHeading
                title="Forms"
                description="Create and manage forms for your workspace."
                actions={
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus aria-hidden="true" />
                        Create form
                    </Button>
                }
            />

            {isFormsPending ? (
                <PageState
                    variant="loading"
                    title="Loading your forms"
                    className="min-h-64"
                />
            ) : isFormsError ? (
                <PageState
                    variant="error"
                    title="Could not load your forms"
                    description={
                        formsError?.message || "Please try again in a moment."
                    }
                    className="min-h-64"
                >
                    <Button
                        variant="outline"
                        onClick={() => void refetchForms()}
                    >
                        Try again
                    </Button>
                </PageState>
            ) : forms && forms.length > 0 ? (
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {forms.map((form: FormListItem) => {
                        const createdAt = form.createdAt
                            ? new Date(String(form.createdAt))
                            : null;
                        const createdAtLabel =
                            createdAt && Number.isFinite(createdAt.getTime())
                                ? new Intl.DateTimeFormat(undefined, {
                                      dateStyle: "medium",
                                  }).format(createdAt)
                                : "Recently created";

                        return (
                            <Link
                                key={form.id}
                                href={`/dashboard/forms/${form.id}`}
                                className="card-chai group focus-visible:ring-ring p-5 focus-visible:ring-2 focus-visible:outline-none"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                                        <FileText
                                            className="text-muted-foreground size-5"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <ArrowUpRight
                                        className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h2 className="mt-4 truncate font-semibold">
                                    {form.title}
                                </h2>
                                <p className="text-muted-foreground mt-1 line-clamp-2 min-h-10 text-sm">
                                    {form.description || "No description"}
                                </p>
                                <div className="text-muted-foreground mt-5 flex items-center justify-between gap-3 text-xs">
                                    <FormStatus published={form.published} />
                                    <span>{createdAtLabel}</span>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            ) : (
                <PageState
                    variant="empty"
                    title="Start with a new form"
                    description="Create a form to start collecting responses."
                    className="min-h-64"
                >
                    <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(true)}
                    >
                        <Plus aria-hidden="true" />
                        Create your first form
                    </Button>
                </PageState>
            )}

            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a form</DialogTitle>
                        <DialogDescription>
                            Give your form a name. You can add fields after it
                            is created.
                        </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-5" onSubmit={handleCreateForm}>
                        <div className="space-y-2">
                            <Label htmlFor="form-title">Form name</Label>
                            <Input
                                id="form-title"
                                autoFocus
                                maxLength={55}
                                placeholder="e.g. Customer feedback"
                                required
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="form-description">
                                Description{" "}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </Label>
                            <Textarea
                                id="form-description"
                                maxLength={255}
                                placeholder="What is this form for?"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || !title.trim()}
                            >
                                {isPending ? "Creating…" : "Create form"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardPage>
    );
}
