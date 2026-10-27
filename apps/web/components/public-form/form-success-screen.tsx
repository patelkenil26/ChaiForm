"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2Icon, RotateCcwIcon, SparklesIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { landingTheme } from "~/config/landing-theme";

interface FormSuccessScreenProps {
  onReset?: () => void;
  formTitle?: string;
}

export function FormSuccessScreen({ onReset, formTitle }: FormSuccessScreenProps) {
  const [hasCelebrated, setHasCelebrated] = useState(false);

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

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial from-background via-background to-muted/20">
      <div className="text-center space-y-6 max-w-md w-full rounded-3xl border bg-card/90 backdrop-blur-md p-8 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Celebratory badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
          <SparklesIcon className="size-3.5 animate-bounce" />
          <span>Response recorded successfully</span>
        </div>

        {/* Animated Checkmark Icon with soft ring */}
        <div
          className="relative mx-auto size-20 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-inner group cursor-pointer transition-transform hover:scale-105 active:scale-95"
          onClick={fireConfetti}
          title="Click to celebrate again!"
        >
          <CheckCircle2Icon className="size-10 stroke-[2.2] animate-in zoom-in duration-300" />
          <div className="absolute inset-0 rounded-3xl ring-4 ring-emerald-500/20 animate-ping opacity-75 pointer-events-none" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Thank you!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {formTitle
              ? `Your submission for "${formTitle}" has been securely recorded.`
              : "Your response has been securely recorded and sent to the form creator."}
          </p>
        </div>

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
        <div className="pt-4 border-t text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 font-mono">
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
