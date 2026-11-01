import Link from "next/link";
import { WandSparkles } from "lucide-react";

import { Footer as ChaiFooter } from "~/components/footer";

export function Footer() {
    return (
        <ChaiFooter
            logo={
                <Link
                    href="/"
                    aria-label="From Builder home"
                    className="font-manrope text-foreground inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight"
                >
                    <WandSparkles className="text-brand size-5" />
                    From Builder
                </Link>
            }
            tagline="Make forms that turn feedback into useful next steps."
            owner="From Builder"
            className="font-manrope"
            sections={[
                {
                    title: "Product",
                    links: [
                        { label: "Features", href: "#features" },
                        { label: "Pricing", href: "#pricing" },
                        { label: "Integrations", href: "#features" },
                        { label: "API", href: "#features" },
                    ],
                },
                {
                    title: "Company",
                    links: [
                        { label: "About", href: "#product" },
                        { label: "Blog", href: "#testimonials" },
                        { label: "Careers", href: "#product" },
                        {
                            label: "Contact",
                            href: "mailto:hello@frombuilder.com",
                        },
                    ],
                },
                {
                    title: "Your workspace",
                    links: [
                        { label: "Create an account", href: "/signup" },
                        { label: "Log in", href: "/signin" },
                        { label: "Start building", href: "/signup" },
                    ],
                },
                {
                    title: "More",
                    links: [
                        { label: "Privacy policy", href: "#" },
                        { label: "Terms of service", href: "#" },
                        { label: "Cookie policy", href: "#" },
                    ],
                },
            ]}
        />
    );
}
