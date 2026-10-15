"use client";

import Link from "next/link";
import { IconForms, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

export function LandingNavbar() {
  const { user, isLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className={`flex aspect-square size-9 items-center justify-center rounded-xl ${landingTheme.logoGradient} transition-transform duration-200 group-hover:scale-105`}>
            <IconForms className="size-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-foreground">ChaiForm</span>
              <Badge variant="outline" className={`hidden sm:inline-flex text-[10px] py-0 px-1.5 h-4 ${landingTheme.badge}`}>
                v2.0
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">
              Conversational Form Builder
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link
            href="/templates"
            className="transition-colors hover:text-foreground text-sm font-medium flex items-center gap-1.5"
          >
            <span>Templates</span>
            <Badge variant="outline" className={`text-[9px] py-0 px-1.5 h-4 ${landingTheme.badge} font-normal`}>
              50+ Free
            </Badge>
          </Link>
          <a
            href="/#features"
            className="transition-colors hover:text-foreground text-sm"
          >
            Features
          </a>
          <Link
            href="/pricing"
            className="transition-colors hover:text-foreground text-sm font-medium"
          >
            Pricing
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {user && !isLoading ? (
            <Button
              asChild
              size="sm"
              className={`gap-2 ${landingTheme.primaryButton}`}
            >
              <Link href="/dashboard">
                <span>Go to Dashboard</span>
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className={`gap-1.5 text-xs sm:text-sm ${landingTheme.primaryButton}`}
              >
                <Link href="/signup">
                  <IconSparkles className="size-3.5" />
                  <span>Get Started Free</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
