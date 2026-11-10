export type MemberStatus = "active" | "inactive"

export interface UserProfile {
  id: string
  name: string
  role: string
}

export interface Member {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: MemberStatus
  joinDate: string
}

export interface CreateMemberPayload {
  name: string
  email: string
  role: string
  department: string
  status: MemberStatus
  joinDate?: string
}

export interface UpdateMemberPayload {
  name?: string
  email?: string
  role?: string
  department?: string
  status?: MemberStatus
  joinDate?: string
}

export interface BulkDeletePayload {
  ids: string[]
}

export interface Department {
  id: string
  name: string
}

export interface EmploymentType {
  id: string
  name: string
}

export interface AnalyticsItem {
  key: string
  label: string
  value: number
  trend: string
}

export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
}

