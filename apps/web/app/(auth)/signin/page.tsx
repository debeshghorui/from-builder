"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoginForm } from "~/components/signin-form";
import { useSignin, useUser } from "~/hooks/api/auth";

export default function LoginPage() {
    const router = useRouter();

    const { user } = useUser();
    const { signInUserWithEmailAndPasswordAsync, isPending } = useSignin();
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user) router.replace("/dashboard");
    }, [router, user]);

    if (user) return null;

    async function handleSignin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isPending) return;
        setMessage("");

        const form = event.currentTarget;
        const emailInput = form.querySelector<HTMLInputElement>("#email");
        const passwordInput = form.querySelector<HTMLInputElement>("#password");

        if (!emailInput || !passwordInput) {
            setMessage(
                "The sign-in form is incomplete. Please refresh and try again.",
            );
            return;
        }

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (!email || !password) {
            setMessage("Enter your email and password.");
            return;
        }

        if (password.length < 8 || password.length > 255) {
            setMessage("Password must be between 8 and 255 characters.");
            return;
        }

        try {
            await signInUserWithEmailAndPasswordAsync(
                { email, password },
                {
                    onSuccess: () => {
                        router.replace("/dashboard");
                    },
                },
            );
            setMessage("You are signed in.");
        } catch {
            setMessage(
                "Unable to sign in with those credentials. Please try again.",
            );
        }
    }

    return (
        <>
            <LoginForm onSubmit={handleSignin} />
            {message && (
                <p
                    className="text-muted-foreground mt-4 text-center text-sm"
                    role="status"
                    aria-live="polite"
                >
                    {message}
                </p>
            )}
        </>
    );
}
