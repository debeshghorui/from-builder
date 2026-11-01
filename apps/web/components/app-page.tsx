import type { ReactNode } from "react";
import { Check, CircleDashed } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function DashboardPage({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <main
            className={cn(
                "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8",
                className,
            )}
        >
            {children}
        </main>
    );
}

export function PageHeading({
    title,
    description,
    eyebrow,
    actions,
    className,
}: {
    title: string;
    description?: string;
    eyebrow?: string;
    actions?: ReactNode;
    className?: string;
}) {
    return (
        <header
            className={cn(
                "flex flex-wrap items-end justify-between gap-4",
                className,
            )}
        >
            <div className="min-w-0">
                {eyebrow && (
                    <p className="text-muted-foreground mb-1 text-sm">
                        {eyebrow}
                    </p>
                )}
                <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                    {title}
                </h1>
                {description && (
                    <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-6 sm:text-base">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </header>
    );
}

export function PageState({
    variant,
    title,
    description,
    children,
    className,
    surface = true,
    icon,
}: {
    variant: "loading" | "error" | "empty";
    title: string;
    description?: string;
    children?: ReactNode;
    className?: string;
    surface?: boolean;
    icon?: ReactNode;
}) {
    const panelClass = surface
        ? "card-chai"
        : "rounded-lg border border-dashed bg-transparent";

    if (variant === "loading") {
        return (
            <section
                className={cn(panelClass, "space-y-4 p-5 sm:p-6", className)}
                aria-busy="true"
                aria-label={title}
            >
                <span className="sr-only">{title}</span>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-24 w-full" />
            </section>
        );
    }

    return (
        <section
            className={cn(
                panelClass,
                "flex min-h-52 flex-col items-center justify-center gap-2 px-6 py-10 text-center",
                className,
            )}
            role={variant === "error" ? "alert" : "status"}
        >
            {icon}
            <h2
                className={cn(
                    "text-sm font-semibold",
                    variant === "error" && "text-destructive",
                )}
            >
                {title}
            </h2>
            {description && (
                <p className="text-muted-foreground max-w-lg text-sm leading-6">
                    {description}
                </p>
            )}
            {children}
        </section>
    );
}

export function FormStatus({ published }: { published: boolean }) {
    const Icon = published ? Check : CircleDashed;
    return (
        <Badge
            variant="outline"
            className={cn(
                "gap-1.5 rounded-md bg-transparent font-medium",
                published
                    ? "border-emerald-800/30 text-emerald-700 dark:border-emerald-300/25 dark:text-emerald-300"
                    : "text-muted-foreground",
            )}
        >
            <Icon aria-hidden="true" className="size-3.5" />
            {published ? "Published" : "Draft"}
        </Badge>
    );
}
