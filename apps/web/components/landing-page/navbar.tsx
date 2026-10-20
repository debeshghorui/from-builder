"use client";

import Link from "next/link";
import { ArrowRight, WandSparkles } from "lucide-react";

import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/ui/theme-toggle";

function BrandMark() {
    return (
        <span className="from-primary text-primary-foreground grid size-8 place-items-center rounded-lg bg-gradient-to-br to-purple-500">
            <WandSparkles className="size-4" />
        </span>
    );
}

export function Navbar() {
    return (
        <header className="border-border/50 bg-background/80 sticky top-0 z-50 mx-auto flex max-w-7xl items-center justify-between border-b px-5 py-4 backdrop-blur-lg sm:px-8 lg:px-12">
            <Link
                href="/"
                className="flex items-center gap-2.5"
                aria-label="From Builder home"
            >
                <BrandMark />
                <span className="text-sm font-semibold tracking-tight">
                    From Builder
                </span>
            </Link>

            <nav
                className="border-border/50 bg-card/50 text-muted-foreground hidden items-center gap-7 rounded-full border px-6 py-2.5 text-xs font-medium backdrop-blur-sm md:flex"
                aria-label="Main navigation"
            >
                <a
                    href="#features"
                    className="hover:text-foreground transition"
                >
                    Features
                </a>
                <a href="#pricing" className="hover:text-foreground transition">
                    Pricing
                </a>
                <a
                    href="#testimonials"
                    className="hover:text-foreground transition"
                >
                    Testimonials
                </a>
            </nav>

            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                >
                    <Link href="/signin">Log in</Link>
                </Button>
                <Button
                    asChild
                    size="sm"
                    className="from-primary hover:from-primary/90 gap-1.5 bg-gradient-to-r to-purple-500 hover:to-purple-500/90"
                >
                    <Link href="/signup">
                        Get started <ArrowRight className="size-3.5" />
                    </Link>
                </Button>
            </div>
        </header>
    );
}
