"use client";

import * as React from "react";
import {
    IconCamera,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconHelp,
    IconInnerShadowTop,
    IconClipboardText,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
    IconAiAgent,
} from "@tabler/icons-react";

import { NavDocuments } from "~/components/nav-documents";
import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import { useUser } from "~/hooks/api/auth";
import { Skeleton } from "~/components/ui/skeleton";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar";

const data = {
    navMain: [
        { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
        { title: "Forms", url: "/dashboard/forms", icon: IconClipboardText },
        { title: "Team", url: "#", icon: IconUsers },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                { title: "Active Proposals", url: "#" },
                { title: "Archived", url: "#" },
            ],
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                { title: "Active Proposals", url: "#" },
                { title: "Archived", url: "#" },
            ],
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                { title: "Active Proposals", url: "#" },
                { title: "Archived", url: "#" },
            ],
        },
    ],
    navSecondary: [
        { title: "Settings", url: "#", icon: IconSettings },
        { title: "Get Help", url: "#", icon: IconHelp },
        { title: "Search", url: "#", icon: IconSearch },
    ],
    documents: [
        { name: "Data Library", url: "#", icon: IconDatabase },
        { name: "Reports", url: "#", icon: IconReport },
        { name: "Assistant", url: "#", icon: IconAiAgent },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user, isPending, isError } = useUser();

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="size-5!" />
                                <span className="text-base font-semibold">
                                    {user?.fullName ?? "Dashboard"}
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                {user ? (
                    <NavUser user={user} />
                ) : isPending ? (
                    <div
                        className="flex items-center gap-2 p-2"
                        aria-label="Loading account"
                    >
                        <Skeleton className="size-8 rounded-lg" />
                        <div className="grid flex-1 gap-1">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ) : isError ? (
                    <p
                        className="text-muted-foreground px-2 py-3 text-xs"
                        role="status"
                    >
                        Account information unavailable
                    </p>
                ) : null}
            </SidebarFooter>
        </Sidebar>
    );
}
