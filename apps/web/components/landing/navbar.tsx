"use client";

import Link from "next/link";
import { IconForms, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useUser } from "~/hooks/api/auth";

export function LandingNavbar() {
  const { user, isLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 text-white shadow-md shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
            <IconForms className="size-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-foreground">ChaiForm</span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0 px-1.5 h-4 border-primary/30 text-primary">
                v2.0
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">
              Conversational Form Builder
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <a
            href="#features"
            className="transition-colors hover:text-foreground text-xs lg:text-sm"
          >
            Features
          </a>
          <a
            href="#live-demo"
            className="flex items-center gap-1 transition-colors hover:text-foreground text-xs lg:text-sm"
          >
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Demo
          </a>
          <a
            href="#architecture"
            className="transition-colors hover:text-foreground text-xs lg:text-sm"
          >
            Architecture
          </a>
          <a
            href="#comparison"
            className="transition-colors hover:text-foreground text-xs lg:text-sm"
          >
            Why ChaiForm
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {user && !isLoading ? (
            <Button
              asChild
              size="sm"
              className="gap-2 bg-gradient-to-r from-indigo-600 to-primary text-white shadow-md shadow-primary/25 hover:opacity-95"
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
                className="gap-1.5 text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Link href="/signup">
                  <IconSparkles className="size-3.5" />
                  <span>Get Started</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
