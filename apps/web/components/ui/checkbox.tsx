"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "~/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-[#fcd34d]/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-[#f59e0b] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#f59e0b] data-[state=checked]:to-[#fcd34d] data-[state=checked]:text-neutral-950 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:border-[#f59e0b] dark:data-[state=checked]:bg-gradient-to-r dark:data-[state=checked]:from-[#f59e0b] dark:data-[state=checked]:to-[#fcd34d] dark:data-[state=checked]:text-neutral-950",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
