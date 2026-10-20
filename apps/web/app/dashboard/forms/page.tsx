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

type FormListItem = RouterOutputs["form"]["getAllFormsByUserId"][number];

export default function FormsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { createFormAsync, isPending } = useCreateForm();
    const {
        forms,
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
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Forms
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Create and manage forms for your workspace.
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus aria-hidden="true" />
                    Create form
                </Button>
            </div>

            {isFormsPending ? (
                <section
                    className="text-muted-foreground flex min-h-64 items-center justify-center rounded-xl border border-dashed text-sm"
                    aria-live="polite"
                >
                    Loading your forms…
                </section>
            ) : isFormsError ? (
                <section
                    className="text-destructive flex min-h-64 items-center justify-center rounded-xl border border-dashed px-6 text-center text-sm"
                    role="alert"
                >
                    {formsError?.message || "Could not load your forms."}
                </section>
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
                                className="group bg-card hover:border-primary/50 focus-visible:ring-ring rounded-xl border p-5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
                                    <span
                                        className={
                                            form.published
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : ""
                                        }
                                    >
                                        {form.published ? "Published" : "Draft"}
                                    </span>
                                    <span>{createdAtLabel}</span>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            ) : (
                <section className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed">
                    <div className="max-w-sm px-6 text-center">
                        <h2 className="font-medium">Start with a new form</h2>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Create a form to start collecting responses.
                        </p>
                        <Button
                            className="mt-5"
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus aria-hidden="true" />
                            Create your first form
                        </Button>
                    </div>
                </section>
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
        </main>
    );
}
