"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconLoader2,
  IconLogin,
} from "@tabler/icons-react"
import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar"
import { useSignOut } from "~/hooks/api/auth"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { signOutAsync } = useSignOut()

  const isLoggedIn = Boolean(user.email && user.email !== "user@example.com")

  const initials = user.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CF"

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    const toastId = toast.loading("Logging out...")

    try {
      // 1. Call tRPC backend procedure to clear HTTP-only cookie on Express API
      await signOutAsync()

      // 2. Call Next.js route handler to clear cookie in Next.js server cookie store
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})

      // 3. Fallback client-side cookie deletion
      document.cookie =
        "authentication-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      toast.success("Logged out successfully!", { id: toastId })

      // 4. Hard redirect to /login to completely reset client memory and re-check session
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback clean and redirect even if backend was unreachable
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
      document.cookie =
        "authentication-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      toast.success("Logged out", { id: toastId })
      window.location.href = "/login"
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg" className="hover:bg-primary/10">
            <Link href="/login" className="flex items-center gap-2.5">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IconLogin className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-primary">Sign In</span>
                <span className="truncate text-xs text-muted-foreground">Access your workspace</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/forms">
                  <IconUserCircle className="size-4" />
                  My Forms
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <IconCreditCard className="size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
            >
              {isLoggingOut ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconLogout className="size-4" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
