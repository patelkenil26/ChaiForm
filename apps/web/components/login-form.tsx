"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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

  const [showPassword, setShowPassword] = useState(false);
  const [errorBanner, setErrorBanner] = useState<{ title: string; description: string } | null>(null);

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
        <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-rose-200 text-xs">{errorBanner.title}</p>
            <p className="text-[11px] text-rose-300/90 leading-relaxed">{errorBanner.description}</p>
          </div>
        </div>
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
          {errors.email && (
            <span className="text-xs text-destructive">{errors.email.message}</span>
          )}
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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`h-10 pr-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
              {...register("password", {
                required: "Password is required",
                onChange: () => setErrorBanner(null),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
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
