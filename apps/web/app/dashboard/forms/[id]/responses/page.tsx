"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Inbox } from "lucide-react";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { DashboardPage, PageHeading, PageState } from "~/components/app-page";

export default function FormResponsesPage() {
    const { id: formId } = useParams<{ id: string }>();
    const form = trpc.form.getFormById.useQuery({ id: formId });
    const responses = trpc.form.getFormResponses.useQuery({ formId });

    if (form.isPending || responses.isPending)
        return (
            <DashboardPage>
                <PageState variant="loading" title="Loading responses" />
            </DashboardPage>
        );

    if (form.isError || responses.isError)
        return (
            <DashboardPage>
                <PageState
                    variant="error"
                    title="Could not load responses"
                    description={
                        form.error?.message ?? responses.error?.message
                    }
                >
                    <Button asChild variant="outline">
                        <Link href={`/dashboard/forms/${formId}`}>
                            Back to builder
                        </Link>
                    </Button>
                </PageState>
            </DashboardPage>
        );

    return (
        <DashboardPage>
            <Button asChild variant="ghost" className="-ml-3 w-fit">
                <Link href={`/dashboard/forms/${formId}`}>
                    <ArrowLeft aria-hidden="true" /> Form builder
                </Link>
            </Button>
            <PageHeading
                eyebrow="Responses"
                title={form.data.title}
                description={`${responses.data.length} submitted response${responses.data.length === 1 ? "" : "s"}`}
            />
            {responses.data.length === 0 ? (
                <PageState
                    variant="empty"
                    title="No responses yet"
                    description="Submitted responses will appear here."
                    icon={
                        <Inbox
                            className="text-muted-foreground size-6"
                            aria-hidden="true"
                        />
                    }
                />
            ) : (
                <section className="space-y-2" aria-label="Submitted responses">
                    {responses.data.map((response, index) => (
                        <Link
                            key={response.id}
                            href={`/dashboard/forms/${formId}/responses/${response.id}`}
                            className="card-chai flex flex-wrap items-center justify-between gap-4 p-4 transition-colors hover:border-white/20"
                        >
                            <span>
                                <span className="block font-medium">
                                    {response.email || "Anonymous response"}
                                </span>
                                <span className="text-muted-foreground mt-1 block text-sm">
                                    Response {responses.data.length - index}
                                </span>
                            </span>
                            <time
                                className="text-muted-foreground text-sm"
                                dateTime={new Date(
                                    response.submittedAt,
                                ).toISOString()}
                            >
                                {new Intl.DateTimeFormat(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                }).format(new Date(response.submittedAt))}
                            </time>
                        </Link>
                    ))}
                </section>
            )}
        </DashboardPage>
    );
}
