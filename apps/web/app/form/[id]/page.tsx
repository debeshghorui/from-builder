"use client";

import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    FileQuestion,
    LockKeyhole,
    TriangleAlert,
} from "lucide-react";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PageState } from "~/components/app-page";

type Answers = Record<string, string>;

function getFieldInputType(type: string) {
    if (type === "EMAIL") return "email";
    if (type === "NUMBER") return "number";
    if (type === "PHONE") return "tel";
    if (type === "PASSWORD") return "password";
    return "text";
}

export default function RespondentFormPage() {
    const { id: formId } = useParams<{ id: string }>();
    const [password, setPassword] = useState("");
    const [accessToken, setAccessToken] = useState<string | undefined>();
    const [email, setEmail] = useState("");
    const [identityReady, setIdentityReady] = useState(false);
    const [answers, setAnswers] = useState<Answers>({});
    const [visitedPages, setVisitedPages] = useState<string[]>([]);
    const [currentPageId, setCurrentPageId] = useState<string | null>(null);
    const [missingFieldIds, setMissingFieldIds] = useState<string[]>([]);
    const [accessError, setAccessError] = useState("");
    const [completed, setCompleted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const formQuery = trpc.publicForm.getPublishedForm.useQuery(
        { formId },
        { enabled: Boolean(formId), retry: false },
    );
    const verifyPassword = trpc.publicForm.verifyPassword.useMutation();
    const submitResponse = trpc.publicForm.submitResponse.useMutation();
    const form = formQuery.data;
    const shouldCollectIdentity = Boolean(form?.collectEmail);
    const isPasswordVerified = !form?.passwordRequired || Boolean(accessToken);
    const flowQuery = trpc.publicForm.getPublishedFlow.useQuery(
        { formId, ...(accessToken ? { accessToken } : {}) },
        {
            enabled:
                Boolean(formId) &&
                Boolean(form) &&
                isPasswordVerified &&
                (!shouldCollectIdentity || identityReady),
            retry: false,
        },
    );
    const flow = flowQuery.data;
    const currentPage = flow?.pages.find((page) => page.id === currentPageId);

    useEffect(() => {
        if (!flow?.startPageId || currentPageId) return;
        setCurrentPageId(flow.startPageId);
        setVisitedPages([flow.startPageId]);
    }, [currentPageId, flow?.startPageId]);

    const setAnswer = (fieldId: string, value: string) => {
        setAnswers((current) => ({ ...current, [fieldId]: value }));
        setMissingFieldIds((current) => current.filter((id) => id !== fieldId));
    };

    const enterForm = (nextEmail: string) => {
        setEmail(nextEmail.trim().toLowerCase());
        setIdentityReady(true);
    };

    const getNextPageId = () => {
        if (!currentPage || !flow) return undefined;
        const outgoing = flow.connections.filter(
            (connection) => connection.sourcePageId === currentPage.id,
        );
        const conditional = outgoing.find((connection) => {
            if (!connection.condition) return false;
            const condition = connection.condition as {
                fieldId: string;
                operator: "equals";
                value: string | number | boolean;
            };
            return (
                answers[condition.fieldId] !== undefined &&
                String(answers[condition.fieldId]) === String(condition.value)
            );
        });
        const defaultConnection = outgoing.find(
            (connection) => !connection.condition,
        );
        return conditional?.targetPageId ?? defaultConnection?.targetPageId;
    };

    const continuePage = () => {
        if (!currentPage || !flow) return;
        const missing = currentPage.fields
            .filter((field) => field.isRequired && !answers[field.id]?.trim())
            .map((field) => field.id);
        if (missing.length) {
            setMissingFieldIds(missing);
            const firstMissingField = currentPage.fields.find(
                (field) => field.id === missing[0],
            );
            const focusTargetId =
                firstMissingField?.type === "YES_NO"
                    ? `field-group-${firstMissingField.id}`
                    : `field-${missing[0]}`;
            const focusTarget = document.getElementById(focusTargetId);
            if (focusTarget) {
                focusTarget.focus();
                focusTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
            return;
        }
        setMissingFieldIds([]);
        const nextPageId = getNextPageId();
        if (!nextPageId) {
            const visitedFieldIds = new Set(
                flow.pages
                    .filter((page) => visitedPages.includes(page.id))
                    .flatMap((page) => page.fields.map((field) => field.id)),
            );
            setAnswers((current) =>
                Object.fromEntries(
                    Object.entries(current).filter(([fieldId]) =>
                        visitedFieldIds.has(fieldId),
                    ),
                ),
            );
            setCompleted(true);
            return;
        }
        const nextPath = [...visitedPages, nextPageId];
        const allowedFields = new Set(
            flow.pages
                .filter((page) => nextPath.includes(page.id))
                .flatMap((page) => page.fields.map((field) => field.id)),
        );
        setAnswers((current) =>
            Object.fromEntries(
                Object.entries(current).filter(([fieldId]) =>
                    allowedFields.has(fieldId),
                ),
            ),
        );
        setCurrentPageId(nextPageId);
        setVisitedPages(nextPath);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goBack = () => {
        if (visitedPages.length < 2) return;
        const previous = visitedPages[visitedPages.length - 2];
        if (!previous) return;
        setCurrentPageId(previous);
        setVisitedPages((current) => current.slice(0, -1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAccessError("");
        try {
            const result = await verifyPassword.mutateAsync({
                formId,
                password,
            });
            setAccessToken(result.accessToken);
        } catch (error) {
            setAccessError(
                error instanceof Error
                    ? error.message
                    : "The password is incorrect.",
            );
        }
    };

    const submitAnswers = async () => {
        if (!flow) return;
        setSubmitError("");
        try {
            await submitResponse.mutateAsync({
                formId,
                email: email || null,
                answers,
                flowVersion: flow.flowVersion,
                visitedPageIds: visitedPages,
                ...(accessToken ? { accessToken } : {}),
            });
            setSubmitted(true);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Could not submit your response.",
            );
        }
    };

    if (formQuery.isPending) {
        return (
            <main className="bg-background text-foreground grid min-h-svh place-items-center px-4 py-8 sm:px-6">
                <div className="w-full max-w-2xl">
                    <PageState
                        variant="loading"
                        title="Loading form"
                        className="min-h-56"
                    />
                </div>
            </main>
        );
    }
    if (formQuery.isError || !form) {
        return (
            <main className="bg-background text-foreground grid min-h-svh place-items-center px-4 py-8 sm:px-6">
                <PageState
                    variant="error"
                    title="This form is unavailable"
                    description="It may have been unpublished or the link may have changed."
                    icon={
                        <FileQuestion aria-hidden="true" className="size-6" />
                    }
                    className="w-full max-w-2xl"
                >
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/">Return home</Link>
                    </Button>
                </PageState>
            </main>
        );
    }

    const shell = (children: ReactNode) => (
        <main className="bg-background text-foreground min-h-svh px-4 py-6 sm:px-6 sm:py-12">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-8 flex items-center justify-between gap-4 sm:mb-10">
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground inline-flex min-h-10 items-center gap-2 text-sm transition-colors"
                    >
                        <ArrowLeft size={15} aria-hidden="true" /> Home
                    </Link>
                    <span className="text-muted-foreground text-xs font-medium">
                        Form response
                    </span>
                </div>
                <header
                    className="border-border mb-6 border-b pb-6 sm:mb-8 sm:pb-8"
                    aria-labelledby="public-form-title"
                >
                    <h1
                        id="public-form-title"
                        className="text-3xl font-semibold tracking-tight break-words sm:text-4xl"
                    >
                        {form.title}
                    </h1>
                    {form.description && (
                        <p className="text-muted-foreground mt-3 max-w-prose text-base leading-7">
                            {form.description}
                        </p>
                    )}
                </header>
                {children}
            </div>
        </main>
    );

    if (form.passwordRequired && !accessToken) {
        return shell(
            <form
                aria-labelledby="password-gate-title"
                className="card-chai space-y-6 p-5 sm:p-8"
                onSubmit={submitPassword}
                aria-busy={verifyPassword.isPending}
            >
                <div className="flex items-start gap-4">
                    <div className="bg-muted text-foreground flex size-11 shrink-0 items-center justify-center rounded-lg">
                        <LockKeyhole aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <h2
                            id="password-gate-title"
                            className="text-xl font-semibold"
                        >
                            Password required
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm leading-6">
                            Enter the password provided by the form owner to
                            continue.
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="form-password">Password</Label>
                    <Input
                        id="form-password"
                        autoFocus
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                {accessError && (
                    <p role="alert" className="text-destructive text-sm">
                        {accessError}
                    </p>
                )}
                <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={verifyPassword.isPending}
                >
                    {verifyPassword.isPending ? "Checking…" : "Continue"}
                    <ArrowRight aria-hidden="true" />
                </Button>
            </form>,
        );
    }

    if (shouldCollectIdentity && !identityReady) {
        return shell(
            <form
                aria-labelledby="identity-gate-title"
                className="card-chai space-y-6 p-5 sm:p-8"
                onSubmit={(event) => {
                    event.preventDefault();
                    enterForm(email);
                }}
            >
                <div>
                    <h2
                        id="identity-gate-title"
                        className="text-xl font-semibold"
                    >
                        Before you begin
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                        {form.allowAnonymous
                            ? "Add your email to identify your response, or continue anonymously."
                            : "Enter your email so the form owner can identify your response."}
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="respondent-email">
                        Email address{form.allowAnonymous ? " (optional)" : ""}
                    </Label>
                    <Input
                        id="respondent-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required={!form.allowAnonymous}
                    />
                </div>
                <div className="grid gap-2 sm:flex sm:flex-wrap">
                    <Button type="submit" className="w-full sm:w-auto">
                        Continue <ArrowRight aria-hidden="true" />
                    </Button>
                    {form.allowAnonymous && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => enterForm("")}
                        >
                            Continue anonymously
                        </Button>
                    )}
                </div>
            </form>,
        );
    }

    if (flowQuery.isPending) {
        return shell(
            <PageState
                variant="loading"
                title="Loading questions"
                className="min-h-56"
            />,
        );
    }
    if (flowQuery.isError || !flow || !currentPage) {
        return shell(
            <PageState
                variant="error"
                title="This form is not ready"
                description={
                    flowQuery.error?.message ??
                    "The form owner has not added a starting page."
                }
                icon={<TriangleAlert aria-hidden="true" className="size-6" />}
            >
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/">Return home</Link>
                </Button>
            </PageState>,
        );
    }

    if (submitted) {
        return shell(
            <div className="card-chai space-y-6 p-6 text-center sm:p-8">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                    <svg
                        aria-hidden="true"
                        className="size-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">
                        Response submitted
                    </h2>
                    <p className="text-muted-foreground mt-2 text-base leading-7">
                        Thank you for completing this form.
                    </p>
                </div>
                <Button
                    asChild
                    variant="outline"
                    className="mx-auto w-full sm:w-auto"
                >
                    <Link href="/">Return home</Link>
                </Button>
            </div>,
        );
    }

    if (completed) {
        return shell(
            <div className="card-chai space-y-6 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                    <div className="bg-muted text-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
                        <FileQuestion aria-hidden="true" className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-semibold">
                            Review your response
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm leading-6">
                            You can go back to review your answers or submit the
                            form now.
                        </p>
                    </div>
                </div>
                {submitError && (
                    <div
                        role="alert"
                        className="bg-destructive/10 border-destructive/20 flex items-start gap-3 rounded-lg border p-4"
                    >
                        <TriangleAlert
                            aria-hidden="true"
                            className="text-destructive mt-0.5 size-5 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-destructive text-sm font-medium">
                                Submission failed
                            </p>
                            <p className="text-destructive/80 mt-1 text-sm">
                                {submitError}
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCompleted(false)}
                        disabled={submitResponse.isPending}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft aria-hidden="true" className="mr-2 size-4" />
                        Review answers
                    </Button>
                    <Button
                        type="button"
                        onClick={() => void submitAnswers()}
                        disabled={submitResponse.isPending}
                        className="w-full sm:w-auto"
                    >
                        {submitResponse.isPending ? (
                            <>Submitting…</>
                        ) : (
                            <>
                                Submit response
                                <ArrowRight
                                    aria-hidden="true"
                                    className="ml-2 size-4"
                                />
                            </>
                        )}
                    </Button>
                </div>
            </div>,
        );
    }

    return shell(
        <section
            className="card-chai overflow-hidden"
            aria-labelledby="current-page-title"
        >
            <div className="space-y-8 p-5 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p
                            className="text-muted-foreground text-xs font-medium"
                            role="status"
                            aria-live="polite"
                        >
                            Step {visitedPages.length} in your form
                        </p>
                        <h2
                            id="current-page-title"
                            className="mt-1 text-xl font-semibold break-words sm:text-2xl"
                        >
                            {currentPage.title}
                        </h2>
                    </div>
                    <span className="text-muted-foreground border-border shrink-0 rounded-md border px-2.5 py-1 text-xs">
                        {currentPage.fields.length}{" "}
                        {currentPage.fields.length === 1
                            ? "question"
                            : "questions"}
                    </span>
                </div>
                <div className="divide-border divide-y">
                    {currentPage.fields.map((field) => (
                        <fieldset
                            key={field.id}
                            id={
                                field.type === "YES_NO"
                                    ? `field-group-${field.id}`
                                    : undefined
                            }
                            tabIndex={
                                field.type === "YES_NO" &&
                                missingFieldIds.includes(field.id)
                                    ? 0
                                    : undefined
                            }
                            className={`min-w-0 space-y-2.5 py-6 first:pt-0 last:pb-0 ${missingFieldIds.includes(field.id) ? "ring-destructive/20 ring-offset-background rounded-lg ring-2 ring-offset-2" : ""}`}
                            aria-invalid={missingFieldIds.includes(field.id)}
                            aria-describedby={
                                missingFieldIds.includes(field.id)
                                    ? `field-error-${field.id}`
                                    : field.description
                                      ? `field-help-${field.id}`
                                      : undefined
                            }
                        >
                            <legend className="block text-sm font-medium">
                                {field.label}
                                {field.isRequired ? (
                                    <>
                                        <span
                                            className="text-destructive ml-1"
                                            aria-hidden="true"
                                        >
                                            *
                                        </span>
                                        <span className="sr-only">
                                            {" "}
                                            required
                                        </span>
                                    </>
                                ) : null}
                            </legend>
                            {field.description && (
                                <p
                                    id={`field-help-${field.id}`}
                                    className="text-muted-foreground text-sm leading-6"
                                >
                                    {field.description}
                                </p>
                            )}
                            {field.type === "YES_NO" ? (
                                <div className="flex gap-3">
                                    {["Yes", "No"].map((option) => (
                                        <div
                                            key={option}
                                            className="border-border hover:bg-muted/50 has-[:focus-visible]:ring-ring flex min-h-12 flex-1 cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2"
                                        >
                                            <input
                                                id={`field-${field.id}-${option.toLowerCase()}`}
                                                type="radio"
                                                name={field.id}
                                                value={option}
                                                checked={
                                                    answers[field.id] === option
                                                }
                                                onChange={() =>
                                                    setAnswer(field.id, option)
                                                }
                                                aria-invalid={missingFieldIds.includes(
                                                    field.id,
                                                )}
                                                aria-describedby={
                                                    missingFieldIds.includes(
                                                        field.id,
                                                    )
                                                        ? `field-error-${field.id}`
                                                        : field.description
                                                          ? `field-help-${field.id}`
                                                          : undefined
                                                }
                                                required={field.isRequired}
                                            />
                                            <Label
                                                htmlFor={`field-${field.id}-${option.toLowerCase()}`}
                                                className="cursor-pointer font-normal"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Input
                                    id={`field-${field.id}`}
                                    aria-label={field.label}
                                    type={getFieldInputType(field.type)}
                                    placeholder={field.placeholder ?? ""}
                                    value={answers[field.id] ?? ""}
                                    onChange={(event) =>
                                        setAnswer(field.id, event.target.value)
                                    }
                                    aria-invalid={missingFieldIds.includes(
                                        field.id,
                                    )}
                                    aria-describedby={
                                        missingFieldIds.includes(field.id)
                                            ? `field-error-${field.id}`
                                            : field.description
                                              ? `field-help-${field.id}`
                                              : undefined
                                    }
                                    required={field.isRequired}
                                />
                            )}
                            {missingFieldIds.includes(field.id) && (
                                <p
                                    id={`field-error-${field.id}`}
                                    className="text-destructive mt-2 text-sm font-medium"
                                    role="alert"
                                >
                                    This answer is required.
                                </p>
                            )}
                        </fieldset>
                    ))}
                </div>
                <div className="border-border flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={goBack}
                        disabled={visitedPages.length < 2}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft aria-hidden="true" /> Back
                    </Button>
                    <Button
                        type="button"
                        onClick={continuePage}
                        className="w-full sm:w-auto sm:min-w-32"
                    >
                        {getNextPageId() ? "Next step" : "Review response"}
                        <ArrowRight aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </section>,
    );
}
