"use client";

import Link from "next/link";
import { IconForms } from "@tabler/icons-react";
import { landingTheme } from "~/config/landing-theme";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/60 py-12 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className={`flex size-7 items-center justify-center rounded-lg ${landingTheme.logoGradient} font-bold shadow-xs`}>
            <IconForms className="size-4" />
          </div>
          <span className="font-bold text-foreground text-sm tracking-tight">ChaiForm</span>
          <span>• Modern Conversational Form Engine</span>
        </div>

        {/* Links */}
        <div className="flex items-center flex-wrap justify-center gap-6">
          <Link href="/templates" className="hover:text-foreground transition-colors">
            Templates
          </Link>
          <Link href="/#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className={`hover:${landingTheme.primaryText} transition-colors font-medium`}>
            Get Started Free
          </Link>
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} ChaiForm. Engineered for 3.5x higher responses.</span>
        </div>
      </div>
    </footer>
  );
}
