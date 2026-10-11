"use client";

import { CheckCircle2Icon } from "lucide-react";

export function FormSuccessScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md w-full rounded-3xl border p-8 bg-card shadow-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto size-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle2Icon className="size-8" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Thanks for submitting!</h1>
          <p className="text-sm text-muted-foreground">Your response has been securely recorded.</p>
        </div>
      </div>
    </div>
  );
}
