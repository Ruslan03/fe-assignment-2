import { createSlice } from "@reduxjs/toolkit"

export interface BaseState {
  version: string
}

const initialState: BaseState = {
  version: "0.0.1",
}

export const baseSlice = createSlice({
  name: "base",
  initialState,
  reducers: {},
})

export const baseReducer = baseSlice.reducer
