"use client";

import { SparklesIcon } from "lucide-react";
import { landingTheme } from "~/config/landing-theme";

export function DropInsertionLine() {
  return (
    <div className="relative py-1.5 -my-0.5 z-30 transition-all duration-150 animate-in fade-in zoom-in-95 pointer-events-none">
      <div className={`h-1 w-full rounded-full ${landingTheme.progressBar} opacity-60 shadow-md`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full ${landingTheme.primaryButton} font-bold text-[10px] tracking-wide uppercase shadow-md border border-white/20`}
        >
          <SparklesIcon className="size-3" />
          <span>Insert Here</span>
        </div>
      </div>
    </div>
  );
}
