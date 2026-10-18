import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { DashboardAuthGuard } from "~/components/auth/dashboard-auth-guard"
import { landingTheme } from "~/config/landing-theme"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardAuthGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className={`relative overflow-hidden ${landingTheme.selection}`}>
          {/* Subtle Ambient Theme Glow */}
          <div className={`pointer-events-none absolute -top-24 right-1/4 h-80 w-96 rounded-full ${landingTheme.heroGlow} -z-10`} />
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardAuthGuard>
  )
}

