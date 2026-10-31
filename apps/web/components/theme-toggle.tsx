"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("size-9 rounded-lg border border-border/50 text-muted-foreground", className)}
        aria-label="Toggle theme placeholder"
        disabled
      >
        <span className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "size-9 rounded-lg border border-border/60 hover:bg-muted text-foreground transition-all cursor-pointer relative",
        className,
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <IconSun
        className={cn(
          "size-4 text-amber-500 transition-all duration-300 absolute",
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <IconMoon
        className={cn(
          "size-4 text-[#CCFF00] dark:text-[#CCFF00] transition-all duration-300 absolute",
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
        )}
      />
    </Button>
  );
}
