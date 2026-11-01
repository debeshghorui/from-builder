import Link from "next/link";
import {
    Activity,
    ArrowRight,
    Check,
    FileText,
    MessageSquareText,
    Sparkles,
    Users,
    WandSparkles,
} from "lucide-react";

import { CtaPanel } from "~/components/cta-panel";
import { FeatureBento, type Feature } from "~/components/feature-bento";
import { Footer, type FooterSection } from "~/components/footer";
import { Hero } from "~/components/hero";
import { PageShell } from "~/components/page-shell";
import { RotatingWord } from "~/components/rotating-word";
import { SectionHead } from "~/components/section-head";
import { StatStrip } from "~/components/stat-strip";
import { Highlight } from "~/components/ui/highlight";

const NAV_LINKS = [
    { label: "Product", href: "#product" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Stories", href: "#stories" },
];

const FOOTER_SECTIONS: FooterSection[] = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Sign up", href: "/signup" },
        ],
    },
    {
        title: "Workspace",
        links: [
            { label: "Log in", href: "/signin" },
            { label: "Create an account", href: "/signup" },
        ],
    },
    {
        title: "Learn",
        links: [
            { label: "How it works", href: "#product" },
            { label: "Our approach", href: "#stories" },
        ],
    },
];

const FEATURES: Feature[] = [
    {
        title: "Create",
        description:
            "Make clear, welcoming forms with flexible question types and simple design controls.",
        tone: "grey",
        link: { label: "Start a form", href: "/signup" },
    },
    {
        title: "Understand",
        description:
            "Follow response patterns and spot useful signals without digging through spreadsheets.",
        tone: "grey",
        link: { label: "Explore insights", href: "#product" },
    },
    {
        title: "Improve",
        description:
            "Bring the right people into the loop and make each round of feedback count.",
        tone: "grey",
        link: { label: "See the workflow", href: "#product" },
    },
    {
        title: "Work together",
        description:
            "Keep your team aligned with shared forms, responses, and reports.",
        tone: "grey",
    },
];

function Brand() {
    return (
        <span className="inline-flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-[0.2rem] bg-[#ff7d0c] text-black">
                <WandSparkles className="size-4" />
            </span>
            <span className="font-onest text-[15px] font-medium tracking-tight">
                From Builder
            </span>
        </span>
    );
}

