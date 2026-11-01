"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { RouterOutputs } from "@repo/trpc/client";
import { Button } from "~/components/ui/button";
import { useUpdateForm } from "~/hooks/api/form";

type Form = RouterOutputs["form"]["getFormById"];
type EmailMode = "required" | "optional" | "none";

function getEmailMode(form: Form): EmailMode {
    if (!form.collectEmail) return "none";
    return form.allowAnonymous ? "optional" : "required";
}

export function ResponseSettings({ form }: { form: Form }) {
    const updateForm = useUpdateForm();
    const [isProtected, setIsProtected] = useState(form.isProtected);
    const [newPassword, setNewPassword] = useState("");
    const [emailMode, setEmailMode] = useState<EmailMode>(getEmailMode(form));
    const [responseLimit, setResponseLimit] = useState(
        form.responseLimit?.toString() ?? "",
    );
    const [perRespondentLimit, setPerRespondentLimit] = useState(
        form.perRespondentLimit?.toString() ?? "",
    );

    useEffect(() => {
        setEmailMode(getEmailMode(form));
        setIsProtected(form.isProtected);
        setNewPassword("");
        setResponseLimit(form.responseLimit?.toString() ?? "");
        setPerRespondentLimit(form.perRespondentLimit?.toString() ?? "");
    }, [form]);

    const requiresEmail = emailMode === "required";
    const hasIncompatibleLimit =
        !requiresEmail && perRespondentLimit.trim().length > 0;
    const hasInvalidLimit = [responseLimit, perRespondentLimit].some(
        (value) =>
            value.trim().length > 0 &&
            (!Number.isInteger(Number(value)) || Number(value) < 1),
    );

    const save = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (hasIncompatibleLimit) return;
        if (isProtected && !form.isProtected && !newPassword.trim()) return;
        const toLimit = (value: string) =>
            value.trim() ? Number(value) : null;
        const collectEmail = emailMode !== "none";
        const allowAnonymous = emailMode !== "required";
        try {
            await updateForm.updateFormAsync({
                id: form.id,
                isProtected,
                ...(newPassword.trim() ? { password: newPassword } : {}),
                ...(!isProtected ? { password: null } : {}),
                collectEmail,
                allowAnonymous,
                responseLimit: toLimit(responseLimit),
                perRespondentLimit: toLimit(perRespondentLimit),
            });
            toast.success("Response settings saved");
        } catch {
            // The mutation hook reports the server error.
        }
    };

    return (
        <details className="card-chai group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <span>
                    <span className="block font-semibold">
                        Response settings
                    </span>
                    <span className="text-muted-foreground mt-1 block text-sm">
                        Email collection and response limits
                    </span>
                </span>
                <span
                    aria-hidden="true"
                    className="text-muted-foreground text-sm group-open:rotate-180"
                >
                    ⌄
                </span>
            </summary>
            <form
                className="border-border space-y-4 border-t p-4"
                onSubmit={save}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 text-sm sm:col-span-2">
                        <label className="flex items-center gap-2 font-medium">
                            <input
                                type="checkbox"
                                checked={isProtected}
                                onChange={(event) =>
                                    setIsProtected(event.target.checked)
                                }
                            />
                            Require a password before opening the form
                        </label>
                        {isProtected && (
                            <input
                                className="bg-background h-10 w-full rounded-md border px-3 sm:max-w-md"
                                type="password"
                                autoComplete="new-password"
                                placeholder={
                                    form.isProtected
                                        ? "Leave blank to keep current password"
                                        : "Set a form password"
                                }
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(event.target.value)
                                }
                                required={!form.isProtected}
                            />
                        )}
                        {isProtected &&
                            !form.isProtected &&
                            !newPassword.trim() && (
                                <span className="text-muted-foreground block text-xs">
                                    Enter a password before saving this setting.
                                </span>
                            )}
                    </div>
                    <label className="space-y-2 text-sm">
                        <span className="font-medium">Email collection</span>
                        <select
                            className="bg-background h-10 w-full rounded-md border px-3"
                            value={emailMode}
                            onChange={(event) =>
                                setEmailMode(event.target.value as EmailMode)
                            }
                        >
                            <option value="required">Require an email</option>
                            <option value="optional">
                                Collect email, allow anonymous
                            </option>
                            <option value="none">
                                Allow anonymous, do not collect email
                            </option>
                        </select>
                        <span className="text-muted-foreground block text-xs">
                            Optional email lets respondents leave the email
                            blank.
                        </span>
                    </label>
                    <label className="space-y-2 text-sm">
                        <span className="font-medium">
                            Maximum total responses
                        </span>
                        <input
                            className="bg-background h-10 w-full rounded-md border px-3"
                            type="number"
                            min="1"
                            step="1"
                            inputMode="numeric"
                            placeholder="No limit"
                            value={responseLimit}
                            onChange={(event) =>
                                setResponseLimit(event.target.value)
                            }
                        />
                    </label>
                    <label className="space-y-2 text-sm sm:col-span-2">
                        <span className="font-medium">
                            Maximum responses per email
                        </span>
                        <input
                            className="bg-background h-10 w-full rounded-md border px-3 disabled:opacity-50 sm:max-w-xs"
                            type="number"
                            min="1"
                            step="1"
                            inputMode="numeric"
                            placeholder="No limit"
                            value={perRespondentLimit}
                            onChange={(event) =>
                                setPerRespondentLimit(event.target.value)
                            }
                        />
                        {hasIncompatibleLimit ? (
                            <span className="text-destructive block text-xs">
                                Per-email limits require email collection for
                                every response. Choose “Require an email” or
                                clear this limit.
                            </span>
                        ) : hasInvalidLimit ? (
                            <span className="text-destructive block text-xs">
                                Limits must be whole numbers greater than zero.
                            </span>
                        ) : (
                            <span className="text-muted-foreground block text-xs">
                                Respondents are matched by their normalized
                                email address.
                            </span>
                        )}
                    </label>
                </div>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={
                            updateForm.isPending ||
                            hasIncompatibleLimit ||
                            hasInvalidLimit
                        }
                    >
                        <Save aria-hidden="true" />
                        {updateForm.isPending ? "Saving…" : "Save settings"}
                    </Button>
                </div>
            </form>
        </details>
    );
}
