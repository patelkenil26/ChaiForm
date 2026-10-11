"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconClipboardPlus, IconCompass } from "@tabler/icons-react"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { ThemesComingSoonButton } from "~/components/themes/themes-modal"

export function SiteHeader() {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/forms") return "Forms"
    if (pathname?.includes("/submissions") || pathname === "/submissions") return "Submissions"
    if (pathname?.startsWith("/forms/") ) return "Form Builder"
    if (pathname === "/explore" || pathname === "/templates") return "Templates Gallery"
    return "ChaiForm"
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-semibold">{getPageTitle()}</h1>
        <div className="ml-auto flex items-center gap-2">
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
            <Button size="sm" asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/forms">
                <IconClipboardPlus className="size-4 mr-1.5" />
                Forms
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

