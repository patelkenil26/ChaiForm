"use client";

import { useEffect } from "react";
import {
  IconArrowRight,
  IconClock,
  IconFileText,
  IconSparkles,
  IconCornerDownLeft,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";
import type { FormThemeConfig } from "~/config/form-themes";

interface FormWelcomeScreenProps {
  title: string;
  description?: string | null;
  welcomeTitle?: string | null;
  welcomeDescription?: string | null;
  welcomeButtonText?: string | null;
  estimatedTime?: string | null;
  fieldCount: number;
  category?: string | null;
  onStart: () => void;
  isEmbed?: boolean;
  theme?: FormThemeConfig;
}

export function FormWelcomeScreen({
  title,
  description,
  welcomeTitle,
  welcomeDescription,
  welcomeButtonText,
  estimatedTime,
  fieldCount,
  category,
  onStart,
  isEmbed = false,
  theme,
}: FormWelcomeScreenProps) {
  const displayTitle = welcomeTitle?.trim() || title;
  const displayDescription = welcomeDescription?.trim() || description?.trim() || null;
  const displayButtonText = welcomeButtonText?.trim() || "Start Form";

  // Compute fallback estimated time if not explicitly provided
  const displayEstimatedTime =
    estimatedTime?.trim() ||
    (fieldCount > 0
      ? `Takes ~${Math.max(1, Math.ceil(fieldCount * 0.4))} min${Math.ceil(fieldCount * 0.4) > 1 ? "s" : ""}`
      : "Takes 1 min");

  // Press Enter anywhere on welcome screen to start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart]);

  return (
    <div
      className={`w-full flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isEmbed
          ? "min-h-[380px] py-8"
          : "min-h-screen py-16 bg-radial from-background via-background to-muted/20"
      }`}
      style={
        !isEmbed && theme ? { background: theme.background, color: theme.textColor } : undefined
      }
    >
      <div
        className="relative max-w-xl w-full rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-8 sm:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500 overflow-hidden text-center sm:text-left"
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
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-60"
          style={{ background: theme ? theme.glowColor : "rgba(204, 255, 0, 0.15)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ background: theme ? theme.glowColor : "rgba(59, 130, 246, 0.15)" }}
        />

        <div className="relative z-10 space-y-6">
          {/* Metadata badges row */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            {category && (
              <Badge
                variant="outline"
                className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 bg-muted/60 border-border text-muted-foreground"
              >
                {category}
              </Badge>
            )}

            <Badge
              variant="outline"
              className="text-xs font-medium px-2.5 py-0.5 border gap-1.5"
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
              <IconClock className="size-3" />
              <span>{displayEstimatedTime}</span>
            </Badge>

            {fieldCount > 0 && (
              <Badge
                variant="outline"
                className="text-xs font-medium px-2.5 py-0.5 bg-muted/60 text-muted-foreground border-border gap-1.5"
              >
                <IconFileText className="size-3" />
                <span>
                  {fieldCount} {fieldCount === 1 ? "question" : "questions"}
                </span>
              </Badge>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.15]">
              {displayTitle}
            </h1>
            {displayDescription && (
              <p className="text-sm sm:text-base opacity-80 leading-relaxed whitespace-pre-line max-w-lg">
                {displayDescription}
              </p>
            )}
          </div>

          {/* CTA & Hotkey Tip */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Button
              type="button"
              onClick={onStart}
              size="lg"
              className={`w-full sm:w-auto h-12 px-8 text-base font-bold shadow-lg gap-2.5 group cursor-pointer ${
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
              <span>{displayButtonText}</span>
              <IconArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>

            <div className="inline-flex items-center gap-1.5 text-xs opacity-75 font-mono select-none">
              <span>Press</span>
              <kbd className="px-2 py-0.5 text-[11px] font-sans font-semibold rounded-md border border-border bg-muted/60 shadow-2xs inline-flex items-center gap-1">
                Enter
                <IconCornerDownLeft className="size-3 opacity-70" />
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
