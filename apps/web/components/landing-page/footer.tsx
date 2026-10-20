"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    WandSparkles,
    Github,
    Twitter,
    Linkedin,
} from "lucide-react";

export function Footer() {
    return (
        <footer className="border-border/50 bg-muted/30 border-t backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-5 pt-16 pb-5 sm:px-8 sm:pt-20 lg:px-12">
                <div className="grid gap-12 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-8">
                    <div className="max-w-sm">
                        <Link
                            href="/"
                            className="text-foreground inline-flex items-center gap-2.5 font-semibold tracking-tight"
                            aria-label="From Builder home"
                        >
                            <span className="from-primary text-primary-foreground grid size-8 place-items-center rounded-lg bg-gradient-to-br to-purple-500">
                                <WandSparkles className="size-4" />
                            </span>
                            From Builder
                        </Link>
                        <p className="mt-5 text-2xl leading-tight font-medium tracking-[-0.045em] sm:text-3xl">
                            Make forms that{" "}
                            <span className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text text-transparent">
                                inspire.
                            </span>
                        </p>
                        <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-6">
                            Create beautiful, responsive forms in minutes. No
                            coding required.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <a
                                href="#"
                                className="border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/10 rounded-lg border p-2 transition-all"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/10 rounded-lg border p-2 transition-all"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/10 rounded-lg border p-2 transition-all"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <nav
                        aria-label="Product links"
                        className="md:justify-self-center"
                    >
                        <h2 className="text-muted-foreground mb-4 text-xs font-semibold tracking-[0.14em] uppercase">
                            Product
                        </h2>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#features"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    Integrations
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    API
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <nav
                        aria-label="Company links"
                        className="md:justify-self-center"
                    >
                        <h2 className="text-muted-foreground mb-4 text-xs font-semibold tracking-[0.14em] uppercase">
                            Company
                        </h2>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <nav
                        aria-label="Account links"
                        className="md:justify-self-end md:pr-8"
                    >
                        <h2 className="text-muted-foreground mb-4 text-xs font-semibold tracking-[0.14em] uppercase">
                            Your workspace
                        </h2>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    href="/signup"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    Create an account
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/signin"
                                    className="text-muted-foreground hover:text-foreground transition"
                                >
                                    Log in
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/signup"
                                    className="text-foreground hover:text-muted-foreground inline-flex items-center gap-1 font-medium transition"
                                >
                                    Start building{" "}
                                    <ArrowUpRight className="size-3" />
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="border-border/50 text-muted-foreground flex flex-col gap-4 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        © {new Date().getFullYear()} From Builder. All rights
                        reserved.
                    </span>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="hover:text-foreground transition"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition"
                        >
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
