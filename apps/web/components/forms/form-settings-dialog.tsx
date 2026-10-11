"use client";

import { useEffect, useState } from "react";
import {
  SlidersHorizontalIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  LinkIcon,
  ClockIcon,
  UsersIcon,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";

export interface FormSettingsPayload {
  closesAt: Date | null;
  responseLimit: number | null;
  slug: string | null;
  password: string | null;
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
  };
  onSave: (settings: FormSettingsPayload) => Promise<void>;
  isSaving: boolean;
}

export function FormSettingsDialog({
  open,
  onOpenChange,
  form,
  onSave,
  isSaving,
}: FormSettingsDialogProps) {
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
        setPasswordValue(""); // Keep empty as placeholder to avoid exposing hash or if creator wants to change it
      } else {
        setHasPassword(false);
        setPasswordValue("");
      }
    }
  }, [open, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const closesAt = hasExpiry && expiryValue ? new Date(expiryValue) : null;
    const responseLimit = hasLimit && limitValue ? parseInt(limitValue, 10) : null;
    const slug = hasSlug && slugValue.trim() ? slugValue.toLowerCase().trim() : null;

    // If password toggle is turned off, send null to remove it from DB.
    // If password toggle is on and user typed a new password, send it.
    // If password toggle is on and field is blank, send undefined to preserve existing password.
    let passwordPayload: string | null = null;
    if (hasPassword) {
      if (passwordValue.trim().length > 0) {
        passwordPayload = passwordValue.trim();
      } else if (form.isPasswordProtected) {
        // preserve existing password by sending undefined or leaving unchanged
        passwordPayload = (undefined as unknown as string);
      }
    } else {
      passwordPayload = null;
    }

    await onSave({
      closesAt,
      responseLimit,
      slug,
      password: passwordPayload,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <SlidersHorizontalIcon className="size-5 text-primary" />
            Form Settings, URL & Access
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Submission status banner */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-xs">
            <span className="text-muted-foreground">Current Submissions:</span>
            <span className="font-semibold text-foreground">
              {form.submissionCount} {form.responseLimit ? `/ ${form.responseLimit}` : "responses"}
            </span>
          </div>

          {/* Password Protection Section */}
          <div className="flex flex-col gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <LockIcon className="size-3.5 text-primary" />
                  <Label htmlFor="toggle-password" className="text-sm font-medium cursor-pointer">
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
                    placeholder={form.isPasswordProtected ? "•••••••• (Leave blank to keep unchanged)" : "Enter access password"}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="text-sm pr-10"
                    required={hasPassword && !form.isPasswordProtected}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 size-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
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
          <div className="flex flex-col gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="size-3.5 text-blue-500" />
                  <Label htmlFor="toggle-slug" className="text-sm font-medium cursor-pointer">
                    Custom Clean URL
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Personalize the public link with a short slug
                </p>
              </div>
              <Switch
                id="toggle-slug"
                checked={hasSlug}
                onCheckedChange={setHasSlug}
              />
            </div>

            {hasSlug && (
              <div className="pt-2 space-y-1.5">
                <FieldLabel htmlFor="custom-slug">Public URL Slug</FieldLabel>
                <div className="flex items-center rounded-md border bg-muted/40 px-3 focus-within:ring-1 focus-within:ring-ring">
                  <span className="text-xs text-muted-foreground font-mono select-none">
                    /form/
                  </span>
                  <input
                    id="custom-slug"
                    type="text"
                    placeholder="my-form-name"
                    value={slugValue}
                    onChange={(e) => {
                      const val = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "");
                      setSlugValue(val);
                    }}
                    className="w-full bg-transparent px-1.5 py-2 text-xs font-mono outline-none"
                    required={hasSlug}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Letters, numbers, and hyphens only (min 3 chars).
                </p>
              </div>
            )}
          </div>

          {/* Expiry Date Section */}
          <div className="flex flex-col gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="size-3.5 text-amber-500" />
                  <Label htmlFor="toggle-expiry" className="text-sm font-medium cursor-pointer">
                    Schedule Expiration
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically close form after specific date & time
                </p>
              </div>
              <Switch
                id="toggle-expiry"
                checked={hasExpiry}
                onCheckedChange={setHasExpiry}
              />
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
          <div className="flex flex-col gap-3 rounded-xl border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <UsersIcon className="size-3.5 text-emerald-500" />
                  <Label htmlFor="toggle-limit" className="text-sm font-medium cursor-pointer">
                    Response Cap
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Limit maximum number of accepted submissions
                </p>
              </div>
              <Switch
                id="toggle-limit"
                checked={hasLimit}
                onCheckedChange={setHasLimit}
              />
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

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
