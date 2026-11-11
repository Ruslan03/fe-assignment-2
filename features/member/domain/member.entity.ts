export type MemberStatus = "active" | "inactive"

export interface MemberType {
    id: string
    name: string
    email: string
    role: string
    department: string
    status: string
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