function ProductPreview() {
    const bars = [
        28, 45, 39, 62, 52, 77, 55, 86, 64, 94, 71, 83, 61, 98, 75, 88, 59, 79,
        50, 91, 67, 82, 58, 73,
    ];
    return (
        <div className="card-chai mx-auto mt-9 w-full max-w-[490px] overflow-hidden p-3 sm:p-4">
            <div className="border-card-edge flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="border-card-edge grid size-7 place-items-center rounded-md border">
                        <Activity className="size-3.5 text-neutral-300" />
                    </span>
                    Example workspace
                </div>
                <span className="text-muted-foreground text-[10px]">
                    Last 30 days⌄
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-3">
                {[
                    ["Responses", "12,486", "+18.6%"],
                    ["Completion", "84.2%", "+6.4%"],
                    ["Forms", "24", "6 active"],
                ].map(([label, value, delta]) => (
                    <div
                        key={label}
                        className="border-card-edge bg-background/40 rounded-lg border p-2.5 sm:p-3"
                    >
                        <div className="text-muted-foreground text-[9px] sm:text-[10px]">
                            {label}
                        </div>
                        <div className="mt-1.5 text-base font-medium tracking-tight sm:text-xl">
                            {value}
                        </div>
                        <div className="mt-1 text-[8px] text-neutral-400 sm:text-[9px]">
                            {delta}
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-card-edge bg-background/40 rounded-lg border p-3 sm:p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-[10px] font-medium">
                            Response activity
                        </div>
                        <div className="text-muted-foreground mt-1 text-[9px]">
                            All forms
                        </div>
                    </div>
                    <span className="border-card-edge text-muted-foreground rounded-full border px-2 py-1 text-[8px]">
                        Sep 01 to Sep 30
                    </span>
                </div>
                <div className="border-card-edge mt-5 flex h-20 items-end gap-[3px] border-b border-l px-1 sm:h-28 sm:gap-1">
                    {bars.map((height, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-t-[2px] bg-neutral-400/60 dark:bg-white/65"
                            style={{
                                height: `${height}%`,
                                opacity: 0.32 + i * 0.025,
                            }}
                        />
                    ))}
                </div>
                <div className="text-muted-foreground mt-2 flex justify-between text-[8px]">
                    <span>Sep 01</span>
                    <span>Sep 08</span>
                    <span>Sep 15</span>
                    <span>Sep 22</span>
                    <span>Sep 30</span>
                </div>
            </div>
            <div className="border-card-edge bg-background/40 text-muted-foreground mt-2 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[9px]">
                <MessageSquareText className="size-3.5" />
                <span>Customer pulse</span>
                <span className="ml-auto">2,841 responses</span>
                <ArrowRight className="size-3" />
            </div>
        </div>
    );
}

export function LandingPage() {
    return (
        <PageShell
            logo={<Brand />}
            navbarProps={{
                layout: "inline",
                groups: NAV_LINKS,
                actions: (
                    <>
                        <Link
                            href="/signin"
                            className="text-muted-foreground hover:text-foreground hidden px-2 text-sm transition-colors sm:inline-flex"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="btn-asym-mirror border-border hover:bg-accent/60 inline-flex h-9 items-center gap-2 border px-3 text-sm font-medium transition-colors"
                        >
                            Get started <ArrowRight className="size-3.5" />
                        </Link>
                    </>
                ),
            }}
            footerProps={{
                sections: FOOTER_SECTIONS,
                tagline: "Forms people finish. Insights teams use.",
                owner: "From Builder",
            }}
        >
            <div className="relative isolate">
                <div
                    aria-hidden="true"
                    className="perspective-grid pointer-events-none absolute inset-x-[-18%] top-[28%] z-0 h-[135%] opacity-45"
                />
                <Hero
                    className="relative z-10 pt-10 sm:pt-16"
                    badge={
                        <span className="inline-flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-white/80" />{" "}
                            A simpler way to learn from people
                        </span>
                    }
                    title={
                        <>
                            Make feedback{" "}
                            <RotatingWord
                                words={["useful.", "actionable.", "clear."]}
                                className="highlight"
                            />
                        </>
                    }
                    primary={{
                        label: "Build your first form",
                        href: "/signup",
                    }}
                    secondary={{
                        label: "Explore the product",
                        href: "#product",
                    }}
                >
                    Create thoughtful forms, understand what people are saying,
                    and turn answers into{" "}
                    <Highlight>better next steps</Highlight>.
                </Hero>
            </div>

            <div id="product" className="mx-auto w-full max-w-2xl text-center">
                <ProductPreview />
                <p className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-xs">
                    <span className="size-1.5 rounded-full bg-neutral-400" />{" "}
                    Responses update as they come in
                </p>
            </div>

            <StatStrip
                className="mx-auto mt-14 w-full max-w-4xl sm:mt-20"
                stats={[
                    { value: "One", label: "Connected workspace" },
                    { value: "Clear", label: "Response overview" },
                    { value: "Flexible", label: "Questions and forms" },
                    { value: "Together", label: "Built for teams" },
                ]}
            />

            <section
                aria-labelledby="workflow-title"
                className="mt-20 sm:mt-28"
            >
                <SectionHead
                    id="workflow-title"
                    title="From noise to knowledge"
                >
                    One calm place to create a form, make sense of the answers,
                    and choose a <Highlight>clear next step</Highlight>.
                </SectionHead>
                <div className="mt-8 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                    <div className="card-chai flex flex-col justify-center gap-5 p-6 sm:p-8">
                        {[
                            {
                                icon: FileText,
                                title: "Create thoughtful forms",
                                text: "Start from a blank page or make a template your own.",
                            },
                            {
                                icon: Sparkles,
                                title: "Spot useful patterns",
                                text: "See responses come together in a clear overview.",
                            },
                            {
                                icon: Users,
                                title: "Bring your team along",
                                text: "Share what you learn with the people who can act.",
                            },
                        ].map(({ icon: Icon, title, text }) => (
                            <div key={title} className="flex gap-3">
                                <span className="border-card-edge grid size-8 shrink-0 place-items-center rounded-md border bg-black/20 text-neutral-300">
                                    <Icon className="size-4" />
                                </span>
                                <div>
                                    <div className="text-sm font-medium">
                                        {title}
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-xs leading-5">
                                        {text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-chai relative overflow-hidden p-5 sm:p-8">
                        <div className="absolute -top-32 right-0 size-72 rounded-full bg-white/[0.035] blur-3xl" />
                        <div className="border-card-edge relative flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="text-sm font-medium">
                                    Q3 customer pulse
                                </p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    Response journey
                                </p>
                            </div>
                            <span className="border-card-edge text-muted-foreground rounded-full border px-2 py-1 text-[10px]">
                                In progress
                            </span>
                        </div>
                        <div className="relative mx-auto my-6 max-w-md space-y-3">
                            {[
                                ["01", "Customer pulse", "2,841 responses"],
                                [
                                    "02",
                                    "Themes discovered",
                                    "8 emerging patterns",
                                ],
                                [
                                    "03",
                                    "Share the story",
                                    "Team report · 4 insights",
                                ],
                            ].map(([number, title, note], i) => (
                                <div
                                    key={number}
                                    className="border-card-edge bg-background/50 flex items-center gap-3 rounded-lg border p-3.5"
                                >
                                    <span className="text-muted-foreground text-[10px]">
                                        {number}
                                    </span>
                                    <span className="border-card-edge grid size-8 place-items-center rounded-md border text-neutral-300">
                                        {i === 0 ? (
                                            <MessageSquareText className="size-4" />
                                        ) : i === 1 ? (
                                            <Sparkles className="size-4" />
                                        ) : (
                                            <ArrowRight className="size-4" />
                                        )}
                                    </span>
                                    <div>
                                        <div className="text-xs font-medium">
                                            {title}
                                        </div>
                                        <div className="text-muted-foreground mt-1 text-[10px]">
                                            {note}
                                        </div>
                                    </div>
                                    <Check className="ml-auto size-3.5 text-neutral-400" />
                                </div>
                            ))}
                            <div className="bg-card-edge mx-auto h-4 w-px" />
                            <div className="border-card-edge text-muted-foreground mx-auto flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px]">
                                <Sparkles className="size-3" /> A clearer next
                                step
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="features"
                aria-labelledby="features-title"
                className="mt-20 sm:mt-28"
            >
                <SectionHead
                    id="features-title"
                    title="The single source of truth"
                >
                    Forms and feedback in one connected workspace, with the
                    context to turn <Highlight>answers into action</Highlight>.
                </SectionHead>
                <FeatureBento features={FEATURES} />
            </section>

            <section
                id="stories"
                aria-labelledby="stories-title"
                className="mt-20 sm:mt-28"
            >
                <SectionHead
                    id="stories-title"
                    title="Make room for the answers that matter"
                >
                    Build a habit of listening, with a workflow that keeps{" "}
                    <Highlight>people at the center</Highlight>.
                </SectionHead>
                <div className="card-chai mt-6 p-6 sm:p-10">
                    <div className="mx-auto max-w-2xl text-center">
                        <MessageSquareText className="mx-auto size-5 text-neutral-400" />
                        <p className="mt-4 text-xl leading-relaxed font-medium tracking-tight sm:text-2xl">
                            Good questions open the door. Clear answers help us
                            decide where to go.
                        </p>
                        <p className="text-muted-foreground mt-3 text-sm">
                            A simple principle behind every form you build with
                            From Builder.
                        </p>
                    </div>
                </div>
            </section>

            <CtaPanel
                className="mt-20 mb-8 sm:mt-28"
                heading="Turn customer feedback into your next great idea."
                tagline="Start building thoughtful forms and give every answer somewhere meaningful to go."
                action={{
                    label: "Create your free workspace",
                    href: "/signup",
                }}
            />
        </PageShell>
    );
}

export default LandingPage;
