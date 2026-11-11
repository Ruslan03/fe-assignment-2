"use client"

import type * as React from "react"
import { useEffect } from "react"
import { Building2, MailPlus, Users, Zap } from "lucide-react"

import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/presentation/store/hooks"
import { Text } from "@atoms/text"
import { StatCard, type StatCardProps } from "@molecules/stat-card"

import {
  clearAnalyticsError,
  fetchAnalytics,
  selectAnalyticsState,
} from "../../store"

const ANALYTICS_CARD_META: Record<
  string,
  { icon: React.ReactNode; variant: StatCardProps["variant"] }
> = {
  totalMembers: { icon: <Users />, variant: "default" },
  activeMembers: { icon: <Zap />, variant: "info" },
  departments: { icon: <Building2 />, variant: "muted" },
  pendingInvites: { icon: <MailPlus />, variant: "warning" },
}

const LOADING_PLACEHOLDERS = [
  { key: "totalMembers", label: "Total Members" },
  { key: "activeMembers", label: "Active Now" },
  { key: "departments", label: "Departments" },
  { key: "pendingInvites", label: "Pending Invites" },
]

export function AnalyticsSummary() {
  const dispatch = useAppDispatch()
  const { items, isLoading, hasLoaded, error } =
    useAppSelector(selectAnalyticsState)

  useEffect(() => {
    void dispatch(fetchAnalytics())
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearAnalyticsError())
    }
  }, [dispatch])

  if (error) {
    return (
      <Text as="p" variant="caption" role="alert" className="text-destructive">
        {error}
      </Text>
    )
  }

  const showLoading = isLoading || (!hasLoaded && items.length === 0)

  return (
    <section
      aria-label="Analytics overview"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {showLoading
        ? LOADING_PLACEHOLDERS.map((placeholder) => {
            const meta = ANALYTICS_CARD_META[placeholder.key]
            return (
              <StatCard
                key={placeholder.key}
                label={placeholder.label}
                value="--"
                icon={meta?.icon}
                variant={meta?.variant}
              />
            )
          })
        : items.map((item) => {
            const meta = ANALYTICS_CARD_META[item.key] ?? {
              icon: <Users />,
              variant: "default" as const,
            }

            return (
              <StatCard
                key={item.key}
                label={item.label}
                value={item.value.toLocaleString("en-US")}
                badge={item.trend}
                icon={meta.icon}
                variant={meta.variant}
              />
            )
          })}
    </section>
  )
}
