import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { injectReducer, type RootState } from "@/shared/presentation/store"

import type { MemberType } from "../../domain/member.entity"
import { createMember, fetchMembers } from "./member.action"

export interface MemberState {
  items: MemberType[]
  search: string
  isLoading: boolean
  error: string | null
  isCreating: boolean
  createError: string | null
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
  isCreating: false,
  createError: null,
}

export const memberSlice = createSlice({
  name: "member",
  initialState: initialMemberState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    clearCreateError: (state) => {
      state.createError = null
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
      .addCase(createMember.pending, (state) => {
        state.isCreating = true
        state.createError = null
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.isCreating = false
        state.createError = null
        state.items = action.payload
      })
      .addCase(createMember.rejected, (state, action) => {
        state.isCreating = false
        state.createError = action.error.message ?? "Failed to create member"
      })
  },
})

export const { setSearch, clearCreateError } = memberSlice.actions
export const memberReducer = memberSlice.reducer

injectReducer(memberSlice.name, memberReducer)

export const selectMemberState = (state: RootState): MemberState =>
  state.member ?? initialMemberState
