"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Check,
    ClipboardList,
    FileText,
    Layers3,
    MessageSquareText,
    Sparkles,
    WandSparkles,
} from "lucide-react";

import { Backdrop } from "~/components/backdrop";
import { Highlight } from "~/components/ui/highlight";
import { Button } from "~/components/ui/button";
import { Footer } from "./footer";
import { Navbar } from "./navbar";

const workflow = [
    {
        icon: ClipboardList,
        title: "Create thoughtful forms",
        copy: "Start with a blank page or a ready-to-edit template.",
    },
    {
        icon: Activity,
        title: "Spot the signal",
        copy: "See response patterns and completion trends at a glance.",
    },
    {
        icon: Layers3,
        title: "Move from insight to action",
        copy: "Share what you learn with the people who can make a difference.",
    },
];

const features = [
    {
        icon: FileText,
        title: "Built for real work",
        copy: "Start with a clear structure, then make it yours with flexible question types and thoughtful design controls.",
    },
    {
        icon: BarChart3,
        title: "Answers become insight",
        copy: "Follow response patterns, see what is resonating, and share a useful summary with your team.",
    },
    {
        icon: WandSparkles,
        title: "Make every form feel considered",
        copy: "Match your brand, keep the experience focused, and meet people wherever they are.",
    },
    {
        icon: MessageSquareText,
        title: "Share progress, not busywork",
        copy: "Bring your team into the process with shared workspaces and clear, simple reporting.",
    },
];

const plans = [
    {
        name: "Starter",
        price: "Free",
        desc: "For getting your first form out there",
        features: [
            "3 active forms",
            "100 responses / month",
            "Essential insights",
        ],
    },
    {
        name: "Pro",
        price: "$29",
        desc: "For teams learning as they grow",
        features: [
            "Unlimited forms",
            "10,000 responses / month",
            "Advanced analytics",
            "Team collaboration",
        ],
    },
    {
        name: "Enterprise",
        price: "Let’s talk",
        desc: "For organization-wide feedback",
        features: [
            "Everything in Pro",
            "Custom security options",
            "Dedicated support",
            "Flexible response limits",
        ],
    },
];

const cardClass =
    "card-chai transition-[border-color,opacity] duration-300 sm:opacity-90 sm:hover:opacity-100";

