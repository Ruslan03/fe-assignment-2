import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { injectReducer, type RootState } from "@/shared/presentation/store"

import type { MemberType } from "../../domain/member.entity"
import { fetchMembers } from "./member.action"

export interface MemberState {
  items: MemberType[]
  search: string
  isLoading: boolean
  error: string | null
}

declare module "@/shared/presentation/store" {
  interface LazyLoadedSlices {
    member: MemberState
  }
}

export const initialMemberState: MemberState = {
  items: [],
  search: "",
  isLoading: false,
  error: null,
}

export const memberSlice = createSlice({
  name: "member",
  initialState: initialMemberState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
        state.items = action.payload
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Failed to fetch members"
      })
  },
})

export const { setSearch } = memberSlice.actions
export const memberReducer = memberSlice.reducer

injectReducer(memberSlice.name, memberReducer)

export const selectMemberState = (state: RootState): MemberState =>
  state.member ?? initialMemberState
