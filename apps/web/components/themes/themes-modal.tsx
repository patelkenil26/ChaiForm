"use client";

import { useState } from "react";
import {
  IconPalette,
  IconSparkles,
  IconTerminal,
  IconMovie,
  IconLeaf,
  IconBrush,
  IconLayersSubtract,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const UPCOMING_THEMES = [
  {
    name: "Minimal SaaS (Dark & Light)",
    tag: "Clean & Sleek",
    desc: "Refined monochrome aesthetic, high contrast typography, and subtle micro-borders.",
    icon: IconLayersSubtract,
    accent: "from-zinc-500 to-zinc-700",
    badgeColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
  {
    name: "Cyberpunk / Terminal Tech",
    tag: "High Tech",
    desc: "Neon green & cyan highlights, dark terminal backgrounds, and futuristic monospace styling.",
    icon: IconTerminal,
    accent: "from-emerald-500 to-cyan-500",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    name: "Anime Aesthetic",
    tag: "Vibrant & Bold",
    desc: "Soft pastel gradients, high-energy accents, rounded bouncy card geometry, and playful fonts.",
    icon: IconBrush,
    accent: "from-pink-500 to-purple-500",
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  {
    name: "Movies & Cinema",
    tag: "Dramatic & Elegant",
    desc: "Deep obsidian backdrop, rich champagne gold accents, and cinematic serif typography.",
    icon: IconMovie,
    accent: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    name: "Nature / Calm",
    tag: "Organic & Serene",
    desc: "Earthy moss greens, soothing warm tones, clean organic aesthetics, and peaceful typography.",
    icon: IconLeaf,
    accent: "from-emerald-600 to-teal-500",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
];

interface ThemesComingSoonButtonProps {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showBadge?: boolean;
}

export function ThemesComingSoonButton({
  variant = "outline",
  size = "sm",
  className = "",
  showBadge = true,
}: ThemesComingSoonButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          title="Creative Themes System (Coming Soon)"
          className={`gap-1.5 text-xs font-medium cursor-pointer shrink-0 px-2 sm:px-3 ${className}`}
        >
          <IconPalette className="size-3.5 text-primary" />
          <span className="hidden sm:inline">Themes</span>
          {showBadge && (
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex px-1.5 py-0 h-4 text-[9px] font-normal uppercase tracking-wider bg-primary/10 text-primary border-primary/20"
            >
              Soon
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-6">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconPalette className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold">Creative Themes System</DialogTitle>
            <Badge
              variant="outline"
              className="text-[10px] font-medium bg-primary/10 text-primary border-primary/20"
            >
              Coming Soon
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Soon you will be able to customize visual presets, background wallpapers, Google font
            families, and button accents for each form.
          </DialogDescription>
        </DialogHeader>

        {/* Themes Presets Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
          {UPCOMING_THEMES.map((theme) => {
            const Icon = theme.icon;
            return (
              <div
                key={theme.name}
                className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/30 p-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex size-6 items-center justify-center rounded-md bg-gradient-to-br ${theme.accent} text-white`}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <span className="text-xs font-semibold">{theme.name}</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] py-0 px-1.5 ${theme.badgeColor}`}>
                    {theme.tag}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{theme.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 rounded-lg bg-card border p-3">
          <div className="text-[11px] font-medium text-foreground mb-1.5 flex items-center gap-1.5">
            <IconSparkles className="size-3 text-primary" />
            <span>Planned Customization Options</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <IconCheck className="size-3 text-emerald-500 shrink-0" />
              <span>Custom Google Fonts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCheck className="size-3 text-emerald-500 shrink-0" />
              <span>Wallpaper & Gradients</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCheck className="size-3 text-emerald-500 shrink-0" />
              <span>Custom Accent Colors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCheck className="size-3 text-emerald-500 shrink-0" />
              <span>Glassmorphism Blur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCheck className="size-3 text-emerald-500 shrink-0" />
              <span>Card Rounded Geometry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCheck className="size-3 text-emerald-500 shrink-0" />
              <span>Live Respondent CSS</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => setOpen(false)} className="text-xs">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
