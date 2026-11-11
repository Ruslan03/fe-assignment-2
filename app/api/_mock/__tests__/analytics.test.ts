import { beforeEach, describe, expect, it } from "vitest"

import { GET as getAnalyticsRoute } from "../../analytics/route"
import { GET as getMemberAnalyticsRoute } from "../../members/[id]/analytics/route"
import { createMember, deleteMember, resetMockStore } from "../store"

describe("mock analytics endpoints", () => {
  beforeEach(() => {
    resetMockStore()
  })

  it("returns combined analytics for members and departments from GET /api/analytics", async () => {
    const response = await getAnalyticsRoute()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.status).toBe(true)
    expect(body.message).toBe("Success get analytics")
    expect(body.data).toEqual([
      expect.objectContaining({
        key: "totalMembers",
        label: "Total Members",
        value: 8,
      }),
      expect.objectContaining({
        key: "activeMembers",
        label: "Active Now",
        value: 6,
      }),
      expect.objectContaining({
        key: "departments",
        label: "Departments",
        value: 5,
        trend: "5 active units",
      }),
      expect.objectContaining({
        key: "pendingInvites",
        label: "Pending Invites",
        value: 3,
        trend: "2 expiring soon",
      }),
    ])
  })

  it("returns member analytics from GET /api/members/:id/analytics and 404 when absent", async () => {
    const okRes = await getMemberAnalyticsRoute(
      new Request("http://localhost/api/members/mem-001/analytics"),
      { params: Promise.resolve({ id: "mem-001" }) }
    )
    const okBody = await okRes.json()

    expect(okRes.status).toBe(200)
    expect(okBody).toEqual({
      status: true,
      message: "Success get member analytics",
      data: {
        totalRepository: 42,
        totalDeployment: 1489,
      },
    })

    const createdMembers = createMember({
      name: "New Member",
      email: "new.member@company.com",
      role: "Engineer",
      department: "Engineering",
      status: "active",
    })
    const createdId = createdMembers[0].id

    const createdRes = await getMemberAnalyticsRoute(
      new Request(`http://localhost/api/members/${createdId}/analytics`),
      { params: Promise.resolve({ id: createdId }) }
    )
    const createdBody = await createdRes.json()
    expect(createdRes.status).toBe(200)
    expect(createdBody.data).toEqual({
      totalRepository: 0,
      totalDeployment: 0,
    })

    deleteMember("mem-001")

    const notFoundRes = await getMemberAnalyticsRoute(
      new Request("http://localhost/api/members/mem-001/analytics"),
      { params: Promise.resolve({ id: "mem-001" }) }
    )
    const notFoundBody = await notFoundRes.json()

    expect(notFoundRes.status).toBe(404)
    expect(notFoundBody).toEqual({
      status: false,
      message: "Member not found",
      data: null,
    })
  })
})

