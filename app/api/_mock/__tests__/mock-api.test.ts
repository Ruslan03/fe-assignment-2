import { beforeEach, describe, expect, it } from "vitest"
import { resetMockStore } from "../store"
import { GET as getCurrentUserRoute } from "../../users/me/route"
import { GET as getMembersRoute, POST as createMemberRoute } from "../../members/route"
import {
  GET as getMemberByIdRoute,
  PUT as updateMemberRoute,
  DELETE as deleteMemberRoute,
} from "../../members/[id]/route"
import { POST as bulkDeleteRoute } from "../../members/bulk-delete/route"
import { GET as getMembersAnalyticsRoute } from "../../members/analytics/route"
import { GET as getDepartmentsRoute } from "../../departments/route"
import { GET as getDepartmentsAnalyticsRoute } from "../../departments/analytics/route"
import { GET as getEmploymentTypesRoute } from "../../employment/types/route"

function createJsonRequest(url: string, method: string, body?: unknown): Request {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

describe("In-Memory Mock API Routes", () => {
  beforeEach(() => {
    resetMockStore()
  })

  it("GET /api/users/me returns current user", async () => {
    const res = await getCurrentUserRoute()
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.status).toBe(true)
    expect(json.data).toEqual({
      id: "usr-001",
      name: "Ruslan",
      role: "Front-end Engineer",
    })
  })

  it("GET /api/members supports listing and filtering", async () => {
    const res = await getMembersRoute(new Request("http://localhost/api/members"))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.status).toBe(true)
    expect(json.data).toHaveLength(8)

    const filteredRes = await getMembersRoute(
      new Request("http://localhost/api/members?department=Design&status=active")
    )
    const filteredJson = await filteredRes.json()
    expect(filteredJson.data).toHaveLength(1)
    expect(filteredJson.data[0].name).toBe("Alya Putri")
  })

  it("POST /api/members adds member to in-memory store and updates analytics", async () => {
    const createRes = await createMemberRoute(
      createJsonRequest("http://localhost/api/members", "POST", {
        name: "Hana Kusuma",
        email: "hana.kusuma@company.com",
        role: "DevOps Engineer",
        department: "Engineering",
        status: "active",
      })
    )
    const createJson = await createRes.json()

    expect(createRes.status).toBe(201)
    expect(createJson.status).toBe(true)
    expect(createJson.data).toHaveLength(9)
    expect(createJson.data[0]).toMatchObject({
      id: "mem-009",
      name: "Hana Kusuma",
      status: "active",
    })

    const analyticsRes = await getMembersAnalyticsRoute()
    const analyticsJson = await analyticsRes.json()
    const totalItem = analyticsJson.data.find(
      (item: { key: string }) => item.key === "total"
    )
    const activeItem = analyticsJson.data.find(
      (item: { key: string }) => item.key === "active"
    )

    expect(totalItem.value).toBe(9)
    expect(activeItem.value).toBe(7)
  })

  it("PUT /api/members/:id updates existing member and returns 404 for unknown id", async () => {
    const res = await updateMemberRoute(
      createJsonRequest("http://localhost/api/members/mem-005", "PUT", {
        name: "Dimas Nugroho",
        email: "dimas.nugroho@company.com",
        role: "Senior QA Engineer",
        department: "Engineering",
        status: "active",
      }),
      { params: Promise.resolve({ id: "mem-005" }) }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.status).toBe(true)
    expect(json.data.role).toBe("Senior QA Engineer")
    expect(json.data.status).toBe("active")

    const getRes = await getMemberByIdRoute(
      new Request("http://localhost/api/members/mem-005"),
      { params: Promise.resolve({ id: "mem-005" }) }
    )
    const getJson = await getRes.json()
    expect(getJson.data.status).toBe("active")

    const notFoundRes = await updateMemberRoute(
      createJsonRequest("http://localhost/api/members/unknown", "PUT", {
        status: "active",
      }),
      { params: Promise.resolve({ id: "unknown" }) }
    )
    expect(notFoundRes.status).toBe(404)
  })

  it("DELETE /api/members/:id removes member and returns deleted object", async () => {
    const res = await deleteMemberRoute(
      new Request("http://localhost/api/members/mem-008", { method: "DELETE" }),
      { params: Promise.resolve({ id: "mem-008" }) }
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.status).toBe(true)
    expect(json.data.id).toBe("mem-008")

    const listRes = await getMembersRoute(new Request("http://localhost/api/members"))
    const listJson = await listRes.json()
    expect(listJson.data).toHaveLength(7)
  })

  it("POST /api/members/bulk-delete removes multiple members and returns remaining list", async () => {
    const res = await bulkDeleteRoute(
      createJsonRequest("http://localhost/api/members/bulk-delete", "POST", {
        ids: ["mem-001", "mem-002", "mem-003"],
      })
    )
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.status).toBe(true)
    expect(json.data).toHaveLength(5)
    expect(
      json.data.some((m: { id: string }) => m.id === "mem-001")
    ).toBe(false)
  })

  it("validates bad payloads with 400 status", async () => {
    const badCreate = await createMemberRoute(
      createJsonRequest("http://localhost/api/members", "POST", {
        name: "",
        status: "unknown",
      })
    )
    expect(badCreate.status).toBe(400)

    const badBulk = await bulkDeleteRoute(
      createJsonRequest("http://localhost/api/members/bulk-delete", "POST", {
        ids: [],
      })
    )
    expect(badBulk.status).toBe(400)
  })

  it("GET /api/departments, /api/departments/analytics, and /api/employment/types return expected data", async () => {
    const deptRes = await getDepartmentsRoute()
    const deptJson = await deptRes.json()
    expect(deptRes.status).toBe(200)
    expect(deptJson.data).toHaveLength(5)

    const deptAnalyticsRes = await getDepartmentsAnalyticsRoute()
    const deptAnalyticsJson = await deptAnalyticsRes.json()
    expect(deptAnalyticsRes.status).toBe(200)
    expect(deptAnalyticsJson.data).toEqual([
      {
        key: "total",
        label: "Departments",
        value: 5,
        trend: "5 active units",
      },
    ])

    const empRes = await getEmploymentTypesRoute()
    const empJson = await empRes.json()
    expect(empRes.status).toBe(200)
    expect(empJson.data).toHaveLength(4)
  })
})

