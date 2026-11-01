"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";

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

    const progress = useMemo(() => {
        if (!flow || !currentPageId) return 0;
        const pageCount = Math.max(flow.pages.length, 1);
        const visited = Math.max(visitedPages.length, 1);
        return Math.min(100, Math.round((visited / pageCount) * 100));
    }, [currentPageId, flow, visitedPages.length]);

    const setAnswer = (fieldId: string, value: string) => {
        setAnswers((current) => ({ ...current, [fieldId]: value }));
        setMissingFieldIds((current) => current.filter((id) => id !== fieldId));
    };

    const enterForm = (nextEmail: string) => {
        setEmail(nextEmail.trim().toLowerCase());
        setIdentityReady(true);
    };

    const continuePage = () => {
        if (!currentPage || !flow) return;
        const missing = currentPage.fields
            .filter((field) => field.isRequired && !answers[field.id]?.trim())
            .map((field) => field.id);
        if (missing.length) {
            setMissingFieldIds(missing);
            document.getElementById(`field-${missing[0]}`)?.focus();
            return;
        }
        setMissingFieldIds([]);
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
        const nextPageId =
            conditional?.targetPageId ?? defaultConnection?.targetPageId;
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
            <main className="text-muted-foreground mx-auto max-w-3xl px-5 py-20 text-center text-sm">
                Loading form…
            </main>
        );
    }
    if (formQuery.isError || !form) {
        return (
            <main className="mx-auto max-w-3xl px-5 py-20 text-center">
                <h1 className="text-2xl font-semibold">Form unavailable</h1>
                <p className="text-muted-foreground mt-2">
                    This form may be unpublished or no longer available.
                </p>
                <Button asChild variant="outline" className="mt-6">
                    <Link href="/">Return home</Link>
                </Button>
            </main>
        );
    }

    const shell = (children: ReactNode) => (
        <main className="min-h-screen bg-[#10100f] px-4 py-10 text-white sm:px-6 sm:py-16">
            <div className="mx-auto max-w-2xl">
                <Link
                    href="/"
                    className="text-muted-foreground mb-6 inline-flex items-center gap-2 text-sm hover:text-white"
                >
                    <ArrowLeft size={15} aria-hidden="true" /> Home
                </Link>
                <header className="mb-6">
                    <p className="text-brand text-xs font-semibold tracking-[0.2em] uppercase">
                        Form
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        {form.title}
                    </h1>
                    {form.description && (
                        <p className="text-muted-foreground mt-2">
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
                className="card-chai space-y-5 p-6 sm:p-8"
                onSubmit={submitPassword}
            >
                <div className="bg-brand/10 text-brand flex size-11 items-center justify-center rounded-2xl">
                    <LockKeyhole aria-hidden="true" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Password required</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Enter the form password to continue.
                    </p>
                </div>
                <label className="block space-y-2 text-sm">
                    <span>Password</span>
                    <input
                        autoFocus
                        className="bg-background text-foreground h-11 w-full rounded-md border px-3"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </label>
                {accessError && (
                    <p role="alert" className="text-destructive text-sm">
                        {accessError}
                    </p>
                )}
                <Button type="submit" disabled={verifyPassword.isPending}>
                    {verifyPassword.isPending ? "Checking…" : "Continue"}
                    <ArrowRight aria-hidden="true" />
                </Button>
            </form>,
        );
    }

    if (shouldCollectIdentity && !identityReady) {
        return shell(
            <form
                className="card-chai space-y-5 p-6 sm:p-8"
                onSubmit={(event) => {
                    event.preventDefault();
                    enterForm(email);
                }}
            >
                <h2 className="text-xl font-semibold">Before you begin</h2>
                <p className="text-muted-foreground text-sm">
                    {form.allowAnonymous
                        ? "You can include your email or continue anonymously."
                        : "Enter your email to begin this form."}
                </p>
                <label className="block space-y-2 text-sm">
                    <span>
                        Email address{form.allowAnonymous ? " (optional)" : ""}
                    </span>
                    <input
                        className="bg-background text-foreground h-11 w-full rounded-md border px-3"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required={!form.allowAnonymous}
                    />
                </label>
                <div className="flex flex-wrap gap-2">
                    <Button type="submit">
                        Continue <ArrowRight aria-hidden="true" />
                    </Button>
                    {form.allowAnonymous && (
                        <Button
                            type="button"
                            variant="outline"
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
            <div className="card-chai text-muted-foreground p-8 text-sm">
                Loading questions…
            </div>,
        );
    }
    if (flowQuery.isError || !flow || !currentPage) {
        return shell(
            <div className="card-chai space-y-3 p-6">
                <h2 className="font-semibold">This form is not ready</h2>
                <p className="text-muted-foreground text-sm">
                    {flowQuery.error?.message ??
                        "The form owner has not added a starting page."}
                </p>
            </div>,
        );
    }

    if (submitted) {
        return shell(
            <div className="card-chai space-y-3 p-8 text-center">
                <div className="bg-brand/10 text-brand mx-auto flex size-12 items-center justify-center rounded-2xl">
                    ✓
                </div>
                <h2 className="text-xl font-semibold">Response submitted</h2>
                <p className="text-muted-foreground text-sm">
                    Thank you for completing this form.
                </p>
            </div>,
        );
    }

    if (completed) {
        return shell(
            <div className="card-chai space-y-5 p-8 text-center">
                <div className="bg-brand/10 text-brand mx-auto flex size-12 items-center justify-center rounded-2xl">
                    ✓
                </div>
                <h2 className="text-xl font-semibold">Ready to submit?</h2>
                <p className="text-muted-foreground text-sm">
                    You can go back to review your answers or submit the form
                    now.
                </p>
                {submitError && (
                    <p role="alert" className="text-destructive text-sm">
                        {submitError}
                    </p>
                )}
                <div className="flex justify-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCompleted(false)}
                    >
                        Review answers
                    </Button>
                    <Button
                        type="button"
                        onClick={() => void submitAnswers()}
                        disabled={submitResponse.isPending}
                    >
                        {submitResponse.isPending
                            ? "Submitting…"
                            : "Submit response"}
                    </Button>
                </div>
            </div>,
        );
    }

    return shell(
        <section className="card-chai overflow-hidden">
            <div className="h-1 bg-white/5">
                <div
                    className="bg-brand h-full transition-[width]"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="space-y-6 p-6 sm:p-8">
                <div>
                    <p className="text-muted-foreground text-xs">
                        Step {visitedPages.length}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                        {currentPage.title}
                    </h2>
                </div>
                <div className="space-y-5">
                    {currentPage.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                            <label
                                className="block text-sm font-medium"
                                htmlFor={`field-${field.id}`}
                            >
                                {field.label}
                                {field.isRequired ? (
                                    <span
                                        className="text-destructive ml-1"
                                        aria-hidden="true"
                                    >
                                        *
                                    </span>
                                ) : null}
                            </label>
                            {field.description && (
                                <p className="text-muted-foreground text-sm">
                                    {field.description}
                                </p>
                            )}
                            {field.type === "YES_NO" ? (
                                <div className="flex gap-3">
                                    {["Yes", "No"].map((option) => (
                                        <label
                                            key={option}
                                            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm"
                                        >
                                            <input
                                                type="radio"
                                                name={field.id}
                                                value={option}
                                                checked={
                                                    answers[field.id] === option
                                                }
                                                onChange={() =>
                                                    setAnswer(field.id, option)
                                                }
                                                required={field.isRequired}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    id={`field-${field.id}`}
                                    className={`bg-background text-foreground h-11 w-full rounded-md border px-3 ${missingFieldIds.includes(field.id) ? "border-destructive" : ""}`}
                                    type={getFieldInputType(field.type)}
                                    placeholder={field.placeholder ?? ""}
                                    value={answers[field.id] ?? ""}
                                    onChange={(event) =>
                                        setAnswer(field.id, event.target.value)
                                    }
                                    aria-invalid={missingFieldIds.includes(
                                        field.id,
                                    )}
                                    required={field.isRequired}
                                />
                            )}
                            {missingFieldIds.includes(field.id) && (
                                <p className="text-destructive text-xs">
                                    This answer is required.
                                </p>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-5">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={goBack}
                        disabled={visitedPages.length < 2}
                    >
                        <ArrowLeft aria-hidden="true" /> Back
                    </Button>
                    <Button type="button" onClick={continuePage}>
                        {flow.connections.some(
                            (connection) =>
                                connection.sourcePageId === currentPage.id,
                        )
                            ? "Next"
                            : "Review"}
                        <ArrowRight aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </section>,
    );
}
