"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import { cn } from "~/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const isItemActive = (url: string) => {
    if (!pathname) return false;
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    if (url === "/submissions" || url === "/dashboard/submissions") {
      return (
        pathname === "/submissions" ||
        pathname.startsWith("/submissions/") ||
        pathname === "/submission" ||
        pathname === "/dashboard/submissions" ||
        pathname.includes("/submissions")
      );
    }
    if (url === "/forms" || url === "/dashboard/forms") {
      return (
        (pathname === "/forms" ||
          pathname.startsWith("/forms/") ||
          pathname === "/form" ||
          pathname === "/dashboard/forms" ||
          pathname.startsWith("/dashboard/forms/")) &&
        !pathname.includes("/submissions")
      );
    }
    if (url === "/explore") {
      return (
        pathname === "/explore" || pathname === "/templates" || pathname.startsWith("/explore/")
      );
    }
    return pathname === url || pathname.startsWith(url + "/");
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active = isItemActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.title}
                  className={cn(
                    "relative transition-all duration-150 rounded-lg px-2.5 py-2 font-medium cursor-pointer",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold border border-primary/50 ring-1 ring-primary/30 shadow-xs dark:bg-sidebar-accent dark:border-primary/50 dark:ring-primary/20"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground border border-transparent active:bg-sidebar-accent/80 active:text-foreground",
                  )}
                >
                  <Link
                    href={item.url}
                    onClick={handleLinkClick}
                    className="flex items-center gap-2.5 w-full"
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          active
                            ? "text-primary stroke-[2.2]"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "truncate",
                        active
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                    {active && (
                      <span className="ml-auto size-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
