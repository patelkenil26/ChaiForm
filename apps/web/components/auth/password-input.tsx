"use client";

import { forwardRef, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

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
            "h-11 pr-11 border-border/80 bg-background/80 focus-visible:ring-2 focus-visible:ring-lime-600/40 dark:focus-visible:ring-[#CCFF00]/40 rounded-xl transition-all text-sm",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus:outline-none cursor-pointer"
          aria-label={toggleAriaLabel}
          tabIndex={-1}
        >
          {showPassword ? <IconEyeOff className="size-4.5" /> : <IconEye className="size-4.5" />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
