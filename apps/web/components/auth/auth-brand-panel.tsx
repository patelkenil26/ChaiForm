"use client";

import Image from "next/image";
import Link from "next/link";
import { landingTheme } from "~/config/landing-theme";

export interface AuthBrandPanelProps {
  headline: React.ReactNode;
  subtitle: string;
  previewQuestion: string;
  previewBadge?: string;
  previewContent: React.ReactNode;
  previewFooterLeft: React.ReactNode;
  previewFooterRight: React.ReactNode;
}

/**
 * Reusable Desktop Brand Story & Live Form Preview Panel for Auth screens (/login, /signup).
 * Provides balanced 2-column layout and animated card beam.
 */
export function AuthBrandPanel({
  headline,
  subtitle,
  previewQuestion,
  previewBadge = "Preview",
  previewContent,
  previewFooterLeft,
  previewFooterRight,
}: AuthBrandPanelProps) {
  return (
    <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-8 xl:p-10 rounded-2xl border border-border/80 bg-gradient-to-br from-amber-500/[0.04] via-card to-background relative overflow-hidden h-full min-h-[580px]">
      <div className={landingTheme.cardBeam} />

      <div>
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
          <div className="relative size-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/chaiform-logo-transparent-for-dark-bg (3).svg"
              alt="ChaiForm"
              width={36}
              height={36}
              className="size-full object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">ChaiForm</span>
        </Link>

        <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          {headline}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{subtitle}</p>

        {/* Mini Form Preview Card */}
        <div className="mt-6 p-4 rounded-xl border border-border/70 bg-background/70 backdrop-blur-md shadow-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              Question 1 of 3
            </span>
            <span className="text-[10px] bg-muted/60 px-2 py-0.5 rounded-full">{previewBadge}</span>
          </div>

          <p className="text-sm font-semibold text-foreground">{previewQuestion}</p>

          {previewContent}

          <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-t border-border/40">
            <span>{previewFooterLeft}</span>
            <span className="text-emerald-400 font-medium">{previewFooterRight}</span>
          </div>
        </div>
      </div>

      {/* 3 Conversion Bullets */}
      <div className="mt-8 pt-6 border-t border-border/60 grid grid-cols-3 gap-3 text-xs">
        <div className="space-y-1">
          <span className="font-semibold text-foreground block">⚡ Built in 60s</span>
          <span className="text-[11px] text-muted-foreground leading-tight block">
            14 interactive types, zero code
          </span>
        </div>
        <div className="space-y-1">
          <span className="font-semibold text-foreground block">☕ Free Forever</span>
          <span className="text-[11px] text-muted-foreground leading-tight block">
            250 responses/mo included
          </span>
        </div>
        <div className="space-y-1">
          <span className="font-semibold text-foreground block">📊 Export Anytime</span>
          <span className="text-[11px] text-muted-foreground leading-tight block">
            CSV, JSON &amp; embed API
          </span>
        </div>
      </div>
    </div>
  );
}
