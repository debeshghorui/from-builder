"use client";

import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SignupForm } from "~/components/signup-form";
import { useSignup } from "~/hooks/api/auth";

export default function SignupPage() {
    const router = useRouter();

    const { createUserWithEmailAndPasswordAsync, isPending } = useSignup();
    const [message, setMessage] = useState("");

    async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isPending) return;
        setMessage("");

        const form = event.currentTarget;
        const nameInput = form.querySelector<HTMLInputElement>("#name");
        const emailInput = form.querySelector<HTMLInputElement>("#email");
        const passwordInput = form.querySelector<HTMLInputElement>("#password");
        const confirmPasswordInput =
            form.querySelector<HTMLInputElement>("#confirm-password");

        if (
            !nameInput ||
            !emailInput ||
            !passwordInput ||
            !confirmPasswordInput
        ) {
            setMessage(
                "The signup form is incomplete. Please refresh and try again.",
            );
            return;
        }

        const fullName = nameInput.value.trim().replace(/\s+/g, " ");
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!firstName || lastNameParts.length === 0) {
            setMessage("Enter your first and last name.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 8 || password.length > 255) {
            setMessage("Password must be between 8 and 255 characters.");
            return;
        }

        if (
            firstName.length > 255 ||
            lastNameParts.join(" ").length > 255 ||
            email.length > 255
        ) {
            setMessage(
                "Name and email fields must be 255 characters or fewer.",
            );
            return;
        }

        try {
            setMessage("Creating your account...");
            await createUserWithEmailAndPasswordAsync(
                {
                    firstName,
                    lastName: lastNameParts.join(" "),
                    email,
                    password,
                },
                {
                    onSuccess: () => {
                        setMessage("Your account has been created.");
                        router.replace("/dashboard");
                    },
                },
            );
            setMessage("Your account has been created.");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "";
            if (/already exists/i.test(errorMessage)) {
                setMessage(
                    "An account with this email already exists. Try signing in instead.",
                );
            } else if (/failed to fetch|network|fetch/i.test(errorMessage)) {
                setMessage(
                    "Could not reach the signup service. Check your connection and try again.",
                );
            } else {
                setMessage(
                    errorMessage ||
                        "Unable to create your account. Please try again.",
                );
            }
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
                        <SignupForm onSubmit={handleSignup} />
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
                <Image
                    src="/placeholder.svg"
                    alt="Abstract sign-in illustration"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
