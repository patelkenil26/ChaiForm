"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  IconArrowRight,
  IconCheck,
  IconCode,
  IconCornerDownLeft,
  IconRefresh,
  IconStarFilled,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useUser } from "~/hooks/api/auth";
import { ShowcaseJsonInspector } from "./showcase-json-inspector";

const TOTAL_RUNNER_STEPS = 3;
const USE_CASES = ["Lead Qualification", "Product Feedback", "Event Registration"] as const;

/**
 * Isolated Interactive Conversational Runner
 * State is self-contained so that typing does not trigger re-renders
 * on parent showcase or inactive builder/responses tabs.
 */
export function ShowcaseRunner() {
  const { user } = useUser();
  const ctaHref = user ? "/dashboard" : "/signup";

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [useCase, setUseCase] = useState<string>("Lead Qualification");
  const [rating, setRating] = useState<number>(5);
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);

  const handleNextStep = () => {
    const next = step + 1;
    setStep(next);
    if (next > TOTAL_RUNNER_STEPS) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#CCFF00", "#FFFFFF", "#10B981", "#38BDF8"],
        });
      } catch {
        // Fallback gracefully if canvas-confetti is not available
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setName("");
    setUseCase("Lead Qualification");
    setRating(5);
  };

  const currentPayload = {
    formId: "flow_lead_qualification_v2",
    respondent: name || "Anonymous Prospect",
    intent: useCase,
    satisfactionScore: rating,
    submittedAt: new Date().toISOString(),
    status: "verified_200",
  };

  const progressPercentage = Math.min(100, (step / TOTAL_RUNNER_STEPS) * 100);

  return (
    <div className="p-6 sm:p-10 md:p-14 min-h-[440px] flex flex-col justify-between">
      {/* Top Runner Header: Step Counter & Quick Actions */}
      <div className="flex items-center justify-between pb-6 border-b border-border/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-muted-foreground font-medium">
            QUESTION {Math.min(step, TOTAL_RUNNER_STEPS)} OF {TOTAL_RUNNER_STEPS}
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="text-[11px] text-lime-800 dark:text-[#CCFF00] font-mono font-bold">
            100% Conversational Flow
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowJsonInspector((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-all cursor-pointer ${
              showJsonInspector
                ? "bg-lime-500/15 dark:bg-[#CCFF00]/15 text-lime-800 dark:text-[#CCFF00] border-lime-600/40 dark:border-[#CCFF00]/40 font-semibold"
                : "bg-muted/60 text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            <IconCode className="size-3.5" />
            <span>{showJsonInspector ? "Hide JSON" : "Inspect Payload"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Restart Demo"
            className="p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
          >
            <IconRefresh className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2 border border-border/50">
        <div
          className="bg-lime-600 dark:bg-[#CCFF00] h-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question 1: Text Input */}
      {step === 1 && (
        <div className="my-auto py-8 max-w-xl space-y-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
              01 <IconArrowRight className="size-3" />
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              What is your name or company name?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Let’s personalize your conversational form setup.
            </p>
          </div>

          <div className="pt-2">
            <Input
              placeholder="e.g. Sarah Connor / Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNextStep();
              }}
              className="h-12 text-base px-4 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-lime-600/40 dark:focus-visible:ring-[#CCFF00]/40"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleNextStep}
              className="h-10 px-5 bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-xs gap-1.5 cursor-pointer shadow-md"
            >
              <span>Next Question</span>
              <IconCornerDownLeft className="size-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground font-mono">
              press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-mono text-[10px]">
                Enter ↵
              </kbd>
            </span>
          </div>
        </div>
      )}

      {/* Question 2: Choice Selector */}
      {step === 2 && (
        <div className="my-auto py-8 max-w-xl space-y-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
              02 <IconArrowRight className="size-3" />
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              What form are you planning to replace?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select your primary use case to test our responsive chip selector.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {USE_CASES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setUseCase(item);
                  handleNextStep();
                }}
                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  useCase === item
                    ? "border-lime-600 dark:border-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 text-foreground shadow-xs ring-1 ring-lime-600/30 dark:ring-[#CCFF00]/40"
                    : "border-border bg-card hover:border-lime-600/40 dark:hover:border-[#CCFF00]/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="size-2 rounded-full bg-lime-600 dark:bg-[#CCFF00]" />
                  <IconCornerDownLeft className="size-3.5 text-muted-foreground opacity-60" />
                </div>
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question 3: Star Rating */}
      {step === 3 && (
        <div className="my-auto py-8 max-w-xl space-y-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-lime-800 dark:text-[#CCFF00]">
              03 <IconArrowRight className="size-3" />
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Rate the smoothness of this 1-by-1 flow:
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Click a star rating to complete this test submission.
            </p>
          </div>

          <div className="flex items-center gap-2.5 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  handleNextStep();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-110 ${
                  star <= rating
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-500 dark:text-amber-400"
                    : "border-border bg-muted/40 text-muted-foreground"
                }`}
              >
                <IconStarFilled className="size-7" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {step > TOTAL_RUNNER_STEPS && (
        <div className="my-auto py-8 text-center space-y-3">
          <div className="size-14 rounded-full bg-lime-500/15 dark:bg-[#CCFF00]/15 text-lime-800 dark:text-[#CCFF00] border border-lime-600/30 dark:border-[#CCFF00]/30 flex items-center justify-center mx-auto shadow-md">
            <IconCheck className="size-7 stroke-[3]" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Submission Completed in 12 Seconds!
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Zero page reloads. Zero drop-off friction. Your answers were instantly structured and
            prepared for automated export.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-xs gap-1.5 cursor-pointer h-10 px-5 shadow-md"
            >
              <Link href={ctaHref}>
                <span>Build Your Own Free</span>
                <IconArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-xs text-muted-foreground border-border hover:text-foreground cursor-pointer h-10 px-4"
            >
              Restart Live Test
            </Button>
          </div>
        </div>
      )}

      {/* Live JSON Inspector Drawer */}
      {showJsonInspector && <ShowcaseJsonInspector payload={currentPayload} />}
    </div>
  );
}
