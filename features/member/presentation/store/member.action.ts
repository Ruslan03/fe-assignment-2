import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  createMemberController,
  getAllMemberController,
} from "../../controller/member.controller"
import type { CreateMemberPayload } from "../../domain/member.entity"

export const fetchMembers = createAsyncThunk(
  "member/fetchMembers",
  async (search?: string) => {
    const members = await getAllMemberController(search)
    return Array.isArray(members) ? members : []
  }
)

export const createMember = createAsyncThunk(
  "member/createMember",
  async (payload: CreateMemberPayload) => {
    const members = await createMemberController(payload)
    return Array.isArray(members) ? members : []
  }
)
