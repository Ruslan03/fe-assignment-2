import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-semibold select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        soft: "bg-primary/10 text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        "soft-primary": "bg-surface-tint text-primary",
        "soft-info": "bg-surface-tint text-info",
        "soft-muted": "bg-surface-tonal text-muted-foreground",
        "soft-warning": "bg-surface-tint text-status-warning-dot",
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-xl",
      },
      size: {
        sm: "size-8 text-xs",
        md: "size-9 text-xs",
        lg: "size-12 text-sm",
        xl: "size-20 text-2xl font-bold",
      },
    },
    compoundVariants: [
      {
        shape: "rounded",
        size: "xl",
        class: "rounded-2xl",
      },
    ],
    defaultVariants: {
      variant: "default",
      shape: "circle",
      size: "md",
    },
  }
)

export type AvatarProps = React.ComponentProps<"div"> &
  VariantProps<typeof avatarVariants>

/** Domain-agnostic avatar atom displaying initials or fallback media in circle or rounded shapes. */
function Avatar({
  className,
  variant = "default",
  shape = "circle",
  size = "md",
  ...props
}: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      data-variant={variant}
      data-shape={shape}
      data-size={size}
      className={cn(avatarVariants({ variant, shape, size }), className)}
      {...props}
    />
  )
}

export { Avatar, avatarVariants }

