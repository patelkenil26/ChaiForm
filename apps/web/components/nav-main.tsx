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

export interface NavMainItem {
  title: string;
  url: string;
  icon?: Icon;
  badge?: number | string | null;
  onClick?: () => void;
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const isItemActive = (url: string) => {
    if (!pathname || url === "#") return false;
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

  const handleItemClick = (item: NavMainItem) => {
    if (item.onClick) {
      item.onClick();
    }
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

            const content = (
              <>
                {item.icon && (
                  <item.icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      active
                        ? "text-primary stroke-[2.2]"
                        : "text-foreground/70 dark:text-zinc-400 group-hover:text-foreground dark:group-hover:text-zinc-200",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "truncate text-xs transition-colors",
                    active
                      ? "text-foreground font-semibold"
                      : "text-foreground/80 dark:text-zinc-300 font-medium group-hover:text-foreground dark:group-hover:text-zinc-100",
                  )}
                >
                  {item.title}
                </span>

                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={cn(
                      "ml-auto text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full border transition-colors",
                      active
                        ? "bg-primary/20 text-foreground border-primary/40 font-bold"
                        : "bg-muted/50 text-foreground/70 dark:text-zinc-400 border-border/60 group-hover:text-foreground",
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {active && !item.badge && (
                  <span className="ml-auto size-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(204,255,0,0.5)]" />
                )}
              </>
            );

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.title}
                  className={cn(
                    "relative transition-all duration-150 rounded-lg px-2.5 py-2 cursor-pointer group",
                    active
                      ? "bg-primary/10 text-foreground font-semibold border border-primary/35 shadow-xs"
                      : "text-foreground/80 dark:text-zinc-300 hover:bg-muted/50 dark:hover:bg-white/[0.05] border border-transparent",
                  )}
                >
                  {item.onClick ? (
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="flex items-center gap-2.5 w-full text-left"
                    >
                      {content}
                    </button>
                  ) : (
                    <Link
                      href={item.url}
                      onClick={() => handleItemClick(item)}
                      className="flex items-center gap-2.5 w-full"
                    >
                      {content}
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
