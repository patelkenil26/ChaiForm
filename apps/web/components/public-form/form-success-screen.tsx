"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2Icon,
  RotateCcwIcon,
  SparklesIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  HourglassIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { landingTheme } from "~/config/landing-theme";
import type { FormThemeConfig } from "~/config/form-themes";

interface FormSuccessScreenProps {
  onReset?: () => void;
  formTitle?: string;
  customTitle?: string | null;
  customDescription?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  autoRedirectUrl?: string | null;
  theme?: FormThemeConfig;
}

export function FormSuccessScreen({
  onReset,
  formTitle,
  customTitle,
  customDescription,
  buttonText,
  buttonUrl,
  autoRedirectUrl,
  theme,
}: FormSuccessScreenProps) {
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(autoRedirectUrl ? 3 : null);
  const [isRedirectCancelled, setIsRedirectCancelled] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fireConfetti = () => {
    try {
      // Center burst
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: [...landingTheme.confettiColors],
      });

      // Side bursts
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 60,
          origin: { x: 0.05, y: 0.65 },
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 60,
          origin: { x: 0.95, y: 0.65 },
        });
      }, 200);
    } catch {
      // Ignore if canvas-confetti is unavailable
    }
  };

  useEffect(() => {
    fireConfetti();
    setHasCelebrated(true);
  }, []);

  // Handle auto-redirect countdown
  useEffect(() => {
    if (!autoRedirectUrl || isRedirectCancelled) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          if (typeof window !== "undefined") {
            window.location.href = autoRedirectUrl;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = interval;

    return () => clearInterval(interval);
  }, [autoRedirectUrl, isRedirectCancelled]);

  const handleCancelRedirect = () => {
    setIsRedirectCancelled(true);
    setCountdown(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const displayTitle = customTitle?.trim() || "Thank you!";
  const displayDescription =
    customDescription?.trim() ||
    (formTitle
      ? `Your submission for "${formTitle}" has been securely recorded.`
      : "Your response has been securely recorded and sent to the form creator.");

  const showActionButton = Boolean(buttonText?.trim() && buttonUrl?.trim());

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-radial from-background via-background to-muted/20"
      style={theme ? { background: theme.background, color: theme.textColor } : undefined}
    >
      <div
        className="text-center space-y-6 max-w-md w-full rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-8 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden"
        style={
          theme
            ? {
                background: theme.cardBackground,
                borderColor: theme.cardBorder,
                color: theme.textColor,
              }
            : undefined
        }
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-60"
          style={{ background: theme ? theme.glowColor : "rgba(16, 185, 129, 0.15)" }}
        />

        {/* Celebratory badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-xs"
          style={
            theme
              ? {
                  borderColor: theme.cardBorder,
                  color: theme.accentColor,
                  background: `${theme.accentColor}18`,
                }
              : undefined
          }
        >
          <SparklesIcon className="size-3.5 animate-bounce" />
          <span>Response recorded successfully</span>
        </div>

        {/* Animated Checkmark Icon with soft ring */}
        <div
          className="relative mx-auto size-20 rounded-3xl border flex items-center justify-center shadow-inner group cursor-pointer transition-transform hover:scale-105 active:scale-95"
          onClick={fireConfetti}
          title="Click to celebrate again!"
          style={
            theme
              ? {
                  borderColor: theme.cardBorder,
                  background: `${theme.accentColor}15`,
                  color: theme.accentColor,
                }
              : undefined
          }
        >
          <CheckCircle2Icon className="size-10 stroke-[2.2] animate-in zoom-in duration-300" />
          <div
            className="absolute inset-0 rounded-3xl animate-ping opacity-75 pointer-events-none"
            style={{
              boxShadow: `0 0 0 4px ${theme ? theme.accentColor : "rgba(16, 185, 129, 0.2)"}`,
            }}
          />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            {displayTitle}
          </h1>
          <p className="text-sm opacity-80 leading-relaxed whitespace-pre-line">
            {displayDescription}
          </p>
        </div>

        {/* Auto-Redirect countdown banner */}
        {autoRedirectUrl && !isRedirectCancelled && countdown !== null && (
          <div className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs flex items-center justify-between gap-2 text-amber-700 dark:text-amber-300 animate-in fade-in">
            <div className="flex items-center gap-2 text-left">
              <HourglassIcon className="size-4 animate-spin text-amber-500 shrink-0" />
              <span>
                Redirecting you in <strong>{countdown}s</strong>...{" "}
                <a href={autoRedirectUrl} className="underline font-semibold hover:text-amber-500">
                  Go now
                </a>
              </span>
            </div>
            <button
              type="button"
              onClick={handleCancelRedirect}
              className="p-1 rounded-md hover:bg-amber-500/20 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Cancel automatic redirect"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        )}

        {/* Primary Call-to-Action Button if configured */}
        {showActionButton && buttonUrl && (
          <div className="pt-1">
            <Button
              asChild
              className={`w-full h-11 text-sm font-bold shadow-lg gap-2 ${
                !theme ? landingTheme.primaryButton : ""
              }`}
              style={
                theme
                  ? {
                      background: theme.accentColor,
                      color: theme.accentTextColor,
                      boxShadow: `0 10px 25px -5px ${theme.glowColor}`,
                    }
                  : undefined
              }
            >
              <a href={buttonUrl} target="_blank" rel="noopener noreferrer">
                <span>{buttonText}</span>
                <ArrowRightIcon className="size-4" />
              </a>
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-full sm:w-auto gap-2 rounded-xl text-xs hover:border-primary/50 transition"
          >
            <RotateCcwIcon className="size-3.5" />
            Submit another response
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={fireConfetti}
            className="w-full sm:w-auto gap-2 rounded-xl text-xs text-muted-foreground hover:text-foreground"
          >
            <SparklesIcon className={`size-3.5 ${landingTheme.iconColor}`} />
            Celebrate again
          </Button>
        </div>

        {/* Footer Brand */}
        <div className="pt-4 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 font-mono">
          <span>Powered by</span>
          <Link
            href="/"
            className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
          >
            ChaiForm
            <ExternalLinkIcon className="size-2.5 opacity-60" />
          </Link>
        </div>
      </div>
    </div>
  );
}
