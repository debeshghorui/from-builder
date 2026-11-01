import type { Metadata } from "next";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";
import { ThemeScript } from "~/components/theme-provider";

export const metadata: Metadata = {
    title: "From Builder | Forms that make feedback useful",
    description:
        "Create thoughtful forms, understand the responses, and turn feedback into better next steps.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <ThemeScript />
            </head>
            <body>
                <GlobalProviders>{children}</GlobalProviders>
            </body>
        </html>
    );
}
