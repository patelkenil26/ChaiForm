"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Loader2, ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useResetPassword } from "~/hooks/api/auth";

type ResetPasswordValues = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const { resetPasswordAsync } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ResetPasswordValues>({
    defaultValues: {
      token: tokenFromUrl,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit: SubmitHandler<ResetPasswordValues> = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPasswordAsync({
        token: values.token,
        newPassword: values.newPassword,
      });

      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password";
      toast.error(msg);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)} {...props}>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="size-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight">Password Reset Complete!</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Your password has been successfully updated. You can now use your new password to sign in.
          </p>
        </div>

        <div className="pt-2">
          <Button asChild className="w-full gap-2">
            <Link href="/login">
              <span>Proceed to Sign In</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardHeader className="p-0">
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
          <KeyRound className="size-3.5" />
          <span>Security</span>
        </div>
        <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
        <CardDescription>
          Enter your new password below to regain access to your account.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* If token wasn't in URL, let user enter token */}
          {!tokenFromUrl && (
            <Field>
              <FieldLabel htmlFor="token">Reset Token</FieldLabel>
              <Input
                id="token"
                type="text"
                placeholder="Paste your reset token here"
                required
                {...register("token", { required: "Reset token is required" })}
              />
            </Field>
          )}

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              required
              minLength={6}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === newPassword || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </Field>

          <Field className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full gap-2 font-medium">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  <span>Reset Password</span>
                </>
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
