"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { DashboardPage, PageHeading, PageState } from "~/components/app-page";

function answerText(value: unknown) {
    if (value === null || value === undefined || value === "")
        return "No answer";
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    )
        return String(value);
    return JSON.stringify(value);
}

export default function FormResponseDetailPage() {
    const { id: formId, responseId } = useParams<{
        id: string;
        responseId: string;
    }>();
    const form = trpc.form.getFormById.useQuery({ id: formId });
    const fields = trpc.form.getFormFields.useQuery({ id: formId });
    const response = trpc.form.getFormResponse.useQuery({ formId, responseId });

    if (form.isPending || fields.isPending || response.isPending)
        return (
            <DashboardPage>
                <PageState variant="loading" title="Loading response" />
            </DashboardPage>
        );

    if (form.isError || fields.isError || response.isError)
        return (
            <DashboardPage>
                <PageState
                    variant="error"
                    title="Could not load this response"
                    description={response.error?.message ?? "Please try again."}
                />
            </DashboardPage>
        );

    const labels = new Map(fields.data.map((field) => [field.id, field.label]));
    const answers =
        response.data.answers && typeof response.data.answers === "object"
            ? (response.data.answers as Record<string, unknown>)
            : {};

    return (
        <DashboardPage>
            <Button asChild variant="ghost" className="-ml-3 w-fit">
                <Link href={`/dashboard/forms/${formId}/responses`}>
                    <ArrowLeft aria-hidden="true" /> All responses
                </Link>
            </Button>
            <PageHeading
                eyebrow="Form response"
                title={form.data.title}
                description={new Intl.DateTimeFormat(undefined, {
                    dateStyle: "full",
                    timeStyle: "short",
                }).format(new Date(response.data.submittedAt))}
            />
            <section className="card-chai space-y-5 p-5 sm:p-7">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="bg-brand/10 text-brand flex size-10 items-center justify-center rounded-xl">
                        <FileText size={18} aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs">
                            Respondent
                        </p>
                        <p className="font-medium">
                            {response.data.email || "Anonymous"}
                        </p>
                    </div>
                </div>
                {Object.keys(answers).length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        This response has no recorded answers.
                    </p>
                ) : (
                    <dl className="divide-y divide-white/10">
                        {Object.entries(answers).map(([fieldId, answer]) => (
                            <div
                                key={fieldId}
                                className="grid gap-2 py-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
                            >
                                <dt className="text-muted-foreground text-sm">
                                    {labels.get(fieldId) ?? "Removed question"}
                                </dt>
                                <dd className="text-sm break-words">
                                    {answerText(answer)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </section>
        </DashboardPage>
    );
}
