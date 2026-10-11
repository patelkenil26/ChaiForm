"use client";

import * as React from "react";
import Link from "next/link";
import {
  IconDashboard,
  IconSettings,
  IconClipboardText,
  IconForms,
  IconInbox,
  IconCompass,
} from "@tabler/icons-react";

import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import { useUser } from "~/hooks/api/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Forms",
    url: "/forms",
    icon: IconClipboardText,
  },
  {
    title: "Submissions",
    url: "/submissions",
    icon: IconInbox,
  },
  {
    title: "Explore Templates",
    url: "/explore",
    icon: IconCompass,
  },
];

// const navSecondary = [
//   {
//     title: "Settings",
//     url: "#",
//     icon: IconSettings,
//   },
// ];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const currentUser = {
    name: user?.fullName || "User",
    email: user?.email || "user@example.com",
    avatar: user?.profileImageUrl || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconForms className="size-4.5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-base font-bold tracking-tight">ChaiForm</span>
                  <span className="text-xs text-muted-foreground">Form Builder</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
