"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { AuthErrorBanner } from "~/components/auth/auth-error-banner";
import { PasswordInput } from "~/components/auth/password-input";
import { useSignIn, useUser } from "~/hooks/api/auth";
import { parseAuthErrorMessage } from "~/lib/error";
import { landingTheme } from "~/config/landing-theme";

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
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Enter your email and password to access your dashboard
        </p>
      </div>

      {errorBanner && (
        <AuthErrorBanner title={errorBanner.title} description={errorBanner.description} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@domain.com"
            className={`h-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
              onChange: () => setErrorBanner(null),
            })}
          />
          {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className={`text-xs ${landingTheme.linkHover} ${landingTheme.primaryText} underline-offset-4 transition-colors`}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              onChange: () => setErrorBanner(null),
            })}
          />
          {errors.password && (
            <span className="text-xs text-destructive">{errors.password.message}</span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-10 mt-2 ${landingTheme.primaryButton} disabled:opacity-50`}
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin text-neutral-950" />}
          {isSubmitting ? "Signing in..." : "Sign In to ChaiForm"}
        </Button>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className={`font-semibold ${landingTheme.primaryText} ${landingTheme.linkHover} underline-offset-4`}
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
