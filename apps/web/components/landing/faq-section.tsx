"use client";

import { useState } from "react";
import { IconChevronDown, IconHelpCircle, IconSparkles } from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";

const FAQS = [
  {
    q: "What is ChaiForm?",
    a: "ChaiForm is an open, high-converting conversational form, survey, and quiz builder created by Kenil Patel. Unlike traditional static forms that display long lists of questions, ChaiForm presents one question at a time with smooth transitions, yielding significantly higher completion and conversion rates. It is designed as a fast, accessible, and generous alternative to Typeform and Google Forms.",
  },
  {
    q: "Who created ChaiForm?",
    a: "ChaiForm was created and engineered by full-stack developer Kenil Patel (https://kenilpatel.in). It was built to solve the frustration of expensive form paywalls and clunky user interfaces by offering a modern, accessible conversational form experience.",
  },
  {
    q: "Is ChaiForm a free alternative to Typeform?",
    a: "Yes. ChaiForm offers a 100% free Starter tier with unlimited forms, 14 field types, instant QR codes, and 250 monthly submissions with zero credit card required, making it an ideal modern alternative to Typeform's restrictive $29+/month paywalls and Google Forms' static design.",
  },
  {
    q: "How does ChaiForm compare to Google Forms and Typeform?",
    a: "Google Forms presents tedious, long-scroll walls of text with high drop-off rates. Typeform has fluid UI but restricts basic features behind expensive $29-$99/month paywalls. ChaiForm combines the high conversion rate of conversational 1-question-at-a-time design with generous starter limits, designer QR codes, and transparent pricing.",
  },
  {
    q: "Do respondents need to create an account or sign in?",
    a: "No! Anyone with your form link can view and submit responses instantly on mobile or desktop without any login, signup, or friction.",
  },
  {
    q: "Can I embed ChaiForm on my own website or blog?",
    a: "Yes! Every form generates a 1-line responsive iframe snippet that works seamlessly across Webflow, WordPress, Framer, Next.js, Shopify, or plain HTML websites.",
  },
  {
    q: "Can I password-protect sensitive surveys or internal forms?",
    a: "Yes. You can lock any form with a secure password. Respondents must enter the correct passcode before questions are revealed, making it ideal for internal company surveys and private beta programs.",
  },
  {
    q: "Can I export my responses to Excel or Google Sheets?",
    a: "Yes. In your dashboard response inbox, you can export all submissions with one click as CSV (compatible with Google Sheets, Microsoft Excel, and Apple Numbers) or raw JSON.",
  },
  {
    q: "What happens when I reach the 250 submission limit on the free Starter tier?",
    a: "Your submissions are never deleted or discarded. Your submission limit automatically resets every 30 days. If your traffic spikes, you will receive an email notification and can upgrade to Pro for 10,000 monthly submissions at any time.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative border-t border-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className={`mb-3 gap-1.5 px-3 py-1 text-xs font-medium ${landingTheme.badge}`}
          >
            <IconHelpCircle className="size-3.5" />
            <span>Got Questions?</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Everything you need to know about ChaiForm, plans, and conversational data collection.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden transition-colors hover:border-border"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base text-foreground">
                    {faq.q}
                  </span>
                  <div
                    className={`size-7 rounded-full flex items-center justify-center shrink-0 border border-border/60 bg-muted/50 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-muted" : ""
                    }`}
                  >
                    <IconChevronDown className="size-4 text-muted-foreground" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
