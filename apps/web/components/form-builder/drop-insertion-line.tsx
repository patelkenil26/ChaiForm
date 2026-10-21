"use client";

import { SparklesIcon } from "lucide-react";

export function DropInsertionLine() {
  return (
    <div className="relative py-1.5 -my-0.5 z-30 transition-all duration-150 animate-in fade-in zoom-in-95 pointer-events-none">
      <div className="h-1 w-full rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400 to-amber-500/20 shadow-md shadow-amber-400/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-bold text-[10px] tracking-wide uppercase shadow-md shadow-amber-500/50 border border-amber-300">
          <SparklesIcon className="size-3" />
          <span>Insert Here</span>
        </div>
      </div>
    </div>
  );
}
