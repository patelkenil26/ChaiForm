"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

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
        <div className="relative size-10 animate-pulse">
          <Image
            src="/chaiform-logo-transparent-for-dark-bg (3).svg"
            alt="ChaiForm"
            width={40}
            height={40}
            className="size-full object-contain"
            priority
          />
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
        <div className="relative size-10">
          <Image
            src="/chaiform-logo-transparent-for-dark-bg (3).svg"
            alt="ChaiForm"
            width={40}
            height={40}
            className="size-full object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className={`size-3.5 animate-spin ${landingTheme.iconColor}`} />
          <span>Redirecting to sign in...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
