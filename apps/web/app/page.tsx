"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "~/hooks/api/auth";

export default function Home() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user && user.userId) {
            router.replace("/dashboard");
        } else {
            router.replace("/signin");
        }
    }, [user, router]);
    return (
        <main className="flex min-h-screen min-w-screen items-center justify-center">
            <div>
                <h1 className="text-3xl">From Builder</h1>
                <div>{user ? JSON.stringify(user, null, 2) : "Loading..."}</div>
            </div>
        </main>
    );
}
