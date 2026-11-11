export type MemberStatus = "active" | "inactive"

export interface MemberType {
  id: string
  name: string
  email: string
  role: string
  department: string
  employmentType?: string
  bio?: string
  status: string
  joinDate: string
}

export interface CreateMemberPayload {
  name: string
  email: string
  role: string
  department: string
  employmentType?: string
  bio?: string
  status: MemberStatus
  joinDate?: string
}

export interface UpdateMemberPayload {
  name?: string
  email?: string
  role?: string
  department?: string
  employmentType?: string
  bio?: string
  status?: MemberStatus
  joinDate?: string
}
