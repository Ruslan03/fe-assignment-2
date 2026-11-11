import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  createMemberController,
  deleteMemberController,
  getAllMemberController,
  getMemberByIdController,
  updateMemberController,
} from "../../controller/member.controller"
import type {
  CreateMemberPayload,
  UpdateMemberPayload,
} from "../../domain/member.entity"

export const fetchMembers = createAsyncThunk(
  "member/fetchMembers",
  async (search?: string) => {
    const members = await getAllMemberController(search)
    return Array.isArray(members) ? members : []
  }
)

export const fetchMemberById = createAsyncThunk(
  "member/fetchMemberById",
  async (id: string) => getMemberByIdController(id)
)

export const createMember = createAsyncThunk(
  "member/createMember",
  async (payload: CreateMemberPayload) => {
    const members = await createMemberController(payload)
    return Array.isArray(members) ? members : []
  }
)

export const updateMember = createAsyncThunk(
  "member/updateMember",
  async ({ id, payload }: { id: string; payload: UpdateMemberPayload }) =>
    updateMemberController(id, payload)
)

export const deleteMember = createAsyncThunk(
  "member/deleteMember",
  async (id: string) => deleteMemberController(id)
)