function Reveal({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const reduceMotion = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

export function LandingPage() {
    return (
        <main className="bg-background text-foreground selection:bg-accent selection:text-accent-foreground relative isolate min-h-screen overflow-x-clip">
            <Backdrop />
            <Navbar />

            <section className="border-border/60 border-b px-6 pt-20 pb-20 sm:px-12 sm:pt-24 sm:pb-28">
                <div className="mx-auto max-w-6xl text-center">
                    <p className="border-card-edge bg-card-fill text-muted-foreground mx-auto mb-6 w-fit rounded-full border px-4 py-2 text-sm">
                        Thoughtful forms for curious teams
                    </p>
                    <h1 className="mx-auto max-w-5xl text-[42px] leading-tight font-semibold tracking-tight md:text-6xl lg:text-7xl">
                        Make every response count. Build forms that move you
                        forward.
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-base text-neutral-600 md:text-xl dark:text-neutral-400">
                        From first question to final insight, From Builder gives
                        your team a simple place to create thoughtful forms and
                        turn the answers into{" "}
                        <Highlight>clear next steps</Highlight>.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Button asChild variant="solid" size="lg">
                            <Link href="/signup">Build your first form</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            iconRight={<ArrowUpRight aria-hidden="true" />}
                        >
                            <a href="#product">Explore the product</a>
                        </Button>
                    </div>
                    <div className="text-muted-foreground mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                        {[
                            "No credit card required",
                            "Free to get started",
                            "Ready in minutes",
                        ].map((item) => (
                            <span
                                key={item}
                                className="inline-flex items-center gap-2"
                            >
                                <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                                {item}
                            </span>
                        ))}
                    </div>

                    <div
                        className={`mx-auto mt-16 max-w-5xl overflow-hidden p-4 text-left sm:p-7 ${cardClass}`}
                    >
                        <div className="border-border/70 flex flex-wrap items-center justify-between gap-3 border-b pb-4 text-sm">
                            <div className="flex items-center gap-2 font-medium">
                                <span className="border-card-edge text-muted-foreground grid size-8 place-items-center rounded-md border">
                                    <Layers3 className="size-4" />
                                </span>
                                From Builder{" "}
                                <span className="text-muted-foreground">
                                    / Workspace overview
                                </span>
                            </div>
                            <div className="text-muted-foreground flex gap-5">
                                <span>Responses</span>
                                <span>Insights</span>
                                <span className="hidden sm:inline">
                                    Automations
                                </span>
                            </div>
                        </div>
                        <div className="grid gap-4 pt-5 md:grid-cols-[1.5fr_1fr]">
                            <div className="border-card-edge bg-background/60 rounded-lg border p-4 sm:p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium">
                                            Response activity
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            All forms · past 30 days
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-montserrat text-2xl font-semibold">
                                            12,486
                                        </p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                            ↗ 18.6% vs last month
                                        </p>
                                    </div>
                                </div>
                                <div className="border-border/70 mt-8 flex h-32 items-end gap-1 border-b border-l px-2 sm:h-40">
                                    {[
                                        32, 55, 42, 74, 52, 89, 63, 76, 48, 94,
                                        68, 82, 58, 100, 72, 88, 61, 78, 54, 91,
                                    ].map((height, index) => (
                                        <span
                                            key={index}
                                            className="flex-1 rounded-t-sm bg-neutral-300/70 dark:bg-neutral-600/70"
                                            style={{ height: `${height}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                                    <span>Sep 01</span>
                                    <span>Sep 08</span>
                                    <span>Sep 15</span>
                                    <span>Sep 22</span>
                                    <span>Sep 30</span>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-rows-2">
                                <div className="border-card-edge bg-background/60 rounded-lg border p-4">
                                    <p className="text-muted-foreground text-sm">
                                        Completion rate
                                    </p>
                                    <div className="mt-3 flex items-end justify-between">
                                        <p className="font-montserrat text-3xl font-semibold">
                                            84.2%
                                        </p>
                                        <div className="flex h-10 items-end gap-1">
                                            {[
                                                38, 55, 45, 68, 58, 78, 66, 94,
                                                72, 100,
                                            ].map((h, i) => (
                                                <span
                                                    key={i}
                                                    className="w-2 rounded-t-sm bg-neutral-300 dark:bg-neutral-600"
                                                    style={{ height: `${h}%` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                                        ↗ 6.4% this month
                                    </p>
                                </div>
                                <div className="border-card-edge bg-background/60 flex items-center gap-3 rounded-lg border p-4">
                                    <span className="border-card-edge text-muted-foreground grid size-10 place-items-center rounded-md border">
                                        <MessageSquareText className="size-4" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Top performing form
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Customer pulse · 2,841 responses
                                        </p>
                                    </div>
                                    <ArrowUpRight className="text-muted-foreground ml-auto size-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-10 text-sm">
                        Forms · Feedback · Research · Signups · Customer
                        insights
                    </p>
                </div>
            </section>

            <section id="product" className="px-6 py-20 sm:px-12 sm:py-28">
                <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="text-muted-foreground mb-4 text-sm font-medium">
                            From noise to knowledge
                        </p>
                        <h2 className="text-2xl leading-tight font-medium sm:text-[30px]">
                            Good questions make better decisions.
                        </h2>
                        <p className="text-muted-foreground mt-5 max-w-md text-base leading-7">
                            Bring your questions, responses, and next steps
                            together. Spend less time sorting through
                            spreadsheets and more time understanding what people
                            need.
                        </p>
                        <div className="mt-8 space-y-5">
                            {workflow.map(({ icon: Icon, title, copy }) => (
                                <div key={title} className="flex gap-3">
                                    <span className="border-card-edge text-muted-foreground mt-0.5 grid size-9 shrink-0 place-items-center rounded-md border">
                                        <Icon className="size-4" />
                                    </span>
                                    <div>
                                        <h3 className="font-montserrat text-sm font-semibold">
                                            {title}
                                        </h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {copy}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`p-5 sm:p-8 ${cardClass}`}>
                        <div className="border-border/70 flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="font-medium">Q3 customer pulse</p>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Response journey
                                </p>
                            </div>
                            <span className="border-border text-muted-foreground rounded-md border px-2 py-1 text-xs">
                                In progress
                            </span>
                        </div>
                        <div className="mx-auto my-6 max-w-md space-y-3">
                            {[
                                {
                                    title: "Customer pulse",
                                    sub: "2,841 responses",
                                    progress: "100%",
                                },
                                {
                                    title: "Themes discovered",
                                    sub: "8 emerging patterns",
                                    progress: "76%",
                                },
                                {
                                    title: "Share the story",
                                    sub: "Team report · 4 insights",
                                    progress: "48%",
                                },
                            ].map((item, i) => (
                                <div
                                    key={item.title}
                                    className="border-card-edge bg-background/60 flex items-center gap-3 rounded-lg border p-4"
                                >
                                    <span className="text-muted-foreground text-xs">
                                        0{i + 1}
                                    </span>
                                    <span className="border-card-edge text-muted-foreground grid size-9 place-items-center rounded-md border">
                                        {i === 0 ? (
                                            <MessageSquareText className="size-4" />
                                        ) : i === 1 ? (
                                            <Sparkles className="size-4" />
                                        ) : (
                                            <ArrowUpRight className="size-4" />
                                        )}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {item.title}
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {item.sub}
                                        </p>
                                    </div>
                                    <span className="text-muted-foreground ml-auto text-xs">
                                        {item.progress}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="border-border/70 text-muted-foreground border-t pt-4 text-center text-sm">
                            A simple path from question to meaningful change
                        </p>
                    </div>
                </div>
            </section>

            <section className="px-6 py-16 sm:px-12 sm:py-20">
                <Reveal>
                    <figure
                        className={`mx-auto max-w-4xl p-8 text-center sm:p-12 ${cardClass}`}
                    >
                        <blockquote className="text-xl leading-relaxed font-medium sm:text-3xl">
                            “The best forms don’t just collect answers. They
                            make it easier to understand people and decide what
                            to do next.”
                        </blockquote>
                        <figcaption className="text-muted-foreground mt-6 text-sm">
                            <span className="text-foreground font-medium">
                                Built for curious teams
                            </span>{" "}
                            · Feedback worth acting on
                        </figcaption>
                    </figure>
                </Reveal>
            </section>

            <section id="features" className="px-6 py-20 sm:px-12 sm:py-28">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10 max-w-3xl">
                        <p className="text-muted-foreground mb-4 text-sm font-medium">
                            One workspace, many possibilities
                        </p>
                        <h2 className="text-2xl font-medium sm:text-[30px]">
                            The single source of truth for every response.
                        </h2>
                        <p className="text-muted-foreground mt-3 text-base">
                            Create, share, and learn from forms in one connected
                            space, with <Highlight>useful context</Highlight>{" "}
                            always close at hand.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {features.map(({ icon: Icon, title, copy }) => (
                            <Reveal key={title}>
                                <article
                                    className={`h-full p-6 sm:p-8 ${cardClass}`}
                                >
                                    <span className="border-card-edge text-muted-foreground mb-5 grid size-10 place-items-center rounded-md border">
                                        <Icon className="size-5" />
                                    </span>
                                    <h3 className="font-montserrat text-lg font-semibold">
                                        {title}
                                    </h3>
                                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                                        {copy}
                                    </p>
                                    <div className="border-card-edge bg-background/60 text-muted-foreground mt-7 rounded-lg border p-4 text-sm">
                                        {title === "Built for real work"
                                            ? "What would make your day easier?"
                                            : title === "Answers become insight"
                                              ? "Satisfaction trend · Trending up 12%"
                                              : title ===
                                                  "Make every form feel considered"
                                                ? "Your brand, your way."
                                                : "Better work, together."}
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-border/60 border-y px-6 py-16 sm:px-12 sm:py-20">
                <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[0.65fr_1fr] sm:items-center">
                    <div className={`p-7 ${cardClass}`}>
                        <p className="text-muted-foreground text-sm">
                            Less busywork, more momentum
                        </p>
                        <p className="font-montserrat mt-3 text-5xl font-semibold tracking-tight">
                            2.3×
                        </p>
                        <p className="text-muted-foreground mt-2 text-sm">
                            More time for the work that moves your team forward.
                        </p>
                        <div className="mt-6 flex h-12 items-end gap-1">
                            {[
                                20, 28, 25, 39, 34, 42, 47, 43, 58, 52, 65, 61,
                                78, 74, 88, 100,
                            ].map((n, i) => (
                                <span
                                    key={i}
                                    className="flex-1 rounded-t-sm bg-neutral-300/70 dark:bg-neutral-600/70"
                                    style={{ height: `${n}%` }}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-4 text-sm font-medium">
                            More clarity, less busywork
                        </p>
                        <h2 className="text-2xl leading-tight font-medium sm:text-[30px]">
                            Save time. Reduce the noise. Make your next move
                            with confidence.
                        </h2>
                        <p className="text-muted-foreground mt-4 text-base leading-7">
                            Spend less time chasing responses and wrangling
                            data. From Builder helps make the useful things
                            easier to see, so your team can focus on what comes
                            next.
                        </p>
                        <a
                            href="#pricing"
                            className="text-foreground hover:text-brand mt-6 inline-flex items-center gap-2 text-sm transition-colors duration-200"
                        >
                            Find the right plan{" "}
                            <ArrowUpRight className="size-4" />
                        </a>
                    </div>
                </div>
            </section>

            <section id="testimonials" className="px-6 py-20 sm:px-12 sm:py-28">
                <Reveal>
                    <div
                        className={`mx-auto max-w-4xl p-8 text-center sm:p-12 ${cardClass}`}
                    >
                        <p className="text-muted-foreground mb-5 text-sm font-medium">
                            Listen a little closer
                        </p>
                        <blockquote className="text-xl leading-relaxed font-medium sm:text-3xl">
                            From Builder gives us the space to ask better
                            questions and the clarity to turn what we hear into
                            better experiences.
                        </blockquote>
                        <p className="text-muted-foreground mt-6 text-sm">
                            A team that listens · Customer feedback, made useful
                        </p>
                    </div>
                </Reveal>
            </section>

            <section id="pricing" className="px-6 py-20 sm:px-12 sm:py-28">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10">
                        <p className="text-muted-foreground mb-4 text-sm font-medium">
                            Start small, scale naturally
                        </p>
                        <h2 className="text-2xl font-medium sm:text-[30px]">
                            A plan for every kind of team.
                        </h2>
                        <p className="text-muted-foreground mt-3 text-base">
                            Begin with what you need today. Upgrade when your
                            work grows.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {plans.map((plan) => (
                            <Reveal key={plan.name}>
                                <article
                                    className={`flex h-full flex-col p-6 ${cardClass}`}
                                >
                                    <h3 className="font-montserrat text-lg font-semibold">
                                        {plan.name}
                                    </h3>
                                    <p className="font-montserrat mt-4 text-3xl font-semibold">
                                        {plan.price}
                                        <span className="text-muted-foreground ml-1 text-sm font-normal">
                                            {plan.name === "Pro"
                                                ? "/ month"
                                                : ""}
                                        </span>
                                    </p>
                                    <p className="text-muted-foreground mt-2 min-h-10 text-sm">
                                        {plan.desc}
                                    </p>
                                    <ul className="mt-5 flex-1 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="text-muted-foreground flex items-center gap-2 text-sm"
                                            >
                                                <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        asChild
                                        variant="soft"
                                        className="mt-6 w-full"
                                    >
                                        <Link href="/signup">
                                            {plan.name === "Enterprise"
                                                ? "Contact us"
                                                : "Get started"}
                                        </Link>
                                    </Button>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-16 sm:px-12 sm:py-20">
                <div
                    className={`mx-auto max-w-5xl p-8 text-center sm:p-14 ${cardClass}`}
                >
                    <p className="text-muted-foreground mb-4 text-sm font-medium">
                        Make listening part of the work
                    </p>
                    <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-medium sm:text-5xl">
                        Turn customer feedback into your next great idea.
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base">
                        Start building thoughtful forms and give every answer
                        somewhere meaningful to go.
                    </p>
                    <Button asChild variant="solid" size="lg" className="mt-7">
                        <Link href="/signup">Create your free workspace</Link>
                    </Button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
