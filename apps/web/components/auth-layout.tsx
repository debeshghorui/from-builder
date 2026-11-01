import Link from "next/link";
import { WandSparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Backdrop } from "~/components/backdrop";

export function AuthLayout({
    children,
    title,
    description,
}: {
    children: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <main className="bg-background text-foreground relative isolate min-h-svh overflow-x-clip">
            <Backdrop />
            <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-7">
                <header>
                    <Link
                        href="/"
                        aria-label="From Builder home"
                        className="focus-visible:ring-ring/50 inline-flex items-center gap-2.5 rounded-sm outline-none focus-visible:ring-[3px]"
                    >
                        <span className="bg-brand grid size-8 place-items-center rounded-md text-[#17110f]">
                            <WandSparkles
                                aria-hidden="true"
                                className="size-4"
                            />
                        </span>
                        <span className="font-onest text-sm font-semibold tracking-tight">
                            From Builder
                        </span>
                    </Link>
                </header>

                <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
                    <section className="card-chai relative hidden min-h-[24rem] flex-col justify-between overflow-hidden p-8 lg:flex lg:p-10">
                        <div className="relative z-10 max-w-md">
                            <p className="text-muted-foreground text-sm">
                                Thoughtful forms for curious teams
                            </p>
                            <h1 className="mt-4 text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
                                {title}
                            </h1>
                            <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-6 sm:text-base">
                                {description}
                            </p>
                        </div>
                        <p className="text-muted-foreground relative z-10 text-xs">
                            From first question to useful next steps.
                        </p>
                    </section>

                    <section className="mx-auto w-full max-w-md">
                        <div className="card-chai p-6 sm:p-8">{children}</div>
                    </section>
                </div>
            </div>
        </main>
    );
}
