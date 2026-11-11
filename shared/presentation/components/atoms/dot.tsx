import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const dotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-status-success-dot",
      warning: "bg-status-warning-dot",
      destructive: "bg-destructive",
      muted: "bg-muted-foreground",
    },
    size: {
      xs: "size-1",
      sm: "size-1.5",
      md: "size-2",
      lg: "size-2.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
})

export type DotProps = React.ComponentProps<"span"> &
  VariantProps<typeof dotVariants>

/** Small circular status indicator atom supporting semantic color and size variants. */
function Dot({
  className,
  variant = "default",
  size = "sm",
  ...props
}: DotProps) {
  return (
    <span
      data-slot="dot"
      data-variant={variant}
      data-size={size}
      aria-hidden="true"
      className={cn(dotVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Dot, dotVariants }

