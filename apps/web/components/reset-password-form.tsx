"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  IconLoader2,
  IconArrowLeft,
  IconKey,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useResetPassword } from "~/hooks/api/auth";
import { parseAuthErrorMessage } from "~/lib/error";

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
  const [errorBanner, setErrorBanner] = useState<{ title: string; description: string } | null>(
    null,
  );

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
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-800 dark:text-[#CCFF00]">
          <IconCheck className="size-6 text-lime-800 dark:text-[#CCFF00]" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Password Reset Complete!
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your password has been successfully updated. You can now use your new credentials to
            sign in.
          </p>
        </div>

        <div className="pt-2">
          <Button
            asChild
            className="w-full h-11 bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-sm rounded-xl cursor-pointer"
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
        <div className="inline-flex items-center justify-center gap-1.5 text-lime-800 dark:text-[#CCFF00] text-xs font-semibold uppercase tracking-wider mb-0.5">
          <IconKey className="size-3.5" />
          <span>Security</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Enter your new password below to regain access to your account.
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
        {/* If token wasn't in URL, let user enter token */}
        {!tokenFromUrl && (
          <div className="space-y-1.5">
            <label htmlFor="token" className="text-xs font-semibold text-foreground">
              Reset Token
            </label>
            <Input
              id="token"
              type="text"
              placeholder="Paste your reset token here"
              required
              className="h-11 px-3.5 rounded-xl border-border/80 bg-background/80 text-sm focus-visible:ring-2 focus-visible:ring-lime-600/40 dark:focus-visible:ring-[#CCFF00]/40 transition-all font-sans"
              {...register("token", { required: "Reset token is required" })}
            />
            {errors.token && (
              <span className="text-xs text-rose-500 font-medium">{errors.token.message}</span>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-xs font-semibold text-foreground">
            New Password
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              className="h-11 pr-11 border-border/80 bg-background/80 text-sm focus-visible:ring-2 focus-visible:ring-lime-600/40 dark:focus-visible:ring-[#CCFF00]/40 transition-all font-sans rounded-xl"
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none p-1 rounded cursor-pointer"
            >
              {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-xs text-rose-500 font-medium">{errors.newPassword.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              required
              minLength={6}
              className="h-11 pr-11 border-border/80 bg-background/80 text-sm focus-visible:ring-2 focus-visible:ring-lime-600/40 dark:focus-visible:ring-[#CCFF00]/40 transition-all font-sans rounded-xl"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === newPassword || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none p-1 rounded cursor-pointer"
            >
              {showConfirmPassword ? (
                <IconEyeOff className="size-4" />
              ) : (
                <IconEye className="size-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-rose-500 font-medium">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-3 bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-sm rounded-xl cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <IconLoader2 className="size-4 animate-spin text-neutral-950" />
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
            <IconArrowLeft className="size-3.5" />
            <span>Back to sign in</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
