"use client";

import * as React from "react";
import Link from "next/link";
import { ChaiFormLogo } from "~/components/brand/chaiform-logo";
import {
  IconDashboard,
  IconSettings,
  IconClipboardText,
  IconInbox,
  IconCompass,
} from "@tabler/icons-react";

import { NavMain, type NavMainItem } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { SettingsModal } from "~/components/settings/settings-modal";
import { useUser } from "~/hooks/api/auth";
import { useListForms } from "~/hooks/api/form";
import { useUserWorkspaceStats } from "~/hooks/api/form-submission";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { forms } = useListForms();
  const { stats } = useUserWorkspaceStats();
  const { isMobile, setOpenMobile } = useSidebar();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const navMain: NavMainItem[] = React.useMemo(
    () => [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Forms",
        url: "/forms",
        icon: IconClipboardText,
        badge: forms ? forms.length : null,
      },
      {
        title: "Submissions",
        url: "/submissions",
        icon: IconInbox,
        badge: stats ? stats.totalSubmissions : null,
      },
      {
        title: "Templates",
        url: "/explore",
        icon: IconCompass,
        badge: "40+",
      },
      {
        title: "Settings",
        url: "/settings",
        icon: IconSettings,
      },
    ],
    [forms, stats],
  );

  const currentUser = {
    name: user?.fullName || "User",
    email: user?.email || "user@example.com",
    avatar: user?.profileImageUrl || "",
  };

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <Link
                  href="/dashboard"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                  className="flex items-center gap-2.5"
                >
                  <ChaiFormLogo size={28} />
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
          <NavUser user={currentUser} onOpenSettings={() => setSettingsOpen(true)} />
        </SidebarFooter>
      </Sidebar>

      {/* Global Workspace Settings Modal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
