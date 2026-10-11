"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { type Icon } from "@tabler/icons-react"

import { cn } from "~/lib/utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active = item.url !== "#" && pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className={cn(
                    "transition-all duration-150 rounded-lg px-2.5 py-2 font-medium",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold border border-primary/50 ring-1 ring-primary/30 shadow-xs dark:bg-sidebar-accent dark:border-primary/50 dark:ring-primary/20"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground border border-transparent"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-2.5 w-full">
                    <item.icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active ? "text-primary stroke-[2.2]" : "text-muted-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
