"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
  IconLoader2,
  IconLogin,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useSignOut } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOutAsync } = useSignOut();
  const queryClient = useQueryClient();

  const isLoggedIn = Boolean(user.email && user.email !== "user@example.com");

  const initials = user.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CF";

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const toastId = toast.loading("Logging out...");

    try {
      // 1. Call tRPC backend procedure to clear HTTP-only cookie on Express API with 3.5s timeout
      await Promise.race([
        signOutAsync({}),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Sign out network request timed out")), 3500),
        ),
      ]).catch((err) => {
        console.warn("Backend signOut response delayed or failed, continuing cleanup:", err);
      });

      // 2. Clear all TanStack query caches in memory
      queryClient.clear();

      // 3. Call Next.js route handler to clear cookie in Next.js server cookie store
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});

      // 4. Fallback client-side cookie deletion
      document.cookie =
        "authentication-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      toast.success("Logged out successfully!", { id: toastId });

      // 5. Hard replace redirect to /login to completely reset client memory and re-check session
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback clean and redirect even if backend was unreachable
      queryClient.clear();
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      document.cookie =
        "authentication-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast.success("Logged out", { id: toastId });
      window.location.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg" className={landingTheme.buttonGhostHover}>
            <Link href="/login" className="flex items-center gap-2.5">
              <div
                className={`flex aspect-square size-8 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
              >
                <IconLogin className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className={`truncate font-semibold ${landingTheme.primaryText}`}>
                  Sign In
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Access your workspace
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`transition-colors ${landingTheme.buttonGhostHover}`}
            >
              <Avatar
                className={`h-8 w-8 rounded-lg border ${landingTheme.avatarBorder} shadow-xs`}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={landingTheme.avatarFallback}>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground" title={user.email}>
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border border-border/80 bg-card shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className={`h-8 w-8 rounded-lg border ${landingTheme.avatarBorder}`}>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className={landingTheme.avatarFallback}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground" title={user.email}>
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className={`${landingTheme.buttonGhostHover} cursor-pointer`}
              >
                <Link
                  href="/forms"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <IconUserCircle className="size-4" />
                  My Forms
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className={`${landingTheme.buttonGhostHover} cursor-pointer`}
              >
                <Link
                  href="/dashboard"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <IconCreditCard className="size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2 font-medium"
            >
              {isLoggingOut ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconLogout className="size-4 text-destructive" />
              )}
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
