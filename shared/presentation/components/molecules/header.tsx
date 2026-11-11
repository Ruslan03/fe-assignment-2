import type * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@atoms/button"
import { Text } from "@atoms/text"

export interface HeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  rightContent?: React.ReactNode
  backHref?: string
  onBack?: () => void
  backLabel?: string
}

function renderSubtitle(subtitle: React.ReactNode) {
  if (
    subtitle === undefined ||
    subtitle === null ||
    subtitle === false ||
    subtitle === ""
  ) {
    return null
  }

  if (typeof subtitle === "string" || typeof subtitle === "number") {
    return (
      <Text
        as="h2"
        variant="muted"
        className="text-sm leading-5 font-normal text-muted-foreground"
      >
        {subtitle}
      </Text>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {subtitle}
    </div>
  )
}

function renderBackButton({
  backHref,
  onBack,
  backLabel = "Go back",
}: Pick<HeaderProps, "backHref" | "onBack" | "backLabel">) {
  if (backHref) {
    return (
      <Button variant="outline" size="icon" asChild aria-label={backLabel}>
        <Link href={backHref}>
          <ArrowLeft />
        </Link>
      </Button>
    )
  }

  if (onBack) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onBack}
        aria-label={backLabel}
      >
        <ArrowLeft />
      </Button>
    )
  }

  return null
}

export function Header({
  title,
  subtitle,
  rightContent,
  backHref,
  onBack,
  backLabel,
}: HeaderProps) {
  const backButton = renderBackButton({ backHref, onBack, backLabel })
  const renderedSubtitle = renderSubtitle(subtitle)

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {backButton}
        <div className="flex flex-col gap-0.5">
          <Text
            as="h1"
            variant="h3"
            className="flex flex-wrap items-center gap-3 text-2xl leading-8 font-semibold tracking-tight text-foreground"
          >
            {title}
          </Text>
          {renderedSubtitle}
        </div>
      </div>

      {rightContent && <div>{rightContent}</div>}
    </div>
  )
}
