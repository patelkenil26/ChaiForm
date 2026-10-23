"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconArrowRight,
  IconSparkles,
  IconMenu2,
  IconCompass,
  IconFlame,
  IconCurrencyDollar,
  IconLogin,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

export function LandingNavbar() {
  const { user, isLoading } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative size-8 sm:size-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/chaiform-logo-transparent-for-dark-bg (3).svg"
              alt="ChaiForm Logo"
              width={36}
              height={36}
              className="size-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-foreground">ChaiForm</span>
              <Badge
                variant="outline"
                className={`hidden sm:inline-flex text-[10px] py-0 px-1.5 h-4 ${landingTheme.badge}`}
              >
                v2.0
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">
              Conversational Form Builder
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link
            href="/templates"
            className="transition-colors hover:text-foreground text-sm font-medium"
          >
            Templates
          </Link>
          <a href="/#features" className="transition-colors hover:text-foreground text-sm">
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
        <div className="flex items-center gap-2 sm:gap-3">
          {user && !isLoading ? (
            <Button
              asChild
              size="sm"
              className={`hidden sm:inline-flex gap-2 ${landingTheme.primaryButton}`}
            >
              <Link href="/dashboard">
                <span>Go to Dashboard</span>
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
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
            </div>
          )}

          {/* Mobile Menu Drawer Toggle */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden size-9 border-border/70"
                aria-label="Open navigation menu"
              >
                <IconMenu2 className="size-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between"
            >
              <div>
                <SheetHeader className="text-left border-b border-border/50 pb-4 mb-4">
                  <SheetTitle className="flex items-center gap-2.5">
                    <div className="relative size-7 flex items-center justify-center">
                      <Image
                        src="/chaiform-logo-transparent-for-dark-bg (3).svg"
                        alt="ChaiForm"
                        width={28}
                        height={28}
                        className="size-full object-contain"
                      />
                    </div>
                    <span className="font-bold text-base">ChaiForm</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] py-0 px-1.5 h-4 ${landingTheme.badge}`}
                    >
                      v2.0
                    </Badge>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-1.5 text-sm font-medium">
                  <Link
                    href="/templates"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <IconCompass className={`size-4.5 ${landingTheme.iconColor}`} />
                    <span>Templates</span>
                  </Link>

                  <a
                    href="/#features"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <IconFlame className="size-4.5 text-indigo-400" />
                    <span>Features</span>
                  </a>

                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <IconCurrencyDollar className="size-4.5 text-emerald-400" />
                    <span>Pricing</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Auth Actions */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-border/50">
                {user && !isLoading ? (
                  <Button
                    asChild
                    size="sm"
                    className={`w-full gap-2 ${landingTheme.primaryButton}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/dashboard">
                      <IconLayoutDashboard className="size-4" />
                      <span>Open Dashboard</span>
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full text-xs gap-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/login">
                        <IconLogin className="size-3.5" />
                        <span>Sign In</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={`w-full text-xs gap-1.5 ${landingTheme.primaryButton}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/signup">
                        <IconSparkles className="size-3.5" />
                        <span>Get Started Free</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
