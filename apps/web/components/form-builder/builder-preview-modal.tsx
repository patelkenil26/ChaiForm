"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import confetti from "canvas-confetti";
import {
  IconDeviceDesktop,
  IconDeviceTablet,
  IconDeviceMobile,
  IconRefresh,
  IconExternalLink,
  IconX,
  IconSparkles,
  IconCheck,
  IconClock,
  IconUsers,
  IconLock,
  IconAlertCircle,
  IconEye,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { FieldGroup } from "~/components/ui/field";
import { FormFieldRenderer } from "~/components/public-form/form-field-renderer";
import { landingTheme } from "~/config/landing-theme";
import { resolveFormTheme } from "~/config/form-themes";
import type { PublicFormField } from "~/components/public-form/types";
import type { BuilderFormData } from "./builder-header";
import type { FieldRow } from "./field-types";

type ViewportMode = "desktop" | "tablet" | "mobile";

interface BuilderPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: BuilderFormData | null | undefined;
  fields: FieldRow[];
  publicPath?: string;
}

export function BuilderPreviewModal({
  open,
  onOpenChange,
  form,
  fields,
  publicPath,
}: BuilderPreviewModalProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [isPreviewStarted, setIsPreviewStarted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Reset form when modal closes or opens
  useEffect(() => {
    if (open) {
      setIsTestSubmitted(false);
      setIsPreviewStarted(false);
      reset();
    }
  }, [open, reset]);

  const handleTestSubmit = () => {
    setIsTestSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: landingTheme.confettiColors,
      });
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    reset();
    setIsTestSubmitted(false);
    setIsPreviewStarted(false);
  };

  const sortedFields = [...fields].sort((a, b) => parseFloat(a.index) - parseFloat(b.index));

  const activeTheme = resolveFormTheme(
    form?.themePreset,
    form?.customBgColor,
    form?.customTextColor,
    form?.customAccentColor,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[95vw] md:max-w-[92vw] lg:max-w-[85vw] xl:max-w-[1300px] h-[92vh] p-0 gap-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl border-border/80 shadow-2xl rounded-2xl"
      >
        <DialogTitle className="sr-only">Form Live Preview</DialogTitle>
        <DialogHeader className="sr-only">
          <h2>Interactive Form Preview Simulator</h2>
        </DialogHeader>

        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/60 bg-muted/40 shrink-0">
          {/* Left: Branding & Status Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex aspect-square size-7 items-center justify-center rounded-lg ${landingTheme.iconBg}`}
              >
                <IconEye className="size-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold tracking-tight">Live Preview</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 py-0 h-4.5 ${landingTheme.iconBg} font-medium gap-1`}
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Interactive Simulator
                  </Badge>
                </div>
                <span
                  className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-xs block"
                  title={form?.title || "Untitled Form"}
                >
                  {form?.title || "Untitled Form"} • {fields.length}{" "}
                  {fields.length === 1 ? "question" : "questions"}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Device Viewport Switcher */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                viewport === "desktop"
                  ? landingTheme.cardHighlightBadge
                  : "text-muted-foreground hover:text-foreground hover:bg-muted font-medium"
              }`}
            >
              <IconDeviceDesktop className="size-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                viewport === "tablet"
                  ? landingTheme.cardHighlightBadge
                  : "text-muted-foreground hover:text-foreground hover:bg-muted font-medium"
              }`}
            >
              <IconDeviceTablet className="size-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                viewport === "mobile"
                  ? landingTheme.cardHighlightBadge
                  : "text-muted-foreground hover:text-foreground hover:bg-muted font-medium"
              }`}
            >
              <IconDeviceMobile className="size-3.5" />
              <span>Mobile (390px)</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs gap-1.5"
              title="Clear entered sample responses"
            >
              <IconRefresh className="size-3.5" />
              <span className="hidden sm:inline">Reset Form</span>
            </Button>

            {publicPath && form?.isPublished && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 text-xs gap-1.5 hidden md:inline-flex"
              >
                <a href={publicPath} target="_blank" rel="noopener noreferrer">
                  <IconExternalLink className="size-3.5" />
                  <span>Open Live URL</span>
                </a>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-lg"
            >
              <IconX className="size-4" />
              <span className="sr-only">Close Preview</span>
            </Button>
          </div>
        </div>

        {/* Notice Ribbon */}
        <div
          className={`border-b ${landingTheme.callout.border} ${landingTheme.callout.bg} px-4 py-1.5 flex items-center justify-between text-xs ${landingTheme.callout.text}`}
        >
          <div className="flex items-center gap-1.5">
            <IconAlertCircle className="size-3.5 shrink-0" />
            <span>
              Preview Mode: Test answers entered here are sandbox-only and{" "}
              <strong>will not be saved</strong> to your database.
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-muted-foreground">
            {form?.closesAt && (
              <span className="flex items-center gap-1">
                <IconClock className={`size-3 ${landingTheme.iconColor}`} />
                Closes: {new Date(form.closesAt).toLocaleDateString()}
              </span>
            )}
            {form?.responseLimit && (
              <span className="flex items-center gap-1">
                <IconUsers className="size-3 text-blue-500" />
                Limit: {form.responseLimit}
              </span>
            )}
            {form?.isPasswordProtected && (
              <span className="flex items-center gap-1">
                <IconLock className="size-3 text-primary" />
                Password Protected
              </span>
            )}
          </div>
        </div>

        {/* Viewport Frame Container */}
        <div className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 md:p-8 flex items-start justify-center">
          <div
            className={`w-full transition-all duration-300 ease-out ${
              viewport === "mobile"
                ? "max-w-[400px] my-2 rounded-[2.5rem] border-8 shadow-2xl p-6 relative"
                : viewport === "tablet"
                  ? "max-w-[640px] my-2 rounded-2xl border shadow-xl p-8"
                  : "max-w-[760px] my-2 rounded-2xl border shadow-lg p-8 md:p-10"
            }`}
            style={{
              background: activeTheme.background,
              color: activeTheme.textColor,
              borderColor: activeTheme.cardBorder,
              boxShadow: `0 20px 50px -10px ${activeTheme.glowColor}`,
            }}
          >
            {/* Mobile Notch Mockup */}
            {viewport === "mobile" && (
              <div className="w-28 h-4 bg-muted-foreground/20 rounded-full mx-auto -mt-2 mb-6" />
            )}

            {isTestSubmitted ? (
              /* Simulated Success State */
              <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div
                  className="flex aspect-square size-16 items-center justify-center rounded-2xl shadow-md"
                  style={{
                    backgroundColor: `${activeTheme.accentColor}18`,
                    color: activeTheme.accentColor,
                    border: `1px solid ${activeTheme.accentColor}35`,
                  }}
                >
                  <IconCheck className="size-8" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <Badge
                    variant="outline"
                    className="text-xs px-2.5 py-0.5"
                    style={{
                      borderColor: `${activeTheme.accentColor}40`,
                      backgroundColor: `${activeTheme.accentColor}12`,
                      color: activeTheme.accentColor,
                    }}
                  >
                    Test Submission Successful
                  </Badge>
                  <h3
                    className="text-xl font-bold tracking-tight"
                    style={{ color: activeTheme.textColor }}
                  >
                    {form?.thankYouTitle || "Everything works smoothly!"}
                  </h3>
                  <p
                    className="text-xs sm:text-sm whitespace-pre-line"
                    style={{ color: activeTheme.textMutedColor }}
                  >
                    {form?.thankYouDescription ||
                      "This is what respondents will see when they complete your form."}
                  </p>
                </div>

                {/* Simulated Custom Action Button */}
                {form?.thankYouButtonText && form?.thankYouButtonUrl && (
                  <div className="pt-1 w-full max-w-xs">
                    <Button
                      asChild
                      size="sm"
                      className="w-full text-xs font-semibold gap-1.5 cursor-pointer shadow-md"
                      style={{
                        backgroundColor: activeTheme.accentColor,
                        color: activeTheme.accentTextColor,
                        boxShadow: `0 4px 15px ${activeTheme.glowColor}`,
                      }}
                    >
                      <a href={form.thankYouButtonUrl} target="_blank" rel="noopener noreferrer">
                        <span>{form.thankYouButtonText}</span>
                        <IconExternalLink className="size-3" />
                      </a>
                    </Button>
                  </div>
                )}

                {/* Simulated Auto-Redirect note */}
                {form?.autoRedirectUrl && (
                  <div className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-700 dark:text-amber-300">
                    Auto-redirect configured:{" "}
                    <span className="font-mono">{form.autoRedirectUrl}</span> (in 3s)
                  </div>
                )}

                <div className="pt-4 flex items-center gap-2">
                  <Button size="sm" onClick={handleReset} className="gap-1.5 cursor-pointer">
                    <IconRefresh className="size-3.5" />
                    <span>Test Again</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="cursor-pointer"
                  >
                    Done Testing
                  </Button>
                </div>
              </div>
            ) : form?.showWelcomeScreen && !isPreviewStarted ? (
              /* Simulated Welcome / Start Screen */
              <div className="py-10 px-2 sm:px-6 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <Badge
                    variant="outline"
                    className="text-xs font-medium px-2.5 py-0.5 gap-1.5"
                    style={{
                      borderColor: `${activeTheme.accentColor}40`,
                      backgroundColor: `${activeTheme.accentColor}15`,
                      color: activeTheme.accentColor,
                    }}
                  >
                    <IconClock className="size-3" />
                    <span>{form.estimatedTime || "Takes 2 mins"}</span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs font-medium px-2.5 py-0.5"
                    style={{
                      borderColor: activeTheme.cardBorder,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: activeTheme.textMutedColor,
                    }}
                  >
                    {fields.length} {fields.length === 1 ? "question" : "questions"}
                  </Badge>
                </div>

                <div className="space-y-2 max-w-md">
                  <h2
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                    style={{ color: activeTheme.textColor }}
                  >
                    {form.welcomeTitle || form.title || "Untitled Form"}
                  </h2>
                  <p
                    className="text-xs sm:text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: activeTheme.textMutedColor }}
                  >
                    {form.welcomeDescription ||
                      form.description ||
                      "Welcome! Please take a few moments to complete this form."}
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    size="lg"
                    onClick={() => setIsPreviewStarted(true)}
                    className="h-11 px-7 text-sm font-bold shadow-md gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: activeTheme.accentColor,
                      color: activeTheme.accentTextColor,
                      boxShadow: `0 4px 20px ${activeTheme.glowColor}`,
                    }}
                  >
                    <span>{form.welcomeButtonText || "Start Form"}</span>
                    <IconExternalLink className="size-3.5 rotate-45" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Live Interactive Form */
              <div>
                {/* Form Header Info */}
                <div className="mb-6 pb-4 border-b" style={{ borderColor: activeTheme.cardBorder }}>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {form?.isPublished ? (
                      <Badge
                        variant="default"
                        className="text-[10px] inline-flex items-center gap-1.5"
                        style={{
                          backgroundColor: `${activeTheme.accentColor}20`,
                          color: activeTheme.accentColor,
                          border: `1px solid ${activeTheme.accentColor}40`,
                        }}
                      >
                        <span
                          className="size-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: activeTheme.accentColor }}
                        />
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[10px] inline-flex items-center gap-1.5"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          color: activeTheme.textMutedColor,
                          border: `1px solid ${activeTheme.cardBorder}`,
                        }}
                      >
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: activeTheme.accentColor }}
                        />
                        Draft (Unpublished)
                      </Badge>
                    )}
                    {form?.slug && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono"
                        style={{
                          color: activeTheme.textMutedColor,
                          borderColor: activeTheme.cardBorder,
                        }}
                      >
                        /form/{form.slug}
                      </Badge>
                    )}
                  </div>
                  <h2
                    className="text-xl sm:text-2xl font-bold tracking-tight"
                    style={{ color: activeTheme.textColor }}
                  >
                    {form?.title || "Untitled Form"}
                  </h2>
                  {form?.description && (
                    <p
                      className="mt-1.5 text-xs sm:text-sm leading-relaxed"
                      style={{ color: activeTheme.textMutedColor }}
                    >
                      {form.description}
                    </p>
                  )}
                </div>

                {sortedFields.length === 0 ? (
                  <div
                    className="py-12 flex flex-col items-center justify-center text-center border border-dashed rounded-xl p-6"
                    style={{ borderColor: activeTheme.cardBorder }}
                  >
                    <IconSparkles
                      className="size-8 mb-2"
                      style={{ color: activeTheme.accentColor }}
                    />
                    <h4 className="text-sm font-semibold" style={{ color: activeTheme.textColor }}>
                      No questions added yet
                    </h4>
                    <p
                      className="text-xs mt-1 max-w-xs"
                      style={{ color: activeTheme.textMutedColor }}
                    >
                      Click &quot;Add Field&quot; in the builder to start adding inputs. They will
                      appear here instantly!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(handleTestSubmit)} className="space-y-6">
                    <FieldGroup>
                      {sortedFields.map((field) => (
                        <FormFieldRenderer
                          key={field.id}
                          field={field as PublicFormField}
                          register={register}
                          setValue={setValue}
                          watch={watch}
                          errors={errors}
                        />
                      ))}
                    </FieldGroup>

                    <div className="pt-4 flex flex-col items-center gap-2">
                      <Button
                        type="submit"
                        className="w-full h-10 text-sm font-semibold gap-2 shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                        style={{
                          backgroundColor: activeTheme.accentColor,
                          color: activeTheme.accentTextColor,
                          boxShadow: `0 4px 15px ${activeTheme.glowColor}`,
                        }}
                        disabled={isSubmitting}
                      >
                        <IconSparkles className="size-3.5" />
                        <span>{form?.submitButtonText || "Submit Response"} (Preview Test)</span>
                      </Button>
                      <span className="text-[11px]" style={{ color: activeTheme.textMutedColor }}>
                        Simulate validation & submission flow
                      </span>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
