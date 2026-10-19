"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Loader2, ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useResetPassword } from "~/hooks/api/auth";
import { parseAuthErrorMessage } from "~/lib/error";
import { landingTheme } from "~/config/landing-theme";

type ResetPasswordValues = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export function ResetPasswordForm({
  className,
  initialToken = "",
  ...props
}: React.ComponentProps<"div"> & { initialToken?: string }) {
  const router = useRouter();
  const tokenFromUrl = initialToken;

  const { resetPasswordAsync } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorBanner, setErrorBanner] = useState<{ title: string; description: string } | null>(null);

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
    setErrorBanner(null);

    if (values.newPassword !== values.confirmPassword) {
      const err = {
        title: "Password Mismatch",
        description: "Your confirm password does not match your entered password.",
      };
      setErrorBanner(err);
      toast.error(err.title, { description: err.description });
      return;
    }

    try {
      await resetPasswordAsync({
        token: values.token,
        newPassword: values.newPassword,
      });

      setIsSuccess(true);
      toast.success("Password reset successfully! You can now sign in.");
    } catch (err: unknown) {
      const parsed = parseAuthErrorMessage(err);
      setErrorBanner(parsed);
      toast.error(parsed.title, {
        description: parsed.description,
      });
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)} {...props}>
        <div className={`mx-auto flex size-12 items-center justify-center rounded-full ${landingTheme.iconBg}`}>
          <CheckCircle2 className={`size-6 ${landingTheme.iconColor}`} />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Password Reset Complete!</h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your password has been successfully updated. You can now use your new credentials to sign in.
          </p>
        </div>

        <div className="pt-2">
          <Button
            asChild
            className={`w-full h-10 ${landingTheme.primaryButton}`}
          >
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
      <div className="flex flex-col gap-1.5 text-center">
        <div className={`inline-flex items-center justify-center gap-1.5 ${landingTheme.primaryText} text-xs font-semibold uppercase tracking-wider mb-0.5`}>
          <KeyRound className="size-3.5" />
          <span>Security</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Enter your new password below to regain access to your account.
        </p>
      </div>

      {errorBanner && (
        <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-rose-200 text-xs">{errorBanner.title}</p>
            <p className="text-[11px] text-rose-300/90 leading-relaxed">{errorBanner.description}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* If token wasn't in URL, let user enter token */}
        {!tokenFromUrl && (
          <div className="space-y-1.5">
            <label htmlFor="token" className="text-sm font-medium text-foreground">
              Reset Token
            </label>
            <Input
              id="token"
              type="text"
              placeholder="Paste your reset token here"
              required
              className={`h-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
              {...register("token", { required: "Reset token is required" })}
            />
            {errors.token && (
              <span className="text-xs text-destructive">{errors.token.message}</span>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
            New Password
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              className={`h-10 pr-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-xs text-destructive">{errors.newPassword.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              required
              minLength={6}
              className={`h-10 pr-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === newPassword || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-destructive">{errors.confirmPassword.message}</span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-10 mt-3 ${landingTheme.primaryButton} disabled:opacity-50`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin text-neutral-950" />
              <span>Resetting password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </Button>

        <p className="text-center pt-1.5">
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
