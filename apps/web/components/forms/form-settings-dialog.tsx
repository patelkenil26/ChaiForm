"use client";

import { useEffect, useState } from "react";
import {
  IconAdjustmentsHorizontal,
  IconLock,
  IconEye,
  IconEyeOff,
  IconLink,
  IconClock,
  IconUsers,
  IconLoader2,
  IconSparkles,
  IconSend,
  IconExternalLink,
  IconHourglass,
  IconCheck,
  IconShieldLock,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { CharacterCounter } from "~/components/ui/character-counter";
import { toast } from "sonner";
import { landingTheme } from "~/config/landing-theme";

export interface FormSettingsPayload {
  closesAt: Date | null;
  responseLimit: number | null;
  slug: string | null;
  password: string | null;
  submitButtonText?: string | null;
  thankYouTitle?: string | null;
  thankYouDescription?: string | null;
  thankYouButtonText?: string | null;
  thankYouButtonUrl?: string | null;
  autoRedirectUrl?: string | null;
  showWelcomeScreen?: boolean;
  welcomeTitle?: string | null;
  welcomeDescription?: string | null;
  welcomeButtonText?: string | null;
  estimatedTime?: string | null;
}

export interface FormSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    submissionCount: number;
    responseLimit?: number | null;
    closesAt?: Date | string | null;
    slug?: string | null;
    isPasswordProtected?: boolean;
    submitButtonText?: string | null;
    thankYouTitle?: string | null;
    thankYouDescription?: string | null;
    thankYouButtonText?: string | null;
    thankYouButtonUrl?: string | null;
    autoRedirectUrl?: string | null;
    showWelcomeScreen?: boolean;
    welcomeTitle?: string | null;
    welcomeDescription?: string | null;
    welcomeButtonText?: string | null;
    estimatedTime?: string | null;
  };
  onSave: (settings: FormSettingsPayload) => Promise<void>;
  isSaving: boolean;
}

const SUBMIT_TEXT_PRESETS = [
  "Submit",
  "Submit Response",
  "Register Now",
  "Send Application",
  "Book Free Demo",
  "Submit Feedback",
];

