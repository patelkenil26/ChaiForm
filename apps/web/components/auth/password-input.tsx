"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { landingTheme } from "~/config/landing-theme";

export interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  toggleAriaLabel?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, toggleAriaLabel = "Toggle password visibility", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn(
            "h-10 pr-10 border-input/60 bg-background/50",
            landingTheme.inputFocus,
            "transition-all",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={toggleAriaLabel}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
