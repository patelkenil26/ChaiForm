"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "~/lib/utils";
import { theme } from "~/config/theme";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none",
        theme.switchFocus,
        theme.switchChecked,
        "data-[state=unchecked]:bg-muted/60 dark:data-[state=unchecked]:bg-zinc-800/80 data-[state=unchecked]:border-border/70",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-3.5 rounded-full ring-0 shadow-sm transition-transform duration-200",
          "data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-neutral-950",
          "data-[state=unchecked]:translate-x-0.5 data-[state=unchecked]:bg-muted-foreground/60 dark:data-[state=unchecked]:bg-zinc-400",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
