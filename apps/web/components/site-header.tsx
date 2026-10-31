"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ThemesComingSoonButton } from "~/components/themes/themes-modal";
import { GlobalCommandPalette, CommandSearchTrigger } from "~/components/global-command-palette";
import { WorkspaceQuotaPill } from "~/components/workspace/workspace-quota-pill";
import { ThemeToggle } from "~/components/theme-toggle";
import { landingTheme } from "~/config/landing-theme";

export function SiteHeader() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const renderBreadcrumbs = () => {
    if (!pathname || pathname === "/dashboard") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname === "/forms") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Forms</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname?.startsWith("/forms/") && pathname.includes("/submissions")) {
      const parts = pathname.split("/");
      const formId = parts[2];
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/forms">Forms</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/forms/${formId}`}>Builder</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Submissions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname?.startsWith("/forms/")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/forms">Forms</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Builder</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname === "/submissions") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Submissions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname === "/explore" || pathname === "/templates") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Templates</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname === "/settings" || pathname.startsWith("/settings/")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold text-foreground">ChaiForm</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <div className="flex-1 min-w-0">
          <Breadcrumb className="truncate text-xs sm:text-sm">{renderBreadcrumbs()}</Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Monthly Response Capacity Pill */}
          <WorkspaceQuotaPill />

          {/* Global Search Palette (⌘K) */}
          <CommandSearchTrigger onClick={() => setSearchOpen(true)} />

          {/* Themes Preview Modal */}
          <ThemesComingSoonButton className="hidden sm:inline-flex" />

          {/* Dark / Light Mode Switcher */}
          <ThemeToggle className="size-8" />
        </div>
      </div>

      {/* Global Workspace Command Palette */}
      <GlobalCommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
