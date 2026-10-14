"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Loader2, ArrowLeft, Mail, CheckCircle2, Copy, ExternalLink, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useRequestPasswordReset } from "~/hooks/api/auth";

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
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-6 text-emerald-500" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            We have generated a password reset request for{" "}
            <span className="font-semibold text-foreground">{submittedEmail}</span>.
          </p>
        </div>

        {resetToken && (
          <div className="rounded-lg border border-border/70 bg-muted/40 p-4 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <KeyRound className="size-4 text-primary" />
              <span>Direct Reset Link (Ready to use)</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button asChild size="sm" className="w-full sm:flex-1 gap-1.5">
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
                className="w-full sm:w-auto gap-1.5"
              >
                <Copy className="size-3.5" />
                <span>Copy Link</span>
              </Button>
            </div>
          </div>
        )}

        <div className="border-t border-border/50 pt-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardHeader className="p-0">
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
          <Mail className="size-3.5" />
          <span>Account Recovery</span>
        </div>
        <CardTitle className="text-2xl font-bold">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your registered email address and we will generate a link to reset your password.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              autoFocus
              {...register("email", { required: true })}
            />
          </Field>

          <Field className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full gap-2 font-medium">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Generating reset link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </Button>
          </Field>

          <FieldDescription className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to sign in</span>
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
