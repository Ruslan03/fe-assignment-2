import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  getAnalyticsController,
  getMemberAnalyticsController,
} from "../../controller/analytics.controller"

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async () => {
    const items = await getAnalyticsController()
    return Array.isArray(items) ? items : []
  }
)

export const fetchMemberAnalytics = createAsyncThunk(
  "analytics/fetchMemberAnalytics",
  async (memberId: string) => getMemberAnalyticsController(memberId)
)

