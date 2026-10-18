"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

import { LoginForm } from "~/components/signin-form";
import { useSignin } from "~/hooks/api/auth";

export default function LoginPage() {
    const { signInUserWithEmailAndPasswordAsync, isPending } = useSignin();
    const [message, setMessage] = useState("");

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
            await signInUserWithEmailAndPasswordAsync({ email, password });
            setMessage("You are signed in.");
        } catch {
            setMessage(
                "Unable to sign in with those credentials. Please try again.",
            );
        }
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Acme Inc.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm onSubmit={handleSignin} />
                        {message && (
                            <p
                                className="mt-4 text-center text-sm"
                                role="status"
                                aria-live="polite"
                            >
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
