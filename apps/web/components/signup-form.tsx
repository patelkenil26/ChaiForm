"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { AuthErrorBanner } from "~/components/auth/auth-error-banner";
import { PasswordInput } from "~/components/auth/password-input";
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
        <AuthErrorBanner title={errorBanner.title} description={errorBanner.description} />
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
          {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
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
          {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              onChange: () => setErrorBanner(null),
            })}
          />
          {errors.password ? (
            <span className="text-xs text-destructive">{errors.password.message}</span>
          ) : (
            <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
              <span
                className={`inline-flex items-center gap-1 ${passwordValue.length >= 8 ? "text-emerald-400 font-medium" : "text-muted-foreground"}`}
              >
                {passwordValue.length >= 8 ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                )}
                <span>8+ characters</span>
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <PasswordInput
            id="confirm-password"
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              onChange: () => setErrorBanner(null),
            })}
          />
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
          </Link>
          .
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
