import { createAsyncThunk } from "@reduxjs/toolkit"

import { getAllMemberController } from "../../controller/member.controller"

export const fetchMembers = createAsyncThunk(
  "member/fetchMembers",
  async (search?: string) => {
    const members = await getAllMemberController(search)
    return Array.isArray(members) ? members : []
  }
)
