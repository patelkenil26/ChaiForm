"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { type Icon } from "@tabler/icons-react";

import { cn } from "~/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active = item.url !== "#" && pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className={cn(
                    "transition-colors duration-150 rounded-lg px-2.5 py-2 font-medium cursor-pointer",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Link
                    href={item.url}
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                    className="flex items-center gap-2.5 w-full"
                  >
                    <item.icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active ? "text-sidebar-accent-foreground" : "text-muted-foreground",
                      )}
                    />
                    <span>{item.title}</span>
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
