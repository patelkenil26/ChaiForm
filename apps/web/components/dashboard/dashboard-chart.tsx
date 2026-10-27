"use client";

import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { IconTrendingUp, IconChartBar, IconCopy } from "@tabler/icons-react";
import { Card, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { landingTheme } from "~/config/landing-theme";

export interface TimelineDataPoint {
  date: string;
  submissions: number;
}

export interface DashboardChartProps {
  isDataLoading: boolean;
  totalSubmissions: number;
  timelineData: TimelineDataPoint[];
  firstForm?: { id: string; slug?: string | null } | null;
  onCopyFirstFormLink?: () => void;
}

/**
 * Interactive 14-day submissions velocity area chart with linear gradient & tooltip.
 */
export function DashboardChart({
  isDataLoading,
  totalSubmissions,
  timelineData,
  firstForm,
  onCopyFirstFormLink,
}: DashboardChartProps) {
  return (
    <Card
      className={`p-5 sm:p-6 rounded-2xl border ${landingTheme.cardBg} ${landingTheme.cardBorderHover} transition-all`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <IconTrendingUp className={`size-5 ${landingTheme.iconColor}`} />
            <span>Workspace Submissions Velocity</span>
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Daily responses collected across your entire workspace over the last 14 days.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={`h-8 text-xs gap-1.5 border-border/70 ${landingTheme.buttonOutlineHover}`}
          >
            <Link href="/submissions">
              <IconChartBar className={`size-3.5 ${landingTheme.iconColor}`} />
              <span>Open Full Analytics</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        {isDataLoading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : totalSubmissions === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center border border-dashed border-border/70 rounded-xl bg-card/40">
            <div
              className={`size-10 rounded-xl ${landingTheme.iconBg} flex items-center justify-center mb-3`}
            >
              <IconTrendingUp className="size-5" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">No responses recorded yet</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              As soon as users complete any form, live activity trends will populate here. Share
              your form link to get started!
            </p>
            {firstForm && onCopyFirstFormLink && (
              <Button
                size="sm"
                variant="outline"
                onClick={onCopyFirstFormLink}
                className={`mt-4 text-xs gap-1.5 h-8 ${landingTheme.buttonOutlineHover}`}
              >
                <IconCopy className="size-3.5" />
                <span>Share Form Link</span>
              </Button>
            )}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardSubmissionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={landingTheme.paletteHex[0]} stopOpacity={0.38} />
                  <stop offset="95%" stopColor={landingTheme.paletteHex[0]} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border/80 bg-neutral-950/95 backdrop-blur-md px-3.5 py-2.5 text-xs shadow-xl shadow-black/60">
                        <p className="font-semibold text-neutral-200">{label}</p>
                        <p className={`font-bold mt-0.5 ${landingTheme.primaryText}`}>
                          {payload[0]?.value} submissions
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="submissions"
                stroke={landingTheme.paletteHex[0]}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dashboardSubmissionsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
