"use client";

import { IconAt, IconId, IconLock, IconUserCircle } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useUser } from "~/hooks/api/auth";
import { DashboardPage, PageHeading, PageState } from "~/components/app-page";

function initials(name: string) {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "U"
    );
}

export default function AccountPage() {
    const { user, isPending, isError, error, refetch } = useUser();

    if (isPending || !user || isError) {
        return (
            <DashboardPage>
                <PageHeading
                    title="Account"
                    description="View your profile and account details."
                />
                <PageState
                    variant={isError ? "error" : "loading"}
                    title={
                        isError
                            ? "Could not load account details"
                            : "Loading account details"
                    }
                    description={isError ? error?.message : undefined}
                    className="min-h-64 max-w-4xl"
                >
                    {isError && (
                        <Button
                            variant="outline"
                            onClick={() => void refetch()}
                        >
                            Try again
                        </Button>
                    )}
                </PageState>
            </DashboardPage>
        );
    }

    const name = user.fullName?.trim() || "User";
    const email = user.email?.trim() || "Not provided";

    return (
        <DashboardPage>
            <PageHeading
                title="Account"
                description="View your profile and account details."
            />
            <div className="grid w-full max-w-4xl gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconUserCircle className="text-muted-foreground size-5" />
                            Profile
                        </CardTitle>
                        <CardDescription>
                            Your personal information associated with this
                            account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            <Avatar className="size-16 rounded-xl">
                                {user.profileImageUrl && (
                                    <AvatarImage
                                        src={user.profileImageUrl}
                                        alt={name}
                                    />
                                )}
                                <AvatarFallback className="rounded-xl text-lg">
                                    {initials(name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="text-lg font-medium">{name}</p>
                                <p className="text-muted-foreground truncate text-sm">
                                    {email}
                                </p>
                            </div>
                            <Badge variant="outline">Account owner</Badge>
                        </div>
                        <Separator className="my-6" />
                        <dl className="grid gap-5 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <IconUserCircle className="text-muted-foreground mt-0.5 size-4" />
                                <div className="min-w-0">
                                    <dt className="text-muted-foreground text-xs">
                                        Full name
                                    </dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {name}
                                    </dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconAt className="text-muted-foreground mt-0.5 size-4" />
                                <div className="min-w-0">
                                    <dt className="text-muted-foreground text-xs">
                                        Email address
                                    </dt>
                                    <dd className="mt-1 truncate text-sm font-medium">
                                        {email}
                                    </dd>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <IconId className="text-muted-foreground mt-0.5 size-4" />
                                <div className="min-w-0">
                                    <dt className="text-muted-foreground text-xs">
                                        Account ID
                                    </dt>
                                    <dd className="mt-1 font-mono text-xs break-all">
                                        {user.userId}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconLock className="text-muted-foreground size-5" />
                            Security
                        </CardTitle>
                        <CardDescription>
                            Your account is protected by your sign-in
                            credentials.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium">Password</p>
                                <p className="text-muted-foreground text-sm">
                                    Password sign-in is enabled for this
                                    account.
                                </p>
                            </div>
                            <Badge variant="outline">Enabled</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardPage>
    );
}
