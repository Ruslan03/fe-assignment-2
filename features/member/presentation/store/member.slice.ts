import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { injectReducer, type RootState } from "@/shared/presentation/store"

import type { MemberType } from "../../domain/member.entity"
import {
  createMember,
  fetchMemberById,
  fetchMembers,
  updateMember,
} from "./member.action"

export interface MemberState {
  items: MemberType[]
  selectedMember: MemberType | null
  search: string
  isLoading: boolean
  error: string | null
  isDetailLoading: boolean
  detailError: string | null
  isCreating: boolean
  createError: string | null
  isUpdating: boolean
  updateError: string | null
}

declare module "@/shared/presentation/store" {
  interface LazyLoadedSlices {
    member: MemberState
  }
}

export const initialMemberState: MemberState = {
  items: [],
  selectedMember: null,
  search: "",
  isLoading: false,
  error: null,
  isDetailLoading: false,
  detailError: null,
  isCreating: false,
  createError: null,
  isUpdating: false,
  updateError: null,
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
    clearUpdateError: (state) => {
      state.updateError = null
    },
    clearSelectedMember: (state) => {
      state.selectedMember = null
      state.isDetailLoading = false
      state.detailError = null
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
      .addCase(fetchMemberById.pending, (state) => {
        state.isDetailLoading = true
        state.detailError = null
        state.selectedMember = null
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.isDetailLoading = false
        state.detailError = null
        state.selectedMember = action.payload
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.isDetailLoading = false
        state.detailError = action.error.message ?? "Failed to fetch member"
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
      .addCase(updateMember.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.isUpdating = false
        state.updateError = null
        state.selectedMember = action.payload
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.error.message ?? "Failed to update member"
      })
  },
})

export const {
  setSearch,
  clearCreateError,
  clearUpdateError,
  clearSelectedMember,
} = memberSlice.actions
export const memberReducer = memberSlice.reducer

injectReducer(memberSlice.name, memberReducer)

export const selectMemberState = (state: RootState): MemberState =>
  state.member ?? initialMemberState