export function FormSettingsDialog({
  open,
  onOpenChange,
  form,
  onSave,
  isSaving,
}: FormSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "access" | "limits">("experience");

  // Experience Settings States
  const [submitButtonText, setSubmitButtonText] = useState("Submit");
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [welcomeTitle, setWelcomeTitle] = useState("");
  const [welcomeDescription, setWelcomeDescription] = useState("");
  const [welcomeButtonText, setWelcomeButtonText] = useState("Start Form");
  const [estimatedTime, setEstimatedTime] = useState("");

  const [thankYouTitle, setThankYouTitle] = useState("");
  const [thankYouDescription, setThankYouDescription] = useState("");
  const [hasThankYouButton, setHasThankYouButton] = useState(false);
  const [thankYouButtonText, setThankYouButtonText] = useState("");
  const [thankYouButtonUrl, setThankYouButtonUrl] = useState("");
  const [hasAutoRedirect, setHasAutoRedirect] = useState(false);
  const [autoRedirectUrl, setAutoRedirectUrl] = useState("");

  // Access & Limits States
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryValue, setExpiryValue] = useState("");

  const [hasLimit, setHasLimit] = useState(false);
  const [limitValue, setLimitValue] = useState("");

  const [hasSlug, setHasSlug] = useState(false);
  const [slugValue, setSlugValue] = useState("");

  const [hasPassword, setHasPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open && form) {
      setSubmitButtonText(form.submitButtonText || "Submit");
      setShowWelcomeScreen(Boolean(form.showWelcomeScreen));
      setWelcomeTitle(form.welcomeTitle || "");
      setWelcomeDescription(form.welcomeDescription || "");
      setWelcomeButtonText(form.welcomeButtonText || "Start Form");
      setEstimatedTime(form.estimatedTime || "");

      setThankYouTitle(form.thankYouTitle || "");
      setThankYouDescription(form.thankYouDescription || "");

      const hasBtn = Boolean(form.thankYouButtonText || form.thankYouButtonUrl);
      setHasThankYouButton(hasBtn);
      setThankYouButtonText(form.thankYouButtonText || "");
      setThankYouButtonUrl(form.thankYouButtonUrl || "");

      const hasRedirect = Boolean(form.autoRedirectUrl);
      setHasAutoRedirect(hasRedirect);
      setAutoRedirectUrl(form.autoRedirectUrl || "");

      if (form.closesAt) {
        setHasExpiry(true);
        const d = new Date(form.closesAt);
        const pad = (n: number) => String(n).padStart(2, "0");
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setExpiryValue(formatted);
      } else {
        setHasExpiry(false);
        setExpiryValue("");
      }

      if (form.responseLimit) {
        setHasLimit(true);
        setLimitValue(String(form.responseLimit));
      } else {
        setHasLimit(false);
        setLimitValue("");
      }

      if (form.slug) {
        setHasSlug(true);
        setSlugValue(form.slug);
      } else {
        setHasSlug(false);
        setSlugValue("");
      }

      if (form.isPasswordProtected) {
        setHasPassword(true);
        setPasswordValue("");
      } else {
        setHasPassword(false);
        setPasswordValue("");
      }
    }
  }, [open, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSlug && slugValue.trim()) {
      const trimmedSlug = slugValue.toLowerCase().trim();
      if (trimmedSlug.length < 3) {
        toast.error("Custom URL slug must be at least 3 characters.");
        return;
      }
      if (trimmedSlug.length > 60) {
        toast.error("Custom URL slug cannot exceed 60 characters.");
        return;
      }
    }

    if (hasPassword && passwordValue.length > 50) {
      toast.error("Access password cannot exceed 50 characters.");
      return;
    }

    if (hasThankYouButton && thankYouButtonUrl.trim()) {
      const url = thankYouButtonUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        toast.error("Thank You button URL must start with http:// or https://");
        return;
      }
    }

    if (hasAutoRedirect && autoRedirectUrl.trim()) {
      const url = autoRedirectUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        toast.error("Auto-redirect URL must start with http:// or https://");
        return;
      }
    }

    const closesAt = hasExpiry && expiryValue ? new Date(expiryValue) : null;
    const responseLimit = hasLimit && limitValue ? parseInt(limitValue, 10) : null;
    const slug = hasSlug && slugValue.trim() ? slugValue.toLowerCase().trim() : null;

    let passwordPayload: string | null = null;
    if (hasPassword) {
      if (passwordValue.trim().length > 0) {
        passwordPayload = passwordValue.trim();
      } else if (form.isPasswordProtected) {
        passwordPayload = undefined as unknown as string;
      }
    } else {
      passwordPayload = null;
    }

    await onSave({
      closesAt,
      responseLimit,
      slug,
      password: passwordPayload,
      submitButtonText: submitButtonText.trim() ? submitButtonText.trim() : "Submit",
      showWelcomeScreen,
      welcomeTitle: showWelcomeScreen && welcomeTitle.trim() ? welcomeTitle.trim() : null,
      welcomeDescription:
        showWelcomeScreen && welcomeDescription.trim() ? welcomeDescription.trim() : null,
      welcomeButtonText:
        showWelcomeScreen && welcomeButtonText.trim() ? welcomeButtonText.trim() : "Start Form",
      estimatedTime: showWelcomeScreen && estimatedTime.trim() ? estimatedTime.trim() : null,
      thankYouTitle: thankYouTitle.trim() ? thankYouTitle.trim() : null,
      thankYouDescription: thankYouDescription.trim() ? thankYouDescription.trim() : null,
      thankYouButtonText:
        hasThankYouButton && thankYouButtonText.trim() ? thankYouButtonText.trim() : null,
      thankYouButtonUrl:
        hasThankYouButton && thankYouButtonUrl.trim() ? thankYouButtonUrl.trim() : null,
      autoRedirectUrl: hasAutoRedirect && autoRedirectUrl.trim() ? autoRedirectUrl.trim() : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <IconAdjustmentsHorizontal className="size-5 text-lime-600 dark:text-[#ccff00]" />
              <span>Form Configuration & Experience</span>
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure respondent journey, custom buttons, welcome screen, completion page, and
            access rules.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          {/* Top Quick Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/40 text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <IconUsers className="size-3.5 text-lime-600 dark:text-[#ccff00]" />
              Submissions Count:
            </span>
            <span className="font-semibold text-foreground">
              {form.submissionCount} {form.responseLimit ? `/ ${form.responseLimit}` : "responses"}
            </span>
          </div>

          {/* Navigation Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "experience" | "access" | "limits")}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3 bg-muted/70 p-1 rounded-xl">
              <TabsTrigger
                value="experience"
                className="text-xs font-medium gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs rounded-lg"
              >
                <IconSparkles className="size-3.5 text-lime-600 dark:text-[#ccff00]" />
                <span>Experience</span>
              </TabsTrigger>
              <TabsTrigger
                value="access"
                className="text-xs font-medium gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs rounded-lg"
              >
                <IconShieldLock className="size-3.5 text-blue-500" />
                <span>Access & URL</span>
              </TabsTrigger>
              <TabsTrigger
                value="limits"
                className="text-xs font-medium gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-2xs rounded-lg"
              >
                <IconClock className="size-3.5 text-amber-500" />
                <span>Limits & Expiry</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: EXPERIENCE & SCREENS */}
            <TabsContent
              value="experience"
              className="space-y-4 pt-3 mt-0 focus-visible:outline-none"
            >
              {/* Feature 1: Custom Submit Button Text */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 bg-card/60">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-lime-500/10 text-lime-600 dark:text-[#ccff00] flex items-center justify-center">
                    <IconSend className="size-4" />
                  </div>
                  <div>
                    <Label htmlFor="submit-btn-text" className="text-sm font-semibold">
                      Submit Button Label
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Personalize the main button shown at the end of the form.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <Input
                    id="submit-btn-text"
                    value={submitButtonText}
                    onChange={(e) => setSubmitButtonText(e.target.value)}
                    placeholder="e.g. Register Now, Send Application"
                    maxLength={50}
                    className="text-sm"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-muted-foreground mr-1">Presets:</span>
                    {SUBMIT_TEXT_PRESETS.map((preset) => (
                      <Badge
                        key={preset}
                        variant="outline"
                        className={`text-[10px] cursor-pointer hover:border-lime-500/60 transition ${
                          submitButtonText === preset
                            ? "bg-lime-500/15 border-lime-500 text-lime-600 dark:text-[#ccff00]"
                            : "bg-muted/40 text-muted-foreground"
                        }`}
                        onClick={() => setSubmitButtonText(preset)}
                      >
                        {preset}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature 2: Optional Welcome Screen */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <IconSparkles className="size-4" />
                      </div>
                      <div>
                        <Label
                          htmlFor="toggle-welcome"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Welcome / Start Screen
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Show an introductory cover before respondents start answering questions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Switch
                    id="toggle-welcome"
                    checked={showWelcomeScreen}
                    onCheckedChange={setShowWelcomeScreen}
                  />
                </div>

                {showWelcomeScreen && (
                  <div className="pt-3 border-t border-border/50 space-y-3 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <FieldLabel htmlFor="welcome-title">Cover Title (Optional)</FieldLabel>
                      <Input
                        id="welcome-title"
                        value={welcomeTitle}
                        onChange={(e) => setWelcomeTitle(e.target.value)}
                        placeholder="Leave blank to use form title"
                        maxLength={255}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel htmlFor="welcome-desc">Cover Description (Optional)</FieldLabel>
                      <Textarea
                        id="welcome-desc"
                        value={welcomeDescription}
                        onChange={(e) => setWelcomeDescription(e.target.value)}
                        placeholder="Provide helpful context, instructions, or what respondents should expect..."
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <FieldLabel htmlFor="welcome-btn">Start Button Text</FieldLabel>
                        <Input
                          id="welcome-btn"
                          value={welcomeButtonText}
                          onChange={(e) => setWelcomeButtonText(e.target.value)}
                          placeholder="e.g. Start Form, Begin"
                          maxLength={50}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <FieldLabel htmlFor="welcome-time">Estimated Time Badge</FieldLabel>
                        <Input
                          id="welcome-time"
                          value={estimatedTime}
                          onChange={(e) => setEstimatedTime(e.target.value)}
                          placeholder="e.g. Takes 2 mins"
                          maxLength={50}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Feature 3: Customizable Thank You / Completion Screen */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 bg-card/60">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <IconCheck className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Thank You / Completion Screen</h4>
                    <p className="text-xs text-muted-foreground">
                      Customize message, CTA button, and auto-redirect after response submission.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="thankyou-title">Success Title</FieldLabel>
                    <Input
                      id="thankyou-title"
                      value={thankYouTitle}
                      onChange={(e) => setThankYouTitle(e.target.value)}
                      placeholder="e.g. Aapka response mil gaya!"
                      maxLength={255}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="thankyou-desc">Success Description</FieldLabel>
                    <Textarea
                      id="thankyou-desc"
                      value={thankYouDescription}
                      onChange={(e) => setThankYouDescription(e.target.value)}
                      placeholder="e.g. Hum 24 ghante me aapse contact karenge ya email bhejenge."
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </div>

                  {/* Sub-feature: Action button on Thank You screen */}
                  <div className="p-3 rounded-lg border border-border/50 bg-background/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="toggle-ty-btn"
                          className="text-xs font-semibold cursor-pointer"
                        >
                          Custom Call-to-Action Button
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Direct respondents to your website, WhatsApp, or community group.
                        </p>
                      </div>
                      <Switch
                        id="toggle-ty-btn"
                        checked={hasThankYouButton}
                        onCheckedChange={setHasThankYouButton}
                      />
                    </div>

                    {hasThankYouButton && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-in fade-in duration-150">
                        <Input
                          value={thankYouButtonText}
                          onChange={(e) => setThankYouButtonText(e.target.value)}
                          placeholder="Button Label (e.g. Visit Website)"
                          maxLength={50}
                          className="text-xs"
                          required={hasThankYouButton}
                        />
                        <Input
                          type="url"
                          value={thankYouButtonUrl}
                          onChange={(e) => setThankYouButtonUrl(e.target.value)}
                          placeholder="Destination URL (https://...)"
                          className="text-xs"
                          required={hasThankYouButton}
                        />
                      </div>
                    )}
                  </div>

                  {/* Sub-feature: Auto-Redirect URL */}
                  <div className="p-3 rounded-lg border border-border/50 bg-background/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="toggle-redirect"
                          className="text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                        >
                          <IconHourglass className="size-3 text-amber-500" />
                          Auto-Redirect after Submission
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Automatically navigate respondent to a specific URL after 3 seconds.
                        </p>
                      </div>
                      <Switch
                        id="toggle-redirect"
                        checked={hasAutoRedirect}
                        onCheckedChange={setHasAutoRedirect}
                      />
                    </div>

                    {hasAutoRedirect && (
                      <div className="pt-1 animate-in fade-in duration-150">
                        <Input
                          type="url"
                          value={autoRedirectUrl}
                          onChange={(e) => setAutoRedirectUrl(e.target.value)}
                          placeholder="https://yoursite.com/welcome-next"
                          className="text-xs"
                          required={hasAutoRedirect}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: ACCESS & SECURITY */}
            <TabsContent value="access" className="space-y-4 pt-3 mt-0 focus-visible:outline-none">
              {/* Password Protection Section */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <IconLock className="size-3.5 text-lime-600 dark:text-[#ccff00]" />
                      <Label
                        htmlFor="toggle-password"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Password Protection
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lock form behind an access password
                    </p>
                  </div>
                  <Switch
                    id="toggle-password"
                    checked={hasPassword}
                    onCheckedChange={setHasPassword}
                  />
                </div>

                {hasPassword && (
                  <div className="pt-2 space-y-1.5">
                    <FieldLabel htmlFor="form-password">
                      {form.isPasswordProtected ? "Update Access Password" : "Set Access Password"}
                    </FieldLabel>
                    <div className="relative flex items-center">
                      <Input
                        id="form-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          form.isPasswordProtected
                            ? "•••••••• (Leave blank to keep unchanged)"
                            : "Enter access password"
                        }
                        maxLength={50}
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className="text-sm pr-16"
                        required={hasPassword && !form.isPasswordProtected}
                      />
                      {passwordValue.length > 0 && (
                        <CharacterCounter
                          current={passwordValue.length}
                          max={50}
                          className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Respondents must enter this password to view and submit the form.
                    </p>
                  </div>
                )}
              </div>

              {/* Custom Slug / Clean URL Section */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <IconLink className="size-3.5 text-blue-500" />
                      <Label htmlFor="toggle-slug" className="text-sm font-medium cursor-pointer">
                        Custom Clean URL
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Personalize the public link with a short slug
                    </p>
                  </div>
                  <Switch id="toggle-slug" checked={hasSlug} onCheckedChange={setHasSlug} />
                </div>

                {hasSlug && (
                  <div className="pt-2 space-y-1.5">
                    <FieldLabel htmlFor="custom-slug">Public URL Slug</FieldLabel>
                    <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 px-3 focus-within:ring-1 focus-within:ring-lime-500/50">
                      <span className="text-xs text-muted-foreground font-mono select-none">
                        /form/
                      </span>
                      <input
                        id="custom-slug"
                        type="text"
                        placeholder="my-form-name"
                        maxLength={60}
                        value={slugValue}
                        onChange={(e) => {
                          const val = e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, "");
                          setSlugValue(val);
                        }}
                        className="w-full bg-transparent px-1.5 py-2 text-xs font-mono outline-hidden text-foreground"
                        required={hasSlug}
                      />
                      <CharacterCounter
                        current={slugValue.length}
                        max={60}
                        className="shrink-0 ml-1"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Letters, numbers, and hyphens only (min 3 chars).
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 3: LIMITS & EXPIRATION */}
            <TabsContent value="limits" className="space-y-4 pt-3 mt-0 focus-visible:outline-none">
              {/* Expiry Date Section */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <IconClock className={`size-3.5 ${landingTheme.iconColor}`} />
                      <Label htmlFor="toggle-expiry" className="text-sm font-medium cursor-pointer">
                        Schedule Expiration
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically close form after specific date & time
                    </p>
                  </div>
                  <Switch id="toggle-expiry" checked={hasExpiry} onCheckedChange={setHasExpiry} />
                </div>

                {hasExpiry && (
                  <div className="pt-2">
                    <FieldLabel htmlFor="expiry-datetime">Close on (Date & Time)</FieldLabel>
                    <Input
                      id="expiry-datetime"
                      type="datetime-local"
                      value={expiryValue}
                      onChange={(e) => setExpiryValue(e.target.value)}
                      className="text-sm"
                      required={hasExpiry}
                    />
                  </div>
                )}
              </div>

              {/* Response Limit Section */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <IconUsers className="size-3.5 text-emerald-500" />
                      <Label htmlFor="toggle-limit" className="text-sm font-medium cursor-pointer">
                        Response Cap
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Limit maximum number of accepted submissions
                    </p>
                  </div>
                  <Switch id="toggle-limit" checked={hasLimit} onCheckedChange={setHasLimit} />
                </div>

                {hasLimit && (
                  <div className="pt-2">
                    <FieldLabel htmlFor="response-cap">Max Responses</FieldLabel>
                    <Input
                      id="response-cap"
                      type="number"
                      min="1"
                      placeholder="e.g. 100"
                      value={limitValue}
                      onChange={(e) => setLimitValue(e.target.value)}
                      className="text-sm"
                      required={hasLimit}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              className={landingTheme.buttonOutlineHover}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className={`gap-2 ${landingTheme.primaryButton}`}
            >
              {isSaving && <IconLoader2 className="size-4 animate-spin" />}
              {isSaving ? "Saving Settings..." : "Save Settings"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
