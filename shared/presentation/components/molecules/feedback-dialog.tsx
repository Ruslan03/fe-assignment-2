'use client'

import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@atoms/dialog"

const feedbackDialogIconVariants = cva(
  "mb-2 flex size-12 items-center justify-center rounded-xl [&_svg]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        success: "bg-sky-100 text-sky-950",
        destructive: "bg-rose-100 text-rose-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface FeedbackDialogProps
  extends VariantProps<typeof feedbackDialogIconVariants> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  className?: string
  iconClassName?: string
}

export function FeedbackDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  variant = "default",
  children,
  footer,
  showCloseButton = false,
  className,
  iconClassName,
}: FeedbackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn("gap-0 overflow-hidden p-0 sm:max-w-md", className)}
      >
        <DialogHeader className="items-center px-6 pt-8 pb-6 text-center">
          {icon && (
            <div
              data-slot="feedback-dialog-icon"
              data-variant={variant}
              className={cn(
                feedbackDialogIconVariants({ variant }),
                iconClassName
              )}
            >
              {icon}
            </div>
          )}
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && <div className="px-6 pb-6">{children}</div>}

        {footer && (
          <DialogFooter className="border-t border-border/60 bg-surface-subtle/60 px-6 py-4 sm:justify-center">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
