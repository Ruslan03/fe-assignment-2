import { createSlice } from "@reduxjs/toolkit"

import { injectReducer, type RootState } from "@/shared/presentation/store"

import type {
  AnalyticsItemType,
  MemberAnalyticsType,
} from "../../domain/analytics.entity"
import { fetchAnalytics, fetchMemberAnalytics } from "./analytics.action"

export interface AnalyticsState {
  items: AnalyticsItemType[]
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
  memberAnalytics: MemberAnalyticsType | null
  memberAnalyticsId: string | null
  isMemberAnalyticsLoading: boolean
  memberAnalyticsError: string | null
}

declare module "@/shared/presentation/store" {
  interface LazyLoadedSlices {
    analytics: AnalyticsState
  }
}

export const initialAnalyticsState: AnalyticsState = {
  items: [],
  isLoading: false,
  hasLoaded: false,
  error: null,
  memberAnalytics: null,
  memberAnalyticsId: null,
  isMemberAnalyticsLoading: false,
  memberAnalyticsError: null,
}

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState: initialAnalyticsState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null
    },
    clearMemberAnalytics: (state) => {
      state.memberAnalytics = null
      state.memberAnalyticsId = null
      state.isMemberAnalyticsLoading = false
      state.memberAnalyticsError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false
        state.hasLoaded = true
        state.error = null
        state.items = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false
        state.hasLoaded = true
        state.error = action.error.message ?? "Failed to fetch analytics"
      })
      .addCase(fetchMemberAnalytics.pending, (state, action) => {
        state.isMemberAnalyticsLoading = true
        state.memberAnalyticsError = null
        state.memberAnalytics = null
        state.memberAnalyticsId = action.meta.arg
      })
      .addCase(fetchMemberAnalytics.fulfilled, (state, action) => {
        state.isMemberAnalyticsLoading = false
        state.memberAnalyticsError = null
        state.memberAnalytics = action.payload
        state.memberAnalyticsId = action.meta.arg
      })
      .addCase(fetchMemberAnalytics.rejected, (state, action) => {
        state.isMemberAnalyticsLoading = false
        state.memberAnalyticsError =
          action.error.message ?? "Failed to fetch member analytics"
      })
  },
})

export const { clearAnalyticsError, clearMemberAnalytics } =
  analyticsSlice.actions
export const analyticsReducer = analyticsSlice.reducer

injectReducer(analyticsSlice.name, analyticsReducer)

export const selectAnalyticsState = (state: RootState): AnalyticsState =>
  state.analytics ?? initialAnalyticsState

