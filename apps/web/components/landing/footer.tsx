"use client";

import Link from "next/link";
import { IconForms, IconBrandGithub, IconBrandTwitter, IconHeart } from "@tabler/icons-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/60 py-12 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            <IconForms className="size-4" />
          </div>
          <span className="font-bold text-foreground text-sm tracking-tight">ChaiForm</span>
          <span>• Modern Conversational Form Builder</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Templates
          </Link>
          <Link href="/forms" className="hover:text-foreground transition-colors">
            Forms
          </Link>
          <Link href="/submissions" className="hover:text-foreground transition-colors">
            Submissions
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} ChaiForm. Built for high conversion.</span>
        </div>
      </div>
    </footer>
  );
}
