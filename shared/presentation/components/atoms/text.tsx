import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "text-base leading-7",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm leading-none font-medium",
      muted: "text-sm text-muted-foreground",
      caption: "text-xs leading-normal text-muted-foreground",
      blockquote: "border-l-2 border-border pl-4 italic text-muted-foreground",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label"
  | "blockquote"
  | "code"

type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>

const variantElementMap: Record<TextVariant, TextElement> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  lead: "p",
  large: "p",
  small: "p",
  muted: "p",
  caption: "span",
  blockquote: "blockquote",
  code: "code",
}

type TextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    as?: TextElement
    asChild?: boolean
  }

/** Typography atom component supporting semantic variants, element overrides, and Slot composition. */
function Text({
  className,
  variant = "p",
  weight,
  align,
  as,
  asChild = false,
  ...props
}: TextProps) {
  const defaultElement = variantElementMap[variant ?? "p"]
  const Comp = asChild ? Slot.Root : (as ?? defaultElement)

  return (
    <Comp
      data-slot="text"
      data-variant={variant}
      className={cn(textVariants({ variant, weight, align, className }))}
      {...props}
    />
  )
}

export { Text, textVariants, type TextProps, type TextElement }

