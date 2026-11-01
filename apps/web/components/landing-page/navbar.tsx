"use client";

import Link from "next/link";
import { WandSparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Navbar as ChaiuiNavbar } from "~/components/navbar";

function BrandMark() {
    return (
        <span className="bg-brand grid size-7 place-items-center rounded-md text-[#17110f]">
            <WandSparkles className="size-3.5" />
        </span>
    );
}

export function Navbar() {
    return (
        <ChaiuiNavbar
            layout="menu"
            logo={
                <Link
                    href="/"
                    className="flex items-center gap-2.5"
                    aria-label="From Builder home"
                >
                    <BrandMark />
                    <span className="text-foreground font-manrope text-xs font-semibold tracking-tight">
                        From Builder
                    </span>
                </Link>
            }
            links={[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Stories", href: "#testimonials" },
            ]}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:bg-accent/60 hover:text-foreground hidden h-8 px-3 text-[10px] sm:inline-flex"
                    >
                        <Link href="/signin">Log in</Link>
                    </Button>
                    <Button
                        asChild
                        variant="solid"
                        size="sm"
                        className="h-8 gap-1.5 px-3 text-[10px]"
                    >
                        <Link href="/signup">Get started</Link>
                    </Button>
                </div>
            }
        />
    );
}
