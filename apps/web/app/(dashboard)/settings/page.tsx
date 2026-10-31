"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  IconSettings,
  IconUser,
  IconCreditCard,
  IconPalette,
  IconKeyboard,
  IconSparkles,
  IconCheck,
  IconShieldCheck,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
  IconBolt,
  IconArrowUpRight,
  IconCopy,
  IconForms,
  IconLock,
  IconWebhook,
  IconKey,
  IconBell,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUser } from "~/hooks/api/auth";
import { useListForms } from "~/hooks/api/form";
import { useUserWorkspaceStats } from "~/hooks/api/form-submission";
import { landingTheme } from "~/config/landing-theme";

const MONTHLY_LIMIT = 250;

type SettingsSection = "profile" | "plan" | "appearance" | "developer" | "shortcuts";

export default function SettingsPage() {
  const { user } = useUser();
  const { forms } = useListForms();
  const { stats } = useUserWorkspaceStats();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [copiedId, setCopiedId] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSubmissions = stats?.totalSubmissions ?? 0;
  const usagePercent = Math.min(100, Math.round((totalSubmissions / MONTHLY_LIMIT) * 100));
  const remaining = Math.max(0, MONTHLY_LIMIT - totalSubmissions);
  const activeFormsCount = forms?.length ?? 0;

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CF";

  const workspaceId = user?.id ? `ws_${user.id.slice(0, 10)}` : "ws_chai_primary";

  const handleCopyWorkspaceId = () => {
    navigator.clipboard.writeText(workspaceId);
    setCopiedId(true);
    toast.success("Workspace ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Workspace Settings
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold"
            >
              <span className="size-1 rounded-full bg-emerald-400 mr-1 animate-pulse" />
              Community Tier
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your account credentials, monthly response quota, theme preferences, and
            developer tools.
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className={`gap-1.5 text-xs h-8.5 font-semibold ${landingTheme.primaryButton}`}
        >
          <Link href="/pricing">
            <IconSparkles className="size-3.5" />
            <span>Upgrade to Pro</span>
            <IconArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {/* Settings Navigation Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Navigation Tabs Rail */}
        <div className="md:col-span-1 flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSection("profile")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer shrink-0 ${
              activeSection === "profile"
                ? "bg-muted/80 text-foreground border border-border/70 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconUser className="size-4 shrink-0 text-muted-foreground" />
            <span>Profile & Account</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("plan")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer shrink-0 ${
              activeSection === "plan"
                ? "bg-muted/80 text-foreground border border-border/70 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconBolt className="size-4 shrink-0 text-lime-400" />
            <div className="flex-1 flex items-center justify-between min-w-0">
              <span>Plan & Usage</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {totalSubmissions}/{MONTHLY_LIMIT}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("appearance")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer shrink-0 ${
              activeSection === "appearance"
                ? "bg-muted/80 text-foreground border border-border/70 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconPalette className="size-4 shrink-0 text-muted-foreground" />
            <span>Appearance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("developer")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer shrink-0 ${
              activeSection === "developer"
                ? "bg-muted/80 text-foreground border border-border/70 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconWebhook className="size-4 shrink-0 text-muted-foreground" />
            <span>API & Webhooks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("shortcuts")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer shrink-0 ${
              activeSection === "shortcuts"
                ? "bg-muted/80 text-foreground border border-border/70 shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconKeyboard className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex-1 flex items-center justify-between">
              <span>Shortcuts</span>
              <kbd className="text-[10px] font-mono px-1 rounded bg-muted text-muted-foreground border border-border/60">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right Stage: Active Section Card */}
        <div className="md:col-span-3 space-y-6">
          {/* 1. Profile Section */}
          {activeSection === "profile" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 space-y-5 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-foreground">User Profile & Account</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your personal authenticated account identity and workspace rights.
                  </p>
                </div>

                <div className="flex items-center gap-4 pb-4 border-b border-border/40">
                  <Avatar
                    className={`size-16 rounded-2xl border ${landingTheme.avatarBorder} shadow-sm`}
                  >
                    <AvatarImage src={user?.profileImageUrl || ""} alt={user?.fullName || "User"} />
                    <AvatarFallback
                      className={`rounded-2xl text-lg font-bold ${landingTheme.avatarFallback}`}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-foreground">
                        {user?.fullName || "ChaiForm Creator"}
                      </span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-2 font-medium">
                        Workspace Owner
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{user?.email || "creator@chaiform.com"}</span>
                      <span className="inline-flex items-center gap-0.5 text-emerald-400 font-medium text-[11px]">
                        <IconShieldCheck className="size-3.5" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <span className="text-muted-foreground font-medium block">
                      Workspace Identifier
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {workspaceId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyWorkspaceId}
                        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                      >
                        {copiedId ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <IconCheck className="size-3" /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <IconCopy className="size-3" /> Copy ID
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                    <span className="text-muted-foreground font-medium block">
                      Active Published Forms
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {activeFormsCount} Forms Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Security & Token Banner */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5 flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <IconLock className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Session Security Active</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your session is secured using HTTP-only encrypted cookies with SameSite strict
                    protection. All respondent submissions are stored with data isolation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Plan & Response Quota */}
          {activeSection === "plan" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Monthly Capacity & Quota
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Monitor responses collected this month against your plan limit.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                  >
                    Community Free Tier
                  </Badge>
                </div>

                {/* Response Meter */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <IconBolt className="size-4 text-lime-400" />
                      Monthly Respondent Answers
                    </span>
                    <span className="font-mono text-sm font-bold text-foreground">
                      <span className={landingTheme.primaryText}>{totalSubmissions}</span>
                      <span className="text-muted-foreground/70"> / {MONTHLY_LIMIT}</span>
                    </span>
                  </div>

                  <Progress value={usagePercent} className="h-2.5 bg-muted/60" />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[11px]">
                        Available Remaining
                      </span>
                      <span className="font-mono font-bold text-foreground text-sm">
                        {remaining}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[11px]">Usage Share</span>
                      <span className="font-mono font-bold text-foreground text-sm">
                        {usagePercent}%
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[11px]">Quota Reset</span>
                      <span className="font-medium text-foreground text-xs">
                        1st of Every Month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pro Tier Upgrade Card */}
                <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card via-muted/20 to-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <IconSparkles className="size-4.5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-foreground block">
                          ChaiForm Pro
                        </span>
                        <span className="text-xs text-muted-foreground">
                          For scaling creators & high volume forms
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground font-mono">$12 / month</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-2">
                      <IconCheck className="size-3.5 text-emerald-400 shrink-0" />
                      <span>5,000 monthly responses (20x)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCheck className="size-3.5 text-emerald-400 shrink-0" />
                      <span>Unlimited published forms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCheck className="size-3.5 text-emerald-400 shrink-0" />
                      <span>Custom domain & remove watermark</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCheck className="size-3.5 text-emerald-400 shrink-0" />
                      <span>Instant webhooks & team members</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    className={`w-full text-xs h-9 justify-between font-semibold ${landingTheme.primaryButton}`}
                  >
                    <Link href="/pricing">
                      <span>Explore Pricing & Pro Plan</span>
                      <IconArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Appearance */}
          {activeSection === "appearance" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 space-y-5 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-foreground">Theme & Interface Display</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose how ChaiForm looks on your device. Changes apply instantly across all
                    pages.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Light Mode */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${
                      mounted && theme === "light"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <IconSun className="size-5" />
                      </div>
                      {mounted && theme === "light" && (
                        <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                          <IconCheck className="size-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">Light Mode</span>
                      <span className="text-[11px] text-muted-foreground">
                        Clean, high contrast for bright rooms
                      </span>
                    </div>
                  </button>

                  {/* Dark Mode */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${
                      mounted && theme === "dark"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/20">
                        <IconMoon className="size-5" />
                      </div>
                      {mounted && theme === "dark" && (
                        <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                          <IconCheck className="size-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">Dark Mode</span>
                      <span className="text-[11px] text-muted-foreground">
                        Sleek obsidian palette easy on eyes
                      </span>
                    </div>
                  </button>

                  {/* System Auto */}
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${
                      mounted && theme === "system"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border/70">
                        <IconDeviceDesktop className="size-5" />
                      </div>
                      {mounted && theme === "system" && (
                        <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                          <IconCheck className="size-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">System Auto</span>
                      <span className="text-[11px] text-muted-foreground">
                        Follows your OS appearance setting
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Developer & API */}
          {activeSection === "developer" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-base font-bold text-foreground">API Keys & Webhooks</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Connect ChaiForm directly with Discord, Slack, Zapier, and custom server
                      webhooks.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border-purple-500/30"
                  >
                    Pro Developer Feature
                  </Badge>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <IconKey className="size-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">REST API Access</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Programmatically query respondent submissions, fetch form definitions, and
                    trigger automated exports via our developer API.
                  </p>
                  <Button asChild size="sm" variant="outline" className="text-xs h-7.5">
                    <Link href="/pricing">Unlock in Pro Tier</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Shortcuts */}
          {activeSection === "shortcuts" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 space-y-5 shadow-xs">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Keyboard Navigation & Hotkeys
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Supercharge your productivity inside ChaiForm using these keyboard hotkeys.
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 divide-y divide-border/40 text-xs">
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">Global Search & Actions</span>
                      <p className="text-[11px] text-muted-foreground">
                        Search forms, templates, and quick actions
                      </p>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <kbd className="px-2 py-0.5 rounded bg-muted border border-border/70 font-semibold text-foreground">
                        ⌘K
                      </kbd>
                      <span className="text-muted-foreground">or</span>
                      <kbd className="px-2 py-0.5 rounded bg-muted border border-border/70 font-semibold text-foreground">
                        Ctrl+K
                      </kbd>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">Jump to Search</span>
                      <p className="text-[11px] text-muted-foreground">
                        Instantly focuses search input on table pages
                      </p>
                    </div>
                    <kbd className="px-2 py-0.5 rounded bg-muted border border-border/70 font-mono font-semibold text-foreground">
                      /
                    </kbd>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">Navigate Submissions</span>
                      <p className="text-[11px] text-muted-foreground">
                        Previous and next response in detail drawer
                      </p>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <kbd className="px-2 py-0.5 rounded bg-muted border border-border/70 font-semibold text-foreground">
                        ↑
                      </kbd>
                      <kbd className="px-2 py-0.5 rounded bg-muted border border-border/70 font-semibold text-foreground">
                        ↓
                      </kbd>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">Dismiss / Close</span>
                      <p className="text-[11px] text-muted-foreground">
                        Closes dialogs, drawers, and search modals
                      </p>
                    </div>
                    <kbd className="px-2 py-0.5 rounded bg-muted border border-border/70 font-mono font-semibold text-foreground">
                      Esc
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
