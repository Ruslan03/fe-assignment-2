import type {
  CreateMemberPayload,
  MemberType,
  UpdateMemberPayload,
} from "../../domain/member.entity"
import type { IMemberRepository } from "../../usecase/member.repository.interface"

export class MemberService implements IMemberRepository {
  async getAllMembers(search?: string): Promise<MemberType[]> {
    const trimmedSearch = search?.trim()
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/members${trimmedSearch ? `?search=${encodeURIComponent(trimmedSearch)}` : ""}`
    const res = await fetch(url)

    const data = await res.json()

    return data?.data as MemberType[]
  }

  async getMemberById(id: string): Promise<MemberType> {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/members/${encodeURIComponent(id)}`
    const res = await fetch(url)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message ?? "Failed to get member")
    }

    return data?.data as MemberType
  }

  async createMember(payload: CreateMemberPayload): Promise<MemberType[]> {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/members`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message ?? "Failed to create member")
    }

    return data?.data as MemberType[]
  }

  async updateMember(
    id: string,
    payload: UpdateMemberPayload
  ): Promise<MemberType> {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/members/${encodeURIComponent(id)}`
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message ?? "Failed to update member")
    }

    return data?.data as MemberType
  }

  async deleteMember(id: string): Promise<MemberType> {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/members/${encodeURIComponent(id)}`
    const res = await fetch(url, {
      method: "DELETE",
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message ?? "Failed to delete member")
    }

    return data?.data as MemberType
  }
}
