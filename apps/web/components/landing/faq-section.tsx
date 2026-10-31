"use client";

import { useState } from "react";
import { IconChevronDown, IconHelpCircle } from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";

const FAQS = [
  {
    q: "What is ChaiForm and how does it work?",
    a: "ChaiForm is an open, high-converting conversational form and survey engine. Unlike traditional static forms that dump 20+ questions at once, ChaiForm presents one question at a time with smooth transitions and keyboard-first navigation (Enter, 1-9 shortcuts), producing up to 3.4x higher completion rates.",
  },
  {
    q: "Is ChaiForm really a free alternative to Typeform?",
    a: "Yes. ChaiForm offers a 100% free Starter tier with unlimited forms, 14 field types, instant QR codes, and 250 monthly submissions with zero credit card required. There are no surprise paywalls or hidden feature lock-ins.",
  },
  {
    q: "What happens when I reach the 250 monthly response limit?",
    a: "Your submissions are never deleted or discarded. Your quota automatically resets every 30 days. If your volume grows, you will receive an email notification and can upgrade to Pro for 10,000 monthly verified responses at any time.",
  },
  {
    q: "How does ChaiForm compare to Google Forms?",
    a: "Google Forms presents tedious, long-scroll walls of text with high drop-off rates and zero branding control. ChaiForm combines distraction-free conversational UX, custom dark/light themes, print-ready QR codes, and real-time webhook streaming.",
  },
  {
    q: "Do my respondents need to create an account or sign in?",
    a: "No! Anyone with your form link can view, navigate, and submit answers instantly on mobile or desktop without any login, signup, or friction.",
  },
  {
    q: "Can I embed ChaiForm on my own website (Next.js, Webflow, WordPress)?",
    a: "Yes! Every form generates a 1-line responsive embed snippet. We support React/Next.js native components, HTML iframes, and Webflow script blocks that match your typography with zero layout shifts.",
  },
  {
    q: "Can I password-protect sensitive surveys or internal forms?",
    a: "Yes. You can lock any form with a secure passcode. Respondents must enter the correct password before questions are revealed, making it ideal for internal executive surveys and confidential beta feedback.",
  },
  {
    q: "How do I export my data to Excel or Google Sheets?",
    a: "In your creator dashboard response hub, you can export all submissions with 1-click as clean CSV (compatible with Google Sheets, Microsoft Excel, and Apple Numbers) or raw JSON payloads.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="py-20 md:py-28 relative bg-background text-foreground border-t border-border/40"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className="text-xs px-3.5 py-1 border-lime-600/30 dark:border-[#CCFF00]/30 bg-lime-500/10 dark:bg-[#CCFF00]/10 text-lime-800 dark:text-[#CCFF00] gap-1.5 mb-4 shadow-xs"
          >
            <IconHelpCircle className="size-3.5" />
            <span>Got Questions?</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Everything you need to know about ChaiForm, limits, and conversational data collection.
          </p>
        </div>

        {/* Animated Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const indexFormatted = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={faq.q}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-lime-600/40 dark:border-[#CCFF00]/50 bg-gradient-to-b from-primary/[0.05] via-card to-card shadow-xl ring-1 ring-lime-600/20 dark:ring-[#CCFF00]/20"
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <span
                      className={`font-mono text-xs font-bold shrink-0 transition-colors duration-200 ${
                        isOpen
                          ? "text-lime-800 dark:text-[#CCFF00]"
                          : "text-muted-foreground/60 group-hover:text-foreground"
                      }`}
                    >
                      {indexFormatted}
                    </span>
                    <span
                      className={`font-semibold text-sm sm:text-base tracking-tight transition-colors duration-200 ${
                        isOpen
                          ? "text-foreground"
                          : "text-foreground/90 group-hover:text-foreground"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>

                  {/* Smooth Spring Icon Pill */}
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? "bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] border-lime-600 dark:border-[#CCFF00] rotate-180 shadow-md"
                        : "bg-muted border-border text-muted-foreground group-hover:border-border/80 group-hover:text-foreground"
                    }`}
                  >
                    <IconChevronDown className="size-4 transition-transform duration-300" />
                  </div>
                </button>

                {/* Animated CSS Grid Accordion Container (0fr -> 1fr interpolation) */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t transition-opacity duration-300 pt-4 pl-12 sm:pl-14 ${
                        isOpen ? "opacity-100 border-border/60" : "opacity-0 border-transparent"
                      }`}
                    >
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
