import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import { injectReducer, type RootState } from "@/shared/presentation/store"

import type { MemberType } from "../../domain/member.entity"
import {
  bulkDeleteMembers,
  createMember,
  deleteMember,
  exportMembersCsv,
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
  isDeleting: boolean
  deletingMemberId: string | null
  deleteError: string | null
  isBulkDeleting: boolean
  bulkDeleteError: string | null
  isExporting: boolean
  exportError: string | null
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
  isDeleting: false,
  deletingMemberId: null,
  deleteError: null,
  isBulkDeleting: false,
  bulkDeleteError: null,
  isExporting: false,
  exportError: null,
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
    clearDeleteError: (state) => {
      state.deleteError = null
    },
    clearBulkDeleteError: (state) => {
      state.bulkDeleteError = null
    },
    clearExportError: (state) => {
      state.exportError = null
    },
    clearSelectedMember: (state) => {
      state.selectedMember = null
      state.isDetailLoading = false
      state.detailError = null
    },
    removeMemberFromState: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      if (state.selectedMember?.id === action.payload) {
        state.selectedMember = null
      }
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
      .addCase(deleteMember.pending, (state, action) => {
        state.isDeleting = true
        state.deletingMemberId = action.meta.arg
        state.deleteError = null
      })
      .addCase(deleteMember.fulfilled, (state) => {
        state.isDeleting = false
        state.deletingMemberId = null
        state.deleteError = null
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.isDeleting = false
        state.deletingMemberId = null
        state.deleteError = action.error.message ?? "Failed to delete member"
      })
      .addCase(bulkDeleteMembers.pending, (state) => {
        state.isBulkDeleting = true
        state.bulkDeleteError = null
      })
      .addCase(bulkDeleteMembers.fulfilled, (state, action) => {
        const deletedIds = new Set(action.meta.arg.ids)
        state.isBulkDeleting = false
        state.bulkDeleteError = null
        state.items = state.search.trim()
          ? state.items.filter((item) => !deletedIds.has(item.id))
          : action.payload
        if (state.selectedMember && deletedIds.has(state.selectedMember.id)) {
          state.selectedMember = null
        }
      })
      .addCase(bulkDeleteMembers.rejected, (state, action) => {
        state.isBulkDeleting = false
        state.bulkDeleteError =
          action.error.message ?? "Failed to delete selected members"
      })
      .addCase(exportMembersCsv.pending, (state) => {
        state.isExporting = true
        state.exportError = null
      })
      .addCase(exportMembersCsv.fulfilled, (state) => {
        state.isExporting = false
        state.exportError = null
      })
      .addCase(exportMembersCsv.rejected, (state, action) => {
        state.isExporting = false
        state.exportError = action.error.message ?? "Failed to export members"
      })
  },
})

export const {
  setSearch,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearBulkDeleteError,
  clearExportError,
  clearSelectedMember,
  removeMemberFromState,
} = memberSlice.actions
export const memberReducer = memberSlice.reducer

injectReducer(memberSlice.name, memberReducer)

export const selectMemberState = (state: RootState): MemberState =>
  state.member ?? initialMemberState
