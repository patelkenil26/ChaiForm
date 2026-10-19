"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Loader2, Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useSignup, useUser } from "~/hooks/api/auth";
import { parseAuthErrorMessage } from "~/lib/error";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { landingTheme } from "~/config/landing-theme";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorBanner, setErrorBanner] = useState<{ title: string; description: string } | null>(null);

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
      className={cn("flex flex-col gap-5", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Start building high-converting conversational forms in seconds
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

      <div className="space-y-3.5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            className={`h-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
            {...register("name", {
              required: "Full name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
              onChange: () => setErrorBanner(null),
            })}
          />
          {errors.name && (
            <span className="text-xs text-destructive">{errors.name.message}</span>
          )}
        </div>

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
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`h-10 pr-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
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
          {errors.password ? (
            <span className="text-xs text-destructive">{errors.password.message}</span>
          ) : (
            <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
              <span className={`inline-flex items-center gap-1 ${passwordValue.length >= 8 ? "text-emerald-400 font-medium" : "text-muted-foreground"}`}>
                {passwordValue.length >= 8 ? <Check className="size-3 text-emerald-400" /> : <span className="size-1.5 rounded-full bg-muted-foreground/40" />}
                <span>8+ characters</span>
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`h-10 pr-10 border-input/60 bg-background/50 ${landingTheme.inputFocus} transition-all`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                onChange: () => setErrorBanner(null),
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
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
          {isSubmitting && <Loader2 className="size-4 animate-spin text-neutral-950" />}
          {isSubmitting ? "Creating account..." : "Get Started Free"}
        </Button>

        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>.
        </p>

        <p className="text-center text-xs text-muted-foreground pt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className={`font-semibold ${landingTheme.primaryText} ${landingTheme.linkHover} underline-offset-4`}
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}

