"use client";

import {
  IconFileSpreadsheet,
  IconBrandSlack,
  IconWebhook,
  IconMail,
  IconBrandNextjs,
  IconWorld,
  IconSparkles,
  IconCheck,
  IconArrowRight,
  IconCode,
} from "@tabler/icons-react";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";

export function IntegrationsSection() {
  const integrations = [
    {
      name: "Google Sheets & Excel",
      desc: "Instant 1-click CSV export ready to open in Sheets, Excel, or Airtable.",
      icon: IconFileSpreadsheet,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    },
    {
      name: "Webflow & WordPress",
      desc: "Embed fluid conversational forms with zero custom CSS or iframe resizing bugs.",
      icon: IconWorld,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/25",
    },
    {
      name: "Next.js & React Sites",
      desc: "Native responsive embed snippets that match your dark mode and typography seamlessly.",
      icon: IconBrandNextjs,
      color: "text-neutral-200 bg-neutral-500/10 border-neutral-500/25",
    },
    {
      name: "Real-Time Webhooks",
      desc: "Trigger automated HTTP JSON payloads to your own backend API or automation workflows.",
      icon: IconWebhook,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    },
    {
      name: "Email & Notification Alerts",
      desc: "Get notified the moment a customer submits critical survey answers or lead inquiries.",
      icon: IconMail,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/25",
    },
    {
      name: "High-Resolution QR Codes",
      desc: "Generate custom vector SVG & PNG QR codes with branded colors for print flyers and pitch decks.",
      icon: IconSparkles,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/25",
    },
  ];

  return (
    <section id="integrations" className="py-20 md:py-24 relative border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge
            variant="outline"
            className={`text-xs px-3 py-1 ${landingTheme.badge} gap-1.5 mb-3`}
          >
            <IconWebhook className="size-3.5" />
            <span>Connected Workflows</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Fits right into your existing stack.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Collect answers where your audience lives, and send responses wherever your team works.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-border/70 bg-card/50 hover:border-border hover:bg-card/80 transition-all group shadow-2xs"
            >
              <div>
                <div
                  className={`flex size-11 items-center justify-center rounded-xl border ${item.color} mb-3.5 group-hover:scale-105 transition-transform`}
                >
                  <item.icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Built for Developers Note */}
        <div className="mt-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <IconCode className={`size-3.5 ${landingTheme.iconColor}`} />
          <span>Built for developers: webhooks, JSON export &amp; responsive embed API.</span>
        </div>
      </div>
    </section>
  );
}
