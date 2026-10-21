"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  IconAlertTriangle,
  IconRefresh,
  IconHome,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { getSafeErrorMessage } from "~/lib/error";
import { landingTheme } from "~/config/landing-theme";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client error to monitoring
    console.error("Unhandled client error captured:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 text-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[360px] w-[560px] rounded-full bg-gradient-to-tr from-destructive/10 via-amber-500/10 to-transparent blur-[120px]" />
      </div>

      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-md">
          <IconAlertTriangle className="size-6" />
        </div>

        <Badge
          variant="outline"
          className="border-destructive/30 bg-destructive/5 text-destructive text-xs px-3 py-1 font-mono uppercase tracking-wider"
        >
          Something Went Wrong
        </Badge>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            An unexpected error occurred
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getSafeErrorMessage(
              error,
              "We encountered an issue while loading this page. You can try refreshing or returning to safety."
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
          <Button
            onClick={() => reset()}
            className={`w-full sm:w-auto gap-2 ${landingTheme.primaryButton}`}
          >
            <IconRefresh className="size-4" />
            <span>Try Again</span>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link href="/dashboard">
              <IconLayoutDashboard className="size-4" />
              <span>Go to Dashboard</span>
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/40 w-full justify-center">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            <IconHome className="size-3.5" />
            <span>Return to ChaiForm Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
