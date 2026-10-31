"use client";

import Link from "next/link";
import { IconSparkles, IconMail } from "@tabler/icons-react";
import { landingTheme } from "~/config/landing-theme";
import { ChaiFormLogo } from "~/components/brand/chaiform-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-md pt-16 pb-12 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info (Spans 2 cols on md) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <ChaiFormLogo size={28} />
              <span className="font-bold text-foreground text-base tracking-tight">ChaiForm</span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Create fluid, conversational forms that people actually enjoy filling.
              1-question-at-a-time focus, instant QR codes, and real-time response analytics.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational • SSL Encrypted</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#demo" className="hover:text-foreground transition-colors">
                  Live Interactive Demo
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-foreground transition-colors">
                  14 Field Types &amp; Features
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-foreground transition-colors">
                  Embeds &amp; Webhooks
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-foreground transition-colors">
                  Starter Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources & Support */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/KenilPatel/chaiform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@chaiform.kenilpatel.in"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <IconMail className="size-3" />
                  <span>Contact Support</span>
                </a>
              </li>
              <li>
                <span className="text-muted-foreground/60 cursor-default">
                  Changelog (v2.4 Active)
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust */}
          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className={`hover:${landingTheme.primaryText} transition-colors font-medium`}
                >
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} ChaiForm. Beautiful conversational forms that convert.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>•</span>
            <a
              href="mailto:support@chaiform.kenilpatel.in"
              className="hover:text-foreground transition-colors"
            >
              support@chaiform.kenilpatel.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
