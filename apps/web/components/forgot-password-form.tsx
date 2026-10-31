"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  IconLoader2,
  IconArrowLeft,
  IconMail,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconKey,
  IconAlertCircle,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRequestPasswordReset } from "~/hooks/api/auth";
import { parseAuthErrorMessage } from "~/lib/error";

type ForgotPasswordValues = {
  email: string;
};

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { requestPasswordResetAsync } = useRequestPasswordReset();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<{ title: string; description: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ForgotPasswordValues>({
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordValues> = async (values) => {
    setErrorBanner(null);
    try {
      const res = await requestPasswordResetAsync({ email: values.email.trim().toLowerCase() });
      setSubmittedEmail(values.email.trim().toLowerCase());
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      toast.success("Password reset link ready!");
    } catch (err: unknown) {
      const parsed = parseAuthErrorMessage(err);
      setErrorBanner(parsed);
      toast.error(parsed.title, {
        description: parsed.description,
      });
    }
  };

  const resetUrl = resetToken ? `/reset-password?token=${resetToken}` : "";

  const handleCopyLink = () => {
    if (!resetUrl) return;
    const fullUrl = `${window.location.origin}${resetUrl}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Reset link copied to clipboard!");
  };

  if (submittedEmail) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)} {...props}>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-800 dark:text-[#CCFF00]">
          <IconCheck className="size-6 text-lime-800 dark:text-[#CCFF00]" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Check your email</h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We have generated a password reset link for{" "}
            <span className="font-semibold text-foreground">{submittedEmail}</span>.
          </p>
        </div>

        {resetToken && (
          <div className="rounded-xl border border-border/80 bg-background/50 p-4 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-lime-800 dark:text-[#CCFF00]">
              <IconKey className="size-4" />
              <span>Direct Reset Link (Ready to use)</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button
                asChild
                size="sm"
                className="w-full sm:flex-1 gap-1.5 bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold"
              >
                <Link href={resetUrl}>
                  <IconExternalLink className="size-3.5" />
                  <span>Proceed to Reset</span>
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="w-full sm:w-auto gap-1.5 border-border/80 hover:bg-muted/50 cursor-pointer"
              >
                <IconCopy className="size-3.5" />
                <span>Copy Link</span>
              </Button>
            </div>
          </div>
        )}

        <div className="border-t border-border/50 pt-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-lime-800 dark:text-[#CCFF00] hover:underline underline-offset-4 transition-colors"
          >
            <IconArrowLeft className="size-3.5" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-1.5 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 text-lime-800 dark:text-[#CCFF00] text-xs font-semibold uppercase tracking-wider mb-0.5">
          <IconMail className="size-3.5" />
          <span>Account Recovery</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot password?</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Enter your registered email address and we will generate a link to reset your password.
        </p>
      </div>

      {errorBanner && (
        <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
          <IconAlertCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-rose-800 dark:text-rose-200 text-xs">
              {errorBanner.title}
            </p>
            <p className="text-[11px] text-rose-700/90 dark:text-rose-300/90 leading-relaxed">
              {errorBanner.description}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <IconMail className="size-3.5 text-muted-foreground" />
            <span>Email Address</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@domain.com"
            autoFocus
            className="h-11 px-3.5 rounded-xl border-border/80 bg-background/80 text-sm focus-visible:ring-2 focus-visible:ring-lime-600/40 dark:focus-visible:ring-[#CCFF00]/40 transition-all font-sans"
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
              onChange: () => setErrorBanner(null),
            })}
          />
          {errors.email && (
            <span className="text-xs text-rose-500 font-medium">{errors.email.message}</span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-2 bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-sm rounded-xl cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <IconLoader2 className="size-4 animate-spin text-neutral-950" />
              <span>Generating reset link...</span>
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
        </Button>

        <p className="text-center pt-1">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft className="size-3.5" />
            <span>Back to sign in</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
