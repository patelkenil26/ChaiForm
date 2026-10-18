"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { toastTheme } from "~/config/landing-theme"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: <CircleCheckIcon className={toastTheme.icons.success} />,
        info: <InfoIcon className={toastTheme.icons.info} />,
        warning: <TriangleAlertIcon className={toastTheme.icons.warning} />,
        error: <OctagonXIcon className={toastTheme.icons.error} />,
        loading: <Loader2Icon className={toastTheme.icons.loading} />,
      }}
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          toast: toastTheme.classNames.toast,
          title: toastTheme.classNames.title,
          description: toastTheme.classNames.description,
          actionButton: toastTheme.classNames.actionButton,
          cancelButton: toastTheme.classNames.cancelButton,
          closeButton: toastTheme.classNames.closeButton,
          default: toastTheme.classNames.default,
          success: toastTheme.classNames.success,
          error: toastTheme.classNames.error,
          warning: toastTheme.classNames.warning,
          info: toastTheme.classNames.info,
          loading: toastTheme.classNames.loading,
          ...props.toastOptions?.classNames,
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          ...toastTheme.cssVars,
          ...props.style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

