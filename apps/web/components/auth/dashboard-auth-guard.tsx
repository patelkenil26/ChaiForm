"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";
import { ChaiFormLogo } from "~/components/brand/chaiform-logo";

export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectParam = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${redirectParam}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <div className="animate-pulse">
          <ChaiFormLogo size={40} priority />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className={`size-3.5 animate-spin ${landingTheme.iconColor}`} />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Show smooth loading state while the router completes redirection to /login
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <ChaiFormLogo size={40} priority />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className={`size-3.5 animate-spin ${landingTheme.iconColor}`} />
          <span>Redirecting to sign in...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
