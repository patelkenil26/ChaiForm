"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  IconArrowRight,
  IconCheck,
  IconStarFilled,
  IconSparkles,
  IconRefresh,
  IconLock,
  IconCode,
  IconDeviceLaptop,
  IconBolt,
  IconCornerDownLeft,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { useUser } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

export function LiveDemoSection() {
  const { user } = useUser();
  const [step, setStep] = useState<number>(0);
  const [productName, setProductName] = useState("");
  const [useCase, setUseCase] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [showJson, setShowJson] = useState(false);

  const totalSteps = 3;

  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep > totalSteps) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const handleReset = () => {
    setStep(0);
    setProductName("");
    setUseCase("");
    setRating(5);
  };

  const progressPercent = step === 0 ? 0 : Math.min(100, Math.round((step / totalSteps) * 100));

  const samplePayload = {
    formId: "demo-live-conversational",
    productName: productName || "(typing...)",
    useCase: useCase || "(select an option)",
    rating: step >= 3 ? `${rating} / 5 Stars` : "(pending)",
    submittedAt: new Date().toISOString(),
    validation: "ZOD_TYPE_SAFE_TRPC_OK",
  };

  return (
    <section
      id="live-demo"
      className="relative py-16 md:py-24 bg-muted/20 border-y border-border/40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <Badge
            variant="outline"
            className={`text-xs px-3 py-1 ${landingTheme.badge} gap-1.5 mb-3`}
          >
            <IconSparkles className="size-3.5" />
            Live Interactive Playground
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Try it yourself. Zero friction.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Experience the smooth, keyboard-first conversational runner right here. No sign-up
            required to test.
          </p>
        </div>

        {/* Demo Window Container */}
        <div className="mt-10 max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
          {/* Browser Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Mock URL bar */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background/80 border border-border/60 text-xs font-mono text-muted-foreground flex-1 max-w-[170px] sm:max-w-80 mx-2 truncate">
              <IconLock className={`size-3 ${landingTheme.iconColor} shrink-0`} />
              <span className="truncate">
                https://chaiform.kenilpatel.in/form/interactive-preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJson(!showJson)}
                className="h-7 text-xs font-mono text-muted-foreground hover:text-foreground gap-1"
                title="Toggle Live tRPC JSON Payload"
              >
                <IconCode className="size-3.5" />
                <span className="hidden sm:inline">
                  {showJson ? "Hide Payload" : "Inspect Payload"}
                </span>
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-muted">
            <div
              className={`h-full ${landingTheme.progressBar} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Playground Body */}
          <div className="p-6 sm:p-10 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="flex flex-col items-center justify-center my-auto text-center max-w-md mx-auto py-6">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl ${landingTheme.iconBg} mb-5 shadow-inner`}
                >
                  <IconSparkles className="size-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Welcome to ChaiForm Demo
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Notice how respondent attention stays 100% focused on one question at a time.
                  Takes less than 15 seconds.
                </p>
                <Button
                  onClick={handleNext}
                  size="lg"
                  className={`mt-6 gap-2 ${landingTheme.primaryButton} shadow-md hover:scale-[1.02] transition-transform`}
                >
                  <span>Start Answering</span>
                  <IconArrowRight className="size-4" />
                </Button>
                <span className="mt-3 text-[11px] text-muted-foreground font-mono inline-flex items-center gap-1">
                  Press Enter <IconCornerDownLeft className="size-3 inline" /> to begin
                </span>
              </div>
            )}

            {/* Step 1: Text Input */}
            {step === 1 && (
              <div className="flex flex-col max-w-lg mx-auto w-full my-auto py-4">
                <div className="text-xs font-mono text-primary font-semibold mb-1">
                  QUESTION 1 OF 3
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  What is your project or startup name?
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Type any name to test instant live response capturing.
                </p>
                <Input
                  placeholder="e.g. Acme Studio or ChaiAI"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNext();
                  }}
                  className="h-12 text-base px-4 border-primary/40 focus-visible:ring-primary shadow-xs"
                />
                <div className="flex items-center justify-between mt-5">
                  <span className="text-[11px] text-muted-foreground font-mono inline-flex items-center gap-1">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs inline-flex items-center gap-0.5">
                      Enter <IconCornerDownLeft className="size-2.5" />
                    </kbd>
                  </span>
                  <Button onClick={handleNext} size="sm" className="gap-1.5">
                    <span>Continue</span>
                    <IconArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Choice Selector */}
            {step === 2 && (
              <div className="flex flex-col max-w-lg mx-auto w-full my-auto py-4">
                <div className="text-xs font-mono text-primary font-semibold mb-1">
                  QUESTION 2 OF 3
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  What is your primary goal today?
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Select an option below to test instant transition:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: "A", label: "Lead Generation & Sales" },
                    { key: "B", label: "Customer Feedback & NPS" },
                    { key: "C", label: "Event / Webinar Signups" },
                    { key: "D", label: "User Onboarding & Quizzes" },
                  ].map((opt) => {
                    const isSelected = useCase === opt.label;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setUseCase(opt.label);
                          setTimeout(handleNext, 180);
                        }}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                          isSelected
                            ? `${landingTheme.cardHighlightBorder} font-bold shadow-md`
                            : "border-border/80 bg-background/60 hover:bg-muted/80 text-foreground"
                        }`}
                      >
                        <span className="flex size-6 items-center justify-center rounded-lg border border-border/80 bg-muted text-xs font-mono font-bold shrink-0">
                          {opt.key}
                        </span>
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: 5-Star Rating */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center max-w-lg mx-auto w-full my-auto py-4 text-center">
                <div className="text-xs font-mono text-primary font-semibold mb-1">
                  QUESTION 3 OF 3
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  How would you rate conversational UI experience?
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-6">
                  Select your star rating below to submit the demo:
                </p>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2 rounded-xl transition hover:scale-110 cursor-pointer"
                      title={`${star} Stars`}
                    >
                      <IconStarFilled
                        className={`size-8 transition-colors ${
                          star <= rating
                            ? landingTheme.ratingStar
                            : "text-muted-foreground/30 hover:opacity-80"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div
                  className={`mt-3 flex items-center justify-center gap-1.5 text-xs font-medium ${landingTheme.primaryText}`}
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rating }).map((_, i) => (
                      <IconStarFilled key={i} className="size-3.5" />
                    ))}
                  </div>
                  <span>
                    {rating === 5 ? "5.0 / 5.0 • Outstanding!" : `${rating}.0 / 5.0 Stars`}
                  </span>
                </div>

                <Button
                  onClick={handleNext}
                  size="lg"
                  className={`mt-6 gap-2 ${landingTheme.primaryButton}`}
                >
                  <IconCheck className="size-4 stroke-[3]" />
                  <span>Submit Demo Response</span>
                </Button>
              </div>
            )}

            {/* Step 4: Completion Screen */}
            {step > 3 && (
              <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto py-6">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 mb-4 shadow-xs">
                  <IconCheck className="size-8 stroke-[3]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Submission Captured!
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Notice how fast and smooth that felt? Zero page reloads, zero form fatigue. Your
                  respondents complete forms 3.5x faster.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild size="sm" className={`gap-2 ${landingTheme.primaryButton}`}>
                    <Link href={user ? "/dashboard" : "/signup"}>
                      <span>{user ? "Build in Dashboard" : "Create Your First Form"}</span>
                      <IconArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
                    <IconRefresh className="size-3.5" />
                    <span>Test Again</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Live JSON Inspector Panel (Collapsible) */}
            {showJson && (
              <div className="mt-6 p-3.5 rounded-xl border border-border/80 bg-neutral-950 text-neutral-200 text-xs font-mono overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-[11px] text-neutral-400">
                  <span className="inline-flex items-center gap-1.5">
                    <IconBolt className="size-3.5 text-amber-500" />
                    LIVE TRPC PAYLOAD STATE
                  </span>
                  <span className="text-emerald-400 font-semibold inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    STREAMING
                  </span>
                </div>
                <pre>{JSON.stringify(samplePayload, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
