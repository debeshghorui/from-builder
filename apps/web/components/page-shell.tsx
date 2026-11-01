import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Footer } from "~/components/footer";
import { Navbar } from "~/components/navbar";
import { Backdrop } from "~/components/backdrop";

type NavbarProps = Omit<ComponentProps<typeof Navbar>, "logo">;
type FooterProps = Omit<ComponentProps<typeof Footer>, "logo">;

/** ChaiUI page frame with the brand and navigation supplied by the product. */
export function PageShell({
    children,
    logo,
    navbarProps,
    footerProps,
}: {
    children: ReactNode;
    logo: ReactNode;
    navbarProps?: NavbarProps;
    footerProps: FooterProps;
}) {
    return (
        <div className="bg-background text-foreground min-h-dvh">
            <Backdrop />
            <div className="sm:max-w-6xl lg:mx-auto">
                <Navbar
                    logo={
                        <Link
                            href="/"
                            aria-label="From Builder home"
                            className="focus-visible:ring-ring/50 rounded-md outline-none focus-visible:ring-[3px]"
                        >
                            {logo}
                        </Link>
                    }
                    {...navbarProps}
                />
                <main className="flex flex-col gap-y-4 p-6 sm:p-12">
                    {children}
                </main>
                <Footer logo={logo} {...footerProps} />
            </div>
        </div>
    );
}
