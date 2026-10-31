"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconForms,
  IconCompass,
  IconArrowLeft,
  IconArrowRight,
  IconHome,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";
import { ChaiFormLogo } from "~/components/brand/chaiform-logo";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 text-center overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className={`h-[360px] w-[560px] rounded-full ${landingTheme.heroGlow}`} />
      </div>

      <div className="flex max-w-md flex-col items-center gap-6">
        {/* App Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <ChaiFormLogo
            size={36}
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">ChaiForm</span>
        </Link>

        {/* 404 Badge */}
        <Badge
          variant="outline"
          className={`text-xs px-3 py-1 font-mono uppercase tracking-wider ${landingTheme.badge}`}
        >
          Error 404 • Page Not Found
        </Badge>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Lost in the flow?
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page, form, or route you requested doesn&apos;t exist or may have been moved.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
          <Button asChild className={`w-full sm:w-auto gap-2 ${landingTheme.primaryButton}`}>
            <Link href="/dashboard">
              <IconLayoutDashboard className="size-4" />
              <span>Go to Dashboard</span>
              <IconArrowRight className="size-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link href="/explore">
              <IconCompass className="size-4" />
              <span>Templates</span>
            </Link>
          </Button>
        </div>

        {/* Secondary Back Action */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/40 w-full justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
          >
            <IconArrowLeft className="size-3.5" />
            <span>Go back to previous page</span>
          </button>
          <span>•</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <IconHome className="size-3.5" />
            <span>ChaiForm Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
