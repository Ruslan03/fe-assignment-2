import type * as React from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@atoms/card"

export interface SectionCardProps {
  title: string
  subtitle?: string
  headerAction?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  size?: "default" | "sm"
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
}

export function SectionCard({
  title,
  subtitle,
  headerAction,
  footer,
  children,
  size = "default",
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: SectionCardProps) {
  return (
    <Card size={size} className={className}>
      <CardHeader className={headerClassName}>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        {headerAction && <CardAction>{headerAction}</CardAction>}
      </CardHeader>

      <CardContent className={contentClassName}>{children}</CardContent>

      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  )
}

