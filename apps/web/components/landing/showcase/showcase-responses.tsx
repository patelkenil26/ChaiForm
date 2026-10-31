"use client";

import { IconStarFilled, IconStar, IconFileSpreadsheet } from "@tabler/icons-react";
import { MOCK_SHOWCASE_RESPONSES } from "./showcase-data";

/**
 * Live Responses & Realtime Analytics Table Preview
 */
export function ShowcaseResponses() {
  return (
    <div className="p-6 sm:p-8 bg-card">
      {/* Top Stream Status Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Live Response Stream (Real-Time)
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-lime-500/10 dark:bg-[#CCFF00]/10 border border-lime-600/25 dark:border-[#CCFF00]/25 text-xs font-bold text-lime-800 dark:text-[#CCFF00]">
          <IconFileSpreadsheet className="size-3.5" />
          <span>1-Click CSV Ready</span>
        </div>
      </div>

      {/* Mini Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-xs font-mono">
          <thead className="bg-muted/60 border-b border-border/60 text-muted-foreground font-semibold">
            <tr>
              <th className="py-2.5 px-4 text-left">RESPONDENT</th>
              <th className="py-2.5 px-4 text-left">USE CASE</th>
              <th className="py-2.5 px-4 text-left">RATING</th>
              <th className="py-2.5 px-4 text-right">TIME TO COMPLETE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-card">
            {MOCK_SHOWCASE_RESPONSES.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-foreground">{row.respondent}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.useCase}</td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                    <span className="flex items-center text-amber-500 dark:text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) =>
                        star <= Math.floor(row.rating) ? (
                          <IconStarFilled key={star} className="size-3" />
                        ) : (
                          <IconStar key={star} className="size-3 opacity-30" />
                        ),
                      )}
                    </span>
                    {row.rating.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                  {row.timeToComplete}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
