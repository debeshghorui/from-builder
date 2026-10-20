"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoginForm } from "~/components/signin-form";
import { TablerIllustration } from "~/components/tabler-illustration";
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
            <div className="bg-muted/40 relative hidden items-center justify-center overflow-hidden p-10 lg:flex">
                <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-purple-500/10" />
                <TablerIllustration
                    name="boy-with-key"
                    alt="A person unlocking an account"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority
                    className="relative z-10 h-auto max-h-[80vh] w-full max-w-2xl object-contain"
                />
            </div>
        </div>
    );
}
