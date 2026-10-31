"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconMail,
  IconLock,
  IconArrowRight,
  IconShieldCheck,
  IconLoader2,
  IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { AuthErrorBanner } from "~/components/auth/auth-error-banner";
import { PasswordInput } from "~/components/auth/password-input";
import { useSignIn, useUser } from "~/hooks/api/auth";
import { parseAuthErrorMessage } from "~/lib/error";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  redirectUrl = "/dashboard",
  ...props
}: React.ComponentProps<"div"> & { redirectUrl?: string }) {
  const { signInUserWithEmailAndPasswordAsync } = useSignIn();
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
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setErrorBanner(null);
    try {
      await signInUserWithEmailAndPasswordAsync({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      toast.success("Welcome back! Redirecting to dashboard...");
      router.replace(redirectUrl.startsWith("/") ? redirectUrl : "/dashboard");
    } catch (err: unknown) {
      const parsed = parseAuthErrorMessage(err);
      setErrorBanner(parsed);
      toast.error(parsed.title, {
        description: parsed.description,
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back
          </h1>
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 border-lime-600/30 dark:border-[#CCFF00]/30 bg-lime-500/10 dark:bg-[#CCFF00]/10 text-lime-800 dark:text-[#CCFF00] font-semibold gap-1.5 shrink-0"
          >
            <IconSparkles className="size-3.5" />
            <span>Secure Access</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Log in with your credentials to manage forms and analyze responses.
        </p>
      </div>

      {errorBanner && (
        <AuthErrorBanner
          title={errorBanner.title}
          description={errorBanner.description}
          className="py-3"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Address */}
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
            placeholder="name@company.com"
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

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <IconLock className="size-3.5 text-muted-foreground" />
              <span>Password</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-lime-800 dark:text-[#CCFF00] hover:underline underline-offset-4 font-semibold transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            className="h-11 text-sm rounded-xl"
            {...register("password", {
              required: "Password is required",
              onChange: () => setErrorBanner(null),
            })}
          />
          {errors.password && (
            <span className="text-xs text-rose-500 font-medium">{errors.password.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 sm:h-12 mt-2 bg-lime-600 dark:bg-[#CCFF00] text-white dark:text-[#0A0B0D] hover:bg-lime-700 dark:hover:bg-[#b8e600] font-bold text-sm sm:text-base rounded-xl gap-2 shadow-lg shadow-lime-500/15 dark:shadow-[#CCFF00]/20 cursor-pointer transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <IconLoader2 className="size-4.5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <IconArrowRight className="size-4.5" />
            </>
          )}
        </Button>

        {/* Trust & Reassurance */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
          <IconShieldCheck className="size-4 text-emerald-500" />
          <span>256-bit SSL encrypted • Zero tracking • Instant access</span>
        </div>

        {/* Switch to Signup */}
        <div className="pt-3 border-t border-border/60 text-center text-xs sm:text-sm text-muted-foreground">
          <span>Don&apos;t have an account yet? </span>
          <Link
            href="/signup"
            className="font-bold text-lime-800 dark:text-[#CCFF00] hover:underline underline-offset-4"
          >
            Create account free →
          </Link>
        </div>
      </form>
    </div>
  );
}
