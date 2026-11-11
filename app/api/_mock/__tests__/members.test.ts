import { beforeEach, describe, expect, it } from "vitest"

import {
  GET as getMemberByIdRoute,
  PUT as putMemberRoute,
} from "../../members/[id]/route"
import { POST as postMembersRoute } from "../../members/route"
import { resetMockStore } from "../store"

describe("mock members employmentType and bio persistence", () => {
  beforeEach(() => {
    resetMockStore()
  })

  it("populates seeded employmentType and bio on GET /api/members/:id and persists updates", async () => {
    const getRes = await getMemberByIdRoute(
      new Request("http://localhost/api/members/mem-001"),
      { params: Promise.resolve({ id: "mem-001" }) }
    )
    const getBody = await getRes.json()

    expect(getRes.status).toBe(200)
    expect(getBody.data).toMatchObject({
      id: "mem-001",
      employmentType: "Full-Time",
      bio: expect.stringContaining("Frontend architecture lead"),
    })

    const putRes = await putMemberRoute(
      new Request("http://localhost/api/members/mem-001", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employmentType: "Contract",
          bio: "Updated bio text",
        }),
      }),
      { params: Promise.resolve({ id: "mem-001" }) }
    )
    const putBody = await putRes.json()

    expect(putRes.status).toBe(200)
    expect(putBody.data).toMatchObject({
      id: "mem-001",
      employmentType: "Contract",
      bio: "Updated bio text",
    })
  })

  it("persists employmentType and bio on POST /api/members", async () => {
    const postRes = await postMembersRoute(
      new Request("http://localhost/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Michael Phelps",
          email: "michael.phelps@acme.corp",
          role: "Staff UI/UX Designer",
          department: "Design",
          employmentType: "Contract",
          bio: "Design systems contributor",
          status: "active",
        }),
      })
    )
    const postBody = await postRes.json()

    expect(postRes.status).toBe(201)
    expect(postBody.data[0]).toMatchObject({
      name: "Michael Phelps",
      employmentType: "Contract",
      bio: "Design systems contributor",
    })
  })
})
