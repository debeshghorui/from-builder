"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import { useCreateForm } from "~/hooks/api/form";
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

export default function FormsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { createFormAsync, isPending } = useCreateForm();

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
