import {
  SEED_CURRENT_USER,
  SEED_DEPARTMENTS,
  SEED_EMPLOYMENT_TYPES,
  SEED_MEMBERS,
  SEED_PENDING_INVITES,
} from "./seed"
import type {
  AnalyticsItem,
  CreateMemberPayload,
  Department,
  EmploymentType,
  Member,
  MemberStatus,
  UpdateMemberPayload,
  UserProfile,
} from "./types"

interface MockApiState {
  currentUser: UserProfile
  members: Member[]
  departments: Department[]
  employmentTypes: EmploymentType[]
  pendingInvites: number
  nextMemberSeq: number
}

export interface MemberFilterOptions {
  search?: string
  department?: string
  status?: string
  role?: string
}

const globalForMock = globalThis as typeof globalThis & {
  __mockApiState?: MockApiState
}

function createInitialState(): MockApiState {
  return {
    currentUser: { ...SEED_CURRENT_USER },
    members: SEED_MEMBERS.map((member) => ({ ...member })),
    departments: SEED_DEPARTMENTS.map((dept) => ({ ...dept })),
    employmentTypes: SEED_EMPLOYMENT_TYPES.map((type) => ({ ...type })),
    pendingInvites: SEED_PENDING_INVITES,
    nextMemberSeq: SEED_MEMBERS.length + 1,
  }
}

function getState(): MockApiState {
  if (!globalForMock.__mockApiState) {
    globalForMock.__mockApiState = createInitialState()
  }
  return globalForMock.__mockApiState
}

/** Resets the in-memory mock database back to its initial seed state. */
export function resetMockStore(): void {
  globalForMock.__mockApiState = createInitialState()
}

export function isValidMemberStatus(value: unknown): value is MemberStatus {
  return value === "active" || value === "inactive"
}

export function getCurrentUser(): UserProfile {
  return { ...getState().currentUser }
}

export function getMembers(filters?: MemberFilterOptions): Member[] {
  const { members } = getState()
  const search = filters?.search?.trim().toLowerCase()
  const department = filters?.department?.trim().toLowerCase()
  const status = filters?.status?.trim().toLowerCase()
  const role = filters?.role?.trim().toLowerCase()

  return members
    .filter((member) => {
      if (search) {
        const matchesSearch =
          member.name.toLowerCase().includes(search) ||
          member.email.toLowerCase().includes(search) ||
          member.role.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }
      if (department && member.department.toLowerCase() !== department) {
        return false
      }
      if (status && member.status.toLowerCase() !== status) {
        return false
      }
      if (role && member.role.toLowerCase() !== role) {
        return false
      }
      return true
    })
    .map((member) => ({ ...member }))
}

export function getMemberById(id: string): Member | null {
  const found = getState().members.find((member) => member.id === id)
  return found ? { ...found } : null
}

export function createMember(payload: CreateMemberPayload): Member[] {
  const state = getState()
  const seq = String(state.nextMemberSeq++).padStart(3, "0")
  const newMember: Member = {
    id: `mem-${seq}`,
    name: payload.name.trim(),
    email: payload.email.trim(),
    role: payload.role.trim(),
    department: payload.department.trim(),
    status: payload.status,
    joinDate: payload.joinDate?.trim() || new Date().toISOString(),
  }

  state.members = [newMember, ...state.members]
  return state.members.map((member) => ({ ...member }))
}

export function updateMember(id: string, payload: UpdateMemberPayload): Member | null {
  const state = getState()
  const index = state.members.findIndex((member) => member.id === id)
  if (index === -1) return null

  const existing = state.members[index]
  const updated: Member = {
    ...existing,
    name: payload.name !== undefined ? payload.name.trim() : existing.name,
    email: payload.email !== undefined ? payload.email.trim() : existing.email,
    role: payload.role !== undefined ? payload.role.trim() : existing.role,
    department:
      payload.department !== undefined ? payload.department.trim() : existing.department,
    status: payload.status !== undefined ? payload.status : existing.status,
    joinDate:
      payload.joinDate !== undefined && payload.joinDate.trim() !== ""
        ? payload.joinDate.trim()
        : existing.joinDate,
  }

  state.members[index] = updated
  return { ...updated }
}

export function deleteMember(id: string): Member | null {
  const state = getState()
  const index = state.members.findIndex((member) => member.id === id)
  if (index === -1) return null

  const [deleted] = state.members.splice(index, 1)
  return { ...deleted }
}

export function bulkDeleteMembers(ids: string[]): {
  deletedCount: number
  members: Member[]
} {
  const state = getState()
  const idSet = new Set(ids)
  const beforeCount = state.members.length
  state.members = state.members.filter((member) => !idSet.has(member.id))
  const deletedCount = beforeCount - state.members.length

  return {
    deletedCount,
    members: state.members.map((member) => ({ ...member })),
  }
}

export function getDepartments(): Department[] {
  return getState().departments.map((dept) => ({ ...dept }))
}

export function getEmploymentTypes(): EmploymentType[] {
  return getState().employmentTypes.map((type) => ({ ...type }))
}

export function getMembersAnalytics(): AnalyticsItem[] {
  const state = getState()
  const total = state.members.length
  const activeCount = state.members.filter((m) => m.status === "active").length

  const now = new Date()
  const currentYear = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth()

  const joinedThisMonth = state.members.filter((m) => {
    const date = new Date(m.joinDate)
    return (
      !Number.isNaN(date.getTime()) &&
      date.getUTCFullYear() === currentYear &&
      date.getUTCMonth() === currentMonth
    )
  }).length

  const activeRate = total > 0 ? Math.round((activeCount / total) * 100) : 0
  const expiringSoon = state.pendingInvites > 0 ? Math.min(2, state.pendingInvites) : 0

  return [
    {
      key: "total",
      label: "Total Members",
      value: total,
      trend: `+${joinedThisMonth} this month`,
    },
    {
      key: "active",
      label: "Active Now",
      value: activeCount,
      trend: `${activeRate}% live activity`,
    },
    {
      key: "pending",
      label: "Pending Invites",
      value: state.pendingInvites,
      trend: `${expiringSoon} expiring soon`,
    },
  ]
}

export function getDepartmentsAnalytics(): AnalyticsItem[] {
  const state = getState()
  const totalDepartments = state.departments.length
  const activeDepartmentNames = new Set(
    state.members
      .filter((m) => m.status === "active")
      .map((m) => m.department.toLowerCase())
  )
  const activeUnits = state.departments.filter((dept) =>
    activeDepartmentNames.has(dept.name.toLowerCase())
  ).length

  return [
    {
      key: "total",
      label: "Departments",
      value: totalDepartments,
      trend: `${activeUnits} active units`,
    },
  ]
}

