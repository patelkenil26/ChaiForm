"use client";

import Link from "next/link";
import {
  IconSparkles,
  IconArrowUpRight,
  IconShieldCheck,
  IconCpu,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";

export interface DashboardQuotaProps {
  isDataLoading: boolean;
  totalSubmissions: number;
  totalForms: number;
  publishedCount: number;
}

const MONTHLY_LIMIT = 250;

/**
 * Premium Workspace Capacity & Health Meter (Quota, Free Tier limits, and Health telemetry).
 */
export function DashboardQuota({
  isDataLoading,
  totalSubmissions,
  totalForms,
  publishedCount,
}: DashboardQuotaProps) {
  const usagePercent = Math.min(100, Math.round((totalSubmissions / MONTHLY_LIMIT) * 100));
  const remaining = Math.max(0, MONTHLY_LIMIT - totalSubmissions);

  return (
    <Card
      className={`p-4 sm:p-5 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} relative overflow-hidden transition-all`}
    >
      {/* Subtle Ambient Background Highlight */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-lime-500/10 dark:bg-[#CCFF00]/10 blur-2xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex size-8 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
          >
            <IconCpu className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground">Monthly Quota</h3>
            <p className="text-[11px] text-muted-foreground">Free Community Tier</p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
          title="Your workspace has active responses remaining"
        >
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Healthy
        </span>
      </div>

      {/* Usage Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <span>Responses Used This Month</span>
          </span>
          <span className="font-mono font-bold text-foreground">
            {isDataLoading ? (
              <Skeleton className="inline-block h-3 w-12" />
            ) : (
              <>
                <span className={landingTheme.primaryText}>{totalSubmissions}</span>
                <span className="text-muted-foreground/80"> / {MONTHLY_LIMIT}</span>
              </>
            )}
          </span>
        </div>

        <div className="relative">
          <Progress value={usagePercent} className="h-2 bg-muted/60" />
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{remaining} responses available</span>
          <span className="font-semibold text-foreground">{usagePercent}% consumed</span>
        </div>
      </div>

      {/* Workspace Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs mb-4">
        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
            Published Forms
          </span>
          <span className="font-bold text-foreground mt-0.5 inline-block text-xs">
            {isDataLoading ? (
              <Skeleton className="h-4 w-6" />
            ) : (
              `${publishedCount} of ${totalForms || 1} live`
            )}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
            Security Status
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 text-xs">
            <IconShieldCheck className="size-3.5" />
            <span>256-bit SSL</span>
          </span>
        </div>
      </div>

      {/* Upgrade Callout */}
      <Button
        asChild
        variant="outline"
        size="sm"
        className={`w-full h-8 text-xs justify-between border-border/70 ${landingTheme.buttonOutlineHover} group`}
        title="Upgrade plan to get higher response limits, custom domains, and team members"
      >
        <Link href="/pricing">
          <span className="flex items-center gap-1.5 font-semibold">
            <IconSparkles className={`size-3.5 ${landingTheme.iconColor}`} />
            <span>Upgrade for More Responses</span>
          </span>
          <IconArrowUpRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </Button>
    </Card>
  );
}
