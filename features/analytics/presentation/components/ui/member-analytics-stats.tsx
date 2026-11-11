"use client"

import { useEffect } from "react"

import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/presentation/store/hooks"
import { Text } from "@atoms/text"

import {
  clearMemberAnalytics,
  fetchMemberAnalytics,
  selectAnalyticsState,
} from "../../store"

export interface MemberAnalyticsStatsProps {
  memberId: string
}

export function MemberAnalyticsStats({ memberId }: MemberAnalyticsStatsProps) {
  const dispatch = useAppDispatch()
  const {
    memberAnalytics,
    memberAnalyticsId,
    isMemberAnalyticsLoading,
    memberAnalyticsError,
  } = useAppSelector(selectAnalyticsState)

  useEffect(() => {
    void dispatch(fetchMemberAnalytics(memberId))
  }, [dispatch, memberId])

  useEffect(() => {
    return () => {
      dispatch(clearMemberAnalytics())
    }
  }, [dispatch])

  const isCurrentMember = memberAnalyticsId === memberId
  const isLoading = isMemberAnalyticsLoading || !isCurrentMember
  const analytics = isLoading || memberAnalyticsError ? null : memberAnalytics

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
