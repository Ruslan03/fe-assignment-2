import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Loader2 } from "lucide-react"

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
      xl: "size-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface SpinnerProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

/** Accessible spinning loader indicator atom supporting semantic size variants. */
function Spinner({
  className,
  size = "md",
  label = "Loading",
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      data-slot="spinner"
      data-size={size}
      className={cn("inline-flex items-center justify-center text-primary", className)}
      {...props}
    >
      <Loader2 aria-hidden="true" className={spinnerVariants({ size })} />
    </div>
  )
}

export { Spinner, spinnerVariants }

