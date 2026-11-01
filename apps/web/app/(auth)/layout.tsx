import type { ReactNode } from "react";

import { AuthLayout } from "~/components/auth-layout";

export default function AuthenticationLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <AuthLayout
            title="Make every response count."
            description="Create thoughtful forms and turn the answers into clear next steps."
        >
            {children}
        </AuthLayout>
    );
}
