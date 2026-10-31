"use client";

import { useState } from "react";
import Link from "next/link";
import { IconBolt, IconSparkles, IconArrowUpRight, IconShieldCheck } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useUserWorkspaceStats } from "~/hooks/api/form-submission";
import { landingTheme } from "~/config/landing-theme";

const MONTHLY_LIMIT = 250;

/**
 * Navbar Workspace Quota Telemetry Pill.
 * Displays response capacity, health dot, and expandable plan details (future payment ready).
 */
export function WorkspaceQuotaPill() {
  const { stats, isLoading } = useUserWorkspaceStats();
  const [open, setOpen] = useState(false);

  const totalSubmissions = stats?.totalSubmissions ?? 0;
  const usagePercent = Math.min(100, Math.round((totalSubmissions / MONTHLY_LIMIT) * 100));
  const remaining = Math.max(0, MONTHLY_LIMIT - totalSubmissions);

  const isNearLimit = usagePercent >= 80;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-8 px-2 sm:px-2.5 rounded-lg border border-border/70 bg-muted/30 hover:bg-muted/60 transition-all text-xs font-medium cursor-pointer shrink-0"
          title="Monthly response capacity and workspace health"
        >
          {/* Animated health status dot */}
          <span
            className={`size-1.5 rounded-full shrink-0 ${
              isNearLimit ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"
            }`}
          />
          <IconBolt
            className={`size-3.5 shrink-0 ${
              isNearLimit ? "text-amber-400" : landingTheme.iconColor
            }`}
          />

          {/* Responsive label: compact on mobile, full on tablet/desktop */}
          <span className="font-mono text-[11px] text-foreground">
            {isLoading ? (
              <span className="opacity-60">...</span>
            ) : (
              <>
                <span className="hidden sm:inline">
                  <span className={landingTheme.primaryText}>{totalSubmissions}</span>
                  <span className="text-muted-foreground/80"> / {MONTHLY_LIMIT}</span>
                </span>
                <span className="sm:hidden">
                  <span className={landingTheme.primaryText}>{totalSubmissions}</span>
                  <span className="text-muted-foreground/70">/250</span>
                </span>
              </>
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-4 rounded-2xl border border-border/80 bg-popover shadow-xl"
      >
        <div className="space-y-3">
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-7 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
              >
                <IconBolt className="size-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Workspace Quota</h4>
                <p className="text-[10px] text-muted-foreground">Community Free Tier</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold">
              <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          {/* Usage Meter */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-[11px] text-muted-foreground font-medium">
                Monthly Responses
              </span>
              <span className="font-mono text-xs font-bold text-foreground">
                <span className={landingTheme.primaryText}>{totalSubmissions}</span>
                <span className="text-muted-foreground/70"> / {MONTHLY_LIMIT}</span>
              </span>
            </div>

            <Progress value={usagePercent} className="h-1.5 bg-muted/60" />

            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{remaining} responses remaining</span>
              <span>{usagePercent}% used</span>
            </div>
          </div>

          {/* Plan Feature Snapshot */}
          <div className="rounded-xl bg-muted/30 border border-border/40 p-2.5 text-[11px] text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 text-foreground font-medium text-[10px] uppercase tracking-wider">
              <IconShieldCheck className="size-3 text-emerald-400" />
              <span>Free Plan Includes</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              Unlimited conversational forms, CSV export, real-time analytics, and 250 monthly
              responses.
            </p>
          </div>

          {/* Upgrade Callout (Ready for future Stripe payment integration) */}
          <Button
            asChild
            size="sm"
            onClick={() => setOpen(false)}
            className={`w-full h-8 text-xs justify-between ${landingTheme.primaryButton} group`}
            title="View Pro plans with higher response limits and custom domains"
          >
            <Link href="/pricing">
              <span className="flex items-center gap-1.5 font-semibold">
                <IconSparkles className="size-3.5" />
                <span>Upgrade for Unlimited</span>
              </span>
              <IconArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
