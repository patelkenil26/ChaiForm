"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconUser,
  IconMail,
  IconLock,
  IconSparkles,
  IconCheck,
  IconShieldCheck,
  IconLoader2,
  IconArrowRight,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { AuthErrorBanner } from "~/components/auth/auth-error-banner";
import { PasswordInput } from "~/components/auth/password-input";
import { useSignup, useUser } from "~/hooks/api/auth";
import { parseAuthErrorMessage } from "~/lib/error";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm({
  className,
  redirectUrl = "/dashboard",
  ...props
}: React.ComponentProps<"form"> & { redirectUrl?: string }) {
  const { createUserWithEmailAndPasswordAsync } = useSignup();
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  const [errorBanner, setErrorBanner] = useState<{ title: string; description: string } | null>(
    null,
  );

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace(redirectUrl.startsWith("/") ? redirectUrl : "/dashboard");
    }
  }, [user, isUserLoading, router, redirectUrl]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const confirmPasswordValue = watch("confirmPassword") || "";

  // Password validation checks
  const hasMinLen = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const passwordsMatch = confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
    setErrorBanner(null);

    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      const err = {
        title: "Password Mismatch",
        description: "Your confirm password does not match your entered password.",
      };
      setErrorBanner(err);
      toast.error(err.title, { description: err.description });
      return;
    }

    if (values.password.length < 8) {
      setError("password", { message: "Password must be at least 8 characters" });
      const err = {
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
      };
      setErrorBanner(err);
      toast.error(err.title, { description: err.description });
      return;
    }

    try {
      await createUserWithEmailAndPasswordAsync({
        email: values.email.trim().toLowerCase(),
        fullName: values.name.trim(),
        password: values.password,
      });
      toast.success("Account created successfully! Welcome to ChaiForm.");
      router.replace(redirectUrl.startsWith("/") ? redirectUrl : "/dashboard");
    } catch (err: unknown) {
      const parsed = parseAuthErrorMessage(err);
      setErrorBanner(parsed);
      toast.error(parsed.title, {
        description: parsed.description,
      });
      if (parsed.title === "Account Already Exists") {
        setError("email", { message: "Email already registered. Please sign in instead." });
      }
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-4 sm:gap-5", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Create your account
          </h1>
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 border-lime-600/30 dark:border-[#CCFF00]/30 bg-lime-500/10 dark:bg-[#CCFF00]/10 text-lime-800 dark:text-[#CCFF00] font-semibold gap-1.5 shrink-0"
          >
            <IconSparkles className="size-3.5" />
            <span>Free Forever</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Start building conversational forms with zero credit card required.
        </p>
      </div>

      {errorBanner && (
        <AuthErrorBanner
          title={errorBanner.title}
          description={errorBanner.description}
          className="py-2.5"
        />
      )}

      <div className="space-y-3.5">
        {/* LINE 1: Full Name (Separate Full-Width Line) */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <IconUser className="size-3.5 text-muted-foreground" />
            <span>Full Name</span>
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Sarah Patel"
            className="h-11 px-3.5 rounded-xl border-border/80 bg-background/80 text-sm focus-visible:ring-2 focus-visible:ring-lime-600/40 dark:focus-visible:ring-[#CCFF00]/40 transition-all font-sans"
            {...register("name", {
              required: "Full name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
              onChange: () => setErrorBanner(null),
            })}
          />
          {errors.name && (
            <span className="text-xs text-rose-500 font-medium">{errors.name.message}</span>
          )}
        </div>

        {/* LINE 2: Email Address (Separate Full-Width Line) */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <IconMail className="size-3.5 text-muted-foreground" />
            <span>Work or Personal Email</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="sarah@company.com"
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

        {/* LINE 3: Password & Confirm Password (Side-by-Side to keep form compact) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <IconLock className="size-3.5 text-muted-foreground" />
              <span>Password</span>
            </label>
            <PasswordInput
              id="password"
              placeholder="Min. 8 chars"
              className="h-11 text-sm rounded-xl"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                onChange: () => setErrorBanner(null),
              })}
            />
            {errors.password && (
              <span className="text-xs text-rose-500 font-medium">{errors.password.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirm-password"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <IconLock className="size-3.5 text-muted-foreground" />
              <span>Confirm Password</span>
            </label>
            <PasswordInput
              id="confirm-password"
              placeholder="Re-enter password"
              className="h-11 text-sm rounded-xl"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                onChange: () => setErrorBanner(null),
              })}
            />
            {errors.confirmPassword && (
              <span className="text-xs text-rose-500 font-medium">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Password Security Checklist */}
      {passwordValue && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border transition-all ${
              hasMinLen
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-border text-muted-foreground bg-muted/30"
            }`}
          >
            <IconCheck className={`size-3.5 ${hasMinLen ? "text-emerald-500" : "opacity-30"}`} />
            <span>8+ chars</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border transition-all ${
              hasUppercase
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-border text-muted-foreground bg-muted/30"
            }`}
          >
            <IconCheck className={`size-3.5 ${hasUppercase ? "text-emerald-500" : "opacity-30"}`} />
            <span>Uppercase</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border transition-all ${
              hasNumber
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-border text-muted-foreground bg-muted/30"
            }`}
          >
            <IconCheck className={`size-3.5 ${hasNumber ? "text-emerald-500" : "opacity-30"}`} />
            <span>Number</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border transition-all ${
              passwordsMatch
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-border text-muted-foreground bg-muted/30"
            }`}
          >
            <IconCheck
              className={`size-3.5 ${passwordsMatch ? "text-emerald-500" : "opacity-30"}`}
            />
            <span>Matches</span>
          </span>
        </div>
      )}

      {/* Prominent Primary CTA Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 sm:h-12 mt-1 bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-sm sm:text-base rounded-xl gap-2 shadow-lg shadow-lime-500/15 dark:shadow-[#CCFF00]/20 cursor-pointer transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <IconLoader2 className="size-4.5 animate-spin" />
            <span>Creating your account...</span>
          </>
        ) : (
          <>
            <span>Create Free Account</span>
            <IconArrowRight className="size-4.5" />
          </>
        )}
      </Button>

      {/* Trust & Legal Row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          <IconShieldCheck className="size-4 text-emerald-500" />
          <span>No credit card required</span>
        </div>
        <p>
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms
          </Link>
          .
        </p>
      </div>

      {/* Switch to login */}
      <div className="text-center text-xs sm:text-sm text-muted-foreground pt-0.5">
        <span>Already have an account? </span>
        <Link
          href="/login"
          className="font-bold text-lime-800 dark:text-[#CCFF00] hover:underline underline-offset-4"
        >
          Sign in here →
        </Link>
      </div>
    </form>
  );
}
