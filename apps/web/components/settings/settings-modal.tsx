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
  IconLayoutList,
  IconLock,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUser } from "~/hooks/api/auth";
import { useListForms } from "~/hooks/api/form";
import { useUserWorkspaceStats } from "~/hooks/api/form-submission";
import { landingTheme } from "~/config/landing-theme";

export interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "account" | "plan" | "appearance" | "shortcuts";
}

const MONTHLY_LIMIT = 250;
const FORMS_LIMIT = 14;

type TabKey = "account" | "plan" | "appearance" | "shortcuts";

export function SettingsModal({ open, onOpenChange, defaultTab = "account" }: SettingsModalProps) {
  const { user } = useUser();
  const { forms } = useListForms();
  const { stats } = useUserWorkspaceStats();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);
  const [copiedId, setCopiedId] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  const totalSubmissions = stats?.totalSubmissions ?? 0;
  const usagePercent = Math.min(100, Math.round((totalSubmissions / MONTHLY_LIMIT) * 100));
  const remaining = Math.max(0, MONTHLY_LIMIT - totalSubmissions);
  const activeFormsCount = forms?.length ?? 0;
  const formsPercent = Math.min(100, Math.round((activeFormsCount / FORMS_LIMIT) * 100));
  const formsRemaining = Math.max(0, FORMS_LIMIT - activeFormsCount);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.25rem)] sm:max-w-3xl p-0 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border/50 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${landingTheme.iconBg}`}
              >
                <IconSettings className="size-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground truncate">
                  Workspace Settings
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground truncate">
                  Manage your account identity, capacity limits, and interface preferences.
                </DialogDescription>
              </div>
            </div>

            {/* Desktop Active Plan Badge */}
            <Badge
              variant="outline"
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono mr-8 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold py-1 px-2.5 shrink-0"
            >
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Community Tier</span>
            </Badge>
          </div>
        </div>

        {/* Mobile 4-Option Segmented Navigation Bar (100% visible, zero truncation, no hidden scroll) */}
        <div className="sm:hidden p-2.5 border-b border-border/60 bg-muted/25 shrink-0">
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-muted/40 border border-border/70">
            <button
              type="button"
              onClick={() => setActiveTab("account")}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "account"
                  ? "bg-background text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <IconUser className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-[11px] font-medium leading-none">Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("plan")}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "plan"
                  ? "bg-background text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <IconBolt className="size-4 shrink-0 text-lime-600 dark:text-[#ccff00]" />
                <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-lime-500 dark:bg-[#ccff00]" />
              </div>
              <span className="text-[11px] font-medium leading-none">Plan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("appearance")}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "appearance"
                  ? "bg-background text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <IconPalette className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-[11px] font-medium leading-none">Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("shortcuts")}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "shortcuts"
                  ? "bg-background text-foreground shadow-xs border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <IconKeyboard className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-[11px] font-medium leading-none">Shortcuts</span>
            </button>
          </div>
        </div>

        {/* Main Body: Desktop Sidebar + Content Area */}
        <div className="flex flex-1 min-h-[380px] sm:min-h-[440px] overflow-hidden">
          {/* Desktop Left Navigation Rail */}
          <div className="hidden sm:flex flex-col w-56 border-r border-border/50 p-3 bg-muted/15 shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer ${
                activeTab === "account"
                  ? "bg-background text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <IconUser className="size-4 shrink-0 text-muted-foreground" />
              <span>Profile & Account</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("plan")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer ${
                activeTab === "plan"
                  ? "bg-background text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <IconBolt className="size-4 shrink-0 text-lime-400" />
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span>Plan & Quota</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {totalSubmissions}/{MONTHLY_LIMIT}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer ${
                activeTab === "appearance"
                  ? "bg-background text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <IconPalette className="size-4 shrink-0 text-muted-foreground" />
              <span>Appearance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("shortcuts")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all w-full text-left cursor-pointer ${
                activeTab === "shortcuts"
                  ? "bg-background text-foreground shadow-xs border border-border/80"
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

          {/* Right Scrollable Content Pane */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* 1. Account & Profile Tab */}
            {activeTab === "account" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Profile & Workspace Identity
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your authenticated credentials and current workspace permissions.
                  </p>
                </div>

                {/* User Identity Card */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar
                      className={`size-12 rounded-xl border ${landingTheme.avatarBorder} shadow-xs`}
                    >
                      <AvatarImage
                        src={user?.profileImageUrl || ""}
                        alt={user?.fullName || "User"}
                      />
                      <AvatarFallback
                        className={`rounded-xl text-sm font-bold ${landingTheme.avatarFallback}`}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground truncate">
                          {user?.fullName || "ChaiForm Creator"}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] py-0 px-2 font-medium bg-muted/80 text-foreground"
                        >
                          Workspace Owner
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <span className="truncate">{user?.email || "creator@chaiform.com"}</span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                          <IconShieldCheck className="size-3 text-emerald-400" />
                          <span>Verified</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workspace Details List */}
                <div className="rounded-xl border border-border/60 bg-card divide-y divide-border/40 text-xs">
                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-foreground">Workspace Identifier</span>
                      <p className="text-[11px] text-muted-foreground">
                        Unique identifier for API integration & support.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyWorkspaceId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/40 hover:bg-muted text-foreground font-mono text-[11px] transition-colors cursor-pointer"
                      title="Click to copy Workspace ID"
                    >
                      <span>{workspaceId}</span>
                      {copiedId ? (
                        <IconCheck className="size-3 text-emerald-400" />
                      ) : (
                        <IconCopy className="size-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-foreground">Published Forms</span>
                      <p className="text-[11px] text-muted-foreground">
                        Total active forms live in this workspace.
                      </p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs font-semibold">
                      {activeFormsCount} Forms
                    </Badge>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-foreground">Session Authentication</span>
                      <p className="text-[11px] text-muted-foreground">
                        Http-only signed JWT token with anti-CSRF protection.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <IconLock className="size-3 text-emerald-400" />
                      <span>Encrypted</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Plan & Response Quota Tab (Future Payment Ready) */}
            {activeTab === "plan" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Workspace Limits & Quotas</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Monitor active forms created and respondent submission limits.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                  >
                    Community Beta (14 Forms)
                  </Badge>
                </div>

                {/* Meter 1: Active Forms Meter Card */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <IconLayoutList className="size-3.5 text-lime-500 dark:text-[#CCFF00]" />
                      Active Forms Created
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      <span className={landingTheme.primaryText}>{activeFormsCount}</span>
                      <span className="text-muted-foreground/70"> / {FORMS_LIMIT}</span>
                    </span>
                  </div>

                  <Progress value={formsPercent} className="h-2 bg-muted/60" />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">
                        Forms Remaining
                      </span>
                      <span className="font-mono font-bold text-foreground">{formsRemaining}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Capacity Used</span>
                      <span className="font-mono font-bold text-foreground">{formsPercent}%</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Tier Cap</span>
                      <span className="font-medium text-foreground text-[10px]">
                        14 Forms in Beta
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meter 2: Respondent Answers Meter Card */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <IconBolt className="size-3.5 text-lime-400" />
                      Monthly Respondent Answers
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      <span className={landingTheme.primaryText}>{totalSubmissions}</span>
                      <span className="text-muted-foreground/70"> / {MONTHLY_LIMIT}</span>
                    </span>
                  </div>

                  <Progress value={usagePercent} className="h-2 bg-muted/60" />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">
                        Responses Left
                      </span>
                      <span className="font-mono font-bold text-foreground">{remaining}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Usage Share</span>
                      <span className="font-mono font-bold text-foreground">{usagePercent}%</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-card/80 border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Cycle Reset</span>
                      <span className="font-medium text-foreground text-[10px]">1st of Month</span>
                    </div>
                  </div>
                </div>

                {/* Pro Tier Card (Coming Soon) */}
                <div className="rounded-xl border border-border/80 bg-gradient-to-br from-card via-muted/20 to-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-lime-500/10 text-lime-600 dark:text-[#CCFF00] border border-lime-500/20">
                        <IconSparkles className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground block">
                            ChaiForm Pro
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground uppercase border border-border/60">
                            Coming Soon
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Unlimited forms, custom domains & 10k responses
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-foreground font-mono">₹1,499 / mo</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                      <IconCheck className="size-3 text-emerald-400 shrink-0" />
                      <span>Unlimited published forms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconCheck className="size-3 text-emerald-400 shrink-0" />
                      <span>10,000 monthly responses</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconCheck className="size-3 text-emerald-400 shrink-0" />
                      <span>Custom domains (/f/your-brand)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconCheck className="size-3 text-emerald-400 shrink-0" />
                      <span>Instant webhooks & exports</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    className="w-full text-xs h-8.5 justify-between border-border bg-card hover:bg-muted text-foreground"
                  >
                    <Link href="/pricing">
                      <span className="font-semibold">View All Plans & Capabilities</span>
                      <IconArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* 3. Appearance & Theme Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Theme & Interface Display</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select your preferred visual mode for the ChaiForm workspace.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Light Mode */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                      mounted && theme === "light"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <IconSun className="size-4.5" />
                      </div>
                      {mounted && theme === "light" && (
                        <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                          <IconCheck className="size-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">Light Mode</span>
                      <span className="text-[10px] text-muted-foreground">
                        Crisp daytime readability
                      </span>
                    </div>
                  </button>

                  {/* Dark Mode */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                      mounted && theme === "dark"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/20">
                        <IconMoon className="size-4.5" />
                      </div>
                      {mounted && theme === "dark" && (
                        <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                          <IconCheck className="size-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">Dark Mode</span>
                      <span className="text-[10px] text-muted-foreground">
                        Sleek low-glare dark palette
                      </span>
                    </div>
                  </button>

                  {/* System Auto */}
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                      mounted && theme === "system"
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border/60 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border/70">
                        <IconDeviceDesktop className="size-4.5" />
                      </div>
                      {mounted && theme === "system" && (
                        <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                          <IconCheck className="size-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">System Auto</span>
                      <span className="text-[10px] text-muted-foreground">
                        Follows OS theme settings
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 4. Keyboard Shortcuts Tab */}
            {activeTab === "shortcuts" && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Keyboard Navigation & Hotkeys
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Speed through forms and respondent data using power-user shortcuts.
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-card divide-y divide-border/40 text-xs">
                  <div className="p-3 flex items-center justify-between">
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

                  <div className="p-3 flex items-center justify-between">
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

                  <div className="p-3 flex items-center justify-between">
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

                  <div className="p-3 flex items-center justify-between">
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
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 sm:py-3 border-t border-border/50 bg-muted/20 flex items-center justify-between shrink-0 text-xs">
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            ChaiForm Cloud • Community Free Workspace
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-7.5 ml-auto cursor-pointer"
          >
            Close Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
