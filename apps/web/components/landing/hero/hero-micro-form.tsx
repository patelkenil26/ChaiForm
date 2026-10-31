"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconArrowRight,
  IconCheck,
  IconCornerDownLeft,
  IconRefresh,
  IconStarFilled,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { useUser } from "~/hooks/api/auth";

export interface HeroMicroFormProps {
  className?: string;
}

/**
 * Isolated Interactive Micro-Form Demo for Hero section
 * Features keyboard shortcuts (A/B/C, 1-5, Enter), step progression,
 * and self-contained state to eliminate unnecessary hero re-renders.
 */
export function HeroMicroForm({ className }: HeroMicroFormProps) {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  const [microStep, setMicroStep] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);

  const handleOptionSelect = (key: string) => {
    setSelectedOption(key);
    setTimeout(() => {
      setMicroStep(2);
    }, 280);
  };

  const handleRatingSelect = (val: number) => {
    setRating(val);
    setTimeout(() => {
      setMicroStep(3);
    }, 280);
  };

  const resetMicroDemo = () => {
    setMicroStep(1);
    setSelectedOption(null);
    setRating(5);
  };

  // Keyboard shortcut listener for micro-demo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (microStep === 1) {
        if (e.key === "a" || e.key === "A" || e.key === "1") {
          handleOptionSelect("a");
        } else if (e.key === "b" || e.key === "B" || e.key === "2") {
          handleOptionSelect("b");
        } else if (e.key === "c" || e.key === "C" || e.key === "3") {
          handleOptionSelect("c");
        }
      } else if (microStep === 2) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 5) {
          handleRatingSelect(num);
        } else if (e.key === "Enter") {
          setMicroStep(3);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [microStep]);

  return (
    <div className={className}>
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Top Hairline Beam Sheen */}
        <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-lime-600/70 dark:via-[#CCFF00]/80 to-transparent" />

        {/* Header Info */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-lime-600 dark:bg-[#CCFF00] animate-pulse" />
            <span className="font-mono text-muted-foreground uppercase tracking-wider text-[11px] font-semibold">
              Interactive Hero Demo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-muted-foreground text-[11px]">
              Step {microStep} of 3
            </span>
            <button
              type="button"
              onClick={resetMicroDemo}
              title="Reset Demo"
              className="p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
            >
              <IconRefresh className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-muted h-1 rounded-full overflow-hidden mt-3">
          <div
            className="bg-lime-600 dark:bg-[#CCFF00] h-full transition-all duration-300 dark:shadow-[0_0_8px_rgba(204,255,0,0.5)]"
            style={{ width: `${(microStep / 3) * 100}%` }}
          />
        </div>

        {/* Micro Question 1 */}
        {microStep === 1 && (
          <div className="mt-5 space-y-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                01 <IconArrowRight className="size-3" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                What is your biggest frustration with traditional forms?
              </h3>
              <p className="text-xs text-muted-foreground">
                Select an option below or press{" "}
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">
                  A
                </kbd>{" "}
                /{" "}
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">
                  B
                </kbd>{" "}
                /{" "}
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">
                  C
                </kbd>
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleOptionSelect("a")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedOption === "a"
                    ? "border-lime-600 dark:border-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 text-foreground ring-1 ring-lime-600/30 dark:ring-[#CCFF00]/40"
                    : "border-border/70 bg-card hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-md bg-muted border border-border flex items-center justify-center font-mono text-xs font-bold text-lime-800 dark:text-[#CCFF00]">
                    A
                  </span>
                  <span>High drop-off rates on long, cluttered static forms</span>
                </div>
                <IconCornerDownLeft className="size-3.5 text-muted-foreground opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => handleOptionSelect("b")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedOption === "b"
                    ? "border-lime-600 dark:border-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 text-foreground ring-1 ring-lime-600/30 dark:ring-[#CCFF00]/40"
                    : "border-border/70 bg-card hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-md bg-muted border border-border flex items-center justify-center font-mono text-xs font-bold text-lime-800 dark:text-[#CCFF00]">
                    B
                  </span>
                  <span>Paying $59-$99/month for Typeform per-seat tiers</span>
                </div>
                <IconCornerDownLeft className="size-3.5 text-muted-foreground opacity-60" />
              </button>

              <button
                type="button"
                onClick={() => handleOptionSelect("c")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedOption === "c"
                    ? "border-lime-600 dark:border-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 text-foreground ring-1 ring-lime-600/30 dark:ring-[#CCFF00]/40"
                    : "border-border/70 bg-card hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-md bg-muted border border-border flex items-center justify-center font-mono text-xs font-bold text-lime-800 dark:text-[#CCFF00]">
                    C
                  </span>
                  <span>Need clean embeddable conversational forms in Next.js</span>
                </div>
                <IconCornerDownLeft className="size-3.5 text-muted-foreground opacity-60" />
              </button>
            </div>
          </div>
        )}

        {/* Micro Question 2 */}
        {microStep === 2 && (
          <div className="mt-5 space-y-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
                02 <IconArrowRight className="size-3" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                How important is keyboard-first speed for your respondents?
              </h3>
              <p className="text-xs text-muted-foreground">
                Click 1 to 5 stars or press keys{" "}
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">
                  1-5
                </kbd>{" "}
                on your keyboard
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingSelect(star)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-110 ${
                    star <= rating
                      ? "border-amber-500/50 bg-amber-500/15 text-amber-500 dark:text-amber-400"
                      : "border-border/60 bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <IconStarFilled className="size-6" />
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => setMicroStep(3)}
                className="bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <IconCornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Micro Question 3: Success Screen */}
        {microStep === 3 && (
          <div className="mt-5 py-4 text-center space-y-3">
            <div className="size-12 rounded-full bg-lime-500/15 dark:bg-[#CCFF00]/15 text-lime-800 dark:text-[#CCFF00] border border-lime-600/30 dark:border-[#CCFF00]/30 flex items-center justify-center mx-auto shadow-md">
              <IconCheck className="size-6 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              That’s the power of Conversational Forms!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Notice how effortless that felt? No overwhelming page reload. Zero manual mouse
              hunting. Just pure, focused interaction.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                asChild
                size="sm"
                className="bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-xs gap-1.5 cursor-pointer shadow-md"
              >
                <Link href={ctaHref}>
                  <span>Build Your First Form Free</span>
                  <IconArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetMicroDemo}
                className="text-xs text-muted-foreground border-border hover:text-foreground cursor-pointer"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
