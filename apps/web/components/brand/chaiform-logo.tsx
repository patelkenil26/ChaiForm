"use client";

import Image from "next/image";
import { cn } from "~/lib/utils";

export interface ChaiFormLogoProps {
  /**
   * Width & height in pixels (defaults to 36px)
   */
  size?: number;
  /**
   * Additional wrapper class names
   */
  className?: string;
  /**
   * Prioritize loading for above-the-fold brand marks
   */
  priority?: boolean;
}

/**
 * Universal ChaiForm Brand Logo Component
 * Automatically serves:
 *   - Dark mode logo (`/logo/chaiform-logo-dark-mode.png`) when html.dark is active
 *   - Light mode logo (`/logo/chaiform-logo-light-mode.png`) when light mode is active
 * Without layout shift or hydration mismatch.
 */
export function ChaiFormLogo({ size = 36, className, priority = false }: ChaiFormLogoProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {/* Dark mode logo */}
      <Image
        src="/logo/chaiform-logo-dark-mode.png"
        alt="ChaiForm Logo"
        width={size}
        height={size}
        className="size-full object-contain hidden dark:block"
        priority={priority}
      />
      {/* Light mode logo */}
      <Image
        src="/logo/chaiform-logo-light-mode.png"
        alt="ChaiForm Logo"
        width={size}
        height={size}
        className="size-full object-contain block dark:hidden"
        priority={priority}
      />
    </div>
  );
}
