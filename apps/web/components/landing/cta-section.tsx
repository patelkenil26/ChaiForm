"use client";

import Link from "next/link";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

export function CtaSection() {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  return (
    <section className="py-20 md:py-28 relative overflow-hidden border-t border-border/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative rounded-3xl ${landingTheme.ctaBox} p-8 sm:p-14 text-center overflow-hidden`}
        >
          {/* Ambient Glow */}
          <div
            className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full ${landingTheme.ctaGlow}`}
          />

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${landingTheme.ctaBadge}`}
          >
            <IconSparkles className="size-3.5" />
            <span>Get Started in Under 60 Seconds</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to supercharge your form response rates?
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create your first conversational form in under 60 seconds. Free forever, no credit card
            required, instant live preview.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className={`w-full sm:w-auto h-12 px-8 text-sm font-semibold gap-2 ${landingTheme.primaryButton} hover:scale-[1.01] transition-all`}
            >
              <Link href={ctaHref}>
                <span>{user ? "Go to Your Dashboard" : "Create a Free Form Now"}</span>
                <IconArrowRight className="size-4.5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 text-sm"
            >
              <Link href="/templates">Templates</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
