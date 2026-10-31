"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export interface ShowcaseJsonInspectorProps {
  payload: {
    formId: string;
    respondent: string;
    intent: string;
    satisfactionScore: number;
    submittedAt: string;
    status: string;
  };
}

export function ShowcaseJsonInspector({ payload }: ShowcaseJsonInspectorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-[#0B0D13] p-4 font-mono text-xs overflow-x-auto shadow-lg relative group">
      {/* Header bar */}
      <div className="text-[11px] text-zinc-400 pb-2 mb-2.5 border-b border-zinc-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400">// REALTIME SUBMISSION PAYLOAD (READY FOR WEBHOOK)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            200 OK
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Copy JSON Payload"
          >
            {copied ? (
              <>
                <IconCheck className="size-3 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <IconCopy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Syntax-Highlighted JSON Body */}
      <div className="text-[11px] font-mono leading-relaxed space-y-0.5 select-text">
        <div className="text-zinc-400">{"{"}</div>
        <div className="pl-4">
          <span className="text-sky-400">"formId"</span>
          <span className="text-zinc-400">: </span>
          <span className="text-emerald-300">"{payload.formId}"</span>
          <span className="text-zinc-400">,</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-400">"respondent"</span>
          <span className="text-zinc-400">: </span>
          <span className="text-emerald-300">"{payload.respondent}"</span>
          <span className="text-zinc-400">,</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-400">"intent"</span>
          <span className="text-zinc-400">: </span>
          <span className="text-emerald-300">"{payload.intent}"</span>
          <span className="text-zinc-400">,</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-400">"satisfactionScore"</span>
          <span className="text-zinc-400">: </span>
          <span className="text-amber-300">{payload.satisfactionScore}</span>
          <span className="text-zinc-400">,</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-400">"submittedAt"</span>
          <span className="text-zinc-400">: </span>
          <span className="text-emerald-300">"{payload.submittedAt}"</span>
          <span className="text-zinc-400">,</span>
        </div>
        <div className="pl-4">
          <span className="text-sky-400">"status"</span>
          <span className="text-zinc-400">: </span>
          <span className="text-lime-400 font-semibold">"{payload.status}"</span>
        </div>
        <div className="text-zinc-400">{"}"}</div>
      </div>
    </div>
  );
}
