"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "~/hooks/api/auth";

export function DashboardAuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { user, isPending, isError } = useUser();

    useEffect(() => {
        if (isError || (!isPending && !user)) router.replace("/signin");
    }, [isError, isPending, router, user]);

    if (!user) return null;
    return children;
}
