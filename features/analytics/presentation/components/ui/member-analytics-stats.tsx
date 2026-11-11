"use client"

import { useEffect, useState } from "react"

import { Text } from "@atoms/text"

import { getMemberAnalyticsController } from "../../../controller/analytics.controller"
import type { MemberAnalyticsType } from "../../../domain/analytics.entity"

export interface MemberAnalyticsStatsProps {
  memberId: string
}

interface AnalyticsResult {
  memberId: string
  data: MemberAnalyticsType | null
}

export function MemberAnalyticsStats({ memberId }: MemberAnalyticsStatsProps) {
  const [result, setResult] = useState<AnalyticsResult | null>(null)

  useEffect(() => {
    let isActive = true

    getMemberAnalyticsController(memberId)
      .then((data) => {
        if (!isActive) return
        setResult({ memberId, data })
      })
      .catch(() => {
        if (!isActive) return
        setResult({ memberId, data: null })
      })

    return () => {
      isActive = false
    }
  }, [memberId])

  const isLoading = result?.memberId !== memberId
  const analytics = isLoading ? null : result.data

  const stats = [
    {
      label: "REPOSITORIES",
      value: isLoading
        ? "--"
        : analytics
          ? analytics.totalRepository.toLocaleString("en-US")
          : "0",
    },
    {
      label: "DEPLOYMENTS",
      value: isLoading
        ? "--"
        : analytics
          ? analytics.totalDeployment.toLocaleString("en-US")
          : "0",
    },
  ]

  return (
    <div className="grid w-full grid-cols-2 divide-x divide-border rounded-xl border border-border/50 bg-muted/50 py-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-0.5 px-3"
        >
          <Text variant="large" className="text-foreground">
            {stat.value}
          </Text>
          <Text
            variant="caption"
            className="text-[11px] font-semibold tracking-wider uppercase"
          >
            {stat.label}
          </Text>
        </div>
      ))}
    </div>
  )
}
