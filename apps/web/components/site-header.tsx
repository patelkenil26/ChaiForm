"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconClipboardPlus, IconCompass } from "@tabler/icons-react"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { ThemesComingSoonButton } from "~/components/themes/themes-modal"

export function SiteHeader() {
  const pathname = usePathname()

  const renderBreadcrumbs = () => {
    if (!pathname || pathname === "/dashboard") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      )
    }

    if (pathname === "/forms") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Forms</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      )
    }

    if (pathname?.startsWith("/forms/") && pathname.includes("/submissions")) {
      const parts = pathname.split("/")
      const formId = parts[2]
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
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
      )
    }

    if (pathname?.startsWith("/forms/")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
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
      )
    }

    if (pathname === "/submissions") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Submissions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      )
    }

    if (pathname === "/explore" || pathname === "/templates") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">Templates Gallery</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      )
    }

    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold text-foreground">ChaiForm</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    )
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex-1 min-w-0">
          <Breadcrumb className="truncate text-xs sm:text-sm">
            {renderBreadcrumbs()}
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {pathname !== "/explore" && pathname !== "/templates" && (
            <Button size="sm" asChild variant="ghost" className="hidden sm:inline-flex text-xs gap-1.5 text-muted-foreground hover:text-foreground">
              <Link href="/explore">
                <IconCompass className="size-3.5" />
                <span>Explore</span>
              </Link>
            </Button>
          )}
          <ThemesComingSoonButton />
          {pathname !== "/forms" && pathname !== "/dashboard/forms" && (
            <Button size="sm" asChild variant="outline" className="hidden sm:inline-flex text-xs">
              <Link href="/forms">
                <IconClipboardPlus className="size-3.5 mr-1.5" />
                Forms
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

