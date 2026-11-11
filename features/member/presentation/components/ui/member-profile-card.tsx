"use client"

import { MemberAnalyticsStats } from "@analytics/presentation/components/ui/member-analytics-stats"
import { getInitials } from "@/shared/presentation/helpers/get-initials"
import { Avatar } from "@atoms/avatar"
import { Card, CardContent } from "@atoms/card"
import { Text } from "@atoms/text"

import type { MemberType } from "../../../domain/member.entity"

export interface MemberProfileCardProps {
  member: MemberType
}

export function MemberProfileCard({ member }: MemberProfileCardProps) {
  return (
    <Card>
      <CardContent className="items-center gap-5 text-center">
        <Avatar shape="rounded" size="xl" aria-hidden="true">
          {getInitials(member.name)}
        </Avatar>

        <div className="flex flex-col items-center gap-1">
          <Text variant="large" className="text-foreground">
            {member.name}
          </Text>
          <Text variant="small" className="font-medium text-primary">
            {member.role}
          </Text>
          <Text variant="caption">{member.email}</Text>
        </div>

        <MemberAnalyticsStats memberId={member.id} />
      </CardContent>
    </Card>
  )
}

