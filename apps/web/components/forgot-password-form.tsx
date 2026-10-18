"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Loader2, ArrowLeft, Mail, CheckCircle2, Copy, ExternalLink, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRequestPasswordReset } from "~/hooks/api/auth";
import { landingTheme } from "~/config/landing-theme";

type ForgotPasswordValues = {
  email: string;
};

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { requestPasswordResetAsync } = useRequestPasswordReset();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordValues>({
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordValues> = async (values) => {
    try {
      const res = await requestPasswordResetAsync({ email: values.email });
      setSubmittedEmail(values.email);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      toast.success("Password reset link ready!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to request password reset";
      toast.error(msg);
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
        <div className={`mx-auto flex size-12 items-center justify-center rounded-full ${landingTheme.iconBg}`}>
          <CheckCircle2 className={`size-6 ${landingTheme.iconColor}`} />
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
            <div className={`flex items-center gap-2 text-xs font-medium ${landingTheme.primaryText}`}>
              <KeyRound className={`size-4 ${landingTheme.iconColor}`} />
              <span>Direct Reset Link (Ready to use)</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button
                asChild
                size="sm"
                className={`w-full sm:flex-1 gap-1.5 ${landingTheme.primaryButton}`}
              >
                <Link href={resetUrl}>
                  <ExternalLink className="size-3.5" />
                  <span>Proceed to Reset</span>
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="w-full sm:w-auto gap-1.5 border-border/80 hover:bg-muted/50"
              >
                <Copy className="size-3.5" />
                <span>Copy Link</span>
              </Button>
            </div>
          </div>
        )}

        <div className="border-t border-border/50 pt-3">
          <Link
            href="/login"
            className={`inline-flex items-center gap-2 text-xs font-semibold ${landingTheme.primaryText} ${landingTheme.linkHover} underline-offset-4 transition-colors`}
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-1.5 text-center">
        <div className={`inline-flex items-center justify-center gap-1.5 ${landingTheme.primaryText} text-xs font-semibold uppercase tracking-wider mb-0.5`}>
          <Mail className="size-3.5" />
          <span>Account Recovery</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot password?</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Enter your registered email address and we will generate a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@domain.com"
            required
            autoFocus
            className={`h-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
            {...register("email", { required: true })}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-10 mt-2 ${landingTheme.primaryButton} disabled:opacity-50`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin text-neutral-950" />
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
            <ArrowLeft className="size-3.5" />
            <span>Back to sign in</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
